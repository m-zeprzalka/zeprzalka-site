"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import { cn } from "../forma/cn"
import { CopyButton } from "../forma/CopyButton"
import { ThemeSwitch } from "../forma/ThemeSwitch"
import { portalRoot } from "./ids"
import { Magnetic } from "./Magnetic"
import { setMotionPaused, useMotionPaused } from "./motion"
import { RollText } from "./RollText"
import { Sygnet } from "./Sygnet"

interface NavItem {
  key: string
  label: string
  href: string
}

export interface HeaderLabels {
  theme: string
  open: string
  close: string
  menu: string
  copied: string
  pause: string
  play: string
}

/** Strefa przy górze, w której nagłówek zawsze stoi, i próg ruchu, który go chowa albo przywraca. */
const TOP_ZONE = 120
const DELTA = 6

/**
 * Nagłówek: sygnet-licznik z domeną, podstrony serwisu (litery przewijane pod
 * kursorem), pauza ruchu, motyw i magnetyczne „Kontakt”. Chowa się przy
 * przewijaniu w dół (nie zasłania scen), wraca przy ruchu w górę albo fokusie.
 * Po zjechaniu z góry dostaje tło płótna i włosową linię (CSS, oś przewijania).
 */
export function Header({
  domain,
  nav,
  cta,
  email,
  labels,
}: {
  domain: string
  nav: readonly NavItem[]
  cta: { label: string; href: string; long: string }
  email: string
  labels: HeaderLabels
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
      className="group flex h-11 items-center gap-1.5 rounded-full pe-2 text-[1.0625rem] font-semibold tracking-[-0.035em] whitespace-nowrap fm-focus"
    >
      <Sygnet className="text-[1.0625rem]" />
      {domain}
    </a>
  )

  return (
    <header ref={ref} className="kn-header fixed inset-x-0 top-0 z-50">
      <div className="kn-wrap flex h-(--kn-header) items-center gap-2">
        {brand}
        <nav aria-label="Nawigacja główna" className="ms-auto hidden lg:block">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="kn-roll-host flex h-11 items-center px-3.5 text-[0.9375rem] font-medium text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink"
                >
                  <RollText text={item.label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ms-auto flex items-center gap-1 lg:ms-3">
          <MotionToggle labels={labels} className="hidden lg:grid" />
          <ThemeSwitch label={labels.theme} className="hidden size-11 lg:grid" />
          <Magnetic className="hidden lg:inline-flex">
            <a
              href={cta.href}
              className="kn-roll-host ms-2 inline-flex h-11 items-center rounded-full bg-fm-ink px-5 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[scale] duration-150 ease-fm-snap active:scale-[0.97]"
            >
              <span data-kn-label="" className="inline-flex">
                <RollText text={cta.label} />
              </span>
            </a>
          </Magnetic>
          <MobileMenu brand={brand} nav={nav} cta={cta} email={email} labels={labels} />
        </div>
      </div>
    </header>
  )
}

/** Pauza całego ruchu ciągłego: sygnet, taśma, reel i wideo (WCAG 2.2.2). */
export function MotionToggle({ labels, className }: { labels: HeaderLabels; className?: string }) {
  const paused = useMotionPaused()
  const label = paused ? labels.play : labels.pause
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink",
        className
      )}
    >
      {paused ? (
        <Play aria-hidden="true" className="size-4 fill-current" />
      ) : (
        <Pause aria-hidden="true" className="size-4 fill-current" />
      )}
    </button>
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
  cta: { label: string; href: string; long: string }
  email: string
  labels: HeaderLabels
}) {
  const [open, setOpen] = useState(false)

  // Menu to tylko telefon i tablet — po obróceniu do szerokiego ekranu zamykamy je.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 64rem)")
    const close = () => wide.matches && setOpen(false)
    wide.addEventListener("change", close)
    return () => wide.removeEventListener("change", close)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex h-11 fm-press items-center gap-2 rounded-full bg-fm-ink ps-4 pe-3.5 text-[0.9375rem] font-medium text-fm-inverse fm-focus lg:hidden">
        {labels.menu}
        <MenuIcon />
      </Dialog.Trigger>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Content
          aria-describedby={undefined}
          className="kn-menu fixed inset-0 z-[61] flex flex-col overflow-y-auto overscroll-contain bg-fm-canvas outline-none"
        >
          <Dialog.Title className="sr-only">{labels.menu}</Dialog.Title>
          <div className="kn-wrap flex h-(--kn-header) shrink-0 items-center justify-between">
            <Dialog.Close asChild>{brand}</Dialog.Close>
            <Dialog.Close className="inline-flex h-11 fm-press items-center gap-2 rounded-full bg-fm-fill ps-4 pe-3.5 text-[0.9375rem] font-medium fm-focus">
              {labels.close}
              <CloseIcon />
            </Dialog.Close>
          </div>
          <nav aria-label="Nawigacja mobilna" className="kn-wrap flex-1 pt-6 pb-8">
            <ul>
              {nav.map((item, index) => (
                <li key={item.key} className="overflow-hidden">
                  <a
                    href={item.href}
                    className="kn-menu-link flex items-center justify-between gap-4 rounded-fm-sm py-1 text-[clamp(2.75rem,13vw,5rem)] leading-[1] font-semibold tracking-[-0.06em] fm-focus"
                    style={{ "--i": index } as CSSProperties}
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" className="size-7 shrink-0 text-fm-ink-3" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="kn-wrap grid shrink-0 gap-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <a
              href={cta.href}
              onClick={() => setOpen(false)}
              className="inline-flex h-14 fm-press items-center justify-center rounded-full bg-fm-ink px-6 text-[1rem] font-medium text-fm-inverse fm-focus"
            >
              {cta.long}
            </a>
            <div className="flex items-center gap-2">
              <CopyButton
                value={email}
                label={email}
                copiedLabel={labels.copied}
                className="h-12 flex-1 justify-between"
              />
              <MotionToggle
                labels={labels}
                className="size-12 bg-fm-fill text-fm-ink hover:bg-fm-fill-strong"
              />
              <ThemeSwitch
                label={labels.theme}
                className="size-12 bg-fm-fill text-fm-ink hover:bg-fm-fill-strong"
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Dwie kreski — ikona menu. */
function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path
        d="M3.5 7.25h13M3.5 12.75h13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
