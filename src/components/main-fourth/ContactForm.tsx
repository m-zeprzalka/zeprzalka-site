"use client"

import { useActionState } from "react"
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Magnetic } from "@/components/main-fourth/Magnetic"
import { contact } from "@/lib/home-content"

const initialState = { success: false, message: "" }
const { form } = contact

/**
 * Pola bez ramek: linia pod tekstem i etykieta w wersalikach. Zmieniamy
 * geometrię, nie kolory — kontrast i pierścień fokusu zostają domyślne
 * z shadcn, więc dostępność jest ta sama co w reszcie serwisu.
 */
const field = "m4-field shadow-none"

function Required() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  )
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactEmail,
    initialState
  )

  if (state.success) {
    return (
      <Alert className="m4-alert">
        <CheckCircle2 />
        <AlertTitle>{state.message}</AlertTitle>
      </Alert>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-12">
      {state.message && (
        <Alert variant="destructive" className="m4-alert">
          <AlertCircle />
          <AlertTitle>{form.errorTitle}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Honeypot — pole niewidoczne dla ludzi, wypełniają je tylko boty */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="m4-company">{form.honeypot}</label>
        <input
          id="m4-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <FieldGroup className="gap-10 sm:grid sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="m4-name" className="m4-field-label">
            {form.name.label} <Required />
          </FieldLabel>
          <Input
            id="m4-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.name.placeholder}
            required
            maxLength={100}
            className={field}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="m4-email" className="m4-field-label">
            {form.email.label} <Required />
          </FieldLabel>
          <Input
            id="m4-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.email.placeholder}
            required
            maxLength={200}
            className={field}
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="m4-project-type" className="m4-field-label">
            {form.projectType.label}
          </FieldLabel>
          <Input
            id="m4-project-type"
            name="project-type"
            type="text"
            placeholder={form.projectType.placeholder}
            maxLength={200}
            className={field}
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="m4-message" className="m4-field-label">
            {form.message.label} <Required />
          </FieldLabel>
          <Textarea
            id="m4-message"
            name="message"
            required
            rows={4}
            maxLength={5000}
            placeholder={form.message.placeholder}
            className={`${field} m4-field-area`}
          />
        </Field>
      </FieldGroup>

      <Magnetic className="self-start">
        <Button type="submit" size="lg" disabled={pending} className="m4-cta">
          {pending && <Spinner data-icon="inline-start" aria-label="Wysyłanie" />}
          {pending ? form.submitting : form.submit}
          {!pending && (
            <ArrowUpRight data-icon="inline-end" className="m4-cta-icon" />
          )}
        </Button>
      </Magnetic>
    </form>
  )
}
