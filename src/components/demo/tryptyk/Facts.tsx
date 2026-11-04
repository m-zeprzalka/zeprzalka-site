import type { ReactNode } from "react"
import { Count } from "./Count"
import type { Fact } from "./types"
import { YearRange } from "./YearRange"

/*
 * Rozmiar liczb zależy od szerokości kolumny faktów (jednostki kontenera), nie okna.
 * 2 × 2: od 24 do 28 px. 4 w rzędzie: tyle, żeby najdłuższa wartość („2016–2026”,
 * ok. 5,4 em) zmieściła się w ćwiartce minus odstępy (3 × 1,5 rem), najwyżej 28 px.
 */
const NUMBER =
  "text-fm-ink leading-none font-medium tracking-[-0.03em] tabular-nums text-[clamp(1.5rem,5cqi,1.75rem)] @min-[40rem]:text-[min(1.75rem,calc((100cqi-4.5rem)/21.6))]"
const PERCENT = { style: "percent", maximumFractionDigits: 2 } as const

/**
 * Cichy rząd czterech faktów. Liczby są treścią, nie dekoracją: w atramencie,
 * z podpisem w szarości; dojeżdżają do wartości raz, po wejściu w kadr
 * (Number Flow). Układ liczy się z szerokości kolumny (container query):
 * cztery w rzędzie dopiero od 40 rem, węziej siatka 2 × 2 — także na desktopie,
 * gdy szyna i scena zabierają kolumnie miejsce (1280 px).
 */
export function Facts({ facts }: { facts: readonly Fact[] }) {
  return (
    <div className="@container mt-12 sm:mt-16 xl:mt-20">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-7 @min-[40rem]:grid-cols-4">
        {facts.map((fact) => (
          <Item key={fact.label} label={fact.label}>
            {fact.kind === "count" && (
              <Count value={fact.value} suffix={fact.suffix} className={NUMBER} />
            )}
            {fact.kind === "range" && (
              <YearRange from={fact.from} to={fact.to} className={NUMBER} />
            )}
            {fact.kind === "percent" && (
              <Count value={fact.value} format={PERCENT} className={NUMBER} />
            )}
          </Item>
        ))}
      </dl>
    </div>
  )
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="order-last text-fm-small text-pretty text-fm-ink-3">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
