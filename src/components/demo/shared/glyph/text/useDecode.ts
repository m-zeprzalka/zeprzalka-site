"use client"

import { useEffect, type RefObject } from "react"
import { useGlyphMotion } from "../motion"
import type { GlyphSettings } from "../settings"
import { clear, collect, paint } from "./decoder"

export type DecodeTrigger = "view" | "hover" | "mount"

/**
 * Dekodowanie liter w elemencie. Wyzwalacze (zawsze w czasie — przewijanie
 * najwyżej URUCHAMIA, nigdy nie zostawia bełkotu):
 * - `view` — raz, po wejściu w kadr; potem najechanie puszcza krótki przebieg,
 * - `mount` — raz, zaraz po hydratacji (tekst nad zgięciem),
 * - `hover` — tekst zawsze czytelny, najechanie i fokus puszczają przebieg
 *   glify → litery (na dotyku: dotknięcie).
 * „Ogranicz ruch” — zwykły tekst.
 */
export function useDecode(
  ref: RefObject<HTMLElement | null>,
  settings: GlyphSettings,
  glyphs: string,
  {
    trigger = "view",
    duration = 1,
    host,
    delay = 0,
  }: {
    trigger?: DecodeTrigger
    /** Mnożnik czasu dekodowania (nagłówek krótszy, akapit dłuższy). */
    duration?: number
    /** Element, który słucha najechania (domyślnie sam tekst). */
    host?: RefObject<HTMLElement | null>
    /** Opóźnienie startu (ms) — kolejność w kompozycji. */
    delay?: number
  } = {}
) {
  const { reduced } = useGlyphMotion()
  const { mode, fps, decode } = settings

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const target = collect(root, mode)
    if (reduced) {
      clear(target)
      return
    }
    const listener = host?.current ?? root
    // Nie szybciej niż ~700 ms na całość: tekst ma się dać przeczytać w trakcie.
    const total = Math.max(700, decode * duration)
    let p = 1
    let goal = 1
    let last = 0
    let lastTick = 0
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const step = (now: number) => {
      frame = 0
      const dt = last ? Math.min(64, now - last) : 16
      last = now
      if (p < goal) p = Math.min(goal, p + dt / total)
      const tick = now - lastTick >= 1000 / fps - 2
      if (tick) lastTick = now
      const busy = paint(target, glyphs, decode * duration, mode, p, tick)
      if (p >= 1) clear(target)
      if (busy || p < goal) frame = requestAnimationFrame(step)
    }
    const run = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        p = 0
        goal = 1
        last = 0
        if (!frame) frame = requestAnimationFrame(step)
      }, delay)
    }

    const cleanups: (() => void)[] = []
    if (trigger === "mount") {
      paint(target, glyphs, decode, mode, 0, true)
      run()
    } else if (trigger === "view") {
      paint(target, glyphs, decode, mode, 0, true)
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          observer.disconnect()
          run()
        },
        { rootMargin: "0px 0px -8% 0px" }
      )
      observer.observe(root)
      cleanups.push(() => observer.disconnect())
    }
    if (trigger === "hover" || trigger === "view") {
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && p >= 1) run()
      }
      const onFocus = () => p >= 1 && run()
      listener.addEventListener("pointerenter", onEnter)
      listener.addEventListener("focusin", onFocus)
      if (trigger === "hover") listener.addEventListener("click", run)
      cleanups.push(() => {
        listener.removeEventListener("pointerenter", onEnter)
        listener.removeEventListener("focusin", onFocus)
        listener.removeEventListener("click", run)
      })
    }
    return () => {
      cleanups.forEach((fn) => fn())
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      clear(target)
    }
  }, [ref, host, mode, fps, decode, glyphs, reduced, trigger, duration, delay])
}
