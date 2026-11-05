"use client"

import { useRef, useState, type CSSProperties } from "react"
import { Check, Copy } from "lucide-react"
import { CHARSET_SPECS, FONT_VAR } from "../engine/charsets"
import { useVariant } from "../lab/store"
import { Letters } from "../text/Letters"
import { useDecode } from "../text/useDecode"

/**
 * Kontakt (G): adres e-mail jako duży napis — zawsze czytelny. Kliknięcie
 * kopiuje go do schowka, a litery przechodzą przez glify wariantu G (szum,
 * fala…) i wracają; „najechanie” puszcza ten sam przebieg pod kursorem,
 * „ciągły” — co kilka sekund.
 */
export function EmailCode({
  email,
  copied,
  label,
}: {
  email: string
  copied: string
  label: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const host = useRef<HTMLButtonElement>(null)
  const variant = useVariant("contact")
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useDecode(ref, "contact", { host, pulse: true })

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      return
    }
    setDone(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 1800)
  }

  return (
    <button
      ref={host}
      type="button"
      onClick={copy}
      aria-label={`${label}: ${email}`}
      className="group -mx-2 inline-flex max-w-full items-center gap-4 rounded-fm-xl px-2 py-1 text-start fm-focus"
    >
      <span
        ref={ref}
        aria-hidden="true"
        className="gll-code gll-email min-w-0 break-all"
        style={
          { "--gll-glyph-font": FONT_VAR[CHARSET_SPECS[variant.charset].font] } as CSSProperties
        }
      >
        <Letters text={email} />
      </span>
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-fm-fill text-fm-ink-2 transition-colors duration-150 group-hover:bg-fm-fill-strong group-hover:text-fm-ink"
      >
        {done ? <Check className="size-4" /> : <Copy className="size-4" />}
      </span>
      <span role="status" className="sr-only">
        {done ? copied : ""}
      </span>
    </button>
  )
}
