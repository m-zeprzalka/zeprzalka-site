"use client"

import { useSyncExternalStore } from "react"

const format = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Warsaw",
})
const subscribe = (onChange: () => void) => {
  const timer = setInterval(onChange, 15_000)
  return () => clearInterval(timer)
}

/** Czas w Warszawie, liczony w przeglądarce (strona jest statyczna, serwer nie zna „teraz”). */
export function LocalTime({ city }: { city: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(new Date()),
    () => null
  )
  return (
    <span className="tabular-nums">
      {city}
      {time && <>, {time}</>}
    </span>
  )
}
