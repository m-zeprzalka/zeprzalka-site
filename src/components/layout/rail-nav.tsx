"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRef } from "react"
import { useEdgeAbove } from "@/lib/hooks"
import type { LinkData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { RAIL_DOT, RAIL_LINK, TRACK_HIDDEN } from "./track-classes"

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
  const hidden = useEdgeAbove(nav, "[data-site-footer]", "top")

  return (
    <nav
      ref={nav}
      aria-label={label}
      className={cn(
        "fixed top-rail rail z-30 hidden transition-[opacity,filter,translate] duration-300 ease-out motion-safe:animate-enter-side motion-safe:[animation-delay:var(--enter-rail)] xl:block",
        hidden && cn(TRACK_HIDDEN, "-translate-x-2")
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
