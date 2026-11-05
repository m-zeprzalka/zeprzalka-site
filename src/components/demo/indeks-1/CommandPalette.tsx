"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Search } from "lucide-react"
import { Kbd } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"
import type { PaletteLabels } from "./PaletteDialog"
import { preloadPeekCard } from "./peek-card-lazy"
import type { PaletteGroup } from "./types"

export type { PaletteLabels } from "./PaletteDialog"

const load = () => import("./PaletteDialog").then((module) => module.PaletteDialog)
const PaletteDialog = dynamic(load, { ssr: false })

/** Skrót „/” nie może przejmować pisania w polach formularza. */
function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  )
}

/**
 * Wyzwalacz palety ⌘K (przycisk w nagłówku, skróty ⌘K / Ctrl K i „/”). Samo
 * okno (Radix Dialog, wyszukiwarka, podgląd) to osobny fragment JS: dochodzi,
 * gdy przeglądarka odpocznie po wejściu, a najpóźniej przy pierwszym otwarciu
 * — wejście na stronę go nie niesie. Każde otwarcie zaczyna od czystego pola.
 */
export function CommandPalette({
  groups,
  email,
  labels,
  className,
}: {
  groups: readonly PaletteGroup[]
  email: string
  labels: PaletteLabels
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [instant, setInstant] = useState(false)
  /** Numer otwarcia — nowy klucz zeruje zapytanie i wybór w oknie. */
  const [session, setSession] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)

  function show(viaKeyboard: boolean) {
    setInstant(viaKeyboard)
    setSession((value) => value + 1)
    setOpen(true)
  }

  const onShortcut = useEffectEvent((event: globalThis.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault()
      if (open) setOpen(false)
      else show(true)
    } else if (event.key === "/" && !open && !isTyping(event.target)) {
      event.preventDefault()
      show(true)
    }
  })

  useEffect(() => {
    window.addEventListener("keydown", onShortcut)
    // Okno palety i karta pod słowem dochodzą, gdy przeglądarka odpocznie po wejściu.
    const idle = setTimeout(() => {
      void load()
      preloadPeekCard()
    }, 2500)
    return () => {
      window.removeEventListener("keydown", onShortcut)
      clearTimeout(idle)
    }
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        aria-label={labels.search}
        onPointerEnter={() => void load()}
        onClick={() => show(false)}
        className={cn(
          "relative grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 after:absolute after:-inset-1 after:content-[''] hover:bg-fm-fill hover:text-fm-ink",
          "sm:flex sm:h-8 sm:w-auto sm:gap-1.5 sm:bg-fm-fill sm:ps-2.5 sm:pe-1.5 sm:hover:bg-fm-fill-strong",
          className
        )}
      >
        <Search aria-hidden="true" className="size-[1.125rem] sm:size-3.5" />
        {/* Platforma ustawiona przed malowaniem (skrypt w IndeksOneHome) — bez podmiany ⌘ → Ctrl. */}
        <span aria-hidden="true" className="hidden items-center gap-0.5 sm:inline-flex">
          <Kbd>
            <span className="i1-os-apple">⌘</span>
            <span className="i1-os-other px-0.5">Ctrl</span>
          </Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      {session > 0 && (
        <PaletteDialog
          key={session}
          groups={groups}
          email={email}
          labels={labels}
          open={open}
          instant={instant}
          onOpenChange={setOpen}
          returnFocus={triggerRef}
        />
      )}
    </>
  )
}
