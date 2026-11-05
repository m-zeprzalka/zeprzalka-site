"use client"

import { useActionState, useState, type FormEvent } from "react"
import { ArrowUp, CircleAlert } from "lucide-react"
import { sendContactEmail, type DemoFormState } from "../forma/demo-action"
import { cn } from "../forma/cn"

interface Copy {
  honeypot: string
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  projectType: string
  projectTypePlaceholder: string
  message: string
  messagePlaceholder: string
  submit: string
  submitting: string
  privacyNote: string
  privacyLink: string
}

type Errors = Partial<Record<"name" | "email" | "message", string>>

const field =
  "block w-full rounded-[0.875rem] bg-fm-fill px-4 text-[1rem] text-fm-ink outline-none placeholder:text-fm-ink-3 transition-[background-color,box-shadow] duration-150 hover:bg-fm-fill-strong focus:bg-fm-surface focus:shadow-[0_0_0_1.5px_var(--fm-ink)] aria-invalid:shadow-[0_0_0_1.5px_var(--fm-ink)]"

/**
 * Formularz kontaktowy dema: walidacja na miejscu (teksty błędów z serwisu),
 * rodzaj projektu jako pigułki (natywne radio — strzałki działają), pole
 * wiadomości rośnie z treścią. Wysyłka idzie do atrapy akcji — demo niczego
 * nie wysyła i mówi to w komunikacie. Pola mają 16 px (bez zoomu na iOS).
 */
export function ContactForm({
  copy,
  errors: messages,
  privacyHref,
}: {
  copy: Copy
  errors: { nameMin: string; emailInvalid: string; messageMin: string }
  privacyHref: string
}) {
  const [state, action, pending] = useActionState<DemoFormState | null, FormData>(
    async () => sendContactEmail(),
    null
  )
  const [errors, setErrors] = useState<Errors>({})
  const types = copy.projectTypePlaceholder
    .replace(/…$/, "")
    .split(" / ")
    .map((type) => type.trim())

  function validate(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget)
    const next: Errors = {}
    if (String(data.get("name") ?? "").trim().length < 2) next.name = messages.nameMin
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? ""))) next.email = messages.emailInvalid
    if (String(data.get("message") ?? "").trim().length < 5) next.message = messages.messageMin
    setErrors(next)
    if (Object.keys(next).length) {
      event.preventDefault()
      event.currentTarget.querySelector<HTMLElement>("[aria-invalid=true]")?.focus()
    }
  }

  return (
    <form action={action} onSubmit={validate} noValidate className="relative grid gap-5">
      {/* Pole-pułapka dla botów, poza ekranem i poza kolejnością Tab. */}
      <label className="absolute -left-[9999px]" aria-hidden="true">
        {copy.honeypot}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="kn-name" label={copy.name} error={errors.name}>
          <input
            id="kn-name"
            name="name"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? "kn-name-error" : undefined}
            className={cn(field, "h-12")}
          />
        </Field>
        <Field id="kn-email" label={copy.email} error={errors.email}>
          <input
            id="kn-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={copy.emailPlaceholder}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "kn-email-error" : undefined}
            className={cn(field, "h-12")}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-fm-small font-medium">{copy.projectType}</legend>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <label key={type} className="relative">
              <input type="radio" name="projectType" value={type} className="peer sr-only" />
              <span className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-fm-fill px-4 text-sm font-medium text-fm-ink-2 transition-[background-color,color] duration-150 select-none peer-checked:bg-fm-ink peer-checked:text-fm-inverse peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fm-ink hover:bg-fm-fill-strong peer-checked:hover:bg-fm-ink">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="kn-message" label={copy.message} error={errors.message}>
        <textarea
          id="kn-message"
          name="message"
          rows={5}
          placeholder={copy.messagePlaceholder}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={errors.message ? "kn-message-error" : undefined}
          className={cn(field, "[field-sizing:content] min-h-36 resize-none py-3")}
        />
      </Field>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[34ch] text-fm-micro text-pretty text-fm-ink-3">
          {copy.privacyNote}{" "}
          <a
            href={privacyHref}
            className="rounded-sm text-fm-ink-2 underline underline-offset-2 fm-focus hover:text-fm-ink"
          >
            {copy.privacyLink}
          </a>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-12 shrink-0 fm-press items-center justify-center gap-2 rounded-full bg-fm-ink ps-6 pe-5 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] hover:bg-fm-ink/85 disabled:opacity-80"
        >
          <span className="grid">
            <span
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-200",
                pending && "opacity-0"
              )}
            >
              {copy.submit}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "col-start-1 row-start-1 opacity-0 transition-opacity duration-200",
                pending && "opacity-100"
              )}
            >
              {copy.submitting}
            </span>
          </span>
          {pending ? (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-fm-inverse/30 border-t-fm-inverse"
            />
          ) : (
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-200 ease-fm-snap group-hover:-translate-y-0.5"
            />
          )}
        </button>
      </div>

      <p role="status" className={cn("text-fm-small text-fm-ink-2", !state && "sr-only")}>
        {state?.message}
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-fm-small font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="kn-swap mt-2 flex items-start gap-1.5 text-[0.8125rem] leading-5 font-medium text-fm-ink"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
