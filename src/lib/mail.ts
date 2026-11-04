import "server-only"

/**
 * Wysyłka wiadomości z formularza kontaktowego.
 *
 * Docelowo przez API Resend: klucz z uprawnieniem tylko do wysyłki z tej
 * domeny (wąski zakres, rotacja jednym kliknięciem, podpis DKIM wyrównany
 * z DMARC). SMTP zostaje jako droga przejściowa, dopóki w Vercelu nie ma
 * `RESEND_API_KEY` — po jego dodaniu zmienne `SMTP_*` (hasło do skrzynki)
 * można usunąć, a z nimi tę gałąź i zależność `nodemailer`.
 */

export interface Mail {
  /** Nazwa wyświetlana nadawcy; adres nadawcy jest stały. */
  fromName: string
  to: string
  replyTo: string
  subject: string
  text: string
  html: string
}

export type MailResult = "sent" | "unconfigured" | "failed"

/** Adres nadawcy przy Resend — domena musi być w nim zweryfikowana. */
const RESEND_FROM = "formularz@zeprzalka.com"

/** Krócej niż limit czasu funkcji: zawieszona usługa kończy się komunikatem, a nie przerwanym żądaniem. */
const TIMEOUT_MS = 8_000

export async function sendMail(mail: Mail): Promise<MailResult> {
  const { RESEND_API_KEY, SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env

  if (RESEND_API_KEY) return sendWithResend(mail, RESEND_API_KEY)
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return sendWithSmtp(mail, { host: SMTP_HOST, user: SMTP_USER, pass: SMTP_PASS })
  }

  console.error("Contact form: no mail transport (RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS)")
  return "unconfigured"
}

async function sendWithResend(mail: Mail, apiKey: string): Promise<MailResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Nazwa w cudzysłowie: dwukropek („Formularz: …”) poza nim psuje nagłówek From.
        from: `"${mail.fromName.replace(/["\\]/g, "")}" <${RESEND_FROM}>`,
        to: [mail.to],
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (response.ok) return "sent"
    console.error("Contact form: Resend responded", response.status, await response.text())
  } catch (error) {
    console.error("Contact form: Resend request failed", error)
  }
  return "failed"
}

async function sendWithSmtp(
  mail: Mail,
  auth: { host: string; user: string; pass: string }
): Promise<MailResult> {
  // Ładowany tylko na tej ścieżce — po przejściu na Resend nie trafia do wykonania.
  const { default: nodemailer } = await import("nodemailer")
  const secure = process.env.SMTP_SECURE !== "false"
  const transporter = nodemailer.createTransport({
    host: auth.host,
    port: Number(process.env.SMTP_PORT) || 465,
    secure,
    // Na porcie 587 (bez `secure`) połączenie musi przejść na TLS.
    requireTLS: !secure,
    auth: { user: auth.user, pass: auth.pass },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: 5_000,
    socketTimeout: TIMEOUT_MS,
  })

  try {
    await transporter.sendMail({
      from: { name: mail.fromName, address: auth.user },
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    })
    return "sent"
  } catch (error) {
    console.error("Contact form: SMTP sendMail failed", error)
    return "failed"
  }
}
