"use client"

import { useActionState, useState, type ReactNode } from "react"
import Link from "next/link"
import { Dialog } from "radix-ui"
import { AnimatePresence, useDragControls, type PanInfo } from "motion/react"
import * as m from "motion/react-m"
import { X } from "lucide-react"
import { sendContactEmail } from "@/components/demo/shared/demo-action"
import { typo } from "@/components/demo/forma/typo"
import { cn } from "../forma/cn"
import { useMedia } from "./hooks"
import { SubmitMorph, type SubmitResult } from "./SubmitMorph"

export interface ContactLabels {
  title: string
  description: string
  close: string
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
  privacyHref: string
}

/** Wynik zostaje na przycisku tyle, żeby dało się go przeczytać. */
const RESULT_HOLD = 3600

const SHEET_SPRING = { type: "spring", visualDuration: 0.5, bounce: 0.1 } as const
const DIALOG_SPRING = { type: "spring", visualDuration: 0.3, bounce: 0 } as const

/**
 * Formularz kontaktowy: na telefonie szuflada od dołu (górne rogi 32 px,
 * przeciągnij uchwyt w dół, żeby zamknąć — prędkość też się liczy), na
 * desktopie okno dialogowe. Radix pilnuje fokusu i Esc, Motion wejścia
 * i wyjścia (`forceMount` + `AnimatePresence`). Akcja to atrapa dem —
 * niczego nie wysyła.
 */
export function ContactSheet({
  open,
  onOpenChange,
  labels,
  onReturnFocus,
  container,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  labels: ContactLabels
  onReturnFocus: () => void
  container: HTMLElement | null
}) {
  const desktop = useMedia("(min-width: 768px)")
  const drag = useDragControls()

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) onOpenChange(false)
  }

  const body = (
    <>
      <div className="flex items-start justify-between gap-6">
        <div>
          <Dialog.Title className="text-fm-h3 font-semibold md:text-2xl md:tracking-[-0.025em]">
            {labels.title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 max-w-[26rem] text-fm-small text-pretty text-fm-ink-2">
            {typo(labels.description)}
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label={labels.close}
          title={labels.close}
          className="-me-2 -mt-1 grid size-10 shrink-0 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"
        >
          <X className="size-[1.125rem]" />
        </Dialog.Close>
      </div>
      <ContactForm labels={labels} />
    </>
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount container={container}>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-black/45 dark:bg-black/65"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              onCloseAutoFocus={(event) => {
                // Bez Dialog.Trigger Radix nie wie, dokąd wrócić — wskazujemy sami.
                event.preventDefault()
                onReturnFocus()
              }}
            >
              {desktop ? (
                <m.div
                  className="fixed inset-0 z-50 m-auto h-fit max-h-[calc(100dvh_-_3rem)] w-[min(34rem,calc(100vw_-_3rem))] overflow-y-auto rounded-[2rem] bg-fm-surface p-8 shadow-fm-float outline-none"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: DIALOG_SPRING }}
                  exit={{ opacity: 0, scale: 0.98, y: 4, transition: { duration: 0.15 } }}
                >
                  {body}
                </m.div>
              ) : (
                <m.div
                  className="fixed inset-x-0 bottom-0 z-50 flex max-h-[calc(100dvh_-_1.5rem)] flex-col rounded-t-[2rem] bg-fm-surface shadow-fm-float outline-none"
                  initial={{ y: "100%" }}
                  animate={{ y: 0, transition: SHEET_SPRING }}
                  exit={{ y: "100%", transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] } }}
                  drag="y"
                  dragListener={false}
                  dragControls={drag}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.05, bottom: 0.85 }}
                  onDragEnd={onDragEnd}
                >
                  {/* Uchwyt: przeciąganie tylko stąd, żeby nie walczyć z przewijaniem formularza. */}
                  <div
                    aria-hidden="true"
                    className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-2 active:cursor-grabbing"
                    onPointerDown={(event) => drag.start(event)}
                  >
                    <span className="h-1.5 w-10 rounded-full bg-fm-fill-strong" />
                  </div>
                  <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                    {body}
                  </div>
                </m.div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function ContactForm({ labels }: { labels: ContactLabels }) {
  const [shown, setShown] = useState<number | null>(null)
  const [result, action] = useActionState<SubmitResult | null>(async (previous) => {
    const response = await sendContactEmail()
    const id = (previous?.id ?? 0) + 1
    // Wynik znika po chwili — zegar startuje z akcji, nie z efektu.
    setShown(id)
    setTimeout(() => setShown((current) => (current === id ? null : current)), RESULT_HOLD)
    return { id, ...response }
  }, null)

  return (
    <form action={action} className="mt-6 grid grid-cols-1 gap-4">
      <Field label={labels.name}>
        <input
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          placeholder={labels.namePlaceholder}
          className={FIELD}
        />
      </Field>
      <Field label={labels.email}>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={labels.emailPlaceholder}
          className={FIELD}
        />
      </Field>
      <Field label={labels.projectType}>
        <input
          name="projectType"
          maxLength={200}
          placeholder={labels.projectTypePlaceholder}
          className={FIELD}
        />
      </Field>
      <Field label={labels.message}>
        <textarea
          name="message"
          required
          minLength={5}
          rows={4}
          placeholder={labels.messagePlaceholder}
          className={cn(FIELD, "[field-sizing:content] h-auto min-h-[7.5rem] resize-none py-3")}
        />
      </Field>
      <div className="mt-2">
        <SubmitMorph
          result={result && result.id === shown ? result : null}
          labels={{ submit: labels.submit, submitting: labels.submitting }}
        />
      </div>
      <p className="text-center text-fm-micro text-pretty text-fm-ink-3">
        {typo(labels.privacyNote)}{" "}
        <Link
          href={labels.privacyHref}
          className="rounded-sm text-fm-ink-2 underline decoration-current/30 underline-offset-2 fm-focus transition-colors hover:text-fm-ink"
        >
          {labels.privacyLink}
        </Link>
      </p>
    </form>
  )
}

/** Wypełnione pole (bez ramki), 16 px — Safari na iOS nie przybliża strony. */
const FIELD =
  "h-12 w-full rounded-fm-xl bg-fm-fill px-4 text-base text-fm-ink placeholder:text-fm-ink-3 outline-none transition-[background-color,box-shadow] duration-150 focus:bg-fm-surface focus:shadow-[0_0_0_1.5px_var(--fm-ink)]"

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-fm-small font-medium">{label}</span>
      {children}
    </label>
  )
}
