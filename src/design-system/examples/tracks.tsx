"use client"

import { RAIL_DOT, RAIL_LINK, TOC_LINK } from "@/components/layout/track-classes"
import { cn } from "@/lib/utils"

const MENU = ["Start", "Usługi", "Portfolio", "Blog", "O mnie", "Kontakt"]
const CHAPTERS = [
  "Wprowadzenie",
  "Siatka i tory",
  "Rozdział o tytule dłuższym niż szerokość toru",
  "Koniec",
]
const ACTIVE = 2

/**
 * Oba tory w spoczynku, obraz statyczny (`inert`): prawdziwe `RailNav` (lewy tor) i
 * `TableOfContents` (prawy) są `fixed` i stoją w torach tej strony od 1280 px.
 */
export function TracksExample() {
  return (
    <div inert className="flex w-full flex-wrap justify-between gap-8">
      <ul className="w-(--container-track) max-w-full">
        {MENU.map((label) => (
          <li key={label}>
            <span
              aria-current={label === "Blog" ? "page" : undefined}
              className={cn(RAIL_LINK, RAIL_DOT)}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
      <div className="w-(--container-track) max-w-full">
        {/* Podpis ma wysokość wiersza menu (`leading-8`) — oba tory zaczynają się w jednej linii. */}
        <p className="ps-4 text-xs leading-8 text-muted-foreground">Rozdziały</p>
        <ol>
          {CHAPTERS.map((label, index) => (
            <li key={label} className="relative">
              {/* Kropka na środku pierwszego wiersza bieżącej pozycji; w żywym spisie jedzie
                  do jej `offsetTop`, więc pozycje mogą mieć dowolną liczbę wierszy. */}
              {index === ACTIVE && (
                <span className="absolute top-[calc(1rem-2.5px)] left-0 size-1.25 rounded-full bg-foreground" />
              )}
              <span aria-current={index === ACTIVE ? "location" : undefined} className={TOC_LINK}>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
