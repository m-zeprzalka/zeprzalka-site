"use client"

import { useEffect, useState } from "react"
import { goToAnchor } from "@/app/main-page/_lib/anchors"
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
    // Bieżąca pozycja: ostatni cel, którego górna krawędź minęła linię 45% okna. Działa
    // dla wysokich sekcji startu i dla niskich nagłówków wpisu — także po skoku do kotwicy,
    // gdy żaden cel nie przejeżdża przez linię. Odczyt raz na klatkę, bez zapisów do DOM.
    let frame = 0
    const measureActive = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let index = 0
      targets.forEach((target, i) => {
        if (target.getBoundingClientRect().top <= line) index = i
      })
      setActive(index)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measureActive)
    }
    // Pierwszy odczyt w klatce po hydratacji, nie w trakcie niej.
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

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
    // Stopka serwisu, nie stopka artykułu (`<footer>` wpisu z tagami i autorem).
    const footerElement = document.querySelector("[data-site-footer]")
    if (footerElement) footer.observe(footerElement)

    // Kursor przy lewej krawędzi kolumny — spis rozwija się, zanim w niego trafisz.
    // Krawędź mierzymy raz i przy zmianie rozmiaru okna, nie przy każdym ruchu.
    const measureEdge = () => targets[0]?.getBoundingClientRect().left ?? window.innerWidth / 4
    let edge = measureEdge()
    const onResize = () => (edge = measureEdge())
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setNear(event.clientX < edge - 24)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      start.disconnect()
      footer.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("resize", onResize)
    }
  }, [sections, tracks])

  const shown = phase === "page"

  return (
    <nav
      data-section-nav=""
      aria-label={label}
      data-open={(near && shown) || undefined}
      className={cn(
        // Szerokość toru (od krawędzi okna do kolumny) — długie rozdziały wpisu nie wychodzą poza ekran.
        "group/toc fixed top-1/2 right-[calc(50%+var(--container-column)/2+var(--spacing-track))] z-30 hidden max-w-[calc(50vw-var(--container-column)/2-var(--spacing-track)-var(--spacing-page))] -translate-y-1/2 transition-[opacity,filter,translate] duration-300 ease-out xl:block",
        // Schowany (start, stopka) — ale osiągalny z klawiatury: fokus w środku go pokazuje.
        shown
          ? "opacity-100"
          : "pointer-events-none -translate-x-2 opacity-0 blur-sm focus-within:pointer-events-auto focus-within:translate-x-0 focus-within:opacity-100 focus-within:blur-none"
      )}
    >
      {/* Kropka przesuwa się o `--active` wierszy po h-8 (wysokość pozycji spisu). */}
      <div className="relative" style={{ "--active": active }}>
        <span
          aria-hidden="true"
          className="absolute top-[calc(1rem-2.5px)] left-0 size-1.25 translate-y-[calc(var(--active)*(--spacing(8)))] rounded-full bg-foreground transition-[translate] duration-300 ease-in-out"
        />
        <ol>
          {sections.map((section, index) => (
            <li key={section.id} style={{ "--k": Math.abs(index - active) }}>
              <a
                href={`#${section.id}`}
                // Ta sama ścieżka skoku co ⌘K: hash, przewinięcie i fokus na celu.
                onClick={(event) => {
                  event.preventDefault()
                  goToAnchor(section.id)
                }}
                aria-current={index === active ? "location" : undefined}
                title={section.label}
                className={cn(
                  "block h-8 truncate rounded-full ps-4 pe-2 text-sm leading-8 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring aria-[current]:text-foreground",
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
