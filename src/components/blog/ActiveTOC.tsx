"use client"

import { useEffect, useState } from "react"

interface Heading {
  id: string
  level: number
  text: string
}

/**
 * Lista nagłówków wpisu z podświetleniem sekcji, którą właśnie się czyta.
 *
 * Wcześniej stała na komponencie `Sidebar` z shadcn — 700 linii z własnym
 * kontekstem, skrótem klawiszowym, ciasteczkiem, wersją mobilną w panelu
 * i podpowiedziami — po to, żeby wyświetlić listę linków. Wygląd jest ten
 * sam (tokeny `sidebar-*` miały wartości identyczne z `accent` i `ring`),
 * a do przeglądarki nie trafia nic poza tą listą.
 */
const ITEM =
  "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-xs h-auto whitespace-normal ring-ring outline-hidden hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground"

export function ActiveTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <ul className="flex w-full min-w-0 flex-col gap-1">
      {headings.map((heading) => {
        const isActive = activeId === heading.id
        return (
          <li key={heading.id} className="relative">
            <a
              href={`#${heading.id}`}
              data-active={isActive}
              aria-current={isActive ? "location" : undefined}
              className={ITEM}
              style={{ paddingLeft: `${(heading.level - 2) * 12 + 8}px` }}
            >
              {heading.text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
