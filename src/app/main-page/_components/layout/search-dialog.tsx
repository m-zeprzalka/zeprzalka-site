"use client"

import { useMemo, useRef, useState, type RefObject } from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/main-page/_components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/main-page/_components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/app/main-page/_components/ui/drawer"
import { Button } from "@/app/main-page/_components/ui/button"
import { Kbd } from "@/app/main-page/_components/ui/kbd"
import { goToAnchor } from "@/app/main-page/_lib/anchors"
import { copyText } from "@/app/main-page/_lib/clipboard"
import { useMediaQuery, useToggleTheme } from "@/app/main-page/_lib/hooks"
import { matchScore } from "@/app/main-page/_lib/search-match"
import type { SearchGroup, SearchItem } from "@/app/main-page/_lib/types"
import type { Locale } from "@/i18n/config"
import type { PluralForms } from "@/i18n/format"
import { Hint, ItemIcon, Preview, ResultCount } from "./search-parts"

export interface SearchLabels {
  search: string
  title: string
  description: string
  placeholder: string
  empty: string
  copied: string
  /** Liczba wyników dla czytnika — formy liczby mnogiej (`plural`). */
  results: PluralForms
  hints: { select: string; open: string; close: string }
}

/** Zamknięte okno nie liczy wyników — stała pusta lista (stabilna zależność `useMemo`). */
const NO_GROUPS: readonly SearchGroup[] = []

/**
 * Okno wyszukiwarki ⌘K (ładowane leniwie przez `SearchMenu`): menu główne serwisu
 * (podstrony), realizacje, wpisy i akcje. Od tabletu okno shadcn na szerokość
 * kolumny z podglądem obok listy; na telefonie arkusz od dołu, który nie włącza
 * klawiatury sam z siebie. Wybrana pozycja działa dopiero po zamknięciu okna (gdy
 * strona znów się przewija): realizacja na starcie otwiera swój wiersz i dostaje
 * fokus, a bez przejścia fokus wraca do przycisku.
 */
export default function SearchDialog({
  open,
  onOpenChange,
  groups,
  labels,
  email,
  locale,
  trigger,
  onCopied,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: readonly SearchGroup[]
  labels: SearchLabels
  email: string
  locale: Locale
  /** Przycisk, do którego wraca fokus po zamknięciu. */
  trigger: RefObject<HTMLButtonElement | null>
  /** Adres skopiowany — potwierdzenie ogłasza przycisk (okno jest już zamknięte). */
  onCopied: () => void
}) {
  const [selected, setSelected] = useState("")
  const pending = useRef<string | null>(null)
  const desktop = useMediaQuery("(min-width: 48rem)")
  const router = useRouter()
  const toggleTheme = useToggleTheme()
  const sheet = useRef<HTMLDivElement>(null)

  const onCloseAutoFocus = (event: Event) => {
    event.preventDefault()
    const href = pending.current
    pending.current = null
    // `preventScroll`: przycisk stoi w przyklejonym nagłówku, w strefie `scroll-padding-top`,
    // i sam `focus()` przewijał stronę o 450–900 px w górę, żeby go „odsłonić”.
    if (!href) return trigger.current?.focus({ preventScroll: true })
    // Klatkę później: blokada przewijania okna jest już zdjęta. Realizacja na starcie,
    // gdy okno otwarto na starcie — skok w miejscu (lista otwiera wiersz); poza tym przejście.
    requestAnimationFrame(() => {
      const [path = "", hash] = href.split("#")
      if (hash && (!path || path === window.location.pathname)) goToAnchor(hash)
      else router.push(href)
    })
  }

  function run(item: SearchItem) {
    onOpenChange(false)
    // Bez schowka — zwykły `mailto:`, jak przy adresie na stronie.
    if (item.action === "copy-email")
      void copyText(email).then((ok) =>
        ok ? onCopied() : window.location.assign(`mailto:${email}`)
      )
    else if (item.action === "toggle-theme") toggleTheme()
    else if (item.href) pending.current = item.href
  }

  // Kolejność grup z danych: podstrony (menu główne), realizacje, wpisy, akcje.
  const ordered = open ? groups : NO_GROUPS
  // Filtrowanie i sortowanie po naszej stronie: cmdk 1.1.1 nie przestawia grup (szuka ich
  // po wewnętrznym id, a w DOM stoją pod nagłówkiem), więc Enter brał pierwszy wiersz w DOM,
  // a nie najlepsze trafienie. Miara trafności — `matchScore` (słowa, nie litery w rozsypce).
  const [search, setSearch] = useState("")
  // Każde otwarcie zaczyna od pustego pola (okno zostaje zamontowane między otwarciami).
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setSearch("")
  }
  const visible = useMemo(() => {
    if (!search.trim()) return ordered
    return ordered
      .map((group) => {
        const scored = group.items
          .map((item) => ({
            item,
            score: matchScore(search, item.label, [item.hint ?? "", item.detail ?? ""]),
          }))
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score)
        return { group, scored, best: scored[0]?.score ?? 0 }
      })
      .filter((entry) => entry.scored.length > 0)
      .sort((a, b) => b.best - a.best)
      .map(({ group, scored }) => ({ ...group, items: scored.map((entry) => entry.item) }))
  }, [ordered, search])
  const items = visible.flatMap((group) => group.items)
  const preview = items.find((item) => item.id === selected)

  const body = (
    <Command
      value={selected}
      onValueChange={setSelected}
      label={labels.title}
      shouldFilter={false}
      className="bg-transparent"
    >
      <CommandInput placeholder={labels.placeholder} value={search} onValueChange={setSearch} />
      <ResultCount locale={locale} forms={labels.results} empty={labels.empty} />
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_15rem] md:divide-x">
        <CommandList label={labels.title} className="max-h-[min(30rem,62dvh)] p-2">
          <CommandEmpty>{labels.empty}</CommandEmpty>
          {visible.map((group) => (
            <CommandGroup key={group.id} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => run(item)}
                  className="min-h-12 gap-3 px-3 text-[0.9375rem] md:min-h-11"
                >
                  <ItemIcon item={item} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    // Poniżej 360 px podpowiedź ustępuje nazwie (inaczej „Polityka prywa…”).
                    <span className="max-w-[40%] shrink-0 truncate text-xs text-muted-foreground max-[22.5rem]:hidden">
                      {item.hint}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        {/* Bez wyników — pusty podgląd, a nie pierwsza pozycja listy. */}
        {desktop && (preview ? <Preview item={preview} /> : <div aria-hidden="true" />)}
      </div>
      {desktop && (
        <div className="flex items-center gap-4 border-t px-4 py-2.5 text-xs text-muted-foreground">
          <Hint
            keys={
              <>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </>
            }
          >
            {labels.hints.select}
          </Hint>
          <Hint keys={<Kbd>↵</Kbd>}>{labels.hints.open}</Hint>
          <Hint keys={<Kbd>esc</Kbd>}>{labels.hints.close}</Hint>
        </div>
      )}
    </Command>
  )

  return desktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Oś kolumny: środek okna przesunięty o połowę zdjętego paska przewijania. */}
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="top-[12vh] left-[calc(50%-var(--removed-body-scroll-bar-size,0px)/2)] max-w-[calc(100%-2*var(--spacing-page))] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-column"
      >
        <DialogTitle className="sr-only">{labels.title}</DialogTitle>
        <DialogDescription className="sr-only">{labels.description}</DialogDescription>
        {body}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {/* Fokus na arkuszu, nie w polu — klawiatura ekranowa nie zasłania połowy ekranu,
          a czytnik nie zostaje na przycisku za oknem (ukrytym przez `aria-hidden`). */}
      <DrawerContent
        ref={sheet}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          sheet.current?.focus({ preventScroll: true })
        }}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DrawerTitle className="sr-only">{labels.title}</DrawerTitle>
        {/* Arkusz da się zamknąć bez gestu — przyciskiem z widocznym napisem. */}
        <DrawerClose asChild>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2 capitalize">
            {labels.hints.close}
          </Button>
        </DrawerClose>
        <DrawerDescription className="sr-only">{labels.description}</DrawerDescription>
        {body}
      </DrawerContent>
    </Drawer>
  )
}
