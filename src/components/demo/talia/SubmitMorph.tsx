"use client"

import { useFormStatus } from "react-dom"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"
import { Check, Info, LoaderCircle } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "../forma/cn"

export interface SubmitResult {
  id: number
  success: boolean
  message: string
}

type Phase = "idle" | "pending" | "result"

const LAYOUT = { type: "spring", visualDuration: 0.38, bounce: 0.18 } as const

/**
 * Przycisk wysyłki, który mówi, co się dzieje: pigułka zwija się w koło ze
 * wskaźnikiem (Motion `layout`, promień korygowany w trakcie skalowania),
 * koło zamienia wskaźnik w znak wyniku, a treść odpowiedzi pojawia się pod
 * spodem — przycisk nie musi mieścić zdania. Wynik pokazuje rodzic przez
 * `result` (i sam go chowa po chwili), potem pigułka wraca. Czytnik ekranu
 * dostaje stan przez region `status`.
 */
export function SubmitMorph({
  result,
  labels,
}: {
  /** Ostatnia odpowiedź akcji albo `null`, gdy przycisk ma wrócić do spoczynku. */
  result: SubmitResult | null
  labels: { submit: string; submitting: string }
}) {
  const { pending } = useFormStatus()
  const reduced = useReducedMotion()
  const phase: Phase = pending ? "pending" : result ? "result" : "idle"
  const busy = phase !== "idle"

  const blur = reduced ? {} : { filter: "blur(3px)" }
  const layer = {
    initial: { opacity: 0, y: 10, ...blur },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, ...blur, transition: { duration: 0.14 } },
    transition: { type: "spring", visualDuration: 0.3, bounce: 0 },
  } as const

  return (
    <div className="flex flex-col items-center">
      <m.button
        layout
        type="submit"
        aria-disabled={busy || undefined}
        onClick={(event) => busy && event.preventDefault()}
        style={{ borderRadius: 999 }}
        transition={{ layout: LAYOUT }}
        className={cn(
          "relative inline-flex h-12 items-center justify-center overflow-hidden text-[0.9375rem] font-medium whitespace-nowrap fm-focus",
          "transition-[background-color,color] duration-200",
          busy ? "w-12" : "w-full px-6",
          phase === "result" && result && !result.success
            ? "bg-fm-fill-strong text-fm-ink"
            : "bg-fm-ink text-fm-inverse hover:bg-fm-ink/85"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {phase === "idle" && (
            <m.span key="idle" layout="position" {...layer}>
              {labels.submit}
            </m.span>
          )}
          {phase === "pending" && (
            <m.span key="pending" layout="position" {...layer} className="grid place-items-center">
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
            </m.span>
          )}
          {phase === "result" && result && (
            <m.span
              key={`result-${result.id}`}
              layout="position"
              {...layer}
              initial={{ opacity: 0, scale: 0.4, ...blur }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="grid place-items-center"
            >
              {result.success ? (
                <Check aria-hidden="true" className="size-5" />
              ) : (
                <Info aria-hidden="true" className="size-5" />
              )}
            </m.span>
          )}
        </AnimatePresence>
      </m.button>
      <AnimatePresence initial={false}>
        {phase === "result" && result && (
          <m.p
            key={result.id}
            aria-hidden="true"
            className="mt-3 text-center text-fm-small text-balance text-fm-ink-2"
            initial={{ opacity: 0, y: -4, ...blur }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.12 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {result.message}
          </m.p>
        )}
      </AnimatePresence>
      <span role="status" className="sr-only">
        {phase === "pending"
          ? labels.submitting
          : phase === "result" && result
            ? result.message
            : ""}
      </span>
    </div>
  )
}
