"use client"

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react"
import { useFormStatus } from "react-dom"
import { ArrowRight, Check, CircleAlert, Info, LoaderCircle } from "lucide-react"
import { sendContactEmail } from "@/components/demo/shared/demo-action"
import { cn } from "../forma/cn"

type Field = "name" | "email" | "message"

interface FormState {
  status: "idle" | "invalid" | "done"
  errors: Partial<Record<Field, string>>
  /** Wpisane wartości wracają do pól — React czyści formularz po akcji. */
  values: { name: string; email: string; message: string; types: readonly string[] }
  message: string
  /** Kolejny numer odpowiedzi: ten sam komunikat dwa razy też ma zostać ogłoszony. */
  seq: number
}

export interface ContactLabels {
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

export interface ContactErrors {
  nameMin: string
  emailInvalid: string
  messageMin: string
}

const EMPTY: FormState = {
  status: "idle",
  errors: {},
  values: { name: "", email: "", message: "", types: [] },
  message: "",
  seq: 0,
}

/** Rodzaje projektu to podpowiedź z treści („Strona internetowa / Animacja / Grafika...”) zamieniona w chipy. */
function projectTypes(placeholder: string): string[] {
  return placeholder
    .replace(/\.{3}|…/g, "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * Krótki formularz w kolumnie. Walidacja po stronie przeglądarki z komunikatami
 * serwisu, fokus na pierwszym błędnym polu, wynik w regionie `status`.
 * Demo niczego nie wysyła — odpowiedź pochodzi z `shared/demo-action.ts`.
 */
export function ContactForm({
  labels,
  errors: messages,
  privacyHref,
}: {
  labels: ContactLabels
  errors: ContactErrors
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

  // Błąd znika, gdy tylko pole zostanie poprawione (edycja), nie dopiero po kolejnym wysłaniu.
  const errorFor = (field: Field) => (touched.has(field) ? undefined : state.errors[field])
  const touch = (field: Field) =>
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)))

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
        <FieldShell id="ix-name" label={labels.name} error={errorFor("name")}>
          <input
            id="ix-name"
            name="name"
            autoComplete="name"
            placeholder={labels.namePlaceholder}
            defaultValue={state.values.name}
            onChange={() => touch("name")}
            aria-invalid={!!errorFor("name")}
            aria-describedby={errorFor("name") ? "ix-name-error" : undefined}
            className="ix-field h-12 px-4"
          />
        </FieldShell>
        <FieldShell id="ix-email" label={labels.email} error={errorFor("email")}>
          <input
            id="ix-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={labels.emailPlaceholder}
            defaultValue={state.values.email}
            onChange={() => touch("email")}
            aria-invalid={!!errorFor("email")}
            aria-describedby={errorFor("email") ? "ix-email-error" : undefined}
            className="ix-field h-12 px-4"
          />
        </FieldShell>
      </div>

      <fieldset>
        <legend className="mb-2 text-fm-small font-medium text-fm-ink-2">
          {labels.projectType}
        </legend>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <label key={type} className="group relative cursor-pointer">
              <input
                type="checkbox"
                name="type"
                value={type}
                defaultChecked={state.values.types.includes(type)}
                className="peer sr-only"
              />
              <span className="inline-flex h-11 fm-press items-center rounded-full bg-fm-fill ps-4 pe-4 text-sm font-medium text-fm-ink-2 outline-2 outline-offset-2 outline-transparent transition-[background-color,color,padding,scale] duration-200 ease-fm-snap peer-checked:bg-fm-ink peer-checked:ps-3 peer-checked:text-fm-inverse peer-focus-visible:outline-fm-ink hover:bg-fm-fill-strong sm:h-10">
                <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-fm-snap group-has-checked:grid-cols-[1fr]">
                  <span className="overflow-hidden">
                    <Check aria-hidden="true" className="me-1.5 size-3.5" strokeWidth={2.5} />
                  </span>
                </span>
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FieldShell id="ix-message" label={labels.message} error={errorFor("message")}>
        <textarea
          id="ix-message"
          name="message"
          rows={4}
          placeholder={labels.messagePlaceholder}
          defaultValue={state.values.message}
          onChange={() => touch("message")}
          aria-invalid={!!errorFor("message")}
          aria-describedby={errorFor("message") ? "ix-message-error" : undefined}
          className="ix-field max-h-80 min-h-32 px-4 py-3"
        />
      </FieldShell>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="ix-enter flex items-start gap-3 rounded-fm-xl bg-fm-fill p-4 text-fm-small text-fm-ink-2"
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
          className="ix-enter flex items-center gap-1.5 text-fm-small text-fm-ink"
        >
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Przycisk wysyłania: spoczynek i „Wysyłanie…” leżą w jednej komórce siatki,
 * więc szerokość nie skacze. Zajęty przycisk ma `aria-disabled`, nie `disabled`
 * — przy `disabled` fokus uciekałby na `<body>`.
 */
function Submit({ idle, pending: pendingLabel }: { idle: string; pending: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending || undefined}
      data-pending={pending || undefined}
      onClick={(event) => {
        if (pending) event.preventDefault()
      }}
      className={cn(
        "ix-submit group inline-grid h-12 shrink-0 place-items-center overflow-hidden rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-ink/85 active:scale-[0.97]",
        pending && "cursor-progress"
      )}
    >
      <span data-layer="idle" className="ix-submit__layer" aria-hidden={pending || undefined}>
        {idle}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
      <span data-layer="pending" className="ix-submit__layer" aria-hidden={!pending || undefined}>
        <LoaderCircle aria-hidden="true" className="ix-spin size-4" />
        {pendingLabel}
      </span>
    </button>
  )
}
