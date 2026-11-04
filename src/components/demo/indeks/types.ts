/**
 * Kształty danych, które serwer (`content.ts`) podaje komponentom klienckim.
 * Same typy — żadnych importów treści, więc plik może trafić do paczki klienta.
 */
import type { PortfolioGroup } from "@/lib/portfolio"

/** Ikony przechodzą przez granicę serwer → klient jako nazwy, nie komponenty. */
export type IconName =
  | "design"
  | "code"
  | "ai"
  | "teaching"
  | "history"
  | "web"
  | "motion"
  | "section"
  | "work"
  | "post"
  | "mail"
  | "external"

export interface Work {
  slug: string
  title: string
  category: string
  group: PortfolioGroup
  groupLabel: string
  groupDescription: string
  /** Brak wideo (produkt ze zrzutem) — kafel pokazuje sam plakat. */
  video?: string
  poster: string
}

export interface PostRow {
  slug: string
  title: string
  href: string
  year: string
  /** „02.11” — dzień i miesiąc, rok stoi w kolumnie grupy. */
  day: string
  /** Pełna data dla `<time dateTime>` i czytników ekranu. */
  iso: string
  isNew: boolean
}

export interface Proof {
  label: string
  meta: string
  href: string
}

export interface Competency {
  id: string
  icon: IconName
  title: string
  description: string
  tags: readonly string[]
  /** Dowody: realizacje albo wpisy, które tę kompetencję pokazują w praktyce. */
  proofs: { heading: string; items: readonly Proof[] }
}

/** Zawartość karty-popovera przy chipie w tekście. */
export type FactDetail =
  | {
      kind: "timeline"
      heading: string
      lead: string
      entries: readonly { period: string; role: string; company: string }[]
    }
  | {
      kind: "tools"
      heading: string
      tools: readonly string[]
      link: { label: string; meta: string; href: string }
    }

export interface PaletteItem {
  id: string
  label: string
  /** Druga linia/kolumna: kategoria, data, skrót. */
  hint?: string
  icon: IconName
  /** Kotwica na tej stronie (#…), trasa serwisu (/…) albo adres zewnętrzny. */
  href?: string
  /** Akcja zamiast nawigacji. */
  action?: "copy-email"
  keywords?: string
}

export interface PaletteGroup {
  id: string
  heading: string
  items: readonly PaletteItem[]
}
