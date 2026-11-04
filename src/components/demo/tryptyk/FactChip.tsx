"use client"

import type { KeyboardEvent } from "react"
import { Popover } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { Chip } from "@/components/demo/forma/Chip"
import { portalRoot } from "./hooks"
import { ICONS } from "./icons"
import type { FactDetail, IconName } from "./types"

/**
 * Słowo w zdaniu, które otwiera kartę z faktami: pigułka w linii tekstu
 * (wypełnienie, pierścień, ikona), pole trafienia ≥ 44 px z pseudo-elementu.
 * Chip jest elementem liniowym (nie przyciskiem), więc łamie się razem ze
 * zdaniem — dlatego `role="button"` i obsługa Enter/Spacji. Karta wyrasta od
 * chipa (origin z Radiksa) w 200 ms, znika w 120 ms.
 */
export function FactChip({
  label,
  icon,
  detail,
}: {
  label: string
  icon: IconName
  detail: FactDetail
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
          className="tk-chip text-fm-ink fm-focus"
        >
          <span className="whitespace-nowrap">
            <Icon aria-hidden="true" strokeWidth={2.25} className="tk-chip__icon" />
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
          className="tk-popover z-50 w-[min(20rem,calc(100vw-2rem))] rounded-fm-xl bg-fm-surface p-4 text-fm-small shadow-fm-pop outline-none"
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
        <p className="font-medium text-fm-ink">{detail.heading}</p>
        <p className="mt-0.5 text-fm-ink-3">{detail.lead}</p>
        <ol className="mt-4 space-y-3">
          {detail.entries.map((entry) => (
            <li key={entry.role} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="min-w-[4.75rem] whitespace-nowrap text-fm-ink-3 tabular-nums">
                {entry.period}
              </span>
              <span>
                <span className="block leading-snug text-fm-ink">{entry.role}</span>
                <span className="block text-fm-ink-3">{entry.company}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div>
      <p className="font-medium text-fm-ink">{detail.heading}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {detail.tools.map((tool) => (
          <li key={tool}>
            <Chip className="h-6 bg-fm-fill px-2.5 text-[0.8125rem]">{tool}</Chip>
          </li>
        ))}
      </ul>
      <Popover.Close asChild>
        <a
          href={detail.link.href}
          className="group -mx-2 mt-3 flex min-h-11 items-center gap-2 rounded-fm-md px-2 fm-focus transition-colors duration-150 hover:bg-fm-fill"
        >
          <span className="text-fm-ink">{detail.link.label}</span>
          <span className="text-fm-ink-3 tabular-nums">{detail.link.meta}</span>
          <ArrowUpRight aria-hidden="true" className="tk-arrow ms-auto size-3.5 text-fm-ink-3" />
        </a>
      </Popover.Close>
    </div>
  )
}
