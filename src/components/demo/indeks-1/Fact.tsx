"use client"

import { ArmedNumber } from "./ArmedGlyph"
import { PeekCardLazy, usePeekCard } from "./peek-card-lazy"
import { peekHandlers } from "./peek-trigger"
import type { Fact as FactData, Peek } from "./types"

/**
 * Fakt: liczba w atramencie, podpis w szarości z przerywanym podkreśleniem —
 * tym samym znakiem „to się otwiera” co frazy w tekście. Bez tła pod liczbą:
 * aktywność pokazuje sama liczba (najechanie puszcza krótki odczyt ze znaków)
 * i podpis, który ciemnieje i traci podkreślenie. Przy wejściu w kadr liczby
 * odczytują się ze znaków raz, w czasie. Myszą — szczegół w prawym torze,
 * kliknięciem i palcem — karta pod liczbą na szerokość kolumny.
 */
export function Fact({ fact, peek }: { fact: FactData; peek: Peek }) {
  const key = `peek:${fact.peek}`
  const card = usePeekCard<HTMLButtonElement>(key, { row: true })

  return (
    <>
      <button
        type="button"
        {...card.triggerProps}
        {...peekHandlers(key)}
        className="group relative flex flex-col items-start gap-2.5 rounded-fm-md text-left fm-focus after:absolute after:-inset-2 after:content-['']"
      >
        <ArmedNumber
          value={fact.value}
          duration={0.75}
          className="text-[1.5rem] leading-none font-medium tracking-[-0.03em] text-fm-ink sm:text-[1.75rem]"
        />
        <span className="text-fm-small text-pretty text-fm-ink-3 underline decoration-fm-edge-strong decoration-dashed underline-offset-[0.3em] transition-[color,text-decoration-color] duration-150 group-hover:text-fm-ink-2 group-hover:decoration-transparent group-data-[state=open]:text-fm-ink group-data-[state=open]:decoration-transparent">
          {fact.label}
        </span>
      </button>
      {card.mounted && (
        <PeekCardLazy
          id={card.id}
          open={card.open}
          onOpenChange={card.change}
          anchor={card.trigger}
          fit={card.fit}
          sideOffset={14 + card.fit.drop}
          peek={peek}
        />
      )}
    </>
  )
}
