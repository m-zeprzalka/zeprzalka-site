"use client"

import { useSyncExternalStore } from "react"

const formatter = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
})

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 15_000)
  return () => clearInterval(timer)
}

/**
 * Godzina w Warszawie. Na serwerze i przy hydratacji pusto (czas zależy od
 * chwili wejścia), potem odświeżana co 15 s. Szerokość zarezerwowana cyframi
 * tabelarycznymi — wiersz stopki nie przeskakuje.
 */
export function LocalTime({ city, label }: { city: string; label: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(Date.now()),
    () => ""
  )

  return (
    <span aria-label={`${label}: ${city}${time ? `, ${time}` : ""}`}>
      {city}, <time className="inline-block min-w-[5ch] tabular-nums">{time}</time>
    </span>
  )
}
