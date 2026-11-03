"use client"

import { useSyncExternalStore } from "react"

const clock = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Warsaw",
})

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 10_000)
  return () => window.clearInterval(id)
}

/**
 * Godzina w Warszawie z migającym dwukropkiem. Liczona tylko w przeglądarce
 * (strona jest statyczna), więc serwer i hydratacja renderują pusty slot
 * o stałej szerokości — bez rozjazdu i bez skoku układu.
 */
export function LocalTime({ city, className }: { city: string; className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => clock.format(new Date()),
    () => ""
  )
  const [hours = "", minutes = ""] = time.split(":")

  return (
    <span className={className}>
      {city}{" "}
      <time className="inline-block min-w-[2.6em] tabular-nums">
        {time && (
          <>
            {hours}
            <span className="motion-safe:animate-[fm-caret_2s_steps(1)_infinite]">:</span>
            {minutes}
          </>
        )}
      </time>
    </span>
  )
}
