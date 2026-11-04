import type { CSSProperties } from "react"

/**
 * Okno sceny dla jednej warstwy, liczone na serwerze (procent postępu sceny).
 * Wartości liczbowe zamiast `calc(var(--i)…)` w CSS — `animation-range`
 * z `var()` w `calc()` nie wszędzie jest pewne, a liczby działają zawsze.
 * Poza trybem przewijanym (brak `animation-name`) styl nic nie robi.
 */
export function sceneRange(start: number, end: number): CSSProperties {
  const pct = (value: number) => `${Math.round(value * 100) / 100}%`
  return { animationRange: `contain ${pct(start)} contain ${pct(end)}` }
}
