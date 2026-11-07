"use client"

import { useEffect, useRef } from "react"
import { randomGlyph } from "@/app/main-page/_lib/glyphs"
import { observeReveal, prefersReducedMotion } from "@/app/main-page/_lib/motion"
import { cn } from "@/lib/utils"

/** Znak w literze zmienia się co tyle ms (ok. 14 kl./s — tempo wybrane w laboratorium). */
const TICK_MS = 70
/** Odczyt napisu przy wejściu w kadr: litery wracają od lewej w tym czasie. */
const DECODE_MS = 820
/** Fala przy najechaniu: kolejna litera co tyle ms, każda przez tyle ms jest znakiem. */
const WAVE_STEP_MS = 26
const WAVE_HOLD_MS = 110

/** Okno litery: od kiedy do kiedy (ms od startu) zamiast niej stoi znak. */
type Window = readonly [from: number, to: number]

function decodeWindows(count: number): Window[] {
  const spread = DECODE_MS * 0.7
  const jitter = DECODE_MS * 0.3
  return Array.from({ length: count }, (_, index) => [
    0,
    (index / Math.max(1, count - 1)) * spread + Math.random() * jitter,
  ])
}

function waveWindows(count: number): Window[] {
  return Array.from({ length: count }, (_, index) => [
    index * WAVE_STEP_MS,
    index * WAVE_STEP_MS + WAVE_HOLD_MS,
  ])
}

/**
 * Przebieg na literach: w swoim oknie litera pokazuje znak (atrybut `data-glyph`,
 * rysuje go CSS — `glyph-text` w globals.css), potem wraca. Tekst w DOM się nie
 * zmienia, więc szerokość i SEO widzą zawsze prawdziwy napis, a czytnik — jego kopię
 * w jednym kawałku.
 */
function play(letters: readonly HTMLElement[], windows: readonly Window[]): () => void {
  const end = Math.max(...windows.map(([, to]) => to))
  const start = performance.now()
  let lastTick = -Infinity
  let frame = 0

  const step = (now: number) => {
    const time = now - start
    const tick = now - lastTick >= TICK_MS
    if (tick) lastTick = now
    letters.forEach((letter, index) => {
      const [from, to] = windows[index] ?? [0, 0]
      if (time >= from && time < to) {
        if (tick || !letter.dataset.glyph) letter.dataset.glyph = randomGlyph()
      } else if (time >= to) delete letter.dataset.glyph
    })
    if (time < end) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)

  return () => {
    cancelAnimationFrame(frame)
    letters.forEach((letter) => delete letter.dataset.glyph)
  }
}

/**
 * Napis, którego litery przechodzą przez znaki sygnetu.
 * - `decode` — napis, który przy wejściu strony jest jeszcze pod zgięciem, czeka
 *   jako znaki i odczytuje się od lewej, gdy wjedzie w kadr. Widoczny od razu
 *   zostaje czytelny (spoczynek zawsze kompletny).
 * - `wave` — najechanie albo fokus na najbliższym linku lub przycisku puszcza
 *   falę: litera po literze na chwilę zamienia się w znak.
 * Przy „ogranicz ruch” napis stoi.
 */
export function GlyphText({
  text,
  mode = "decode",
  className,
}: {
  text: string
  mode?: "decode" | "wave"
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const letters = [...root.querySelectorAll<HTMLElement>("[data-letter]")]
    let stop = () => {}

    if (mode === "wave") {
      const host = root.closest<HTMLElement>("a, button") ?? root
      const run = (event: Event) => {
        if (event instanceof PointerEvent && event.pointerType !== "mouse") return
        if (event.type === "focus" && !host.matches(":focus-visible")) return
        stop()
        stop = play(letters, waveWindows(letters.length))
      }
      host.addEventListener("pointerenter", run)
      host.addEventListener("focus", run)
      return () => {
        host.removeEventListener("pointerenter", run)
        host.removeEventListener("focus", run)
        stop()
      }
    }

    const unobserve = observeReveal(root, {
      arm: () => letters.forEach((letter) => (letter.dataset.glyph = randomGlyph())),
      play: () => (stop = play(letters, decodeWindows(letters.length))),
    })
    return () => {
      unobserve()
      stop()
    }
  }, [mode, text])

  // Czytnik dostaje cały napis w jednym kawałku (`sr-only`); litery do animacji są
  // `aria-hidden` — VoiceOver i TalkBack potrafią czytać osobne `span` litera po literze.
  return (
    <span ref={ref} className={cn("glyph-text", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, index) =>
          // Spacje (także twarde z `noOrphans`) zostają tekstem — znak pojawia się tylko w literach.
          /\s/.test(char) ? (
            char
          ) : (
            <span key={index} data-letter="">
              {char}
            </span>
          )
        )}
      </span>
    </span>
  )
}
