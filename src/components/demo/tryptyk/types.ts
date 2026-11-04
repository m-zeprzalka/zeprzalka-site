/**
 * Kształty danych, które serwer (`content.ts`) podaje komponentom klienckim.
 * Same typy — moduł może trafić do paczki przeglądarki.
 */
import type { PortfolioGroup } from "@/lib/portfolio"
import type { SectionId } from "./anchors"

/** Ikony przechodzą przez granicę serwer → klient jako nazwy, nie komponenty. */
export type IconName =
  | "design"
  | "code"
  | "motion"
  | "history"
  | "web"
  | "section"
  | "page"
  | "post"
  | "mail"
  | "external"
  | "theme"

export interface Work {
  slug: string
  title: string
  category: string
  group: PortfolioGroup
  groupLabel: string
  /** Opis do panelu: zdanie produktu albo opis grupy. */
  caption: string
  video?: string
  poster: string
  width: number
  height: number
  /** Działający serwis (własne produkty) — link „na zewnątrz” zamiast portfolio. */
  url?: string
  /** Pozycja na liście (1…n) — licznik w scenie. */
  index: number
  /** W zajawce obecnej strony głównej — pasek miniatur przy reelu. */
  featured: boolean
}

export interface Post {
  slug: string
  title: string
  description: string
  href: string
  date: string
  dateLabel: string
  /** „02.11” — dzień i miesiąc; rok stoi w lewym pasie listy. */
  day: string
  year: string
  image: string
  readingTime: string
  isNew: boolean
}

export interface Competency {
  id: string
  icon: IconName
  title: string
  description: string
  tools: readonly string[]
  /** Dowody: realizacje, które tę kompetencję pokazują (scena i lista w karcie). */
  proofs: { label: string; meta: string; slugs: readonly string[] }
}

/** Zawartość karty-popovera przy chipie w tekście wstępu. */
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

export type Fact =
  | { kind: "count"; value: number; suffix?: string; label: string }
  | { kind: "range"; from: number; to: number; label: string }
  | { kind: "percent"; value: number; label: string }

export interface NavItem {
  id: SectionId
  label: string
  /** Liczba pozycji (realizacje, wpisy) — cicha liczba w spisie. */
  count?: number
}

export interface PaletteItem {
  id: string
  label: string
  hint?: string
  icon: IconName
  /** Plakat zamiast ikony (realizacje). */
  thumb?: string
  /** Glif sekcji zamiast ikony — ten sam co w spisie i w logo. */
  glyph?: string
  /** Kotwica (#…), trasa serwisu (/…) albo adres zewnętrzny. */
  href?: string
  action?: "copy-email" | "toggle-theme"
  keywords?: string
}

export interface PaletteGroup {
  id: string
  heading: string
  items: readonly PaletteItem[]
}
