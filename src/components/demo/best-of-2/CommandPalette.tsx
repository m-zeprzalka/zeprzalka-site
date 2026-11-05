"use client"

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Dialog } from "radix-ui"
import {
  ArrowUpRight,
  Check,
  CornerDownLeft,
  FileText,
  Hash,
  Mail,
  PanelsTopLeft,
  PlaySquare,
  Search,
  SunMoon,
  type LucideIcon,
} from "lucide-react"
import { Kbd } from "@/components/demo/forma/Chip"
import { useThemeTransition } from "@/components/demo/shared/glyph"
import { plural, type PluralForms } from "@/i18n/format"
import { cn } from "../forma/cn"
import { portalRoot } from "./ids"
import { searchPalette, type Match } from "./palette-search"
import type { PaletteGroup, PaletteIcon, PaletteItem } from "./palette-types"
import { useSheetDrag } from "./use-sheet-drag"
import { useWorks } from "./WorksProvider"

/** Nazwy ikon z serwera → komponenty lucide (komponentu nie da się przekazać przez granicę RSC). */
const ICONS: Record<PaletteIcon, LucideIcon> = {
  section: Hash,
  work: PlaySquare,
  post: FileText,
  page: PanelsTopLeft,
  mail: Mail,
  theme: SunMoon,
  external: ArrowUpRight,
}

export interface PaletteLabels {
  search: string
  placeholder: string
  noResults: string
  results: PluralForms
  hintNavigate: string
  hintOpen: string
  hintClose: string
  copied: string
}

const optionId = (id: string) => `b2-opt-${id}`

/** Skrót „/” nie może przejmować pisania w polach formularza. */
function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  )
}

/**
 * Przejście do kotwicy na tej stronie. Fokus idzie za treścią (nagłówek
 * sekcji), a nie wraca do przycisku palety. Realizacje same rozwijają
 * wiersz na `hashchange`, więc tę samą kotwicę „odświeżamy” ręcznie.
 */
function goToAnchor(hash: string) {
  const target = document.getElementById(hash.slice(1))
  if (!target) return
  if (window.location.hash === hash) {
    target.scrollIntoView({ block: "start" })
    window.dispatchEvent(new HashChangeEvent("hashchange"))
  } else {
    window.location.hash = hash
  }
  target.querySelector<HTMLElement>("[data-anchor-focus]")?.focus({ preventScroll: true })
}

/**
 * Paleta ⌘K (wzór: `indeks/CommandPalette.tsx` — „fajny patent z wyszukiwarką
 * jak w jakimś design systemie”): sekcje, realizacje, wpisy, podstrony i akcje
 * w jednym polu. Realizacja otwiera podgląd (to samo okno co slider i masonry).
 * Wzorzec combobox + listbox (aria-activedescendant), strzałki i Enter;
 * Esc, pułapkę i przywracanie fokusu daje Radix Dialog; Esc przy wpisanym
 * zapytaniu najpierw je czyści. Na telefonie arkusz od dołu z uchwytem do
 * przeciągnięcia, od 640 px okno. Otwarta skrótem klawiszowym nie animuje się.
 */
export function CommandPalette({
  groups,
  email,
  labels,
}: {
  groups: readonly PaletteGroup[]
  email: string
  labels: PaletteLabels
}) {
  const router = useRouter()
  const works = useWorks()
  const { resolvedTheme } = useTheme()
  const switchTheme = useThemeTransition("tiles")
  const pendingWork = useRef<string | null>(null)
  const allWorks = useMemo(
    () => groups.flatMap((group) => group.items).flatMap((item) => (item.work ? [item.work] : [])),
    [groups]
  )
  const [open, setOpen] = useState(false)
  const [instant, setInstant] = useState(false)
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const pendingAnchor = useRef<string | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const { sheetRef, handleProps } = useSheetDrag<HTMLDivElement>(() => setOpen(false))

  const results = useMemo(() => searchPalette(groups, query), [groups, query])
  const flat = useMemo(() => results.flatMap((entry) => entry.matches), [results])
  const active = flat.find((match) => match.item.id === activeId) ?? flat[0]

  function show(viaKeyboard: boolean) {
    setInstant(viaKeyboard)
    setQuery("")
    setActiveId(null)
    setCopied(false)
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
    return () => window.removeEventListener("keydown", onShortcut)
  }, [])

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // Aktywna pozycja zawsze w kadrze listy (strzałki przy długiej liście).
  useEffect(() => {
    if (!active) return
    document.getElementById(optionId(active.item.id))?.scrollIntoView({ block: "nearest" })
  }, [active])

  async function activate(item: PaletteItem) {
    if (item.work) {
      pendingWork.current = item.work
      setOpen(false)
      return
    }
    if (item.action === "theme") {
      setOpen(false)
      // Po zamknięciu palety — zdjęcie strony do przejścia nie łapie okna.
      requestAnimationFrame(() => switchTheme(resolvedTheme === "dark" ? "light" : "dark"))
      return
    }
    if (item.action === "copy-email") {
      try {
        await navigator.clipboard.writeText(email)
      } catch {
        return
      }
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1600)
      return
    }
    const href = item.href
    if (!href) return
    if (href.startsWith("#")) {
      pendingAnchor.current = href
      setOpen(false)
    } else if (href.startsWith("/")) {
      setOpen(false)
      router.push(href)
    } else {
      window.open(href, "_blank", "noopener,noreferrer")
      setOpen(false)
    }
  }

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (flat.length === 0) return
      const index = active ? flat.indexOf(active) : -1
      const step = event.key === "ArrowDown" ? 1 : -1
      const next = flat[(index + step + flat.length) % flat.length]
      if (next) setActiveId(next.item.id)
    } else if (event.key === "Enter" && active) {
      event.preventDefault()
      void activate(active.item)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? show(false) : setOpen(false))}>
      <Dialog.Trigger
        aria-keyshortcuts="Meta+K Control+K"
        className="relative grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 after:absolute after:-inset-1 after:content-[''] hover:bg-fm-fill hover:text-fm-ink lg:flex lg:h-9 lg:w-auto lg:gap-2 lg:bg-fm-fill lg:ps-3 lg:pe-1.5 lg:text-[0.8125rem] lg:font-medium lg:text-fm-ink-3 lg:hover:bg-fm-fill-strong"
      >
        <Search aria-hidden="true" className="size-[1.125rem] lg:size-3.5" />
        <span className="sr-only lg:not-sr-only">{labels.search}</span>
        <span aria-hidden="true" className="ms-3 hidden items-center gap-0.5 lg:inline-flex">
          {/* Oba znaki są w HTML; właściwy pokazuje CSS po atrybucie `data-b2-os` na <html>
              (skrypt inline przed pierwszym malowaniem) — bez podmiany po hydratacji. */}
          <Kbd className="b2-k-apple">⌘</Kbd>
          <Kbd className="b2-k-other px-1">Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Dialog.Trigger>

      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay
          data-instant={instant || undefined}
          className="b2-overlay fixed inset-0 z-[80] bg-[oklch(0_0_0/0.22)] dark:bg-[oklch(0_0_0/0.5)]"
        />
        <Dialog.Content
          ref={sheetRef}
          aria-describedby={undefined}
          data-instant={instant || undefined}
          onEscapeKeyDown={(event) => {
            if (!query) return
            event.preventDefault()
            setQuery("")
            setActiveId(null)
          }}
          onCloseAutoFocus={(event) => {
            const work = pendingWork.current
            if (work) {
              pendingWork.current = null
              event.preventDefault()
              works.open(work, allWorks)
              return
            }
            const hash = pendingAnchor.current
            if (!hash) return
            pendingAnchor.current = null
            event.preventDefault()
            goToAnchor(hash)
          }}
          className={cn(
            "b2-palette fixed z-[81] flex flex-col overflow-hidden bg-fm-surface shadow-fm-pop outline-none",
            "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[1.75rem] pb-[max(env(safe-area-inset-bottom),0.5rem)]",
            // Od 640 px okno na siatce strony: pełna szerokość kontenera, od 1024 px kolumny 4–9
            // z 12 (`--b2-palette-w`, procenty liczone od okna bez paska przewijania), tuż pod nagłówkiem.
            "sm:inset-x-0 sm:top-[calc(var(--b2-header-top)+var(--b2-header)+0.75rem)] sm:bottom-auto sm:mx-auto sm:max-h-[min(34rem,calc(100dvh-var(--b2-header-top)-var(--b2-header)-2rem))] sm:w-(--b2-palette-w) sm:rounded-fm-3xl sm:pb-0"
          )}
        >
          <Dialog.Title className="sr-only">{labels.search}</Dialog.Title>
          {/* Uchwyt arkusza: pole chwytu na całą szerokość, sama kreska 36 × 4 px. */}
          <div
            aria-hidden="true"
            {...handleProps}
            className="flex h-5 shrink-0 cursor-grab touch-none items-end justify-center sm:hidden"
          >
            <span className="h-1 w-9 rounded-full bg-fm-edge-strong" />
          </div>

          <div className="flex h-14 shrink-0 items-center gap-3 px-5 sm:px-4">
            <Search aria-hidden="true" className="size-4 shrink-0 text-fm-ink-3" />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="b2-palette-list"
              aria-autocomplete="list"
              aria-activedescendant={active ? optionId(active.item.id) : undefined}
              aria-label={labels.search}
              placeholder={labels.placeholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveId(null)
              }}
              onKeyDown={onInputKey}
              autoComplete="off"
              spellCheck={false}
              className="h-full min-w-0 flex-1 bg-transparent text-base text-fm-ink outline-none placeholder:text-fm-ink-3 sm:text-[0.9375rem]"
            />
            <Kbd aria-hidden="true" className="hidden sm:inline-flex">
              esc
            </Kbd>
          </div>
          <div aria-hidden="true" className="h-px shrink-0 bg-fm-edge" />

          <div
            id="b2-palette-list"
            role="listbox"
            aria-label={labels.search}
            className="min-h-0 flex-1 scroll-py-2 overflow-y-auto overscroll-contain p-2 sm:max-h-[24rem]"
          >
            {results.map(({ group, matches }) => (
              <div key={group.id} role="group" aria-labelledby={`b2-pg-${group.id}`}>
                <div
                  id={`b2-pg-${group.id}`}
                  className="px-3 pt-3 pb-1.5 text-fm-micro font-medium text-fm-ink-3"
                >
                  {group.heading}
                </div>
                {matches.map((match) => (
                  <Option
                    key={match.item.id}
                    match={match}
                    active={match === active}
                    copied={copied && match.item.action === "copy-email"}
                    copiedLabel={labels.copied}
                    onHover={() => setActiveId(match.item.id)}
                    onSelect={() => void activate(match.item)}
                  />
                ))}
              </div>
            ))}
            {flat.length === 0 && (
              <p className="py-14 text-center text-fm-small text-fm-ink-3">{labels.noResults}</p>
            )}
          </div>

          <div className="hidden h-10 shrink-0 items-center gap-4 border-t border-fm-edge px-4 text-fm-micro text-fm-ink-3 sm:flex">
            <Hint keys={["↑", "↓"]}>{labels.hintNavigate}</Hint>
            <Hint keys={["↵"]}>{labels.hintOpen}</Hint>
            <Hint keys={["esc"]}>{labels.hintClose}</Hint>
          </div>

          <span role="status" className="sr-only">
            {query ? plural(flat.length, "pl", labels.results) : ""}
            {copied ? labels.copied : ""}
          </span>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Option({
  match: { item, range },
  active,
  copied,
  copiedLabel,
  onHover,
  onSelect,
}: {
  match: Match
  active: boolean
  copied: boolean
  copiedLabel: string
  onHover: () => void
  onSelect: () => void
}) {
  const Icon = copied ? Check : ICONS[item.icon]
  const label = range ? (
    <>
      {item.label.slice(0, range[0])}
      <mark className="bg-transparent font-medium text-fm-ink">
        {item.label.slice(range[0], range[1])}
      </mark>
      {item.label.slice(range[1])}
    </>
  ) : (
    item.label
  )

  return (
    <div
      id={optionId(item.id)}
      role="option"
      aria-selected={active}
      data-active={active || undefined}
      // pointermove, nie pointerenter: lista przewijana pod stojącym kursorem nie kradnie wyboru.
      onPointerMove={active ? undefined : onHover}
      onClick={onSelect}
      className="group/opt flex min-h-11 cursor-pointer items-center gap-3 rounded-fm-lg px-3 text-[0.9375rem] select-none data-active:bg-fm-fill"
    >
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 text-fm-ink-3 group-data-active/opt:text-fm-ink"
      />
      <span className="min-w-0 flex-1 truncate text-fm-ink-2 group-data-active/opt:text-fm-ink">
        {label}
      </span>
      {item.hint && (
        <span className="shrink-0 text-fm-small text-fm-ink-3 tabular-nums">
          {copied ? copiedLabel : item.hint}
        </span>
      )}
      <CornerDownLeft
        aria-hidden="true"
        className="hidden size-3.5 shrink-0 text-fm-ink-3 opacity-0 group-data-active/opt:opacity-100 sm:block"
      />
    </div>
  )
}

function Hint({ keys, children }: { keys: readonly string[]; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex gap-0.5">
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </span>
      {children}
    </span>
  )
}
