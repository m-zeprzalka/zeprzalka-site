"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { OPEN_EVENT } from "./CommandPalette"
import { GlyphMark } from "./glyph"
import { COL } from "./grid"
import { useActiveSection } from "./hooks"
import type { SectionLink } from "./types"

/**
 * Spis jest potrzebny między startem a stopką: pojawia się, gdy tytuł startu
 * zjedzie pod nagłówek, i znika, gdy w kadr wejdzie stopka (ma własne linki).
 */
function useNeeded(): boolean {
  const [past, setPast] = useState(false)
  const [footer, setFooter] = useState(false)
  useEffect(() => {
    const title = document.getElementById(`${SECTION.start}-title`)
    const end = document.querySelector("footer")
    if (!title || !end) return
    const top = new IntersectionObserver(
      ([entry]) => setPast(!!entry && !entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-64px 0px 0px 0px" }
    )
    const bottom = new IntersectionObserver(([entry]) => setFooter(!!entry?.isIntersecting))
    top.observe(title)
    bottom.observe(end)
    return () => {
      top.disconnect()
      bottom.disconnect()
    }
  }, [])
  return past && !footer
}

/**
 * Menu, które pojawia się dopiero, gdy jest potrzebne. Od 1280 px: spis sekcji
 * w kolumnach 1–2 (przyklejony, aktywna sekcja atramentem z kropką). Niżej:
 * pigułka u dołu z sygnetem i nazwą bieżącej sekcji — otwiera paletę; chowa
 * się przy przewijaniu w dół, wraca przy przewijaniu w górę.
 */
export function Rail({
  items,
  label,
  searchLabel,
}: {
  items: readonly SectionLink[]
  label: string
  searchLabel: string
}) {
  const ids = items.map((item) => item.id)
  const active = useActiveSection(ids)
  const past = useNeeded()
  const current = items.find((item) => item.id === active) ?? items[0]

  return (
    <>
      <nav
        aria-label={label}
        data-shown={past || undefined}
        className="pointer-events-none fixed inset-x-0 top-[calc(var(--i2-header)+3.5rem)] z-20 hidden opacity-0 blur-[4px] transition-[opacity,filter] duration-300 ease-[var(--i2-out)] data-shown:pointer-events-auto data-shown:opacity-100 data-shown:blur-none xl:block"
      >
        <div className="i2-grid">
          <div className={COL.rail}>
            <p className="ps-7 text-fm-micro font-medium text-fm-ink-3">{label}</p>
            <ul className="mt-2 flex flex-col">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={item.id === active ? "location" : undefined}
                    tabIndex={past ? undefined : -1}
                    className={cn(
                      "group flex h-9 items-center gap-2.5 rounded-full px-3 text-fm-small fm-focus transition-colors duration-150",
                      item.id === active
                        ? "text-fm-ink"
                        : "text-fm-ink-3 hover:bg-fm-fill hover:text-fm-ink"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full bg-current transition-[opacity,scale] duration-200",
                        item.id === active ? "opacity-100" : "scale-50 opacity-0"
                      )}
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <Dock shown={past} label={current?.label ?? ""} searchLabel={searchLabel} />
    </>
  )
}

/** Pigułka spisu (poniżej 1280 px). Chowa się przy przewijaniu w dół. */
function Dock({
  shown,
  label,
  searchLabel,
}: {
  shown: boolean
  label: string
  searchLabel: string
}) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > last)
      last = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const visible = shown && !hidden
  return (
    <div
      data-shown={visible || undefined}
      className="pointer-events-none fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),1rem)] z-30 flex translate-y-[calc(100%+1.5rem)] justify-center transition-transform duration-300 ease-[var(--ease-fm-drawer)] data-shown:pointer-events-auto data-shown:translate-y-0 xl:hidden"
    >
      <button
        type="button"
        tabIndex={visible ? undefined : -1}
        onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
        className="flex h-12 fm-press items-center gap-2.5 rounded-full bg-fm-surface ps-4 pe-2 text-fm-small font-medium text-fm-ink shadow-fm-pop fm-focus"
      >
        <GlyphMark className="text-fm-ink-2" />
        <span className="min-w-[6.5rem] text-start">{label}</span>
        <span className="grid size-8 place-items-center rounded-full bg-fm-fill text-fm-ink-2">
          <Search aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{searchLabel}</span>
        </span>
      </button>
    </div>
  )
}
