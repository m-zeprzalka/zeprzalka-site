"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { SECTION } from "./anchors"
import { LOGO, LOGO_REST, randomOf } from "./glyph/alphabet"
import { glyphFont } from "./glyph/fonts"

/** Rytm logo serwisu: nowy znak co sekundę. */
const TICK_MS = 1000
/** Najechanie: krótki szum znaku i odczyt domeny litera po literze. */
const SCRAMBLE_STEPS = 7
const SCRAMBLE_MS = 42
const LETTER_MS = 26

/**
 * Logo jak w serwisie (`src/components/layout/LogoGlyph.tsx`): znak podmieniany
 * co sekundę + `zeprzalka.com`. Znak startowy stały (HTML z serwera = pierwszy
 * render klienta, bez rozjazdu hydratacji), losowanie dopiero w efekcie.
 * Różnica: własny krój znaków (`i1-glyphs.woff2`) i stałe pudełko — każdy znak
 * ma tę samą metrykę, więc nagłówek nie drga i nigdy nie pokazuje pustego
 * prostokąta z kroju zastępczego. Akcent: najechanie puszcza krótki szum znaku,
 * a domena odczytuje się ze znaków litera po literze. „Ogranicz ruch” — znak stoi.
 */
export function Logo({ domain }: { domain: string }) {
  const reduced = useReducedMotion()
  const [glyph, setGlyph] = useState(LOGO_REST)
  const domainRef = useRef<HTMLSpanElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (reduced) return undefined
    const interval = setInterval(() => setGlyph(randomOf(LOGO)), TICK_MS)
    const pending = timers.current
    return () => {
      clearInterval(interval)
      pending.forEach(clearTimeout)
    }
  }, [reduced])

  function play() {
    if (reduced) return
    timers.current.forEach(clearTimeout)
    timers.current = []
    for (let step = 1; step <= SCRAMBLE_STEPS; step++) {
      timers.current.push(setTimeout(() => setGlyph(randomOf(LOGO)), step * SCRAMBLE_MS))
    }
    // Domena: każda litera na jedną klatkę zamienia się w znak, kolejno od lewej.
    const letters = domainRef.current?.querySelectorAll<HTMLElement>("[data-l]") ?? []
    letters.forEach((letter, index) => {
      timers.current.push(
        setTimeout(() => {
          letter.dataset.g = randomOf(LOGO)
        }, index * LETTER_MS),
        setTimeout(() => delete letter.dataset.g, index * LETTER_MS + 90)
      )
    })
  }

  return (
    <a
      href={`#${SECTION.start}`}
      onPointerEnter={(event) => event.pointerType === "mouse" && play()}
      onFocus={(event) => event.currentTarget.matches(":focus-visible") && play()}
      className="group relative -ms-1 flex items-center gap-2 rounded-full py-1 ps-1 pe-2 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap text-fm-ink fm-focus after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']"
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-grid h-[1em] w-[0.62em] place-items-center text-[1.3em] leading-none text-fm-ink",
          glyphFont.className
        )}
      >
        {reduced ? LOGO_REST : glyph}
      </span>
      <span ref={domainRef} className="i1-logo">
        <span className="sr-only">{domain}</span>
        <span aria-hidden="true">
          {Array.from(domain).map((letter, index) => (
            <span key={index} data-l="">
              {letter}
            </span>
          ))}
        </span>
      </span>
    </a>
  )
}
