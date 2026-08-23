"use server"

import nodemailer from "nodemailer"
import { z } from "zod"

export interface ContactFormState {
  success: boolean
  message: string
}

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Imię musi mieć minimum 2 znaki.")
    .max(100, "Imię może mieć maksymalnie 100 znaków."),
  email: z
    .email("Podaj poprawny adres e-mail.")
    .trim()
    .max(200, "Adres e-mail jest za długi."),
  projectType: z
    .string()
    .trim()
    .max(200, "Rodzaj projektu jest za długi.")
    .optional(),
  message: z
    .string()
    .trim()
    .min(5, "Wiadomość musi mieć minimum 5 znaków.")
    .max(5000, "Wiadomość może mieć maksymalnie 5000 znaków."),
})

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
  // Honeypot: pole niewidoczne dla ludzi — wypełniają je tylko boty.
  // Zwracamy "sukces", aby bot nie wiedział, że został odfiltrowany.
  if (formData.get("company")) {
    return { success: true, message: "Wiadomość wysłana. Odezwę się wkrótce!" }
  }

  const result = contactSchema.safeParse({
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
      message:
        "Formularz jest chwilowo niedostępny. Napisz bezpośrednio na m@zeprzalka.com.",
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

  try {
    await transporter.sendMail({
      from: `"${safeName}" <${SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "m@zeprzalka.com",
      replyTo: email,
      subject: `Wiadomość z formularza: ${safeSubject}`,
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
      message:
        "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na m@zeprzalka.com.",
    }
  }

  return { success: true, message: "Wiadomość wysłana. Odezwę się wkrótce!" }
}
