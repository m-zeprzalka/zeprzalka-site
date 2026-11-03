"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { setInspect, useInspect } from "./inspect-store"

export interface NavItem {
  href: string
  label: string
}

/** Czas w Warszawie, odświeżany co sekundę — „żywy” detal zamiast zielonej kropki. */
function useWarsawTime() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const format = new Intl.DateTimeFormat("pl-PL", {
      timeZone: "Europe/Warsaw",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function Header({
  nav,
  homeHref,
  languageHref,
  languageLabel,
  email,
  themeLabel,
}: {
  nav: readonly NavItem[]
  homeHref: string
  languageHref: string
  languageLabel: string
  email: string
  themeLabel: string
}) {
  const time = useWarsawTime()
  const inspect = useInspect()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const progressRef = useRef<HTMLSpanElement>(null)

  // Postęp lektury na miarce pod nagłówkiem — bez renderów Reacta.
  useEffect(() => {
    let frame = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? window.scrollY / max : 0
      progressRef.current?.style.setProperty("transform", `scaleX(${ratio})`)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <header className="pz-header">
      <div className="pz-container flex h-full items-center justify-between gap-6">
        <Link href={homeHref} className="pz-brand" aria-label="Michał Zeprzałka — strona główna">
          <span className="pz-brand__mark" aria-hidden="true" />
          <span className="font-medium tracking-[-0.01em]">Michał Zeprzałka</span>
        </Link>

        <nav aria-label="Nawigacja główna" className="hidden md:block">
          <ol className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="pz-nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex items-center gap-1">
          <span className="pz-clock mr-3 hidden lg:inline">
            Warszawa <span className="pz-mono">{time ?? "--:--:--"}</span>
          </span>
          <button
            type="button"
            className="pz-icon-btn hidden md:inline-flex"
            aria-pressed={inspect}
            onClick={() => setInspect(!inspect)}
            title="Pokaż siatkę i wymiary elementów"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M1.5 10.5 10.5 1.5l4 4-9 9z M4 8l1.5 1.5 M6 6l2 2 M8 4l1.5 1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
            <span className="sr-only">Wymiary</span>
          </button>
          <button
            type="button"
            className="pz-icon-btn"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            title={themeLabel}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" />
            </svg>
            <span className="sr-only">{themeLabel}</span>
          </button>
          <Link
            href={languageHref}
            className="pz-icon-btn pz-mono text-[0.6875rem] tracking-[0.08em]"
            lang="en"
            hrefLang="en"
          >
            {languageLabel}
          </Link>
          <button
            type="button"
            className="pz-icon-btn md:hidden"
            aria-expanded={open}
            aria-controls="pz-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? "Zamknij" : "Menu"}
          </button>
        </div>
      </div>
      {/* Miarka: podziałka na dolnej krawędzi nagłówka, wypełnienie = postęp lektury. */}
      <span className="pz-ruler" aria-hidden="true">
        <span ref={progressRef} className="pz-ruler__fill" />
      </span>

      <div id="pz-menu" className="pz-menu md:hidden" data-open={open || undefined} hidden={!open}>
        <nav aria-label="Nawigacja mobilna" className="pz-container">
          <ol>
            {nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
          <a href={`mailto:${email}`} className="pz-mono mt-10 block text-sm">
            {email}
          </a>
        </nav>
      </div>
    </header>
  )
}
