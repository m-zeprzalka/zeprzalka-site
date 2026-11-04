"use client"

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react"
import { useFormStatus } from "react-dom"
import { Check, CircleAlert, Info } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { sendContactEmail } from "@/components/demo/forma/demo-action"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { GlyphSpinner } from "./GlyphSpinner"

type Field = "name" | "email" | "message"
type Labels = DemoHomeContent["contact"]["form"]
type Errors = DemoHomeContent["contact"]["errors"]

interface FormState {
  status: "idle" | "invalid" | "done"
  errors: Partial<Record<Field, string>>
  /** Wpisane wartości wracają do pól — React czyści formularz po akcji. */
  values: { name: string; email: string; message: string; types: readonly string[] }
  message: string
  /** Kolejny numer odpowiedzi: ten sam komunikat dwa razy też ma zostać ogłoszony. */
  seq: number
}

const EMPTY: FormState = {
  status: "idle",
  errors: {},
  values: { name: "", email: "", message: "", types: [] },
  message: "",
  seq: 0,
}

/** Rodzaje projektu to podpowiedź z treści („Strona internetowa / Animacja / Grafika…”) zamieniona w przełączniki. */
function projectTypes(placeholder: string): string[] {
  return placeholder
    .replace(/\.{3}|…/g, "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * Formularz kontaktowy (wzór z „Indeksu”): walidacja w przeglądarce z komunikatami
 * serwisu, fokus na pierwszym błędnym polu, wynik w regionie `status`. Wysyłanie
 * sygnalizuje migający glif. Demo niczego nie wysyła (`forma/demo-action.ts`).
 */
export function ContactForm({
  labels,
  errors: messages,
  privacyHref,
}: {
  labels: Labels
  errors: Errors
  privacyHref: string
}) {
  const types = projectTypes(labels.projectTypePlaceholder)

  async function submit(prev: FormState, data: FormData): Promise<FormState> {
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      types: data.getAll("type").map(String),
    }
    const errors: FormState["errors"] = {}
    if (values.name.length < 2) errors.name = messages.nameMin
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = messages.emailInvalid
    if (values.message.length < 5) errors.message = messages.messageMin
    if (Object.keys(errors).length > 0) {
      return { status: "invalid", errors, values, message: "", seq: prev.seq + 1 }
    }
    const result = await sendContactEmail()
    return { status: "done", errors: {}, values, message: result.message, seq: prev.seq + 1 }
  }

  const [state, action] = useActionState(submit, EMPTY)
  const [touched, setTouched] = useState<ReadonlySet<Field>>(() => new Set())
  const [handledSeq, setHandledSeq] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  // Nowa odpowiedź akcji: błędy znów widoczne, fokus na pierwszym błędnym polu.
  if (handledSeq !== state.seq) {
    setHandledSeq(state.seq)
    setTouched(new Set())
  }
  useEffect(() => {
    if (state.status !== "invalid") return
    const first = (["name", "email", "message"] as const).find((field) => state.errors[field])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }, [state])

  const errorFor = (field: Field) => (touched.has(field) ? undefined : state.errors[field])
  const touch = (field: Field) =>
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)))

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
        <FieldShell id="gl-name" label={labels.name} error={errorFor("name")}>
          <input
            id="gl-name"
            name="name"
            autoComplete="name"
            placeholder={labels.namePlaceholder}
            defaultValue={state.values.name}
            onChange={() => touch("name")}
            aria-invalid={!!errorFor("name")}
            aria-describedby={errorFor("name") ? "gl-name-error" : undefined}
            className="gl-input h-12 px-4"
          />
        </FieldShell>
        <FieldShell id="gl-email" label={labels.email} error={errorFor("email")}>
          <input
            id="gl-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder={labels.emailPlaceholder}
            defaultValue={state.values.email}
            onChange={() => touch("email")}
            aria-invalid={!!errorFor("email")}
            aria-describedby={errorFor("email") ? "gl-email-error" : undefined}
            className="gl-input h-12 px-4"
          />
        </FieldShell>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-fm-small font-medium text-fm-ink-2">
          {labels.projectType}
        </legend>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <label key={type} className="group relative cursor-pointer select-none">
              <input
                type="checkbox"
                name="type"
                value={type}
                defaultChecked={state.values.types.includes(type)}
                className="peer sr-only"
              />
              <span className="inline-flex h-11 fm-press items-center gap-1.5 rounded-full bg-fm-fill px-4 text-sm font-medium text-fm-ink-2 outline-2 outline-offset-2 outline-transparent transition-[background-color,color,scale] duration-150 ease-fm-snap peer-checked:bg-fm-ink peer-checked:text-fm-inverse peer-focus-visible:outline-fm-ink hover:bg-fm-fill-strong peer-checked:hover:bg-fm-ink/85">
                <Check
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="-ms-0.5 hidden size-3.5 group-has-checked:block"
                />
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FieldShell id="gl-message" label={labels.message} error={errorFor("message")}>
        <textarea
          id="gl-message"
          name="message"
          rows={5}
          placeholder={labels.messagePlaceholder}
          defaultValue={state.values.message}
          onChange={() => touch("message")}
          aria-invalid={!!errorFor("message")}
          aria-describedby={errorFor("message") ? "gl-message-error" : undefined}
          className="gl-input max-h-96 min-h-36 px-4 py-3"
        />
      </FieldShell>

      <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[22rem] text-fm-micro text-pretty text-fm-ink-3">
          {labels.privacyNote}{" "}
          <a
            href={privacyHref}
            className="rounded-fm-xs text-fm-ink-2 underline decoration-fm-edge-strong underline-offset-2 fm-focus hover:text-fm-ink"
          >
            {labels.privacyLink}
          </a>
        </p>
        <Submit idle={labels.submit} pending={labels.submitting} />
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {state.status === "done" && (
          <p
            key={state.seq}
            className="flex items-start gap-3 rounded-fm-xl bg-fm-fill p-4 text-fm-small text-fm-ink-2 motion-safe:animate-[fm-rise_400ms_var(--ease-fm-snap)_both]"
          >
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fm-ink" />
            {state.message}
          </p>
        )}
      </div>
    </form>
  )
}

function FieldShell({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-fm-small font-medium text-fm-ink-2">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-fm-small text-fm-ink motion-safe:animate-[fm-fade_200ms_var(--ease-fm-snap)_both]"
        >
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Przycisk wysyłania: spoczynek i „Wysyłanie…” w jednej komórce siatki (szerokość
 * nie skacze). Zajęty ma `aria-disabled`, nie `disabled` — fokus nie ucieka.
 */
function Submit({ idle, pending: pendingLabel }: { idle: string; pending: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending || undefined}
      onClick={(event) => {
        if (pending) event.preventDefault()
      }}
      className={cn(
        "inline-grid h-12 shrink-0 place-items-center rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-ink/85 active:scale-[0.97]",
        pending && "cursor-progress"
      )}
    >
      <span
        aria-hidden={pending || undefined}
        className={cn(
          "col-start-1 row-start-1 transition-[opacity,filter] duration-200",
          pending && "opacity-0 blur-[2px]"
        )}
      >
        {idle}
      </span>
      <span
        aria-hidden={!pending || undefined}
        className={cn(
          "col-start-1 row-start-1 inline-flex items-center gap-2 transition-[opacity,filter] duration-200",
          !pending && "opacity-0 blur-[2px]"
        )}
      >
        <GlyphSpinner active={pending} />
        {pendingLabel}
      </span>
    </button>
  )
}
