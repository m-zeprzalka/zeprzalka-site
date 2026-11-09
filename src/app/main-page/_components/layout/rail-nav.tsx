"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, type RefObject } from "react"
import type { LinkData } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

/**
 * Pozycja toru: wiersz 32 px (`h-8` — na tej wysokości liczy się też kropka spisu
 * rozdziałów), tekst przycięty do szerokości toru, pełna nazwa w `title`. Bieżąca
 * (`aria-current`) w kolorze tekstu.
 */
export const RAIL_LINK =
  "relative block h-8 truncate rounded-full ps-4 pe-2 text-sm leading-8 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring aria-[current]:text-foreground"

/** Kropka bieżącej pozycji menu (`aria-current`) — w wierszu, na wysokości środka tekstu. */
export const RAIL_DOT =
  "before:absolute before:top-[calc(1rem-2.5px)] before:left-0 before:size-1.25 before:rounded-full before:bg-foreground before:opacity-0 before:transition-opacity aria-[current]:before:opacity-100"

/**
 * Bieżąca podstrona: `page` — dokładnie ta strona, `true` — jej dział (wpis, kategoria →
 * Blog). Start tylko pod własnym adresem.
 */
function currentOf(href: string, pathname: string, home: string): "page" | "true" | undefined {
  if (pathname === href) return "page"
  if (href !== home && pathname.startsWith(`${href}/`)) return "true"
  return undefined
}

/**
 * Stopka serwisu doszła do elementu toru (jej górna krawędź nad jego dolną krawędzią
 * z odstępem) — tor chowa się nad nią, bo znak stopki idzie przez całą szerokość okna.
 * Na krótkiej stronie (404, kontakt na wysokim ekranie) stopka stoi niżej niż menu
 * i menu zostaje. Wspólne dla menu i spisu rozdziałów; odczyt raz na klatkę.
 */
export function useFooterOverlap(ref: RefObject<HTMLElement | null>, gap = 32): boolean {
  const [overlap, setOverlap] = useState(false)
  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]")
    const element = ref.current
    if (!footer || !element) return
    let frame = 0
    const measure = () => {
      frame = 0
      const { bottom } = element.getBoundingClientRect()
      // Poniżej 1280 px tor ma `display: none` — nie ma czego chować.
      if (bottom === 0) return
      setOverlap(footer.getBoundingClientRect().top < bottom + gap)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [ref, gap])
  return overlap
}

/**
 * Menu główne w lewym torze (od 1280 px): podstrony serwisu, zawsze w całości,
 * bieżąca z kropką. Stoi na górnej krawędzi treści (`top-rail`) i wchodzi razem
 * z nagłówkiem. Poniżej 1280 px tę samą rolę pełni ⌘K i stopka. Bez prefetchu przy
 * wczytaniu (menu jest w kadrze na każdej stronie — pobierałoby pięć stron naraz):
 * strona pobiera się przy najechaniu albo fokusie, tuż przed kliknięciem.
 */
export function RailNav({
  label,
  items,
  homeHref,
}: {
  label: string
  items: readonly LinkData[]
  homeHref: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = useRef<HTMLElement>(null)
  const hidden = useFooterOverlap(nav)

  return (
    <nav
      ref={nav}
      aria-label={label}
      className={cn(
        "fixed top-rail rail z-30 hidden transition-[opacity,filter,translate] duration-300 ease-out motion-safe:animate-enter-side motion-safe:[animation-delay:var(--enter-rail)] xl:block",
        hidden &&
          "pointer-events-none -translate-x-2 opacity-0 blur-sm focus-within:pointer-events-auto focus-within:translate-x-0 focus-within:opacity-100 focus-within:blur-none"
      )}
    >
      <ul>
        {items.map((item) => {
          const current = currentOf(item.href, pathname, homeHref)
          const prefetch = current === "page" ? undefined : () => router.prefetch(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={false}
                onPointerEnter={prefetch}
                onFocus={prefetch}
                aria-current={current}
                title={item.label}
                className={cn(RAIL_LINK, RAIL_DOT)}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
