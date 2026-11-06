"use client"

import { useEffect, useState } from "react"
import type { SectionLink } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

/**
 * Spis sekcji w lewym torze (od 1280 px). Pojawia się dopiero, gdy start
 * zniknie z kadru — menu jest, kiedy jest potrzebne. Bieżąca sekcja to ta,
 * która przecina środek okna.
 */
export function SectionNav({
  label,
  sections,
}: {
  label: string
  sections: readonly SectionLink[]
}) {
  const [active, setActive] = useState(sections[0]?.id)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)
    const current = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: "-45% 0px -54% 0px" }
    )
    targets.forEach((target) => current.observe(target))

    const start = targets[0]
    const shown = new IntersectionObserver(([entry]) => setVisible(!entry?.isIntersecting), {
      rootMargin: "0px 0px -40% 0px",
    })
    if (start) shown.observe(start)

    return () => {
      current.disconnect()
      shown.disconnect()
    }
  }, [sections])

  return (
    <nav
      aria-label={label}
      inert={!visible}
      className={cn(
        "fixed top-1/2 right-[calc(50%+var(--container-column)/2+var(--spacing-track))] z-30 hidden -translate-y-1/2 transition-opacity duration-300 xl:block",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <p className="mb-3 text-xs text-muted-foreground">{label}</p>
      <ol className="grid gap-0.5">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className="group flex min-h-8 items-center gap-2.5 rounded-full text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current]:text-foreground"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-current opacity-0 transition-opacity group-aria-[current]:opacity-100"
              />
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
