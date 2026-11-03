import type { CSSProperties, ReactNode } from "react"
import { Count } from "@/components/demo/forma/Count"
import type { IndeksContent } from "./content"
import { YearRange } from "./YearRange"

const NUMBER = "text-fm-ink text-[1.5rem] leading-none font-medium tracking-[-0.03em] tabular-nums"
const PERCENT = { style: "percent", maximumFractionDigits: 2 } as const

/**
 * Cichy rząd czterech faktów. Liczby są treścią, nie dekoracją: małe (24 px),
 * w atramencie, z podpisem w szarości; dojeżdżają do wartości raz, po wejściu
 * w kadr (Number Flow). Na telefonie siatka 2 × 2.
 */
export function Facts({ facts }: { facts: IndeksContent["facts"] }) {
  return (
    <dl
      style={{ "--d": "560ms" } as CSSProperties}
      className="ix-enter ix-col mt-14 grid grid-cols-2 gap-x-6 gap-y-7 sm:mt-20 sm:grid-cols-4"
    >
      <Fact label={facts.years.label}>
        <Count value={facts.years.value} suffix="+" className={NUMBER} />
      </Fact>
      <Fact label={facts.clients.label}>
        <Count value={facts.clients.value} suffix="+" className={NUMBER} />
      </Fact>
      <Fact label={facts.lectures.label}>
        <YearRange from={facts.lectures.from} to={facts.lectures.to} className={NUMBER} />
      </Fact>
      <Fact label={facts.score.label}>
        <Count value={facts.score.value} format={PERCENT} className={NUMBER} />
      </Fact>
    </dl>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="order-last text-fm-small text-fm-ink-3">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
