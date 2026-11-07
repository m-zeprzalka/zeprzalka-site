"use client"

import { useRef, useState, type ReactNode, type RefObject } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowUpRightIcon, CopyIcon, HashIcon, SunMoonIcon, type LucideIcon } from "lucide-react"
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
import { goToAnchor } from "@/app/main-page/_lib/anchors"
import { useMediaQuery } from "@/app/main-page/_lib/hooks"
import type { SearchGroup, SearchItem, SearchItemIcon } from "@/app/main-page/_lib/types"

export interface SearchLabels {
  search: string
  title: string
  description: string
  placeholder: string
  empty: string
  hints: { select: string; open: string; close: string }
}

/** Ikony pozycji bez miniatury (realizacje i wpisy mają miniatury). */
const ICONS: Record<Exclude<SearchItemIcon, "work" | "post">, LucideIcon> = {
  section: HashIcon,
  page: ArrowUpRightIcon,
  email: CopyIcon,
  theme: SunMoonIcon,
}

/**
 * Okno wyszukiwarki ⌘K (ładowane leniwie przez `SearchMenu`). Od tabletu okno
 * shadcn na szerokość kolumny z podglądem obok listy; na telefonie arkusz od
 * dołu, który nie włącza klawiatury sam z siebie. Wybrana pozycja działa
 * dopiero po zamknięciu okna (gdy strona znów się przewija): skok do kotwicy
 * przenosi tam fokus, a bez skoku fokus wraca do przycisku.
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

  const onCloseAutoFocus = (event: Event) => {
    event.preventDefault()
    const href = pending.current
    pending.current = null
    if (!href) return trigger.current?.focus()
    // Klatkę później: blokada przewijania okna jest już zdjęta. Kotwica na tej samej
    // stronie — skok w miejscu; na innej (sekcja startu wybrana z podstrony) — przejście.
    requestAnimationFrame(() => {
      const [path = "", hash] = href.split("#")
      if (hash && (!path || path === window.location.pathname)) goToAnchor(hash)
      else router.push(href)
    })
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
        <CommandList className="max-h-[min(30rem,62dvh)] p-2">
          <CommandEmpty>{labels.empty}</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.id} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[item.label, item.hint ?? ""]}
                  onSelect={() => run(item)}
                  className="min-h-12 gap-3 px-3 text-[0.9375rem] md:min-h-11"
                >
                  <ItemIcon item={item} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="max-w-[40%] shrink-0 truncate text-xs text-muted-foreground">
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
      {/* Bez automatycznego fokusu na polu — klawiatura nie zasłania połowy ekranu. */}
      <DrawerContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DrawerTitle className="sr-only">{labels.title}</DrawerTitle>
        <DrawerDescription className="sr-only">{labels.description}</DrawerDescription>
        {body}
      </DrawerContent>
    </Drawer>
  )
}

/** Miniatura realizacji i wpisu albo ikona — kolumna 28 px, równa we wszystkich wierszach. */
function ItemIcon({ item }: { item: SearchItem }) {
  if (item.thumb) {
    return (
      <Image
        src={item.thumb}
        alt=""
        width={56}
        height={56}
        sizes="28px"
        className="size-7 shrink-0 rounded-md bg-muted object-cover"
      />
    )
  }
  const Icon = ICONS[item.icon as keyof typeof ICONS]
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-md border bg-background">
      <Icon className="size-3.5" />
    </span>
  )
}

function Preview({ item }: { item: SearchItem }) {
  return (
    <div aria-hidden="true" className="hidden flex-col gap-3 p-4 md:flex">
      {item.thumb ? (
        <Image
          src={item.thumb}
          alt=""
          width={480}
          height={270}
          sizes="240px"
          className="aspect-video w-full rounded-lg bg-muted object-cover"
        />
      ) : (
        <span className="grid aspect-video w-full place-items-center rounded-lg border bg-muted/50">
          <ItemIcon item={item} />
        </span>
      )}
      <p className="text-sm font-medium text-pretty">{item.label}</p>
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
