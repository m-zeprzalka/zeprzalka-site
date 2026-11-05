"use client"

import type { CSSProperties, KeyboardEvent } from "react"
import { cn } from "@/components/demo/forma/cn"
import { ICONS } from "./icons"
import type { PeekWork } from "./PeekBody"
import { PeekCardLazy, usePeekCard } from "./peek-card-lazy"
import { peekHandlers } from "./peek-trigger"
import type { IconName, Peek } from "./types"

/**
 * Fraza w zdaniu, która otwiera podgląd: myszą (od 1280 px) — karta w prawym
 * torze siatki, kliknięciem i palcem — karta pod słowem na całą szerokość
 * kolumny. Atrament i przerywane podkreślenie odróżniają ją od szarego tekstu;
 * obła pigułka tła pojawia się dopiero przy wskazaniu. Fraza łamie się razem ze
 * zdaniem, więc to `span role="button"` z obsługą Enter i Spacji.
 */
export function Chip({
  text,
  icon,
  peekId,
  peek,
  work,
  className,
  style,
}: {
  text: string
  icon?: IconName
  peekId: string
  peek: Peek
  work?: PeekWork
  className?: string
  style?: CSSProperties
}) {
  const key = `peek:${peekId}`
  const card = usePeekCard<HTMLSpanElement>(key)
  const Icon = icon ? ICONS[icon] : null
  // Ikona sklejona z pierwszym słowem: nigdy nie zostaje sama na końcu wiersza.
  const [first = "", ...rest] = text.replace(/(\d)\s+/g, "$1\u00a0").split(" ")

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        {...card.triggerProps}
        {...peekHandlers(key)}
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          event.currentTarget.click()
        }}
        style={style}
        className={cn("i1-chip fm-focus", className)}
      >
        {Icon ? (
          <span className="whitespace-nowrap">
            <Icon aria-hidden="true" strokeWidth={2.25} className="i1-chip__icon" />
            {first}
          </span>
        ) : (
          first
        )}
        {rest.length > 0 && ` ${rest.join(" ")}`}
      </span>
      {card.mounted && (
        <PeekCardLazy
          id={card.id}
          open={card.open}
          onOpenChange={card.change}
          anchor={card.trigger}
          fit={card.fit}
          sideOffset={12}
          peek={peek}
          work={work}
        />
      )}
    </>
  )
}
