"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { DsEntry } from "@/components/design-system/primitives"

/**
 * Boczny spis treści z podświetleniem aktywnej sekcji — ten sam wzorzec,
 * co spis treści wpisu blogowego (`components/blog/ActiveTOC`).
 */
export function DsNav({ entries }: { entries: DsEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id)

  useEffect(() => {
    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null)

    // Trzymamy zbiór sekcji widocznych w pasku odczytu i wybieramy z niego
    // pierwszą w kolejności dokumentu. Reagowanie na ostatni raport
    // obserwatora dawałoby wskazanie sekcji, którą już minęliśmy.
    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) visible.add(record.target.id)
          else visible.delete(record.target.id)
        }
        const first = entries.find((entry) => visible.has(entry.id))
        if (first) setActive(first.id)
      },
      { rootMargin: "-15% 0px -75% 0px" }
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [entries])

  return (
    <nav aria-label="Spis treści katalogu" className="lg:sticky lg:top-24">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Spis treści
      </p>
      <ol className="flex flex-col gap-1 border-l">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={active === entry.id ? "location" : undefined}
              className={cn(
                "-ml-px flex items-baseline gap-3 border-l py-1.5 pl-4 text-sm transition-colors",
                active === entry.id
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
