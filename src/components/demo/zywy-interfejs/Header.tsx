"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Dialog } from "radix-ui"
import { Menu, X } from "lucide-react"
import { cn } from "../forma/cn"
import { buttonVariants } from "../forma/Button"
import { LiveDot } from "../forma/Chip"
import { ThemeSwitch } from "../forma/ThemeSwitch"

interface NavItem {
  href: string
  label: string
}

/**
 * Pływająca pigułka nawigacji. Po zjechaniu z pierwszego ekranu zwęża się
 * i dostaje cień — ustępuje treści, ale zostaje pod ręką. Podświetlenie
 * pozycji menu przesuwa się za kursorem (transform + szerokość, sprężyna CSS).
 * Na telefonie: znak, „Napisz” i przycisk menu, które otwiera arkusz od dołu.
 */
export function Header({
  brand,
  status,
  nav,
  cta,
  labels,
}: {
  brand: string
  status: string
  nav: NavItem[]
  cta: NavItem
  labels: { theme: string; open: string; close: string; menu: string }
}) {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLUListElement>(null)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)

  useEffect(() => {
    const sentinel = document.getElementById("zi-top")
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  function track(target: HTMLElement) {
    const list = navRef.current
    if (!list) return
    const base = list.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    setPill({ x: rect.left - base.left, w: rect.width })
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
      <div
        data-scrolled={scrolled || undefined}
        className={cn(
          "pointer-events-auto flex h-14 w-full max-w-[72rem] items-center justify-between gap-3 rounded-full pr-2 pl-5",
          "transition-[max-width,background-color,box-shadow] duration-500 ease-fm-snap",
          "bg-fm-canvas/70 backdrop-blur-xl data-scrolled:max-w-[46rem] data-scrolled:bg-fm-surface/80 data-scrolled:shadow-fm-pop"
        )}
      >
        <Link
          href="#zi-top"
          className="-ml-1 flex items-center gap-2.5 rounded-full px-1 text-[0.9375rem] font-semibold tracking-tight fm-focus"
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-full bg-fm-ink text-[0.6875rem] font-bold text-fm-inverse"
          >
            MZ
          </span>
          <span className="hidden sm:inline">{brand}</span>
        </Link>

        <nav aria-label={labels.menu} className="hidden md:block">
          <ul
            ref={navRef}
            className="relative flex items-center"
            onPointerLeave={() => setPill(null)}
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 rounded-full bg-fm-fill transition-[translate,width,opacity] duration-300 ease-fm-snap"
              style={{
                translate: `${pill?.x ?? 0}px 0`,
                width: pill?.w ?? 0,
                opacity: pill ? 1 : 0,
              }}
            />
            {nav.map((item) => (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  onPointerEnter={(event) => track(event.currentTarget)}
                  onFocus={(event) => track(event.currentTarget)}
                  className="block rounded-full px-3.5 py-2 text-sm text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <span className="mr-2 hidden items-center gap-2 text-fm-micro font-medium text-fm-ink-2 lg:flex">
            <LiveDot /> {status}
          </span>
          <ThemeSwitch label={labels.theme} />
          <Link href={cta.href} className={cn(buttonVariants({ size: "sm" }), "h-10 px-4")}>
            {cta.label}
          </Link>
          <MobileMenu nav={nav} labels={labels} />
        </div>
      </div>
    </header>
  )
}

function MobileMenu({
  nav,
  labels,
}: {
  nav: NavItem[]
  labels: { open: string; close: string; menu: string }
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={labels.open}
        className="grid size-10 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus hover:bg-fm-fill md:hidden"
      >
        <Menu className="size-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        {/* Arkusz renderuje się poza korzeniem `.fm`, więc dostaje go jawnie. */}
        <div className="fm contents">
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-x-2 bottom-2 z-50 rounded-fm-4xl bg-fm-surface p-2 shadow-fm-float outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:ease-fm-drawer data-[state=open]:slide-in-from-bottom">
            <div
              className="mx-auto mt-1 mb-2 h-1 w-10 rounded-full bg-fm-fill-strong"
              aria-hidden
            />
            <Dialog.Title className="sr-only">{labels.menu}</Dialog.Title>
            <nav aria-label={labels.menu}>
              <ul className="grid gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex h-14 items-center rounded-fm-3xl px-5 text-lg font-medium tracking-tight fm-focus hover:bg-fm-fill active:bg-fm-fill"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Dialog.Close className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-fm-fill text-sm font-medium fm-focus">
              <X className="size-4" /> {labels.close}
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
