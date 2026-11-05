"use client"

import { useEffect, type RefObject } from "react"
import type { SectionId } from "../lab/config"
import { useGlyphMotion, useVariant } from "../lab/store"
import { ScrollSettle } from "../engine/timing"
import { clear, collect, paint } from "./decoder"

/**
 * Dekodowanie liter w elemencie według wariantu sekcji z laboratorium.
 * Wyzwalacze: przewijanie (pasmo idzie za przewijaniem, nie cofa się, a po
 * 300 ms bezruchu tekst w kadrze dokańcza się sam — nigdy nie zostaje bełkot),
 * ciągły (raz, w czasie, po wejściu w kadr), najechanie (dotyk: po wejściu
 * w kadr), klik (dotknięcie przełącza). Ograniczony ruch — zwykły tekst.
 */
export function useDecode(
  ref: RefObject<HTMLElement | null>,
  section: SectionId,
  {
    host,
    scrollSpan = 0.55,
    duration = 1,
    pulse = false,
    view = false,
    maxFps = 60,
  }: {
    /** Element, który słucha najechania i kliknięcia (domyślnie sam tekst). */
    host?: RefObject<HTMLElement | null>
    /** Ile wysokości ekranu trwa dekodowanie przy przewijaniu. */
    scrollSpan?: number
    /** Mnożnik czasu dekodowania (nagłówek krótszy, akapit dłuższy). */
    duration?: number
    /** Tekst zawsze czytelny; wyzwalacz puszcza przebieg: glify → litery. */
    pulse?: boolean
    /** Nagłówki i liczby: zawsze raz, po wejściu w kadr (wyzwalacz sekcji steruje jej efektem). */
    view?: boolean
    /** Górna granica tempa liter (nagłówek sekcji wideo nie miga w tempie klipów). */
    maxFps?: number
  } = {}
) {
  const variant = useVariant(section)
  const { reduced, auto } = useGlyphMotion()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const target = collect(root, variant.mode)
    if (reduced) {
      clear(target)
      return
    }
    const listener = host?.current ?? root
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const wanted = view ? "continuous" : variant.trigger
    const trigger =
      wanted === "hover" && coarse
        ? "continuous"
        : wanted === "continuous" && !auto
          ? "instant"
          : wanted
    let p = 0
    let goal = 0
    let last = 0
    let lastTick = 0
    let frame = 0
    let seen = false
    let visible = false
    const settle = new ScrollSettle()
    const total = Math.max(500, variant.decode * 1.6 * duration)

    const progressFromScroll = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      return Math.min(
        1,
        Math.max(0, (vh * 0.92 - rect.top) / (rect.height * 0.35 + vh * scrollSpan))
      )
    }

    const step = (now: number) => {
      frame = 0
      const dt = last ? Math.min(64, now - last) : 16
      last = now
      if (trigger === "scroll") {
        p = goal = settle.update(progressFromScroll(), visible, dt, 1200, now)
      } else if (p < goal) p = Math.min(goal, p + dt / total)
      else if (p > goal) p = Math.max(goal, p - (dt / total) * 1.6)
      const tick = now - lastTick >= 1000 / Math.min(variant.fps, maxFps) - 2
      if (tick) lastTick = now
      const busy = paint(target, variant, p, tick)
      // Stan końcowy zawsze czysty: po dojściu do 1 litery wracają bez wyjątków.
      if (p >= 1 && goal >= 1) clear(target)
      const settling = trigger === "scroll" && visible && settle.pending
      if (busy || p !== goal || settling) frame = requestAnimationFrame(step)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(step)
    }

    if (trigger === "instant") {
      clear(target)
      return
    }
    if (pulse) {
      p = goal = 1
      clear(target)
      const run = () => {
        p = 0
        goal = 1
        wake()
      }
      let timer: ReturnType<typeof setInterval> | undefined
      if (variant.trigger === "continuous" && auto) timer = setInterval(run, 6000)
      const onEnterPulse = (event: PointerEvent) => {
        if (event.pointerType === "mouse") run()
      }
      if (variant.trigger === "hover") listener.addEventListener("pointerenter", onEnterPulse)
      if (variant.trigger === "click" || coarse) listener.addEventListener("click", run)
      return () => {
        clearInterval(timer)
        cancelAnimationFrame(frame)
        listener.removeEventListener("pointerenter", onEnterPulse)
        listener.removeEventListener("click", run)
        clear(target)
      }
    }
    paint(target, variant, 0, true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting
        if (!entry?.isIntersecting) return
        if (trigger === "continuous" && !seen) {
          seen = true
          goal = 1
        }
        wake()
      },
      // Od pierwszego piksela w kadrze — nic nie zostaje zakodowane przy krawędzi ekranu.
      { rootMargin: "0px" }
    )
    observer.observe(root)

    const onScroll = () => wake()
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      goal = 1
      wake()
    }
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      goal = 0
      wake()
    }
    const onClick = () => {
      goal = goal > 0.5 ? 0 : 1
      wake()
    }
    const onFocus = () => {
      goal = 1
      wake()
    }
    if (trigger === "scroll") window.addEventListener("scroll", onScroll, { passive: true })
    if (trigger === "hover") {
      listener.addEventListener("pointerenter", onEnter)
      listener.addEventListener("pointerleave", onLeave)
      listener.addEventListener("focusin", onFocus)
    }
    if (trigger === "click") listener.addEventListener("click", onClick)
    wake()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      listener.removeEventListener("pointerenter", onEnter)
      listener.removeEventListener("pointerleave", onLeave)
      listener.removeEventListener("focusin", onFocus)
      listener.removeEventListener("click", onClick)
      clear(target)
    }
  }, [ref, host, variant, reduced, auto, scrollSpan, duration, pulse, view, maxFps])
}
