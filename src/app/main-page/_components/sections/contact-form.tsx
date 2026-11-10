"use client"

import { useActionState, useEffect, useId, useRef } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { sendContactEmail, type ContactField, type ContactFormState } from "@/app/actions/contact"
import { ChoiceGroup } from "@/app/main-page/_components/ui/choice-group"
import { Button } from "@/app/main-page/_components/ui/button"
import { Field, FieldError, FieldLabel } from "@/app/main-page/_components/ui/field"
import { Input } from "@/app/main-page/_components/ui/input"
import { Textarea } from "@/app/main-page/_components/ui/textarea"
import type { Locale } from "@/i18n/config"
import { splitProjectTypes } from "@/lib/contact-fields"
import { cn } from "@/lib/utils"

export interface ContactFormCopy {
  honeypot: string
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  projectType: string
  message: string
  messagePlaceholder: string
  submit: string
  submitting: string
  privacyNote: string
  privacyLink: string
}

const INITIAL: ContactFormState = { success: false, message: "" }

/**
 * Formularz kontaktowy na komponentach shadcn i akcji serwerowej serwisu
 * (`sendContactEmail`: walidacja zod, limit, pole-pułapka). Przy błędzie akcja
 * odsyła wpisane wartości — nic nie znika po jednej literówce — a fokus
 * wraca na pierwsze błędne pole, opisane komunikatem (`aria-describedby`).
 */
export function ContactForm({
  locale,
  copy,
  projectTypes,
  projectTypeHint,
  privacyHref,
}: {
  locale: Locale
  copy: ContactFormCopy
  projectTypes: readonly string[]
  /** Podpowiedź pod nazwą pola: wybór wielokrotny. */
  projectTypeHint: string
  privacyHref: string
}) {
  const [state, action, pending] = useActionState(sendContactEmail, INITIAL)
  // Identyfikatory z `useId` — drugi formularz albo nagłówek wpisu nie zdubluje `id`.
  const uid = useId()
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
    trap: `${uid}-trap`,
    status: `${uid}-status`,
  }
  const form = useRef<HTMLFormElement>(null)
  // Pole z błędem opisuje jego własny komunikat (pod polem), a nie wspólny region statusu.
  const errorId = (field: ContactField) => `${uid}-${field}-error`
  const invalid = (field: ContactField) =>
    state.invalid?.includes(field)
      ? ({ "aria-invalid": true, "aria-describedby": errorId(field) } as const)
      : {}
  // Bez `role="alert"`: błąd czyta czytnik raz — jako opis pola, na które przechodzi fokus.
  const error = (field: ContactField) =>
    state.errors?.[field] ? (
      <FieldError id={errorId(field)} role={undefined}>
        {state.errors[field]}
      </FieldError>
    ) : null
  const values = state.success ? undefined : state.fields

  useEffect(() => {
    if (state.invalid?.length) form.current?.querySelector<HTMLElement>("[aria-invalid]")?.focus()
  }, [state])

  return (
    <form ref={form} action={action} className="relative mt-10 grid gap-6">
      <input type="hidden" name="locale" value={locale} />
      {/* Pole-pułapka: niewidoczne i poza kolejnością Tab — wypełniają je tylko boty. */}
      <div aria-hidden="true" className="absolute size-px overflow-hidden opacity-0">
        {/* Nazwa bez znaczenia dla autouzupełniania (np. „company” Chrome wypełniłby danymi firmy). */}
        <label htmlFor={ids.trap}>{copy.honeypot}</label>
        <input id={ids.trap} name="hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={ids.name}>{copy.name}</FieldLabel>
          <Input
            id={ids.name}
            name="name"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            defaultValue={values?.name}
            {...invalid("name")}
            required
            minLength={2}
          />
          {error("name")}
        </Field>
        <Field>
          <FieldLabel htmlFor={ids.email}>{copy.email}</FieldLabel>
          <Input
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            defaultValue={values?.email}
            {...invalid("email")}
            required
          />
          {error("email")}
        </Field>
      </div>

      {/* Kilka rodzajów naraz; akcja składa je w jedną listę (`src/lib/contact-fields.ts`)
          i po błędzie odsyła ją w tej postaci. */}
      <ChoiceGroup
        legend={copy.projectType}
        description={projectTypeHint}
        name="project-type"
        options={projectTypes}
        multiple
        defaultValue={splitProjectTypes(values?.projectType)}
      />

      <Field>
        <FieldLabel htmlFor={ids.message}>{copy.message}</FieldLabel>
        <Textarea
          id={ids.message}
          name="message"
          placeholder={copy.messagePlaceholder}
          defaultValue={values?.message}
          {...invalid("message")}
          required
          minLength={5}
        />
        {error("message")}
      </Field>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[40ch] text-xs text-pretty text-muted-foreground">
          {copy.privacyNote}{" "}
          <Link href={privacyHref} className="underline underline-offset-4 hover:text-foreground">
            {copy.privacyLink}
          </Link>
        </p>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? copy.submitting : copy.submit}
          <ArrowRightIcon />
        </Button>
      </div>

      {/* Region stoi w drzewie dostępności także pusty — inaczej czytnik nie ogłosi komunikatu.
          Wynik wysyłki i błędy bez pola (limit, poczta); błąd pola stoi pod polem. */}
      <p
        id={ids.status}
        role="status"
        className={cn("text-sm empty:sr-only", state.success ? "text-success" : "text-destructive")}
      >
        {state.invalid?.length ? null : state.message}
      </p>
    </form>
  )
}
