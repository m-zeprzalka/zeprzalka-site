"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { sendContactEmail } from "@/components/demo/forma/demo-action"
import { cn } from "@/components/demo/forma/cn"

type Field = "name" | "email" | "message"

interface State {
  errors: Partial<Record<Field, string>>
  message: string
  values: Record<Field, string>
}

export interface ContactFormLabels {
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

/** Rodzaje projektu: podpowiedź z treści („Strona internetowa / Animacja / Grafika…”) jako chipy. */
function projectTypes(placeholder: string) {
  return placeholder
    .replace(/\.{3}|…/g, "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * Formularz-atrapa (dema niczego nie wysyłają — `forma/demo-action`).
 * Walidacja z komunikatami z treści serwisu, wartości wracają do pól po
 * odpowiedzi, a wynik ogłasza region `status`. Pola 16 px (bez zoomu iOS),
 * wiadomość rośnie z treścią (`field-sizing`).
 */
export function ContactForm({
  labels,
  errors,
  privacyHref,
}: {
  labels: ContactFormLabels
  errors: { nameMin: string; emailInvalid: string; messageMin: string }
  privacyHref: string
}) {
  const types = projectTypes(labels.projectTypePlaceholder)
  const [picked, setPicked] = useState<readonly string[]>([])

  const [state, action] = useActionState<State, FormData>(
    async (_previous, data) => {
      const values = {
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        message: String(data.get("message") ?? "").trim(),
      }
      const found: State["errors"] = {}
      if (values.name.length < 2) found.name = errors.nameMin
      if (!/^\S+@\S+\.\S+$/.test(values.email)) found.email = errors.emailInvalid
      if (values.message.length < 5) found.message = errors.messageMin
      if (Object.keys(found).length) return { errors: found, message: "", values }
      const result = await sendContactEmail()
      return { errors: {}, message: result.message, values }
    },
    { errors: {}, message: "", values: { name: "", email: "", message: "" } }
  )

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="name"
          label={labels.name}
          placeholder={labels.namePlaceholder}
          autoComplete="name"
          defaultValue={state.values.name}
          error={state.errors.name}
        />
        <TextField
          name="email"
          type="email"
          label={labels.email}
          placeholder={labels.emailPlaceholder}
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.errors.email}
        />
      </div>

      <fieldset>
        <legend className="text-fm-small font-medium text-fm-ink">{labels.projectType}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {types.map((type) => {
            const on = picked.includes(type)
            return (
              <label
                key={type}
                className={cn(
                  "inline-flex h-10 fm-press cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-[background-color,color,box-shadow,scale] duration-150 ease-fm-snap select-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-fm-ink",
                  on
                    ? "bg-fm-ink text-fm-inverse"
                    : "bg-fm-surface text-fm-ink-2 shadow-fm-ring hover:text-fm-ink"
                )}
              >
                <input
                  type="checkbox"
                  name="projectType"
                  value={type}
                  checked={on}
                  onChange={() =>
                    setPicked((current) =>
                      on ? current.filter((item) => item !== type) : [...current, type]
                    )
                  }
                  className="sr-only"
                />
                {type}
              </label>
            )
          })}
        </div>
      </fieldset>

      <TextField
        name="message"
        label={labels.message}
        placeholder={labels.messagePlaceholder}
        defaultValue={state.values.message}
        error={state.errors.message}
        multiline
      />

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[24rem] text-fm-micro text-pretty text-fm-ink-3">
          {labels.privacyNote}{" "}
          <a
            href={privacyHref}
            className="rounded-sm text-fm-ink-2 underline decoration-fm-edge-strong underline-offset-2 fm-focus hover:decoration-current"
          >
            {labels.privacyLink}
          </a>
        </p>
        <Submit label={labels.submit} pending={labels.submitting} />
      </div>
      <p role="status" className="min-h-5 text-fm-small text-fm-ink-2 empty:hidden">
        {state.message}
      </p>
    </form>
  )
}

function Submit({ label, pending }: { label: string; pending: string }) {
  const { pending: busy } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex h-12 shrink-0 fm-press items-center justify-center gap-2 rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale,opacity] duration-150 ease-fm-snap select-none hover:bg-fm-ink/85 disabled:opacity-70"
    >
      {busy ? pending : label}
      {busy ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <ArrowRight aria-hidden="true" className="size-4" />
      )}
    </button>
  )
}

function TextField({
  name,
  label,
  error,
  multiline = false,
  ...props
}: {
  name: string
  label: string
  error?: string
  multiline?: boolean
  placeholder: string
  defaultValue: string
  type?: string
  autoComplete?: string
}) {
  const id = `tf-${name}`
  const field = cn(
    "w-full rounded-fm-lg bg-fm-fill px-4 text-base text-fm-ink transition-[background-color,box-shadow] duration-150 outline-none placeholder:text-fm-ink-3 hover:bg-fm-fill-strong focus-visible:bg-fm-surface focus-visible:shadow-[0_0_0_2px_var(--fm-ink)]",
    error && "shadow-[0_0_0_1px_var(--fm-ink)]"
  )
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-fm-small font-medium text-fm-ink">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(field, "[field-sizing:content] min-h-32 resize-none py-3")}
          {...props}
        />
      ) : (
        <input
          id={id}
          name={name}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(field, "h-12")}
          {...props}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-fm-small text-fm-ink">
          {error}
        </p>
      )}
    </div>
  )
}
