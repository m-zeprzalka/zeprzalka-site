"use client"

import { useActionState, useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { sendContactEmail, type ContactField, type ContactFormState } from "@/app/actions/contact"
import { Button } from "@/app/main-page/_components/ui/button"
import { Field, FieldLabel } from "@/app/main-page/_components/ui/field"
import { Input } from "@/app/main-page/_components/ui/input"
import { Textarea } from "@/app/main-page/_components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/app/main-page/_components/ui/toggle-group"
import type { Locale } from "@/i18n/config"
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
 * odsyła wpisane wartości — nic nie znika po jednej literówce.
 */
export function ContactForm({
  locale,
  copy,
  projectTypes,
  privacyHref,
}: {
  locale: Locale
  copy: ContactFormCopy
  projectTypes: readonly string[]
  privacyHref: string
}) {
  const [state, action, pending] = useActionState(sendContactEmail, INITIAL)
  const [projectType, setProjectType] = useState("")
  const invalid = (field: ContactField) => state.invalid?.includes(field) || undefined
  const values = state.success ? undefined : state.fields

  return (
    <form action={action} className="relative mt-10 grid gap-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="project-type" value={projectType} />
      {/* Pole-pułapka: niewidoczne i poza kolejnością Tab — wypełniają je tylko boty. */}
      <div aria-hidden="true" className="absolute size-px overflow-hidden opacity-0">
        <label htmlFor="company">{copy.honeypot}</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">{copy.name}</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            defaultValue={values?.name}
            aria-invalid={invalid("name")}
            required
            minLength={2}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">{copy.email}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            defaultValue={values?.email}
            aria-invalid={invalid("email")}
            required
          />
        </Field>
      </div>

      <Field>
        <FieldLabel id="project-type-label">{copy.projectType}</FieldLabel>
        <ToggleGroup
          type="single"
          variant="outline"
          spacing={2}
          value={projectType}
          onValueChange={setProjectType}
          aria-labelledby="project-type-label"
          className="flex-wrap"
        >
          {projectTypes.map((type) => (
            <ToggleGroupItem key={type} value={type} className="h-10 px-4">
              {type}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="message">{copy.message}</FieldLabel>
        <Textarea
          id="message"
          name="message"
          placeholder={copy.messagePlaceholder}
          defaultValue={values?.message}
          aria-invalid={invalid("message")}
          required
          minLength={5}
        />
      </Field>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[40ch] text-xs text-pretty text-muted-foreground">
          {copy.privacyNote}{" "}
          <a href={privacyHref} className="underline underline-offset-4 hover:text-foreground">
            {copy.privacyLink}
          </a>
        </p>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? copy.submitting : copy.submit}
          <ArrowRightIcon />
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn("text-sm empty:hidden", state.success ? "text-success" : "text-destructive")}
      >
        {state.message}
      </p>
    </form>
  )
}
