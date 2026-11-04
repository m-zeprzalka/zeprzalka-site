"use client"

import { useState } from "react"
import { Dialog } from "radix-ui"
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { cn } from "../forma/cn"
import { portalRoot } from "./hooks"
import { LocalTime } from "./LocalTime"
import { SectionNav } from "./SectionNav"
import { useSheetDrag } from "./use-sheet-drag"
import type { NavItem } from "./types"

/**
 * Menu poniżej 1280 px — to samo lewe skrzydło, zwinięte do arkusza: spis
 * sekcji z glifami, status, czas, e-mail, profile i motyw. Na telefonie
 * arkusz od dołu (przeciągnięcie w dół zamyka), od 640 px panel pod paskiem.
 */
export function MenuSheet({
  person,
  status,
  nav,
  labels,
}: {
  person: {
    email: string
    locality: string
    socials: readonly { label: string; url: string }[]
  }
  status: string
  nav: readonly NavItem[]
  labels: {
    menu: string
    close: string
    sections: string
    copied: string
    theme: string
    cta: string
  }
}) {
  const [open, setOpen] = useState(false)
  const { sheetRef, handleProps } = useSheetDrag<HTMLDivElement>(() => setOpen(false))

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={labels.menu}
        className="relative grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 after:absolute after:-inset-1 after:content-[''] hover:bg-fm-fill hover:text-fm-ink sm:size-9"
      >
        <Menu aria-hidden="true" className="size-[1.125rem]" />
      </Dialog.Trigger>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay className="tk-overlay fixed inset-0 z-50 bg-[oklch(0_0_0/0.22)] dark:bg-[oklch(0_0_0/0.5)]" />
        <Dialog.Content
          ref={sheetRef}
          aria-describedby={undefined}
          className={cn(
            "tk-sheet tk-palette fixed z-50 flex flex-col bg-fm-surface shadow-fm-float outline-none",
            "inset-x-0 bottom-0 rounded-t-[1.75rem] px-3 pb-[max(env(safe-area-inset-bottom),1rem)]",
            "tk-menu-panel sm:inset-x-auto sm:top-[4.25rem] sm:bottom-auto sm:w-80 sm:rounded-fm-2xl sm:p-3"
          )}
        >
          <Dialog.Title className="sr-only">{labels.menu}</Dialog.Title>
          <div
            aria-hidden="true"
            {...handleProps}
            className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center sm:hidden"
          >
            <span className="h-1 w-9 rounded-full bg-fm-edge-strong" />
          </div>
          <div className="flex items-center justify-between px-3 pt-1 pb-3 sm:pt-0">
            <p className="flex items-center gap-2.5 text-fm-small text-fm-ink-2">
              <LiveDot />
              {status}
            </p>
            <Dialog.Close
              aria-label={labels.close}
              className="-me-2 grid size-11 fm-press place-items-center rounded-full text-fm-ink-3 fm-focus transition-colors hover:bg-fm-fill hover:text-fm-ink sm:size-9"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>

          <SectionNav
            label={labels.sections}
            items={nav}
            onNavigate={() => setOpen(false)}
            row={44}
          />

          <div className="mt-3 border-t border-fm-edge px-3 pt-4 text-fm-small">
            <div className="flex items-center justify-between gap-3">
              <span className="text-fm-ink-3">
                <LocalTime locality={person.locality} />
              </span>
              <ThemeSwitch label={labels.theme} className="-me-2 size-11 sm:size-9" />
            </div>
            <CopyButton
              value={person.email}
              label={person.email}
              copiedLabel={labels.copied}
              className="mt-3 h-12 w-full justify-between bg-fm-fill ps-4 pe-4 shadow-none hover:bg-fm-fill-strong sm:h-10"
            />
            <ul className="-ms-2 mt-2 flex items-center gap-1">
              {person.socials.map((profile) => (
                <li key={profile.url}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-0.5 rounded-full px-2 text-fm-ink-2 fm-focus transition-colors duration-150 hover:bg-fm-fill hover:text-fm-ink sm:h-9"
                  >
                    {profile.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5 text-fm-ink-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Główne wezwanie do działania na dole arkusza — w zasięgu kciuka. */}
          <Dialog.Close asChild>
            <a
              href="#kontakt"
              className="group mx-3 mt-4 flex h-12 fm-press items-center justify-center gap-2 rounded-full bg-fm-ink px-5 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 hover:bg-fm-ink/85 sm:mx-0 sm:h-11 sm:text-sm"
            >
              {labels.cta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
