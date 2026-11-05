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
import { Check, CornerDownLeft, Search } from "lucide-react"
import { Kbd } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"
import { portalRoot, useIsApple } from "./hooks"
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

const optionId = (id: string) => `ixn-opt-${id}`

/** Polska odmiana liczebnika („1 wynik”, „3 wyniki”, „5 wyników”). */
function plural(count: number, forms: PaletteLabels["results"]) {
  const rule = new Intl.PluralRules("pl-PL").select(count) as keyof PaletteLabels["results"]
  return `${count} ${forms[rule] ?? forms.other}`
}

/** Skrót „/” nie może przejmować pisania w polach formularza. */
function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  )
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
 * Paleta ⌘K jak w dobrych systemach projektowych: sekcje, realizacje, wpisy,
 * podstrony i akcje (kopiuj e-mail, zmień motyw) w jednym polu; od 768 px
 * podgląd aktywnej pozycji (miniatura i opis). Combobox + listbox
 * (`aria-activedescendant`), strzałki, Enter, Esc czyści zapytanie, drugi Esc
 * zamyka. Otwarta skrótem — bez animacji (akcja z klawiatury); podgląd przy
 * strzałkach zmienia się od razu. Na telefonie arkusz od dołu z uchwytem.
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
  const router = useRouter()
  const apple = useIsApple()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [instant, setInstant] = useState(false)
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const pendingAnchor = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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
    <Dialog.Root open={open} onOpenChange={(next) => (next ? show(false) : setOpen(false))}>
      <Dialog.Trigger
        aria-keyshortcuts="Meta+K Control+K"
        aria-label={labels.search}
        className={cn(
          "relative grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 after:absolute after:-inset-1 after:content-[''] hover:bg-fm-fill hover:text-fm-ink",
          "sm:flex sm:h-8 sm:w-auto sm:gap-1.5 sm:bg-fm-fill sm:ps-2.5 sm:pe-1.5 sm:hover:bg-fm-fill-strong",
          className
        )}
      >
        <Search aria-hidden="true" className="size-[1.125rem] sm:size-3.5" />
        <span aria-hidden="true" className="hidden items-center gap-0.5 sm:inline-flex">
          <Kbd className={cn(!apple && "px-1")}>{apple ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Dialog.Trigger>

      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay
          data-instant={instant || undefined}
          className="ixn-overlay fixed inset-0 z-50 bg-[oklch(0_0_0/0.2)] dark:bg-[oklch(0_0_0/0.5)]"
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
            const hash = pendingAnchor.current
            if (!hash) return
            pendingAnchor.current = null
            event.preventDefault()
            goToAnchor(hash)
          }}
          className={cn(
            "ixn-palette fixed z-50 flex flex-col overflow-hidden bg-fm-surface shadow-fm-float outline-none",
            "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[1.75rem] pb-[max(env(safe-area-inset-bottom),0.5rem)]",
            "sm:inset-x-0 sm:top-[12vh] sm:bottom-auto sm:mx-auto sm:max-h-[min(32rem,76vh)] sm:w-[min(36rem,calc(100%-2rem))] sm:rounded-fm-2xl sm:pb-0",
            "md:w-[min(46rem,calc(100%-2rem))]"
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
              aria-controls="ixn-palette-list"
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
              id="ixn-palette-list"
              role="listbox"
              aria-label={labels.search}
              className="min-h-0 flex-1 scroll-py-2 overflow-y-auto overscroll-contain p-2 sm:max-h-[24rem]"
            >
              {results.map(({ group, matches, total }) => (
                <div key={group.id} role="group" aria-labelledby={`ixn-pg-${group.id}`}>
                  <div
                    id={`ixn-pg-${group.id}`}
                    className="flex items-baseline justify-between px-3 pt-3 pb-1.5 text-fm-micro font-medium text-fm-ink-3"
                  >
                    {group.heading}
                    {query && <span className="tabular-nums">{total}</span>}
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
        <span className="ixn-media-ring relative size-6 shrink-0 overflow-hidden rounded-fm-xs bg-fm-fill">
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
        <div className="ixn-media-ring relative aspect-[16/10] w-full overflow-hidden rounded-fm-lg bg-fm-fill">
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
