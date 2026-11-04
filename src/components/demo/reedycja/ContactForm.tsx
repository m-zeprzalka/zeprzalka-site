"use client"

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react"
import { CircleAlert, Info, LoaderCircle } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { cn } from "@/components/demo/forma/cn"
import { sendContactEmail, type DemoFormState } from "@/components/demo/forma/demo-action"
import type { DemoHomeContent } from "@/components/demo/shared/content"

type FormCopy = DemoHomeContent["contact"]["form"]
type ErrorCopy = DemoHomeContent["contact"]["errors"]
type Field = "name" | "email" | "message"

const INITIAL: DemoFormState = { success: false, message: "" }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Rodzaje projektu z podpowiedzi pola („Strona internetowa / Animacja / Grafika…”). */
function suggestions(placeholder: string): string[] {
  return placeholder
    .replace(/…|\.{3}/g, "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
}

/** Te same reguły i komunikaty co w akcji serwisu (`common.contactAction`). */
function validate(data: FormData, errors: ErrorCopy): Partial<Record<Field, string>> {
  const name = String(data.get("name") ?? "").trim()
  const email = String(data.get("email") ?? "").trim()
  const message = String(data.get("message") ?? "").trim()
  const result: Partial<Record<Field, string>> = {}
  if (name.length < 2) result.name = errors.nameMin
  else if (name.length > 100) result.name = errors.nameMax
  if (!EMAIL.test(email)) result.email = errors.emailInvalid
  else if (email.length > 200) result.email = errors.emailMax
  if (message.length < 5) result.message = errors.messageMin
  else if (message.length > 5000) result.message = errors.messageMax
  return result
}

/**
 * Ten sam formularz co dziś (imię, e-mail, rodzaj projektu, wiadomość), ale:
 * pola wypełnione i 16 px (bez zoomu na iOS — dług nr 4); walidacja własna
 * (`noValidate`) z komunikatami z treści serwisu pod polem, zamiast
 * angielskich dymków przeglądarki; rodzaj projektu to grupa pigułek
 * (`aria-pressed`), które zapisują ukryte pole — bez pustego inputu.
 * Demo nie wysyła wiadomości — akcja z `forma/demo-action`.
 */
export function ContactForm({
  copy,
  errors: errorCopy,
  privacyHref,
}: {
  copy: FormCopy
  errors: ErrorCopy
  privacyHref: string
}) {
  const [state, formAction, pending] = useActionState(sendContactEmail, INITIAL)
  const [types, setTypes] = useState<readonly string[]>([])
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const chips = suggestions(copy.projectTypePlaceholder)

  useEffect(() => {
    if (state.message) statusRef.current?.focus()
  }, [state])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validate(new FormData(event.currentTarget), errorCopy)
    setErrors(found)
    const first = (["name", "email", "message"] as const).find((field) => found[field])
    if (!first) return
    event.preventDefault()
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  /** Po pierwszym błędzie pole sprawdza się na bieżąco — komunikat znika, gdy już jest dobrze. */
  function recheck(field: Field) {
    if (!errors[field] || !formRef.current) return
    const next = validate(new FormData(formRef.current), errorCopy)[field]
    if (next !== errors[field]) setErrors((prev) => ({ ...prev, [field]: next }))
  }

  const field =
    "block w-full rounded-fm-lg bg-fm-fill px-4 text-base text-fm-ink outline-none placeholder:text-fm-ink-3 transition-[background-color,box-shadow] duration-150 hover:bg-fm-fill-strong focus:bg-fm-surface focus:shadow-[0_0_0_1px_var(--fm-edge-strong),0_0_0_4px_color-mix(in_oklab,var(--fm-ink)_8%,transparent)] aria-invalid:shadow-[0_0_0_1.5px_var(--fm-ink)]"
  const label = "mb-2 block text-sm font-medium"
  const required = (
    <span aria-hidden="true" className="text-fm-ink-3">
      {" "}
      *
    </span>
  )
  const invalid = (name: Field) =>
    errors[name]
      ? ({ "aria-invalid": true, "aria-describedby": `${id}-${name}-error` } as const)
      : {}
  const message = (name: Field) =>
    errors[name] && (
      <p
        id={`${id}-${name}-error`}
        className="mt-2 flex items-start gap-1.5 text-[0.8125rem] leading-snug font-medium text-fm-ink"
      >
        <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
        {errors[name]}
      </p>
    )

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="grid gap-5">
      {state.message && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="status"
          className="flex items-start gap-3 rounded-fm-lg bg-fm-fill p-4 text-sm text-fm-ink-2 outline-none"
        >
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fm-ink" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            {copy.name}
            {required}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            onChange={() => recheck("name")}
            {...invalid("name")}
            className={cn(field, "h-12")}
          />
          {message("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            {copy.email}
            {required}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={copy.emailPlaceholder}
            onChange={() => recheck("email")}
            {...invalid("email")}
            className={cn(field, "h-12")}
          />
          {message("email")}
        </div>
      </div>

      <div role="group" aria-labelledby={`${id}-type`}>
        <p id={`${id}-type`} className={label}>
          {copy.projectType}
        </p>
        <input type="hidden" name="project-type" value={types.join(", ")} />
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const on = types.includes(chip)
            return (
              <button
                key={chip}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setTypes((prev) => (on ? prev.filter((item) => item !== chip) : [...prev, chip]))
                }
                className={cn(
                  "inline-flex h-11 fm-press items-center rounded-full px-4.5 text-sm font-medium fm-focus transition-[background-color,color,box-shadow,scale] duration-150 select-none",
                  on
                    ? "bg-fm-ink text-fm-inverse"
                    : "bg-fm-fill text-fm-ink-2 hover:bg-fm-fill-strong hover:text-fm-ink"
                )}
              >
                {chip}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={label}>
          {copy.message}
          {required}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder={copy.messagePlaceholder}
          onChange={() => recheck("message")}
          {...invalid("message")}
          className={cn(field, "min-h-36 resize-y py-3.5 leading-relaxed")}
        />
        {message("message")}
      </div>

      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:order-2 sm:w-auto">
          {pending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
          {pending ? copy.submitting : copy.submit}
        </Button>
        <p className="max-w-[34ch] text-[0.8125rem] leading-relaxed text-fm-ink-3 sm:order-1">
          {copy.privacyNote}{" "}
          <a
            href={privacyHref}
            className="rounded-sm text-fm-ink-2 underline decoration-fm-edge-strong underline-offset-2 fm-focus hover:text-fm-ink hover:decoration-current"
          >
            {copy.privacyLink}
          </a>
        </p>
      </div>
    </form>
  )
}
