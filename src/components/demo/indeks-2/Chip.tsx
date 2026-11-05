"use client"

import type { CSSProperties, KeyboardEvent } from "react"
import { cn } from "@/components/demo/forma/cn"
import { cardHandlers, useCardActive } from "./card-store"
import { ICONS } from "./icons"
import type { IconName } from "./types"

/**
 * Słowo w zdaniu, które otwiera kartę. Atrament, ikona i przerywane
 * podkreślenie odróżniają je od szarego tekstu; obłe tło pojawia się przy
 * wskazaniu i gdy karta jest otwarta. Chip łamie się razem ze zdaniem
 * (element liniowy), więc `role="button"` i obsługa Enter/Spacji.
 */
export function Chip({
  text,
  card,
  icon,
  dock,
  style,
  className,
}: {
  text: string
  card: string
  icon?: IconName
  /** Id elementu, którego miejsce karta zajmuje na marginesie (twarz na starcie). */
  dock?: string
  style?: CSSProperties
  className?: string
}) {
  const active = useCardActive(card)
  const Icon = icon ? ICONS[icon] : null
  // Ikona sklejona z pierwszym słowem; liczba zostaje przy rzeczowniku (twarda spacja).
  const [first = "", ...rest] = text.replace(/(\d)\s+/g, "$1 ").split(" ")

  return (
    <span
      role="button"
      tabIndex={0}
      data-dock={dock}
      data-active={active || undefined}
      aria-expanded={active}
      onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        event.currentTarget.click()
      }}
      {...cardHandlers(card)}
      style={style}
      className={cn("i2-chip", className)}
    >
      <span className="whitespace-nowrap">
        {Icon && <Icon aria-hidden="true" strokeWidth={2.25} className="i2-chip__icon" />}
        {first}
      </span>
      {rest.length > 0 && ` ${rest.join(" ")}`}
    </span>
  )
}
