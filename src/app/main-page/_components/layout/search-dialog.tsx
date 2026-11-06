"use client"

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
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
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/app/main-page/_components/ui/drawer"
import { Kbd, KbdGroup } from "@/app/main-page/_components/ui/kbd"
import { useMediaQuery } from "@/app/main-page/_lib/hooks"
import type { SearchGroup, SearchItem } from "@/app/main-page/_lib/types"

export interface SearchLabels {
  search: string
  title: string
  description: string
  placeholder: string
  empty: string
  hints: { select: string; open: string; close: string }
}

/** Okno zamyka się 200 ms (animacja shadcn) — nawigujemy dopiero potem, gdy strona znowu się przewija. */
const CLOSE_MS = 220

/**
 * Okno wyszukiwarki ⌘K (ładowane leniwie przez `SearchMenu`): od tabletu okno
 * shadcn na szerokość kolumny z podglądem obok listy, na telefonie arkusz od
 * dołu, który nie włącza klawiatury sam z siebie.
 */
export default function SearchDialog({
  open,
  onOpenChange,
  groups,
  labels,
  email,
  trigger,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: readonly SearchGroup[]
  labels: SearchLabels
  email: string
  /** Przycisk, do którego wraca fokus po zamknięciu. */
  trigger: RefObject<HTMLButtonElement | null>
}) {
  const [selected, setSelected] = useState("")
  const pending = useRef<string | null>(null)
  const desktop = useMediaQuery("(min-width: 48rem)")
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const href = pending.current
    if (open || !href) return
    pending.current = null
    const timer = setTimeout(() => {
      if (!href.startsWith("#")) return router.push(href)
      // Ten sam hash nie wywołuje zdarzenia — ogłaszamy go sami (sekcja portfolio otwiera wtedy realizację).
      history.pushState(null, "", href)
      window.dispatchEvent(new HashChangeEvent("hashchange"))
      document.getElementById(href.slice(1))?.scrollIntoView()
    }, CLOSE_MS)
    return () => clearTimeout(timer)
  }, [open, router])

  // Po zamknięciu fokus wraca do przycisku (WCAG 2.4.3) — także po otwarciu skrótem.
  const returnFocus = (event: Event) => {
    event.preventDefault()
    trigger.current?.focus()
  }

  function run(item: SearchItem) {
    onOpenChange(false)
    if (item.action === "copy-email") void navigator.clipboard?.writeText(email)
    else if (item.action === "toggle-theme") setTheme(resolvedTheme === "dark" ? "light" : "dark")
    else if (item.href) pending.current = item.href
  }

  const items = groups.flatMap((group) => group.items)
  const preview = items.find((item) => item.id === selected) ?? items[0]

  const body = (
    <Command value={selected} onValueChange={setSelected} className="bg-transparent">
      <CommandInput placeholder={labels.placeholder} />
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_15rem] md:divide-x">
        <CommandList className="max-h-[min(28rem,60dvh)] p-2">
          <CommandEmpty>{labels.empty}</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.id} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[item.label, item.hint ?? ""]}
                  onSelect={() => run(item)}
                  className="min-h-11 px-3"
                >
                  <span className="truncate">{item.label}</span>
                  {item.hint && (
                    <span className="ml-auto shrink-0 truncate text-xs text-muted-foreground">
                      {item.hint}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        {desktop && preview && <Preview item={preview} />}
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
        onCloseAutoFocus={returnFocus}
        className="sm:max-w-column top-[12vh] left-[calc(50%-var(--removed-body-scroll-bar-size,0px)/2)] max-w-[calc(100%-2*var(--spacing-page))] translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">{labels.title}</DialogTitle>
        <DialogDescription className="sr-only">{labels.description}</DialogDescription>
        {body}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {/* Bez automatycznego fokusu na polu — klawiatura nie zasłania połowy ekranu. */}
      <DrawerContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={returnFocus}
      >
        <DrawerTitle className="sr-only">{labels.title}</DrawerTitle>
        <DrawerDescription className="sr-only">{labels.description}</DrawerDescription>
        {body}
      </DrawerContent>
    </Drawer>
  )
}

function Preview({ item }: { item: SearchItem }) {
  return (
    <div aria-hidden="true" className="hidden flex-col gap-3 p-4 md:flex">
      {item.thumb && (
        <Image
          src={item.thumb}
          alt=""
          width={480}
          height={270}
          sizes="240px"
          className="aspect-video w-full rounded-lg bg-muted object-cover"
        />
      )}
      <p className="text-sm font-medium">{item.label}</p>
      {item.detail && (
        <p className="line-clamp-5 text-sm text-pretty text-muted-foreground">{item.detail}</p>
      )}
    </div>
  )
}

function Hint({ keys, children }: { keys: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <KbdGroup>{keys}</KbdGroup>
      {children}
    </span>
  )
}
