"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { cn } from "@/lib/utils"
import { useMedia } from "./hooks"
import { Mark } from "./Mark"
import { useTalia } from "./TaliaProvider"
import type { NavItem } from "./types"

export interface HeaderLabels {
  brand: string
  status: string
  navAria: string
  openMenu: string
  closeMenu: string
  write: string
  theme: string
}

const PANEL = { type: "spring", visualDuration: 0.36, bounce: 0.12 } as const

/**
 * Pływająca pigułka. Na desktopie stoi na środku: sygnet, trzy kotwice,
 * status. Po przewinięciu kondensuje się — etykieta statusu chowa się do
 * samej kropki, a cień rośnie (strażnik IntersectionObserver, bez nasłuchu
 * scroll). Na telefonie: sygnet, „Napisz” i menu; menu nie otwiera osobnej
 * warstwy, tylko rozciąga samą pigułkę w panel (Motion `layout`).
 */
export function Header({ nav, labels }: { nav: readonly NavItem[]; labels: HeaderLabels }) {
  const { openContact } = useTalia()
  const desktop = useMedia("(min-width: 768px)")
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const sentinel = useRef<HTMLSpanElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const expanded = menu && !desktop

  useEffect(() => {
    const node = sentinel.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function close({ refocus = false } = {}) {
    setMenu(false)
    if (refocus) toggle.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && expanded) close({ refocus: true })
  }

  return (
    <>
      <span
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 h-12 w-px"
      />

      <AnimatePresence>
        {expanded && (
          <m.div
            aria-hidden="true"
            className="bg-fm-canvas/70 fixed inset-0 z-30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            onClick={() => close()}
          />
        )}
      </AnimatePresence>

      <header
        className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-3 md:top-4"
        onKeyDown={onKeyDown}
      >
        <m.div
          layout={!desktop}
          transition={{ layout: PANEL }}
          style={{ borderRadius: 26 }}
          data-scrolled={scrolled || undefined}
          className={cn(
            "pointer-events-auto w-full overflow-hidden backdrop-blur-xl backdrop-saturate-150 md:w-auto",
            "bg-fm-surface/75 shadow-fm-ring transition-[box-shadow,background-color] duration-300",
            "data-scrolled:bg-fm-surface/85 data-scrolled:shadow-fm-pop",
            expanded && "bg-fm-surface/95 shadow-fm-float"
          )}
        >
          <m.div
            layout={!desktop ? "position" : false}
            className="flex h-[3.25rem] items-center gap-1 px-1.5"
          >
            <a
              href="#top"
              onClick={() => close()}
              className="group fm-focus text-fm-ink flex h-10 items-center gap-2 rounded-full ps-2 pe-3 text-sm font-semibold tracking-[-0.01em]"
            >
              <Mark />
              {labels.brand}
            </a>

            <nav aria-label={labels.navAria} className="hidden items-center md:flex">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="fm-focus text-fm-ink-2 hover:bg-fm-fill hover:text-fm-ink flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-150 hover:duration-0"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Status: etykieta zwija się do kropki po przewinięciu (siatka 1fr → 0fr). */}
            <div className="text-fm-small text-fm-ink-2 ms-1 hidden h-9 items-center rounded-full ps-3 pe-1 md:flex">
              <LiveDot />
              <span
                className={cn(
                  "ease-fm-snap grid transition-[grid-template-columns,opacity] duration-500",
                  scrolled ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
                )}
              >
                <span className="overflow-hidden whitespace-nowrap">
                  <span className="ps-2 pe-1">{labels.status}</span>
                </span>
              </span>
            </div>
            <ThemeSwitch label={labels.theme} className="hidden md:grid" />

            <div className="ms-auto flex items-center gap-1 md:hidden">
              <Button size="sm" className="h-10 px-4" onClick={openContact}>
                {labels.write}
              </Button>
              <button
                ref={toggle}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-label={expanded ? labels.closeMenu : labels.openMenu}
                onClick={() => setMenu((value) => !value)}
                className="fm-focus fm-press text-fm-ink hover:bg-fm-fill grid size-10 place-items-center rounded-full transition-[background-color,scale]"
              >
                <span className="grid [&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:size-[1.125rem] [&>svg]:transition-[opacity,rotate,scale] [&>svg]:duration-300">
                  <Menu
                    aria-hidden="true"
                    className={cn(expanded && "scale-50 rotate-90 opacity-0")}
                  />
                  <X
                    aria-hidden="true"
                    className={cn(!expanded && "scale-50 -rotate-90 opacity-0")}
                  />
                </span>
              </button>
            </div>
          </m.div>

          <AnimatePresence initial={false}>
            {expanded && (
              <m.div
                id={panelId}
                key="panel"
                layout="position"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.06, duration: 0.25 } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="px-1.5 pb-1.5"
              >
                <nav aria-label={labels.navAria} className="flex flex-col px-1 pt-2 pb-3">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => close()}
                      className="fm-focus text-fm-ink hover:bg-fm-fill flex h-14 items-center rounded-2xl px-3 text-[1.625rem] font-semibold tracking-[-0.03em] transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="bg-fm-fill rounded-fm-2xl flex items-center justify-between py-1.5 ps-4 pe-1.5">
                  <span className="text-fm-small text-fm-ink-2 flex items-center gap-2.5">
                    <LiveDot />
                    {labels.status}
                  </span>
                  <ThemeSwitch label={labels.theme} />
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </header>
    </>
  )
}
