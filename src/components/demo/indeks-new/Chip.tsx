"use client"

import { useState, type CSSProperties, type KeyboardEvent } from "react"
import { Popover } from "radix-ui"
import { cn } from "@/components/demo/forma/cn"
import { portalRoot } from "./hooks"
import { ICONS } from "./icons"
import { PeekBody } from "./PeekBody"
import { mutePeek } from "./peek-store"
import { peekHandlers } from "./peek-trigger"
import type { IconName, Peek } from "./types"

/**
 * Słowo w zdaniu, które otwiera podgląd: myszą — na marginesie (karta
 * odkodowuje obraz albo wyostrza informację), kliknięciem i palcem — w karcie
 * pod słowem. Atrament i przerywane podkreślenie odróżniają je od szarego
 * tekstu; tło pojawia się dopiero przy wskazaniu. Chip łamie się razem ze
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
  work?: { title: string; src: string }
  className?: string
  style?: CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const Icon = icon ? ICONS[icon] : null
  // Ikona sklejona z pierwszym słowem: nigdy nie zostaje sama na końcu wiersza.
  const [first = "", ...rest] = text.replace(/(\d)\s+/g, "$1\u00a0").split(" ")
  const key = `peek:${peekId}`

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        // Otwarta karta pod słowem zastępuje podgląd na marginesie.
        mutePeek(next ? key : null)
      }}
    >
      <Popover.Trigger asChild>
        <span
          role="button"
          tabIndex={0}
          {...peekHandlers(key)}
          onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
            if (event.key !== "Enter" && event.key !== " ") return
            event.preventDefault()
            event.currentTarget.click()
          }}
          style={style}
          className={cn("ixn-chip fm-focus", className)}
        >
          {Icon ? (
            <span className="whitespace-nowrap">
              <Icon aria-hidden="true" strokeWidth={2.25} className="ixn-chip__icon" />
              {first}
            </span>
          ) : (
            first
          )}
          {rest.length > 0 && ` ${rest.join(" ")}`}
        </span>
      </Popover.Trigger>
      <Popover.Portal container={portalRoot()}>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={10}
          collisionPadding={16}
          className="ixn-popover z-50 w-[min(20rem,calc(100vw-2rem))] rounded-fm-xl bg-fm-surface p-4 text-fm-small shadow-fm-pop outline-none"
        >
          <PeekBody peek={peek} work={work} onNavigate={() => setOpen(false)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
