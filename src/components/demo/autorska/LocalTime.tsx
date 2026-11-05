"use client"

import { useSyncExternalStore } from "react"

const format = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
})

/** Zegar odświeżany na granicy minuty (nie co sekundę). */
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>
  const tick = () => {
    onChange()
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000))
  }
  timer = setTimeout(tick, 60_000 - (Date.now() % 60_000))
  return () => clearTimeout(timer)
}

/**
 * Czas w Warszawie liczony w przeglądarce — strona zostaje statyczna.
 * Serwer renderuje samo miasto, godzina dochodzi po hydratacji.
 */
export function LocalTime({ locality }: { locality: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(Date.now()),
    () => null
  )
  return (
    <span className="tabular-nums">
      {locality}
      {time && (
        <>
          <span aria-hidden="true">, </span>
          <time>{time}</time>
        </>
      )}
    </span>
  )
}
