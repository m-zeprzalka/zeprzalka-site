"use client"

import { useActionState, useEffect, useId, useRef } from "react"
import Link from "next/link"
import { sendContactEmail, type ContactField, type ContactFormState } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CircleAlert, CircleCheck, MousePointerClick } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { getCommon } from "@/i18n/content/common"

const initialState: ContactFormState = { success: false, message: "" }

/**
 * Formularz kontaktowy. Teksty przychodzą z komponentu serwerowego — moduły
 * treści (`src/i18n/content/*`) nie trafiają do JavaScriptu przeglądarki.
 */
export function ContactForm({
  locale,
  copy,
  privacyHref,
}: {
  locale: Locale
  copy: ReturnType<typeof getCommon>["form"]
  privacyHref: string
}) {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState)
  const statusRef = useRef<HTMLDivElement>(null)
  // Identyfikatory unikalne w dokumencie — formularz może stanąć na stronie
  // obok innych pól (`id="name"` kolidowałby z każdym innym).
  const id = useId()
  const ids = {
    status: `${id}-status`,
    name: `${id}-name`,
    email: `${id}-email`,
    projectType: `${id}-project-type`,
    message: `${id}-message`,
    company: `${id}-company`,
  }

  // Po wysłaniu formularz znika albo dostaje komunikat — fokus przechodzi
  // na komunikat (czytnik ekranu odczyta go raz, przy fokusie), żeby
  // klawiatura nie została „na body".
  useEffect(() => {
    if (state.message) statusRef.current?.focus()
  }, [state])

  /** Pole z błędem: `aria-invalid` i opis wskazujący komunikat (WCAG 3.3.1). */
  const invalid = (field: ContactField) =>
    state.invalid?.includes(field)
      ? ({ "aria-invalid": true, "aria-describedby": ids.status } as const)
      : {}

  if (state.success) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-5 text-green-600 outline-none dark:text-green-400"
      >
        <CircleCheck className="h-5 w-5 shrink-0" />
        <p>{state.message}</p>
      </div>
    )
  }

  // Przy błędzie serwer odsyła wpisane wartości — React 19 czyści formularz
  // po każdej akcji, a `defaultValue` przywraca je po tym czyszczeniu.
  const fields = state.fields

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div
          ref={statusRef}
          id={ids.status}
          tabIndex={-1}
          className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive outline-none"
        >
          <CircleAlert className="h-5 w-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {/*
        Język formularza jedzie razem ze zgłoszeniem: komunikaty walidacji
        wracają w tym samym języku, w którym czytelnik wypełniał pola,
        a temat maila dostaje znacznik wersji angielskiej.
      */}
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — pole niewidoczne dla ludzi, wypełniają je tylko boty */}
      <div className="absolute -z-10 h-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={ids.company}>{copy.honeypot}</label>
        <input id={ids.company} name="hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/*
        Limity poniżej powtarzają reguły z akcji serwerowej (zod), żeby
        przeglądarka zatrzymała oczywisty błąd, zanim formularz wyjdzie.
      */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="mb-2 block text-sm font-medium">
            {copy.name}{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </label>
          <Input
            id={ids.name}
            name="name"
            type="text"
            placeholder={copy.namePlaceholder}
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            defaultValue={fields?.name}
            {...invalid("name")}
            className="px-4 py-6"
          />
        </div>
        <div>
          <label htmlFor={ids.email} className="mb-2 block text-sm font-medium">
            {copy.email}{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </label>
          <Input
            id={ids.email}
            name="email"
            type="email"
            placeholder={copy.emailPlaceholder}
            required
            maxLength={200}
            autoComplete="email"
            defaultValue={fields?.email}
            {...invalid("email")}
            className="px-4 py-6"
          />
        </div>
      </div>

      <div>
        <label htmlFor={ids.projectType} className="mb-2 block text-sm font-medium">
          {copy.projectType}
        </label>
        <Input
          id={ids.projectType}
          name="project-type"
          type="text"
          placeholder={copy.projectTypePlaceholder}
          maxLength={200}
          defaultValue={fields?.projectType}
          {...invalid("projectType")}
          className="px-4 py-6"
        />
      </div>

      <div>
        <label htmlFor={ids.message} className="mb-2 block text-sm font-medium">
          {copy.message}{" "}
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        </label>
        {/*
          Nadpisania utrzymują dotychczasowy wygląd pola (inne tło w ciemnym motywie,
          14 px, dawny pierścień fokusu) — ujednolicenie z `Input` czeka na decyzję
          właściciela (docs/KIERUNEK-WIZUALNY.md, dług wizualny nr 6).
        */}
        <Textarea
          id={ids.message}
          name="message"
          required
          rows={6}
          minLength={5}
          maxLength={5000}
          defaultValue={fields?.message}
          {...invalid("message")}
          className="field-sizing-fixed min-h-0 resize-none bg-background p-4 text-sm shadow-none ring-offset-background transition-none focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm dark:bg-background"
          placeholder={copy.messagePlaceholder}
        />
      </div>

      <Button type="submit" size="lg" className="w-fit gap-2 p-6" disabled={pending}>
        <MousePointerClick className="h-4 w-4" />
        {pending ? copy.submitting : copy.submit}
      </Button>

      {/* Obowiązek informacyjny RODO (art. 13) w skrócie; pełna treść na osobnej stronie. */}
      <p className="text-xs text-muted-foreground">
        {copy.privacyNote}{" "}
        <Link
          href={privacyHref}
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {copy.privacyLink}
        </Link>
      </p>
    </form>
  )
}
