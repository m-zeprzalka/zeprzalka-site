"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { checkRateLimit, clientKey } from "@/lib/rate-limit"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { fill } from "@/i18n/format"
import { joinProjectTypes } from "@/lib/contact-fields"
import { escapeMarkup } from "@/lib/escape"
import { sendMail } from "@/lib/mail"
import { CONTACT_EMAIL } from "@/lib/site"

export type ContactField = "name" | "email" | "projectType" | "message"

export interface ContactFormState {
  success: boolean
  message: string
  /** Pola z błędem walidacji — formularz oznacza je `aria-invalid`. */
  invalid?: ContactField[]
  /** Pierwszy komunikat każdego błędnego pola — formularz może pokazać go pod polem. */
  errors?: Partial<Record<ContactField, string>>
  /**
   * Wpisane wartości, odsyłane przy błędzie. React 19 czyści formularz po
   * każdej akcji, więc bez tego jedna literówka w adresie kasowała całą
   * napisaną wiadomość.
   */
  fields?: {
    name: string
    email: string
    /** Lista rodzajów projektu (`joinProjectTypes`, `src/lib/contact-fields.ts`). */
    projectType: string
    message: string
  }
}

function text(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : ""
}

/**
 * Formularz stoi na dwóch wersjach językowych serwisu, więc komunikat musi
 * wrócić w tym samym języku, w którym czytelnik wypełniał pola. Język jedzie
 * w ukrytym polu; nieznana wartość spada do polskiego.
 */
function readLocale(value: FormDataEntryValue | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

function schemaFor(locale: Locale) {
  const copy = getCommon(locale).contactAction

  return z.object({
    name: z.string().trim().min(2, copy.nameMin).max(100, copy.nameMax),
    // Najpierw obcięcie spacji, potem format — odwrotna kolejność odrzucała
    // adres ze spacją na końcu (częste przy autouzupełnianiu na telefonie).
    email: z.string().trim().max(200, copy.emailMax).pipe(z.email(copy.emailInvalid)),
    projectType: z.string().trim().max(200, copy.projectTypeMax).optional(),
    message: z.string().trim().min(5, copy.messageMin).max(5000, copy.messageMax),
  })
}

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const locale = readLocale(formData.get("locale"))
  const copy = getCommon(locale).contactAction
  // Kilka pigułek (albo jedno pole tekstowe) — jedna lista.
  const types = joinProjectTypes(formData.getAll("project-type"))
  const fields = {
    name: text(formData.get("name"), 100),
    email: text(formData.get("email"), 200),
    projectType: types.slice(0, 200),
    message: text(formData.get("message"), 5000),
  }

  // Honeypot: pole niewidoczne dla ludzi — wypełniają je tylko boty.
  // Zwracamy "sukces", aby bot nie wiedział, że został odfiltrowany. Nazwa `hp` celowo
  // bez znaczenia: „company” Chrome autouzupełniał danymi firmy prawdziwym osobom.
  if (formData.get("hp")) {
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
      fields,
    }
  }

  const result = schemaFor(locale).safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    // Pole opcjonalne: brak w zgłoszeniu to `undefined`, nie `null`
    // (inaczej użytkownik dostawał angielski komunikat zod).
    projectType: types || undefined,
    message: formData.get("message") ?? "",
  })

  if (!result.success) {
    // Komunikat: pierwszy problem (zod zwraca co najmniej jeden). Pola: wszystkie
    // z błędem — czytnik ekranu i obramowanie wskazują każde od razu.
    const fieldErrors = z.flattenError(result.error).fieldErrors as Partial<
      Record<ContactField, string[]>
    >
    const invalid = Object.keys(fieldErrors) as ContactField[]
    const errors = Object.fromEntries(
      invalid.map((field) => [field, fieldErrors[field]?.[0] ?? copy.failed])
    ) as Partial<Record<ContactField, string>>
    return {
      success: false,
      message: result.error.issues[0]?.message ?? copy.failed,
      invalid,
      errors,
      fields,
    }
  }

  const { name, email, projectType, message } = result.data

  // Nagłówki mailowe nie mogą zawierać znaków nowej linii (header injection).
  const safeName = name.replace(/[\r\n"]/g, " ").trim()
  const safeSubject = (projectType || "Brak tematu").replace(/[\r\n]/g, " ")
  // Sama wiadomość zostaje po polsku — czyta ją jedna osoba. Znacznik [EN]
  // w temacie mówi tylko tyle, że odpowiedź ma pójść po angielsku.
  const localeTag = locale === "pl" ? "" : "[EN] "

  const sent = await sendMail({
    // Stały prefiks: nazwa wyświetlana nadawcy pochodzi z formularza, więc
    // bez niego wiadomość mogła udawać np. „Bank — dział bezpieczeństwa".
    fromName: `Formularz: ${safeName}`.slice(0, 120),
    // Odbiorca: zmienna środowiskowa albo publiczny adres kontaktowy serwisu.
    to: process.env.CONTACT_RECIPIENT || CONTACT_EMAIL,
    replyTo: email,
    subject: `${localeTag}Wiadomość z formularza: ${safeSubject}`,
    text: `Imię: ${name}\nEmail: ${email}\nRodzaj projektu: ${projectType || "-"}\n\n${message}`,
    html: `
      <p><strong>Imię:</strong> ${escapeMarkup(name)}</p>
      <p><strong>Email:</strong> ${escapeMarkup(email)}</p>
      <p><strong>Rodzaj projektu:</strong> ${escapeMarkup(projectType || "-")}</p>
      <hr/>
      <p>${escapeMarkup(message).replace(/\n/g, "<br/>")}</p>
    `,
  })

  if (sent !== "sent") {
    return {
      success: false,
      message: sent === "unconfigured" ? copy.unavailable : copy.failed,
      fields,
    }
  }

  return { success: true, message: copy.success }
}
