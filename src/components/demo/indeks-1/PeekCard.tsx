"use client"

import { useRef, type RefObject } from "react"
import { useMedia } from "./hooks"
import { Popover } from "radix-ui"
import { X } from "lucide-react"
import { portalRoot } from "./hooks"
import { PeekBody, type PeekWork } from "./PeekBody"
import type { Peek } from "./types"
import { UI } from "./ui-strings"

/** Klasy karty pod słowem — wspólne dla fraz i liczb (szerokość = kolumna, z `fit`). */
const PEEK_CARD =
  "z-50 overflow-y-auto overscroll-contain origin-(--radix-popover-content-transform-origin) rounded-fm-2xl bg-fm-surface p-(--i1-inset) text-fm-small shadow-(--i1-shadow-pop) outline-none duration-200 ease-fm-snap data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98 data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-97 data-[state=open]:blur-in-[2px]"

/**
 * Karta pod słowem (Radix Popover) — osobny fragment JS, wczytywany w
 * bezczynności albo przy pierwszym dotknięciu frazy. Wyzwalacz jest zwykłym
 * elementem frazy lub liczby (`usePeekCard`), więc karta kotwiczy się do niego
 * bez `Popover.Trigger`; stoi na krawędziach kolumny (`fit`). Kliknięcie
 * w wyzwalacz przy otwartej karcie ją zamyka (nie „zamyka i otwiera”), a po
 * zamknięciu fokus wraca do wyzwalacza — chyba że kliknięto gdzie indziej.
 */
export function PeekCard({
  id,
  open,
  onOpenChange,
  anchor,
  fit,
  sideOffset,
  peek,
  work,
}: {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  anchor: RefObject<HTMLElement | null>
  fit: { offset: number; width: number }
  sideOffset: number
  peek: Peek
  work?: PeekWork
}) {
  const outside = useRef(false)
  // Na dotyku karta leży nad treścią jak arkusz: strona pod nią przygasa (bez rozmycia —
  // pełnoekranowy `backdrop-filter` to koszt GPU), a w rogu karty stoi wyraźne „zamknij”.
  const coarse = useMedia("(pointer: coarse)")
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Anchor virtualRef={anchor as RefObject<HTMLElement>} />
      {coarse && (
        <Popover.Portal container={portalRoot()}>
          <div
            aria-hidden="true"
            data-state={open ? "open" : "closed"}
            className="pointer-events-none fixed inset-0 z-40 bg-[oklch(0_0_0/0.42)] duration-200 ease-fm-snap data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:bg-[oklch(0_0_0/0.66)]"
          />
        </Popover.Portal>
      )}
      <Popover.Portal container={portalRoot()}>
        <Popover.Content
          id={id}
          side="bottom"
          align="start"
          alignOffset={fit.offset}
          sideOffset={sideOffset}
          collisionPadding={{ top: 72, bottom: 16 }}
          style={{
            width: fit.width || undefined,
            maxHeight: "var(--radix-popover-content-available-height)",
          }}
          onOpenAutoFocus={() => {
            outside.current = false
          }}
          onInteractOutside={(event) => {
            if (anchor.current?.contains(event.target as Node)) event.preventDefault()
            else outside.current = true
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            if (!outside.current) anchor.current?.focus({ preventScroll: true })
          }}
          className={PEEK_CARD}
        >
          {coarse && (
            <div className="-me-1.5 -mt-1.5 mb-1 flex justify-end">
              <Popover.Close
                aria-label={UI.close}
                className="grid size-11 fm-press place-items-center rounded-full bg-fm-fill text-fm-ink-2 fm-focus transition-[background-color,scale] active:bg-fm-fill-strong"
              >
                <X aria-hidden="true" className="size-4" />
              </Popover.Close>
            </div>
          )}
          <PeekBody peek={peek} work={work} onNavigate={() => onOpenChange(false)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
