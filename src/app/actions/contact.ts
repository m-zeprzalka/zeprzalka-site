"use server"

import { headers } from "next/headers"
import nodemailer from "nodemailer"
import { z } from "zod"
import { checkRateLimit, clientKey } from "@/lib/rate-limit"
import { DEFAULT_LOCALE, locales, type Locale } from "@/i18n/config"
import { fill, getCommon } from "@/i18n/content/common"

export interface ContactFormState {
  success: boolean
  message: string
}

/**
 * Formularz stoi na dwóch wersjach językowych serwisu, więc komunikat musi
 * wrócić w tym samym języku, w którym czytelnik wypełniał pola. Język jedzie
 * w ukrytym polu; nieznana wartość spada do polskiego.
 */
function readLocale(value: FormDataEntryValue | null): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE
}

function schemaFor(locale: Locale) {
  const copy = getCommon(locale).contactAction

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, copy.nameMin)
      .max(100, copy.nameMax),
    email: z.email(copy.emailInvalid).trim().max(200, copy.emailMax),
    projectType: z
      .string()
      .trim()
      .max(200, copy.projectTypeMax)
      .optional(),
    message: z
      .string()
      .trim()
      .min(5, copy.messageMin)
      .max(5000, copy.messageMax),
  })
}

// Treść pól trafia do HTML maila — bez escapowania odbiorca wykonałby
// dowolny znacznik wstrzyknięty przez nadawcę formularza.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const locale = readLocale(formData.get("locale"))
  const copy = getCommon(locale).contactAction

  // Honeypot: pole niewidoczne dla ludzi — wypełniają je tylko boty.
  // Zwracamy "sukces", aby bot nie wiedział, że został odfiltrowany.
  if (formData.get("company")) {
    return { success: true, message: copy.success }
  }

  // Limit zgłoszeń z jednego adresu — honeypot zatrzymuje proste boty,
  // ale nie kogoś, kto po prostu wysyła formularz w kółko.
  const { allowed, retryAfter } = checkRateLimit(clientKey(await headers()))
  if (!allowed) {
    const minutes = Math.max(1, Math.ceil(retryAfter / 60))
    return {
      success: false,
      message: fill(copy.rateLimited, { minutes }),
    }
  }

  const result = schemaFor(locale).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    projectType: formData.get("project-type"),
    message: formData.get("message"),
  })

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  const { name, email, projectType, message } = result.data

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } =
    process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("Contact form: missing SMTP configuration (SMTP_HOST/SMTP_USER/SMTP_PASS)")
    return {
      success: false,
      message: copy.unavailable,
    }
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: SMTP_SECURE !== "false",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  // Nagłówki mailowe nie mogą zawierać znaków nowej linii (header injection).
  const safeName = name.replace(/[\r\n"]/g, " ").trim()
  const safeSubject = (projectType || "Brak tematu").replace(/[\r\n]/g, " ")
  // Sama wiadomość zostaje po polsku — czyta ją jedna osoba. Znacznik [EN]
  // w temacie mówi tylko tyle, że odpowiedź ma pójść po angielsku.
  const localeTag = locale === "pl" ? "" : "[EN] "

  try {
    await transporter.sendMail({
      from: `"${safeName}" <${SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "m@zeprzalka.com",
      replyTo: email,
      subject: `${localeTag}Wiadomość z formularza: ${safeSubject}`,
      text: `Imię: ${name}\nEmail: ${email}\nRodzaj projektu: ${projectType || "-"}\n\n${message}`,
      html: `
        <p><strong>Imię:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Rodzaj projektu:</strong> ${escapeHtml(projectType || "-")}</p>
        <hr/>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    })
  } catch (error) {
    console.error("Contact form: sendMail failed", error)
    return {
      success: false,
      message: copy.failed,
    }
  }

  return { success: true, message: copy.success }
}
