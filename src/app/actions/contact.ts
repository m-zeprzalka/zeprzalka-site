"use server"

import nodemailer from "nodemailer"

export interface ContactFormState {
  success: boolean
  message: string
}

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim()
  const email = formData.get("email")?.toString().trim()
  const projectType = formData.get("project-type")?.toString().trim()
  const message = formData.get("message")?.toString().trim()

  if (!name || !email || !message) {
    return { success: false, message: "Wypełnij wymagane pola." }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: "Podaj poprawny adres e-mail." }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-sh188996.super-host.pl",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: "m@zeprzalka.com",
    replyTo: email,
    subject: `Wiadomość z formularza: ${projectType || "Brak tematu"}`,
    text: `Imię: ${name}\nEmail: ${email}\nRodzaj projektu: ${projectType || "-"}\n\n${message}`,
    html: `
      <p><strong>Imię:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Rodzaj projektu:</strong> ${projectType || "-"}</p>
      <hr/>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  })

  return { success: true, message: "Wiadomość wysłana. Odezwę się wkrótce!" }
}
