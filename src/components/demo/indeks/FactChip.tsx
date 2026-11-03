"use client"

import type { CSSProperties, KeyboardEvent } from "react"
import { Popover } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { Chip } from "@/components/demo/forma/Chip"
import { portalRoot } from "./hooks"
import { ICONS } from "./icons"
import type { FactDetail, IconName } from "./types"

/**
 * Słowo w zdaniu, które otwiera kartę z faktami. Atrament, ikona i przerywane
 * podkreślenie odróżniają je od szarego tekstu; tło pojawia się dopiero przy
 * wskazaniu i otwarciu. Chip jest elementem liniowym (nie przyciskiem), więc
 * łamie się razem ze zdaniem — dlatego `role="button"` i obsługa Enter/Spacji.
 * Karta wyrasta od chipa (origin z Radiksa) w 200 ms, znika w 120 ms.
 */
export function FactChip({
  label,
  icon,
  detail,
  delay,
}: {
  label: string
  icon: IconName
  detail: FactDetail
  /** Opóźnienie wejścia w sekwencji pierwszego ekranu (ms). */
  delay: number
}) {
  const Icon = ICONS[icon]
  // Ikona sklejona z pierwszym słowem: nigdy nie zostaje sama na końcu wiersza.
  // Liczba zostaje przy rzeczowniku („12 lat”) — twarda spacja.
  const [first = "", ...rest] = label.replace(/(\d)\s+/g, "$1\u00a0").split(" ")

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span
          role="button"
          tabIndex={0}
          onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
            if (event.key !== "Enter" && event.key !== " ") return
            event.preventDefault()
            event.currentTarget.click()
          }}
          style={{ "--d": `${delay}ms` } as CSSProperties}
          className="ix-chip ix-sharpen fm-focus text-fm-ink"
        >
          <span className="whitespace-nowrap">
            <Icon aria-hidden="true" strokeWidth={2.25} className="ix-chip__icon" />
            {first}
          </span>
          {rest.length > 0 && ` ${rest.join(" ")}`}
        </span>
      </Popover.Trigger>
      <Popover.Portal container={portalRoot()}>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={10}
          collisionPadding={16}
          className="ix-popover bg-fm-surface shadow-fm-pop text-fm-small rounded-fm-xl z-50 w-[min(20rem,calc(100vw-2rem))] p-4 outline-none"
        >
          <DetailBody detail={detail} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function DetailBody({ detail }: { detail: FactDetail }) {
  if (detail.kind === "timeline") {
    return (
      <div>
        <p className="text-fm-ink font-medium">{detail.heading}</p>
        <p className="text-fm-ink-3 mt-0.5">{detail.lead}</p>
        <ol className="mt-4 space-y-3">
          {detail.entries.map((entry) => (
            <li key={entry.role} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="text-fm-ink-3 min-w-[4.75rem] whitespace-nowrap tabular-nums">
                {entry.period}
              </span>
              <span>
                <span className="text-fm-ink block leading-snug">{entry.role}</span>
                <span className="text-fm-ink-3 block">{entry.company}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div>
      <p className="text-fm-ink font-medium">{detail.heading}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {detail.tools.map((tool) => (
          <li key={tool}>
            <Chip className="bg-fm-fill h-6 px-2.5">{tool}</Chip>
          </li>
        ))}
      </ul>
      <Popover.Close asChild>
        <a
          href={detail.link.href}
          className="group fm-focus hover:bg-fm-fill rounded-fm-md -mx-2 mt-3 flex min-h-11 items-center gap-2 px-2 transition-colors duration-150"
        >
          <span className="text-fm-ink">{detail.link.label}</span>
          <span className="text-fm-ink-3 tabular-nums">{detail.link.meta}</span>
          <ArrowUpRight aria-hidden="true" className="ix-arrow text-fm-ink-3 ms-auto size-3.5" />
        </a>
      </Popover.Close>
    </div>
  )
}
