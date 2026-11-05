"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Dialog } from "radix-ui"
import { Check, CornerDownLeft, Search } from "lucide-react"
import { Kbd } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"
import { portalRoot } from "./hooks"
import { ICONS } from "./icons"
import { searchPalette, type Match } from "./palette-search"
import type { PaletteGroup, PaletteItem } from "./types"
import { useSheetDrag } from "./use-sheet-drag"

export interface PaletteLabels {
  search: string
  placeholder: string
  noResults: string
  clear: string
  results: { one: string; few: string; many: string; other: string }
  hintNavigate: string
  hintOpen: string
  hintClose: string
  copied: string
}

const optionId = (id: string) => `i1-opt-${id}`

/** Polska odmiana liczebnika („1 wynik”, „3 wyniki”, „5 wyników”). */
function plural(count: number, forms: PaletteLabels["results"]) {
  const rule = new Intl.PluralRules("pl-PL").select(count) as keyof PaletteLabels["results"]
  return `${count} ${forms[rule] ?? forms.other}`
}

/** Przejście do kotwicy na tej stronie; fokus idzie za treścią (nagłówek sekcji). */
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
 * Okno palety ⌘K (osobny fragment JS — wczytywany w bezczynności albo przy
 * pierwszym otwarciu, wyzwalacz i skróty są w `CommandPalette.tsx`). Jak w dobrych systemach projektowych: sekcje, realizacje, wpisy,
 * podstrony i akcje (kopiuj e-mail, zmień motyw) w jednym polu; od 768 px
 * podgląd aktywnej pozycji (miniatura i opis). Combobox + listbox
 * (`aria-activedescendant`), strzałki, Enter, Esc czyści zapytanie, drugi Esc
 * zamyka. Otwarta skrótem — bez animacji (akcja z klawiatury); podgląd przy
 * strzałkach zmienia się od razu. Na telefonie arkusz od dołu z uchwytem.
 */
export function PaletteDialog({
  groups,
  email,
  labels,
  open,
  instant,
  onOpenChange,
  returnFocus,
}: {
  groups: readonly PaletteGroup[]
  email: string
  labels: PaletteLabels
  open: boolean
  /** Otwarta skrótem klawiszowym — bez animacji wejścia. */
  instant: boolean
  onOpenChange: (open: boolean) => void
  /** Wyzwalacz w nagłówku — dostaje fokus po zamknięciu. */
  returnFocus?: RefObject<HTMLButtonElement | null>
}) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const pendingAnchor = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const { sheetRef, handleProps } = useSheetDrag<HTMLDivElement>(() => onOpenChange(false))
  const setOpen = onOpenChange

  const results = useMemo(() => searchPalette(groups, query), [groups, query])
  const flat = useMemo(() => results.flatMap((entry) => entry.matches), [results])
  const active = flat.find((match) => match.item.id === activeId) ?? flat[0]

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // Aktywna pozycja zawsze w kadrze listy (strzałki przy długiej liście).
  useEffect(() => {
    if (!active) return
    document.getElementById(optionId(active.item.id))?.scrollIntoView({ block: "nearest" })
  }, [active])

  async function activate(item: PaletteItem) {
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
    if (item.action === "toggle-theme") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay
          data-instant={instant || undefined}
          className="fixed inset-0 z-50 bg-[oklch(0_0_0/0.2)] duration-200 ease-fm-snap data-instant:animate-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:bg-[oklch(0_0_0/0.5)]"
        />
        <Dialog.Content
          ref={sheetRef}
          aria-describedby={undefined}
          data-instant={instant || undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            inputRef.current?.focus({ preventScroll: true })
          }}
          onEscapeKeyDown={(event) => {
            if (!query) return
            event.preventDefault()
            setQuery("")
            setActiveId(null)
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            const hash = pendingAnchor.current
            pendingAnchor.current = null
            // Przejście do kotwicy przenosi fokus na nagłówek sekcji; inaczej wraca do wyzwalacza
            // (WCAG 2.4.3) — także po otwarciu skrótem, gdy przedtem fokus był na <body>.
            if (hash) goToAnchor(hash)
            else returnFocus?.current?.focus({ preventScroll: true })
          }}
          className={cn(
            "i1-palette fixed z-50 flex flex-col overflow-hidden bg-fm-surface shadow-(--i1-shadow-pop) outline-none data-instant:animate-none",
            // Telefon: arkusz od dołu (szuflada); od 640 px: krótkie wejście od góry, bez przesuwu.
            "duration-[420ms] ease-fm-drawer data-[state=closed]:animate-out data-[state=closed]:duration-[240ms] data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
            "sm:origin-top sm:duration-200 sm:ease-fm-snap sm:data-[state=closed]:duration-150 sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-98 sm:data-[state=open]:fade-in-0 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-97",
            "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[1.75rem] pb-[max(env(safe-area-inset-bottom),0.5rem)]",
            // Od 640 px: dokładnie szerokość i oś kolumny (szerokość i prawy brzeg w `indeks-1.css`).
            "sm:top-[calc(var(--i1-header)+0.5rem)] sm:bottom-auto sm:left-0 sm:mx-auto sm:max-h-[min(32rem,calc(100dvh-var(--i1-header)-2rem))] sm:rounded-fm-2xl sm:pb-0"
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
              ref={inputRef}
              role="combobox"
              aria-expanded="true"
              aria-controls="i1-palette-list"
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
              enterKeyHint="go"
              className="h-full min-w-0 flex-1 bg-transparent text-base text-fm-ink outline-none placeholder:text-fm-ink-3 sm:text-[0.9375rem]"
            />
            <Kbd aria-hidden="true" className="hidden sm:inline-flex">
              esc
            </Kbd>
          </div>
          <div aria-hidden="true" className="h-px shrink-0 bg-fm-edge" />

          <div className="flex min-h-0 flex-1">
            <div
              id="i1-palette-list"
              role="listbox"
              aria-label={labels.search}
              className="min-h-0 flex-1 scroll-py-2 overflow-y-auto overscroll-contain p-2 sm:max-h-[24rem]"
            >
              {results.map(({ group, matches }) => (
                <div key={group.id} role="group" aria-labelledby={`i1-pg-${group.id}`}>
                  <div
                    id={`i1-pg-${group.id}`}
                    className="flex items-baseline justify-between px-3 pt-3 pb-1.5 text-fm-micro font-medium text-fm-ink-3"
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
                <div className="flex flex-col items-center gap-3 py-12 text-center text-fm-small text-fm-ink-3">
                  <p>
                    {labels.noResults} „<span className="text-fm-ink">{query}</span>”
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      inputRef.current?.focus()
                    }}
                    className="inline-flex h-9 fm-press items-center rounded-full bg-fm-fill px-4 font-medium text-fm-ink-2 fm-focus transition-colors hover:bg-fm-fill-strong hover:text-fm-ink"
                  >
                    {labels.clear}
                  </button>
                </div>
              )}
            </div>
            {active && <Preview item={active.item} copied={copied} copiedLabel={labels.copied} />}
          </div>

          <div className="hidden h-10 shrink-0 items-center gap-4 border-t border-fm-edge px-4 text-fm-micro text-fm-ink-3 sm:flex">
            <Hint keys={["↑", "↓"]}>{labels.hintNavigate}</Hint>
            <Hint keys={["↵"]}>{labels.hintOpen}</Hint>
            <Hint keys={["esc"]}>{labels.hintClose}</Hint>
            <span className="ms-auto tabular-nums">
              {query ? plural(flat.length, labels.results) : ""}
            </span>
          </div>

          <span role="status" className="sr-only">
            {query ? plural(flat.length, labels.results) : ""}
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
      {item.thumb ? (
        <span className="i1-ring relative size-6 shrink-0 overflow-hidden rounded-fm-xs bg-fm-fill">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumb}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </span>
      ) : (
        <Icon
          aria-hidden="true"
          className="mx-1 size-4 shrink-0 text-fm-ink-3 group-data-active/opt:text-fm-ink"
        />
      )}
      <span className="min-w-0 flex-1 truncate text-fm-ink-2 group-data-active/opt:text-fm-ink">
        {label}
      </span>
      {item.hint && (
        <span className="max-w-[40%] shrink-0 truncate text-fm-small text-fm-ink-3 tabular-nums md:hidden">
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

/** Podgląd aktywnej pozycji (od 768 px): miniatura albo ikona, podpis i krótki opis. */
function Preview({
  item,
  copied,
  copiedLabel,
}: {
  item: PaletteItem
  copied: boolean
  copiedLabel: string
}) {
  const Icon = ICONS[item.icon]
  return (
    <aside
      aria-hidden="true"
      className="hidden w-[16.5rem] shrink-0 flex-col gap-3 overflow-hidden border-s border-fm-edge p-4 md:flex"
    >
      {item.thumb ? (
        <div className="i1-ring relative aspect-[16/10] w-full overflow-hidden rounded-fm-lg bg-fm-fill">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={item.thumb}
            src={item.thumb}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      ) : (
        <span className="grid size-10 place-items-center rounded-fm-md bg-fm-fill text-fm-ink-2">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-fm-small font-medium text-pretty text-fm-ink">{item.label}</p>
        {item.hint && (
          <p className="mt-0.5 truncate text-fm-micro text-fm-ink-3 tabular-nums">
            {copied && item.action === "copy-email" ? copiedLabel : item.hint}
          </p>
        )}
        {item.detail && (
          <p className="mt-2 line-clamp-4 text-fm-micro text-pretty text-fm-ink-2">{item.detail}</p>
        )}
      </div>
    </aside>
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
