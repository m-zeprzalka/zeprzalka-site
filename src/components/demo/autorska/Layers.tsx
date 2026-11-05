"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Popover } from "radix-ui"
import { Check, Copy, Layers as LayersIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "../forma/cn"
import { useThemeTransition } from "../shared/glyph"
import { useStack } from "./StackProvider"
import { UI } from "./ui-strings"

const noop = () => () => {}
/** Kontener portalu wewnątrz korzenia `.fm` (na serwerze — brak; panel i tak otwiera się po hydratacji). */
const usePortal = () =>
  useSyncExternalStore(
    noop,
    () => document.getElementById("au-portal"),
    () => null
  )

export interface Layer {
  id: string
  label: string
  /** Indeks pierwszej karty warstwy w stosie (do podświetlenia bieżącej). */
  sheet: number
  /** Warstwa podrzędna (kompetencje) — wcięta jak dziecko ramki w panelu warstw. */
  child?: boolean
}

/**
 * Nawigacja jako panel warstw z narzędzia projektanta: przycisk w nagłówku pokazuje bieżącą
 * warstwę, panel (⌘K / Ctrl+K) — drzewo rozdziałów i dwie szybkie akcje. Zwykłe kotwice —
 * przewijanie robi przeglądarka. Panel trafia do portalu wewnątrz korzenia `.fm`, bo tokeny
 * Formy i warstw są zdefiniowane na nim, a nie na `<body>`.
 */
export function Layers({
  layers,
  email,
  themeLabel,
  copiedLabel,
}: {
  layers: readonly Layer[]
  email: string
  themeLabel: string
  copiedLabel: string
}) {
  const { active } = useStack()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const portal = usePortal()
  const { resolvedTheme } = useTheme()
  const transition = useThemeTransition()

  const current = layers.reduce<Layer | undefined>(
    (found, layer) => (layer.sheet <= active ? layer : found),
    undefined
  )
  const top = layers.reduce<Layer | undefined>(
    (found, layer) => (!layer.child && layer.sheet <= active ? layer : found),
    undefined
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  const row =
    "flex min-h-11 w-full items-center gap-3 rounded-[0.875rem] px-3 text-start text-fm-small fm-focus transition-colors duration-150"

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-10 fm-press items-center gap-2.5 rounded-full bg-fm-fill ps-3.5 pe-1.5 text-fm-small font-medium text-fm-ink fm-focus transition-[background-color,scale] hover:bg-fm-fill-strong"
        >
          <LayersIcon aria-hidden="true" className="size-4 text-fm-ink-2" />
          <span className="sr-only">{UI.layers}: </span>
          <span className="min-w-[5.5rem] text-start sm:min-w-[6.5rem]">
            {top?.label ?? UI.layers}
          </span>
          <kbd
            aria-hidden="true"
            className="hidden h-7 items-center rounded-full bg-(--au-sheet) px-2.5 font-mono text-fm-micro text-fm-ink-3 sm:inline-flex"
          >
            <span className="au-k-mac">⌘</span>
            <span className="au-k-ctrl">Ctrl</span>
            &nbsp;K
          </kbd>
        </button>
      </Popover.Trigger>
      <Popover.Portal container={portal}>
        <Popover.Content
          align="end"
          sideOffset={10}
          collisionPadding={8}
          aria-label={UI.layersTitle}
          onOpenAutoFocus={(event) => {
            // Fokus na bieżącej warstwie, nie na pierwszym wierszu.
            const here =
              event.currentTarget instanceof HTMLElement
                ? event.currentTarget.querySelector<HTMLElement>("[aria-current]")
                : null
            if (here) {
              event.preventDefault()
              here.focus()
            }
          }}
          className="z-[60] w-[min(20rem,calc(100vw-1rem))] rounded-(--au-r-card) bg-(--au-sheet) p-2 text-fm-ink shadow-fm-pop ring-1 ring-(--au-ring) outline-none data-[side=bottom]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"
        >
          <p className="px-3 pt-2 pb-1.5 text-fm-micro font-medium text-fm-ink-3">{UI.layers}</p>
          <ul>
            {layers.map((layer) => {
              const here = layer === current
              return (
                <li key={`${layer.sheet}-${layer.label}`}>
                  <a
                    href={`#${layer.id}`}
                    aria-current={here ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      row,
                      layer.child && "ps-9",
                      here ? "bg-fm-fill text-fm-ink" : "text-fm-ink-2 hover:bg-fm-fill/70"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-3 shrink-0 rounded-[0.25rem] ring-1",
                        here ? "bg-fm-ink ring-fm-ink" : "ring-fm-ink-3"
                      )}
                    />
                    <span className="flex-1">{layer.label}</span>
                    {here && (
                      <span aria-hidden="true" className="text-fm-micro text-fm-ink-3">
                        {UI.layersHint}
                      </span>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
          <div aria-hidden="true" className="mx-3 my-2 h-px bg-fm-edge" />
          <p className="sr-only">{UI.actions}</p>
          <button
            type="button"
            className={cn(row, "text-fm-ink-2 hover:bg-fm-fill/70")}
            onClick={() => {
              void navigator.clipboard?.writeText(email).then(() => setCopied(true))
            }}
          >
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            <span className="flex-1">{copied ? copiedLabel : UI.copyEmail}</span>
            <span className="text-fm-micro text-fm-ink-3">{email}</span>
          </button>
          <button
            type="button"
            className={cn(row, "text-fm-ink-2 hover:bg-fm-fill/70")}
            onClick={() => {
              setOpen(false)
              transition(resolvedTheme === "dark" ? "light" : "dark")
            }}
          >
            <Sun aria-hidden="true" className="hidden size-4 dark:block" />
            <Moon aria-hidden="true" className="size-4 dark:hidden" />
            <span className="flex-1">{themeLabel}</span>
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
