"use client"

import { useEffect, useRef } from "react"
import { cn } from "../forma/cn"
import { motionAllowed } from "./gsap"
import { motionPausedNow, onMotionChange } from "./motion"

/** Glify sygnetu — formy geometryczne z obecnego logo (wszystkie są w `kn-glyphs.woff2`). */
const GLYPHS = Array.from("⎈⎉⎊⎋⌘⊞⊠⊡⊟⊛⊕⊗⍟❖◈⧺⧻⍫⌀⊜◆◇○◎")
export const REST_GLYPH = "⎈"
const INTERVAL = 1000
const ROLL = { duration: 260, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }

function pick(not: string) {
  let next = not
  while (next === not) next = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? REST_GLYPH
  return next
}

/**
 * Sygnet-licznik: wariacja migającego glifu z logo. Zamiast podmiany znak
 * przewija się w górę jak bęben licznika — stary wyjeżdża, nowy wjeżdża
 * (260 ms, WAAPI na kompozytorze), co sekundę. Najechanie na rodzica `group`
 * przewija kilka znaków szybciej. Pauza ruchu i „ogranicz ruch” zatrzymują
 * go na ⎈ (WCAG 2.2.2). Pierwszy render jest stały — zgodna hydratacja.
 *
 * `auto={false}` (znak w stopce): bez stałego rytmu — jedna krótka seria, gdy
 * znak wejdzie w kadr, i przy najechaniu; zawsze kończy na ⎈, więc stoi jako
 * czytelny, cały sygnet, a nie klatka w pół obrotu.
 */
export function Sygnet({ className, auto = true }: { className?: string; auto?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const box = ref.current
    const [a, b] = box ? [...box.children] : []
    if (!box || !(a instanceof HTMLElement) || !(b instanceof HTMLElement)) return
    let front = a
    let back = b
    let timer: ReturnType<typeof setInterval> | undefined

    const roll = (glyph: string, speed = 1) => {
      back.textContent = glyph
      const options = { ...ROLL, duration: ROLL.duration / speed, fill: "forwards" as const }
      front.animate([{ translate: "0 0" }, { translate: "0 -100%" }], options)
      back.animate([{ translate: "0 100%" }, { translate: "0 0" }], options)
      ;[front, back] = [back, front]
    }
    const start = () => {
      clearInterval(timer)
      if (!auto) return
      if (motionPausedNow() || !motionAllowed()) {
        if (front.textContent !== REST_GLYPH) roll(REST_GLYPH)
        return
      }
      timer = setInterval(() => roll(pick(front.textContent ?? "")), INTERVAL)
    }
    // Najechanie na link z logo: krótka seria (4 znaki co 70 ms) — ruch wywołany przez użytkownika.
    const host = box.closest<HTMLElement>(".group")
    let burst: ReturnType<typeof setTimeout> | undefined
    const scramble = () => {
      if (!motionAllowed() || (!auto && motionPausedNow())) return
      let left = auto ? 4 : 6
      const step = () => {
        roll(left === 1 ? REST_GLYPH : pick(front.textContent ?? ""), 2)
        if (--left > 0) burst = setTimeout(step, auto ? 70 : 90)
      }
      clearTimeout(burst)
      step()
    }
    start()
    const off = onMotionChange(start)
    host?.addEventListener("pointerenter", scramble)
    // Znak bez stałego rytmu przewija się raz, gdy wejdzie w kadr.
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        scramble()
        seen.disconnect()
      },
      { threshold: 0.6 }
    )
    if (!auto) seen.observe(box)
    return () => {
      clearInterval(timer)
      clearTimeout(burst)
      off()
      seen.disconnect()
      host?.removeEventListener("pointerenter", scramble)
    }
  }, [auto])

  return (
    <span ref={ref} aria-hidden="true" className={cn("kn-sygnet", className)}>
      <span>{REST_GLYPH}</span>
      <span>{REST_GLYPH}</span>
    </span>
  )
}
