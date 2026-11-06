"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { useMediaQuery } from "@/app/main-page/_lib/hooks"
import type { SectionLink } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

/** Lewy tor jest od 1280 px (`xl:block`) — poniżej spis nie nasłuchuje niczego. */
const TRACKS_QUERY = "(min-width: 80rem)"

/**
 * Spis sekcji w lewym torze (od 1280 px), który jest tylko wtedy, gdy jest
 * potrzebny: w starcie milczy, przy stopce znika. W spoczynku widać samą bieżącą
 * sekcję z kropką; gdy kursor zbliży się do lewej krawędzi kolumny (albo fokus
 * wejdzie do spisu), pozostałe pozycje wyostrzają się z rozmycia, kolejno od
 * bieżącej, a kropka płynie między wierszami.
 */
export function SectionNav({
  label,
  sections,
}: {
  label: string
  sections: readonly SectionLink[]
}) {
  const tracks = useMediaQuery(TRACKS_QUERY)
  const [active, setActive] = useState(0)
  const [phase, setPhase] = useState<"start" | "page" | "footer">("start")
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!tracks) return
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)
    const current = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) setActive(targets.indexOf(hit.target as HTMLElement))
      },
      { rootMargin: "-45% 0px -54% 0px" }
    )
    targets.forEach((target) => current.observe(target))

    let inStart = true
    let inFooter = false
    const update = () => setPhase(inFooter ? "footer" : inStart ? "start" : "page")
    const start = new IntersectionObserver(
      ([entry]) => {
        inStart = Boolean(entry?.isIntersecting)
        update()
      },
      { rootMargin: "0px 0px -45% 0px" }
    )
    const footer = new IntersectionObserver(([entry]) => {
      inFooter = Boolean(entry?.isIntersecting)
      update()
    })
    if (targets[0]) start.observe(targets[0])
    const footerElement = document.querySelector("footer")
    if (footerElement) footer.observe(footerElement)

    // Kursor przy lewej krawędzi kolumny — spis rozwija się, zanim w niego trafisz.
    // Krawędź mierzymy raz i przy zmianie rozmiaru okna, nie przy każdym ruchu.
    const measure = () => targets[0]?.getBoundingClientRect().left ?? window.innerWidth / 4
    let edge = measure()
    const onResize = () => (edge = measure())
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setNear(event.clientX < edge - 24)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      current.disconnect()
      start.disconnect()
      footer.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("resize", onResize)
    }
  }, [sections, tracks])

  const shown = phase === "page"

  return (
    <nav
      aria-label={label}
      inert={!shown}
      data-open={(near && shown) || undefined}
      className={cn(
        "group/toc fixed top-1/2 right-[calc(50%+var(--container-column)/2+var(--spacing-track))] z-30 hidden -translate-y-1/2 transition-[opacity,filter,translate] duration-300 ease-out xl:block",
        shown ? "opacity-100" : "pointer-events-none -translate-x-2 opacity-0 blur-sm"
      )}
    >
      {/* Kropka przesuwa się o `--active` wierszy po h-8 (wysokość pozycji spisu). */}
      <div className="relative" style={{ "--active": active } as CSSProperties}>
        <span
          aria-hidden="true"
          className="absolute top-[calc(1rem-2.5px)] left-0 size-1.25 translate-y-[calc(var(--active)*(--spacing(8)))] rounded-full bg-foreground transition-[translate] duration-300 ease-in-out"
        />
        <ol>
          {sections.map((section, index) => (
            <li key={section.id} style={{ "--k": Math.abs(index - active) } as CSSProperties}>
              <a
                href={`#${section.id}`}
                aria-current={index === active ? "location" : undefined}
                className={cn(
                  "flex h-8 items-center rounded-full ps-4 pe-2 text-sm whitespace-nowrap text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current]:text-foreground",
                  // W spoczynku tylko bieżąca; rozwinięty spis — kolejno od bieżącej (28 ms na pozycję).
                  "opacity-0 blur-[3px] transition-[opacity,filter,color] duration-200 aria-[current]:opacity-100 aria-[current]:blur-none",
                  "group-focus-within/toc:opacity-100 group-focus-within/toc:blur-none group-hover/toc:opacity-100 group-hover/toc:blur-none group-data-open/toc:opacity-100 group-data-open/toc:blur-none",
                  "group-hover/toc:[transition-delay:calc(var(--k)*28ms)] group-data-open/toc:[transition-delay:calc(var(--k)*28ms)]"
                )}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
