"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { cardHandlers, useCardActive } from "./card-store"
import { GlyphNumber } from "./glyph"
import type { Fact } from "./types"
import { triggerFor, useArmed, type Arming } from "./use-armed"

const percent = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 })

function valueOf(fact: Fact): string {
  if (fact.percent) return `${percent.format(fact.value)}%`
  return String(fact.value)
}

/**
 * Cztery liczby z „O mnie”. Dekodują się ze znaków przy wejściu w kadr
 * (kolejno, co 120 ms) i ponownie przy wskazaniu — to jest sygnał aktywności,
 * zamiast szarej karty pod liczbą; obok podpisu strzałka. Klik/fokus otwiera
 * kartę ze szczegółem.
 */
export function Facts({
  facts,
  since,
  className,
}: {
  facts: readonly Fact[]
  since: string
  className?: string
}) {
  const ref = useRef<HTMLUListElement>(null)
  const armed = useArmed(ref)
  return (
    <ul ref={ref} className={cn("grid grid-cols-2 gap-x-(--i2-gap) gap-y-10", className)}>
      {facts.map((fact, index) => (
        <li key={fact.id}>
          <FactButton fact={fact} since={since} armed={armed} delay={index * 120} />
        </li>
      ))}
    </ul>
  )
}

function FactButton({
  fact,
  since,
  armed,
  delay,
}: {
  fact: Fact
  since: string
  armed: Arming
  delay: number
}) {
  const active = useCardActive(fact.card)
  return (
    <button
      type="button"
      data-active={active || undefined}
      aria-expanded={active}
      {...cardHandlers(fact.card)}
      className="group -m-2 flex w-[calc(100%+1rem)] flex-col items-start gap-2 rounded-fm-2xl p-2 text-start fm-focus"
    >
      <span className="flex items-baseline gap-1.5 text-[2rem] leading-none font-medium tracking-[-0.035em] text-fm-ink sm:text-[2.25rem]">
        {fact.since && <span className="text-[0.5em] tracking-normal text-fm-ink-3">{since}</span>}
        <GlyphNumber
          value={valueOf(fact)}
          suffix={fact.suffix}
          trigger={triggerFor(armed)}
          delay={delay}
        />
      </span>
      <span className="flex items-start gap-1 text-fm-small leading-snug text-pretty text-fm-ink-2 transition-colors duration-150 group-hover:text-fm-ink group-data-active:text-fm-ink">
        {fact.label}
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-fm-ink-3 opacity-0 transition-[opacity,translate] duration-200 ease-[var(--i2-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-active:opacity-100"
        />
      </span>
    </button>
  )
}
