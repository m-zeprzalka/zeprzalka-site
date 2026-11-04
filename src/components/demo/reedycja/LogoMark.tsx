"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "@/components/demo/forma/cn"

/**
 * Glify z ASCII i Latin-1 — wszystkie są w podzbiorze `latin` kroju Geist Mono,
 * więc nigdy nie spadają do czcionki systemowej (dawne znaki APL i matematyczne
 * bywały pustym prostokątem — dług nr 11).
 */
const GLYPHS = Array.from("{}[]<>/\\|*+=#%&@$~^;:!?±×÷¤°¬«»¶")
/** Znak spoczynkowy: paragraf — „wydanie”, skład, druk. */
const BASE = "§"

const pick = (previous: string) => {
  let next = previous
  while (next === previous) next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? BASE
  return next
}

/**
 * Znak serwisu w drugim wydaniu: glif w kafelku + domena. Glif nie miga sam
 * w nieskończoność (WCAG 2.2.2) — „dekoduje się” po wczytaniu, przewija razem
 * ze stroną i tasuje pod kursorem, a w spoczynku wraca do paragrafu.
 * Przy „ogranicz ruch” stoi.
 */
export function LogoMark({ domain, href }: { domain: string; href: string }) {
  const [glyph, setGlyph] = useState(BASE)
  const reduced = useReducedMotion()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lastScroll = useRef(0)

  function clear() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  /** Kilka szybkich podmian i lądowanie na znaku spoczynkowym. */
  function decode(steps: number, delay = 0) {
    // Media query wprost: przy pierwszym efekcie hydratacja może jeszcze nieść wartość z serwera.
    if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    clear()
    for (let step = 0; step <= steps; step++) {
      timers.current.push(
        setTimeout(
          () => setGlyph((previous) => (step === steps ? BASE : pick(previous))),
          delay + step * 55
        )
      )
    }
  }

  const onScroll = useEffectEvent(() => {
    if (reduced) return
    const now = performance.now()
    if (now - lastScroll.current > 110) {
      lastScroll.current = now
      clear()
      setGlyph(pick)
    }
    // Po zatrzymaniu przewijania krótki „dekod” z powrotem do paragrafu.
    clearTimeout(settle.current)
    settle.current = setTimeout(() => decode(3), 420)
  })

  const onMount = useEffectEvent(() => decode(9, 250))

  useEffect(() => {
    onMount()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      clearTimeout(settle.current)
      clear()
    }
  }, [])

  return (
    <a
      href={href}
      onPointerEnter={() => decode(7)}
      onFocus={() => decode(7)}
      className="group -mx-1.5 flex h-10 items-center gap-2.5 rounded-full px-1.5 fm-focus"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-7 place-items-center rounded-fm-sm bg-fm-ink font-mono text-[0.9375rem] leading-none text-fm-inverse",
          "transition-transform duration-200 ease-fm-snap group-active:scale-95"
        )}
      >
        {glyph}
      </span>
      <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{domain}</span>
    </a>
  )
}
