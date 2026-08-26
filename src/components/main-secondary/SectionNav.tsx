"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { SectionMeta } from "@/lib/home-content"

interface SectionNavProps {
  items: SectionMeta[]
}

/**
 * Pionowa szyna orientacyjna (tylko szerokie ekrany): kropka na sekcję,
 * etykieta pojawia się przy najechaniu / fokusie. Aktywną sekcję wyznacza
 * IntersectionObserver względem linii w środku viewportu.
 */
export function SectionNav({ items }: SectionNavProps) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Sekcje strony"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 min-[1400px]:block"
    >
      <ol className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className="group flex items-center justify-end gap-3 rounded-full py-1.5 pl-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span
                  className={cn(
                    "ms-meta -translate-x-1 opacity-0 transition-[opacity,translate] duration-300",
                    "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  )}
                >
                  {item.index} {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full bg-muted-foreground/40 transition-[scale,background-color] duration-300",
                    "group-hover:bg-foreground group-focus-visible:bg-foreground",
                    isActive && "scale-150 bg-foreground"
                  )}
                />
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
