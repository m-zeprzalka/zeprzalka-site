"use client"

import { RAIL_DOT, RAIL_LINK } from "@/app/main-page/_components/layout/rail-nav"
import { cn } from "@/lib/utils"

const MENU = ["Start", "Usługi", "Portfolio", "Blog", "O mnie", "Kontakt"]
const CHAPTERS = ["Wprowadzenie", "Siatka i tory", "Rozdział o tytule dłuższym niż tor", "Koniec"]
const ACTIVE = 2

/**
 * Lewy tor w spoczynku, obraz statyczny (`inert`): prawdziwe `RailNav` i `TableOfContents`
 * są `fixed` i stoją w torze tej strony od 1280 px. Wiersze z `RAIL_LINK`, kropki jak w nich.
 */
export function LeftTrackExample() {
  return (
    <div inert className="w-(--container-track) max-w-full">
      <ul>
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
      {/* Spis stoi 2,5 rem pod menu (`top-rail-toc`); kropka przesuwa się o `--active` wierszy. */}
      <div className="mt-10">
        <p className="ps-4 pb-2 text-xs text-muted-foreground">Rozdziały</p>
        <div className="relative" style={{ "--active": ACTIVE }}>
          <span className="absolute top-[calc(1rem-2.5px)] left-0 size-1.25 translate-y-[calc(var(--active)*(--spacing(8)))] rounded-full bg-foreground" />
          <ol>
            {CHAPTERS.map((label, index) => (
              <li key={label}>
                <span
                  aria-current={index === ACTIVE ? "location" : undefined}
                  className={RAIL_LINK}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
