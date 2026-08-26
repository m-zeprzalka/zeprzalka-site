"use client"

import { useActionState } from "react"
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { contact } from "@/lib/home-content"

const initialState = { success: false, message: "" }
const { form } = contact

/**
 * Pola bez ramek — jedna linia bazowa pod tekstem, jak w formularzu na papierze.
 * Zmieniamy wyłącznie geometrię (promień, krawędzie, wysokość); kolory i stan
 * fokusu zostają domyślne z shadcn, więc kontrast i widoczność fokusu są te same
 * co w reszcie serwisu — także wewnątrz odwróconego bloku.
 */
const fieldClass =
  "h-12 rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none dark:bg-transparent"

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
      <Alert className="rounded-none">
        <CheckCircle2 />
        <AlertTitle>{state.message}</AlertTitle>
      </Alert>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {state.message && (
        <Alert variant="destructive" className="rounded-none">
          <AlertCircle />
          <AlertTitle>{form.errorTitle}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Honeypot — pole niewidoczne dla ludzi, wypełniają je tylko boty */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="m3-company">{form.honeypot}</label>
        <input
          id="m3-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <FieldGroup className="gap-10 sm:grid sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="m3-name" className="m3-label">
            {form.name.label} <Required />
          </FieldLabel>
          <Input
            id="m3-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.name.placeholder}
            required
            maxLength={100}
            className={fieldClass}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="m3-email" className="m3-label">
            {form.email.label} <Required />
          </FieldLabel>
          <Input
            id="m3-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.email.placeholder}
            required
            maxLength={200}
            className={fieldClass}
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="m3-project-type" className="m3-label">
            {form.projectType.label}
          </FieldLabel>
          <Input
            id="m3-project-type"
            name="project-type"
            type="text"
            placeholder={form.projectType.placeholder}
            maxLength={200}
            className={fieldClass}
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="m3-message" className="m3-label">
            {form.message.label} <Required />
          </FieldLabel>
          <Textarea
            id="m3-message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            placeholder={form.message.placeholder}
            className="min-h-32 resize-none rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none dark:bg-transparent"
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="group h-13 w-full rounded-none px-6 text-base sm:w-fit"
      >
        {pending ? (
          <Spinner data-icon="inline-start" aria-label="Wysyłanie" />
        ) : null}
        {pending ? form.submitting : form.submit}
        {!pending && (
          <ArrowRight
            data-icon="inline-end"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        )}
      </Button>
    </form>
  )
}
