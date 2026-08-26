"use client"

import { useActionState } from "react"
import { AlertCircle, CheckCircle2, MousePointerClick } from "lucide-react"
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

function Required() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  )
}

/**
 * Ten sam server action i te same nazwy pól co w produkcyjnym formularzu —
 * zmienia się wyłącznie warstwa prezentacji (shadcn Field/Alert/Spinner).
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactEmail,
    initialState
  )

  if (state.success) {
    return (
      <Alert>
        <CheckCircle2 />
        <AlertTitle>{state.message}</AlertTitle>
      </Alert>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.message && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{form.errorTitle}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Honeypot — pole niewidoczne dla ludzi, wypełniają je tylko boty */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="ms-company">{form.honeypot}</label>
        <input
          id="ms-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <FieldGroup className="sm:grid sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="ms-name">
            {form.name.label} <Required />
          </FieldLabel>
          <Input
            id="ms-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.name.placeholder}
            required
            maxLength={100}
            className="h-12 px-4"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="ms-email">
            {form.email.label} <Required />
          </FieldLabel>
          <Input
            id="ms-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.email.placeholder}
            required
            maxLength={200}
            className="h-12 px-4"
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="ms-project-type">
            {form.projectType.label}
          </FieldLabel>
          <Input
            id="ms-project-type"
            name="project-type"
            type="text"
            placeholder={form.projectType.placeholder}
            maxLength={200}
            className="h-12 px-4"
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="ms-message">
            {form.message.label} <Required />
          </FieldLabel>
          <Textarea
            id="ms-message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            placeholder={form.message.placeholder}
            className="min-h-40 resize-none px-4 py-3"
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-fit rounded-full px-6 text-base"
      >
        {pending ? (
          <Spinner data-icon="inline-start" aria-label="Wysyłanie" />
        ) : (
          <MousePointerClick data-icon="inline-start" />
        )}
        {pending ? form.submitting : form.submit}
      </Button>
    </form>
  )
}
