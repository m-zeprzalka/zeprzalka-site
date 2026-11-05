"use client"

import { useEffect, useRef } from "react"
import { modeStore } from "../lens/store"

/** Czas przejazdu linii i wysokość pasa kodu za nią. */
const DURATION = 1400
const BAND = 112
/** Ile razy skan może się odegrać na jednej wizycie (wejście + jedno ponowne). */
const MAX_RUNS = 2

/**
 * Skan biogramu na czas, nie na przewijanie: gdy sekcja wejdzie w kadr, linia
 * przejeżdża przez nią raz (1,4 s, krzywa „ruch po ekranie”), ciągnąc za sobą
 * krótki pas kodu, i znika — zostaje gotowy tekst. Stan spoczynkowy jest zawsze
 * kompletny (projekt), przewijanie najwyżej uruchamia animację. Ponowne wejście
 * — najwyżej raz jeszcze. Przy „ogranicz ruch” i w trybie „Kod” — nic.
 * Animacja to WAAPI na dwóch przeciwnych transformacjach (kompozytor).
 */
export function Scan({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scan = ref.current
    const section = scan?.closest<HTMLElement>("section")
    const move = scan?.querySelector<HTMLElement>(".rg-scan__move")
    const inner = scan?.querySelector<HTMLElement>(".rg-scan__inner")
    if (!scan || !section || !move || !inner) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let runs = 0
    let armed = true
    let animations: Animation[] = []

    const play = () => {
      if (runs >= MAX_RUNS || modeStore.get() === "code") return
      runs += 1
      armed = false
      const height = section.offsetHeight
      // Zawartość pasa ma wysokość sekcji — bliźniaki stoją dokładnie na oryginałach.
      inner.style.height = `${height}px`
      const options: KeyframeAnimationOptions = {
        duration: DURATION,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
      scan.setAttribute("data-playing", "")
      animations = [
        move.animate({ translate: [`0 ${-BAND}px`, `0 ${height}px`] }, options),
        inner.animate({ translate: [`0 ${BAND}px`, `0 ${-height}px`] }, options),
      ]
      const done = () => {
        scan.removeAttribute("data-playing")
        inner.style.height = ""
      }
      void animations[0]?.finished.then(done).catch(done)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting && armed) play()
        else if (!entry.isIntersecting) armed = true
      },
      { threshold: 0.35 }
    )
    observer.observe(section)
    const offMode = modeStore.subscribe(() => {
      animations.forEach((animation) => animation.cancel())
      scan.removeAttribute("data-playing")
    })
    return () => {
      observer.disconnect()
      offMode()
      animations.forEach((animation) => animation.cancel())
    }
  }, [])

  return (
    <div ref={ref} className="rg-scan" aria-hidden="true">
      {children}
    </div>
  )
}
