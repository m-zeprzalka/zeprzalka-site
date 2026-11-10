"use client"

import type { ReactNode } from "react"
import { useCommandState } from "cmdk"
import Image from "next/image"
import { ArrowUpRightIcon, CopyIcon, SunMoonIcon, type LucideIcon } from "lucide-react"
import { KbdGroup } from "@/app/main-page/_components/ui/kbd"
import type { SearchItem, SearchItemIcon } from "@/app/main-page/_lib/types"
import type { Locale } from "@/i18n/config"
import { plural, type PluralForms } from "@/i18n/format"

/* Części okna ⌘K (`search-dialog.tsx`): licznik wyników, ikona pozycji, podgląd, podpowiedź. */

/** Ikony pozycji bez miniatury (realizacje i wpisy mają miniatury). */
const ICONS: Record<Exclude<SearchItemIcon, "work" | "post">, LucideIcon> = {
  page: ArrowUpRightIcon,
  email: CopyIcon,
  theme: SunMoonIcon,
}

/** Liczba wyników (albo ich brak) dla czytnika — `[cmdk-empty]` nie jest regionem na żywo. */
export function ResultCount({
  locale,
  forms,
  empty,
}: {
  locale: Locale
  forms: PluralForms
  empty: string
}) {
  const count = useCommandState((state) => state.filtered.count)
  return (
    <p role="status" className="sr-only">
      {count ? plural(count, locale, forms) : empty}
    </p>
  )
}

/** Miniatura realizacji i wpisu albo ikona — kolumna 28 px, równa we wszystkich wierszach. */
export function ItemIcon({ item }: { item: SearchItem }) {
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

export function Preview({ item }: { item: SearchItem }) {
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

export function Hint({ keys, children }: { keys: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <KbdGroup>{keys}</KbdGroup>
      {children}
    </span>
  )
}
