"use client"

import { useSyncExternalStore } from "react"

const TIME_ZONE = "Europe/Warsaw"
const MINUTE = 60_000

/** Godzina zawsze w Warszawie: zapis w języku strony i wartość maszynowa (`HH:MM`). */
const formatters = new Map<string, Intl.DateTimeFormat>()
function formatter(locale: string) {
  let format = formatters.get(locale)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
    })
    formatters.set(locale, format)
  }
  return format
}
const machine = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 15_000)
  return () => clearInterval(timer)
}

/** Migawka to numer minuty — stała przez całą minutę, więc bez zbędnych renderów. */
const currentMinute = () => Math.floor(Date.now() / MINUTE)

/**
 * Godzina w Warszawie. Na serwerze i przy hydratacji pusto (czas zależy od
 * chwili wejścia), potem sprawdzana co 15 s. Szerokość zarezerwowana cyframi
 * tabelarycznymi — wiersz stopki nie przeskakuje.
 */
export function LocalTime({
  city,
  label,
  locale,
}: {
  city: string
  label: string
  locale: string
}) {
  const minute = useSyncExternalStore(subscribe, currentMinute, () => null)
  const date = minute === null ? null : new Date(minute * MINUTE)

  return (
    <span>
      <span className="sr-only">{label}: </span>
      {city},{" "}
      <time
        dateTime={date ? machine.format(date) : undefined}
        className="inline-block min-w-[5ch] tabular-nums"
      >
        {date ? formatter(locale).format(date) : ""}
      </time>
    </span>
  )
}
