"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "../forma/Button"
import { cn } from "../forma/cn"
import { CopyButton } from "../forma/CopyButton"
import { ThemeSwitch } from "../forma/ThemeSwitch"
import { Glyph } from "./Glyph"
import { portalRoot } from "./ids"

interface NavItem {
  key: string
  label: string
  href: string
}

interface Labels {
  theme: string
  open: string
  close: string
  menu: string
  copied: string
}

/** Przewinięcie, poniżej którego nagłówek zawsze stoi, i próg ruchu, który go chowa lub przywraca. */
const TOP_ZONE = 96
const DELTA = 6

/**
 * Pływająca pigułka: sygnet ASCII z imieniem i nazwiskiem, podstrony serwisu,
 * motyw i akcja (na telefonie kompaktowa „Kontakt” obok menu). Przy
 * przewijaniu w dół pigułka chowa się nad krawędź — nie zasłania tekstu —
 * i wraca przy przewijaniu w górę albo gdy fokus wejdzie do nagłówka.
 * Na telefonie rozwija się w panel menu (Radix Dialog). Cień uniesienia po
 * zjechaniu z góry liczy CSS (oś czasu przewijania).
 */
export function Header({
  name,
  nav,
  cta,
  email,
  labels,
}: {
  name: string
  nav: readonly NavItem[]
  cta: { label: string; href: string }
  email: string
  labels: Labels
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = ref.current
    if (!header) return
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const hide = y > TOP_ZONE && y - last > DELTA && !header.contains(document.activeElement)
      const show = y <= TOP_ZONE || last - y > DELTA
      if (hide) header.setAttribute("data-hidden", "")
      else if (show) header.removeAttribute("data-hidden")
      if (Math.abs(y - last) > DELTA || y <= TOP_ZONE) last = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onFocus = () => header.removeAttribute("data-hidden")
    window.addEventListener("scroll", onScroll, { passive: true })
    header.addEventListener("focusin", onFocus)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      header.removeEventListener("focusin", onFocus)
    }
  }, [])

  const brand = (
    <a
      href="#start"
      className="flex h-10 min-w-0 items-center gap-2.5 rounded-full ps-1 pe-3 text-[0.9375rem] font-medium tracking-[-0.02em] whitespace-nowrap fm-focus"
    >
      <Glyph />
      <span className="truncate">{name}</span>
    </a>
  )

  return (
    <header
      ref={ref}
      className="es-header pointer-events-none fixed inset-x-0 top-0 z-50 pt-(--es-header-top)"
    >
      <div className="es-pill pointer-events-auto mx-3 flex h-(--es-header) items-center gap-1 rounded-full px-2 lg:mx-auto lg:w-fit">
        {brand}
        <nav aria-label="Nawigacja główna" className="hidden lg:block">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="flex h-10 items-center rounded-full px-3.5 text-sm text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="flex-1 lg:hidden" />
        <ThemeSwitch label={labels.theme} className="hidden lg:grid" />
        <a
          href={cta.href}
          className={cn(
            buttonVariants({ size: "md" }),
            "relative h-9 px-3.5 text-[0.8125rem] after:absolute after:-inset-1 after:content-[''] sm:h-10 sm:px-4.5 sm:text-sm"
          )}
        >
          {cta.label}
        </a>
        <MobileMenu brand={brand} nav={nav} cta={cta} email={email} labels={labels} />
      </div>
    </header>
  )
}

function MobileMenu({
  brand,
  nav,
  cta,
  email,
  labels,
}: {
  brand: React.ReactNode
  nav: readonly NavItem[]
  cta: { label: string; href: string }
  email: string
  labels: Labels
}) {
  const [open, setOpen] = useState(false)

  // Panel to tylko telefon i tablet; po obróceniu do szerokiego ekranu zamykamy go.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 64rem)")
    const close = () => wide.matches && setOpen(false)
    wide.addEventListener("change", close)
    return () => wide.removeEventListener("change", close)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={labels.open}
        className="grid size-10 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill lg:hidden"
      >
        <MenuIcon />
      </Dialog.Trigger>
      {/* Portal do korzenia koncepcji — poza nim nie ma tokenów Formy. */}
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay className="es-overlay fixed inset-0 z-[60] bg-black/25 dark:bg-black/55" />
        <Dialog.Content
          aria-describedby={undefined}
          className="es-sheet fixed inset-x-3 top-(--es-header-top) z-[61] flex max-h-[calc(100dvh-var(--es-header-top)-0.75rem)] flex-col overflow-y-auto overscroll-contain rounded-[1.75rem] bg-fm-surface p-2 shadow-fm-float outline-none"
        >
          <Dialog.Title className="sr-only">{labels.menu}</Dialog.Title>
          <div className="flex h-(--es-header) shrink-0 items-center justify-between">
            <Dialog.Close asChild>{brand}</Dialog.Close>
            <Dialog.Close
              aria-label={labels.close}
              className="grid size-10 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill"
            >
              <CloseIcon />
            </Dialog.Close>
          </div>
          <nav aria-label="Nawigacja mobilna" className="px-2 pt-2 pb-4">
            <ul>
              {nav.map((item) => (
                <li key={item.key} className="border-b border-fm-edge last:border-0">
                  <a
                    href={item.href}
                    className="group flex h-14 items-center justify-between rounded-fm-lg px-2 text-[1.375rem] font-medium tracking-[-0.03em] fm-focus active:bg-fm-fill"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-fm-ink-3 transition-[translate,color] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fm-ink"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-2 rounded-[1.25rem] bg-fm-fill p-2">
            <a
              href={cta.href}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              {cta.label}
            </a>
            <div className="flex items-center justify-between gap-2">
              <CopyButton
                value={email}
                label={email}
                copiedLabel={labels.copied}
                className="h-12 flex-1 justify-between"
              />
              <ThemeSwitch
                label={labels.theme}
                className="size-12 bg-fm-surface shadow-fm-ring hover:bg-fm-surface"
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Dwie kreski — ikona menu w proporcjach pigułki (lucide ma trzy). */
function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <path
        d="M3.5 7.25h13M3.5 12.75h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
