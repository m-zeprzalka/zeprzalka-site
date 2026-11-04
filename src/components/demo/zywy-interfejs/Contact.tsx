"use client"

import { useActionState, useId } from "react"
import { ArrowUpRight, Info } from "lucide-react"
import { cn } from "../forma/cn"
import { sendContactEmail, type DemoFormState } from "../forma/demo-action"

const initial: DemoFormState = { success: false, message: "" }

/**
 * Formularz w karcie: pola wypełnione (bez ramek), 16 px na telefonie (iOS
 * nie powiększa strony), przycisk, który morfuje „wyślij → wysyłanie”
 * bez zmiany szerokości. Demo niczego nie wysyła (forma/demo-action.ts).
 */
export function Contact({
  copy,
}: {
  copy: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    message: string
    messagePlaceholder: string
    submit: string
    submitting: string
  }
}) {
  const [state, action, pending] = useActionState(sendContactEmail, initial)
  const id = useId()
  const field =
    "fm-focus w-full rounded-fm-lg bg-fm-fill px-4 text-base text-fm-ink transition-[background-color,box-shadow] duration-150 placeholder:text-fm-ink-3 hover:bg-fm-fill-strong focus-visible:bg-fm-surface focus-visible:shadow-fm-ring md:text-[0.9375rem]"

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-fm-small font-medium" htmlFor={`${id}-name`}>
          {copy.name}
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            className={cn(field, "h-12")}
          />
        </label>
        <label className="grid gap-2 text-fm-small font-medium" htmlFor={`${id}-email`}>
          {copy.email}
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            className={cn(field, "h-12")}
          />
        </label>
      </div>
      <label className="grid gap-2 text-fm-small font-medium" htmlFor={`${id}-message`}>
        {copy.message}
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          placeholder={copy.messagePlaceholder}
          className={cn(field, "resize-none py-3.5 leading-relaxed")}
        />
      </label>
      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-grid h-12 fm-press items-center rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-ink/85 disabled:cursor-progress"
        >
          {/* Oba stany w jednej komórce siatki — szerokość przycisku się nie zmienia. */}
          <span
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center gap-2 transition-[opacity,translate,filter] duration-200 ease-fm-snap",
              pending && "-translate-y-1 opacity-0 blur-[2px]"
            )}
          >
            {copy.submit} <ArrowUpRight className="size-4" />
          </span>
          <span
            aria-hidden={!pending}
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center gap-2 transition-[opacity,translate,filter] duration-200 ease-fm-snap",
              !pending && "translate-y-1 opacity-0 blur-[2px]"
            )}
          >
            <span className="size-4 animate-spin rounded-full border-2 border-current/25 border-t-current" />
            {copy.submitting}
          </span>
        </button>
        <p role="status" className="flex min-h-5 items-center gap-2 text-fm-small text-fm-ink-2">
          {state.message && (
            <>
              <Info className="size-4 shrink-0" /> {state.message}
            </>
          )}
        </p>
      </div>
    </form>
  )
}
