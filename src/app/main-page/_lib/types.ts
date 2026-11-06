/**
 * Kształty danych, które serwer (`_lib/content/*`) podaje komponentom. Same
 * typy — żadnych importów treści, więc plik może trafić do paczki klienta.
 */

export interface Media {
  src: string
  alt: string
  width: number
  height: number
  /** Zapętlony klip bez dźwięku; plakat (`src`) stoi pod nim od razu. */
  video?: string
}

export interface Link {
  label: string
  href: string
  external?: boolean
}

/**
 * Karta podglądu — ten sam wygląd na marginesie (desktop) i w popoverze
 * (dotyk). Kadr w naturalnych proporcjach (albo mozaika), pod nim podpis,
 * opis albo oś czasu i link.
 */
export interface Peek {
  title: string
  meta?: string
  body?: string
  timeline?: readonly { period: string; role: string; company: string }[]
  media: readonly Media[]
  link?: Link
}

/** Zdanie podzielone na zwykły tekst i frazy otwierające kartę (`peek` = klucz w `peeks`). */
export interface Segment {
  text: string
  peek?: string
}

export interface Fact {
  id: string
  value: string
  label: string
  peek: string
}

export interface Skill {
  id: "design" | "development" | "ai" | "teaching"
  title: string
  description: string
  tags: readonly string[]
  peek: string
  proofs: { heading: string; items: readonly Link[] }
}

export interface Work {
  slug: string
  title: string
  category: string
  media: Media
  description?: string
  url?: string
}

export interface WorkGroup {
  id: string
  label: string
  works: readonly Work[]
}

export interface Post {
  slug: string
  title: string
  href: string
  year: string
  /** „02.11” — dzień i miesiąc; rok stoi w kolumnie grupy. */
  day: string
  iso: string
  cover: Media
  isNew: boolean
}

export interface SectionLink {
  id: string
  label: string
}

export type SearchItemIcon = "section" | "work" | "post" | "page" | "email" | "theme"

export interface SearchItem {
  id: string
  label: string
  icon: SearchItemIcon
  /** Druga kolumna wiersza: kategoria, data, adres. */
  hint?: string
  /** Podgląd obok listy (od tabletu) i miniatura w wierszu. */
  thumb?: string
  detail?: string
  href?: string
  action?: "copy-email" | "toggle-theme"
}

export interface SearchGroup {
  id: string
  heading: string
  items: readonly SearchItem[]
}
