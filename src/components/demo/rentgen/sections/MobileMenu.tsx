"use client"

import { useEffect, useState } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../forma/cn"
import { CopyButton } from "../../forma/CopyButton"
import { ThemeSwitch } from "../../forma/ThemeSwitch"

interface NavItem {
  key: string
  label: string
  href: string
}

/** Portal do korzenia koncepcji — poza nim nie ma tokenów Formy. */
function portalRoot(): HTMLElement | undefined {
  if (typeof document === "undefined") return undefined
  return document.querySelector<HTMLElement>("[data-rg-root]") ?? undefined
}

/**
 * Menu telefonu: arkusz z góry (Radix Dialog — pułapka fokusu, Esc, powrót
 * fokusu). Duże wiersze nawigacji, akcja kontaktu, e-mail do skopiowania
 * i motyw — żeby ekran menu nie był w 70% pusty (dług nr 8 serwisu).
 */
export function MobileMenu({
  nav,
  cta,
  ctaClass,
  email,
  labels,
}: {
  nav: readonly NavItem[]
  cta: { label: string; href: string }
  ctaClass: string
  email: string
  labels: { open: string; close: string; menu: string; theme: string; copied: string }
}) {
  const [open, setOpen] = useState(false)

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
        className="grid size-11 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill lg:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
          <path
            d="M3.5 7.25h13M3.5 12.75h13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Dialog.Trigger>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay className="rg-overlay fixed inset-0 z-[80] bg-black/30 dark:bg-black/60" />
        <Dialog.Content
          aria-describedby={undefined}
          className="rg-sheet fixed inset-x-2 top-[calc(0.5rem+env(safe-area-inset-top,0px))] z-[81] flex max-h-[calc(100dvh-1rem)] flex-col overflow-y-auto overscroll-contain rounded-[1.75rem] bg-fm-surface p-2 shadow-fm-float outline-none"
        >
          <div className="flex h-14 shrink-0 items-center justify-between ps-3">
            <Dialog.Title className="text-fm-small font-medium text-fm-ink-3">
              {labels.menu}
            </Dialog.Title>
            <Dialog.Close
              aria-label={labels.close}
              className="grid size-11 fm-press place-items-center rounded-full text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Dialog.Close>
          </div>
          <nav aria-label="Nawigacja mobilna" className="px-2 pt-1 pb-4">
            <ul>
              {nav.map((item) => (
                <li key={item.key} className="border-b border-fm-edge last:border-0">
                  <a
                    href={item.href}
                    className="group flex h-14 items-center justify-between rounded-fm-lg px-2 text-[1.375rem] font-medium tracking-[-0.03em] fm-focus active:bg-fm-fill"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" className="size-5 text-fm-ink-3" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-2 rounded-[1.25rem] bg-fm-fill p-2">
            <a href={cta.href} onClick={() => setOpen(false)} className={cn(ctaClass, "w-full")}>
              {cta.label}
            </a>
            <div className="flex items-center gap-2">
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
