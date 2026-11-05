/**
 * Kształty danych, które serwer (`content.ts`) podaje komponentom klienckim.
 * Same typy — żadnych importów treści, więc plik może trafić do paczki klienta.
 */

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
  | "theme"
  | "copy"
  | "page"

/** Obraz z wymiarami — kadr rezerwuje miejsce bez mierzenia w przeglądarce. */
export interface Frame {
  src: string
  width: number
  height: number
}

export interface WorkRow {
  slug: string
  title: string
  category: string
  poster: Frame
  /** Zapętlony klip bez dźwięku; brak = produkt pokazany samym zrzutem. */
  video?: string
  /** Działający serwis (własne produkty). */
  url?: string
  description?: string
}

export interface WorkGroup {
  id: string
  label: string
  description: string
  works: readonly WorkRow[]
}

export interface PostRow {
  slug: string
  title: string
  href: string
  year: string
  /** „02.11” — dzień i miesiąc; rok stoi w kolumnie grupy. */
  day: string
  /** ISO — do `<time dateTime>`. */
  iso: string
  image: string
  isNew: boolean
}

/**
 * Podgląd na marginesie (≥ 1280 px, mysz) albo w popoverze (dotyk):
 * realizacja, okładka wpisu, mozaika kilku obrazów albo informacja tekstowa.
 */
export type Peek =
  | { kind: "work"; slug: string }
  | { kind: "post"; slug: string }
  | { kind: "mosaic"; label: string; items: readonly Frame[]; link?: PeekLink }
  | {
      kind: "info"
      heading: string
      /** Okres albo liczba obok nagłówka (cicho, cyframi tabelarycznymi). */
      meta?: string
      body?: string
      entries?: readonly { period: string; role: string; company: string }[]
      link?: PeekLink
    }

export interface PeekLink {
  label: string
  href: string
  meta?: string
}

/** Zdanie podzielone na tekst i chipy — chip wskazuje podgląd z `peeks`. */
export type Segment = { text: string } | { text: string; peek: string; icon?: IconName }

export interface Competency {
  id: string
  icon: IconName
  title: string
  description: string
  tags: readonly string[]
  /** Podgląd na marginesie: obrazy z dowodów. */
  peek: string
  proofs: { heading: string; items: readonly { label: string; meta: string; href: string }[] }
}

export interface Fact {
  id: string
  /** Liczba (dojeżdża do wartości) albo gotowy tekst („2016–2026”). */
  value: number | string
  suffix?: string
  /** Format procentowy dla 99,28%. */
  percent?: boolean
  label: string
  peek: string
}

export interface PaletteItem {
  id: string
  label: string
  /** Druga kolumna: kategoria, data, ścieżka. */
  hint?: string
  icon: IconName
  /** Miniatura (realizacje, wpisy) — też w podglądzie palety. */
  thumb?: string
  /** Krótki opis do podglądu palety. */
  detail?: string
  href?: string
  action?: "copy-email" | "toggle-theme"
  keywords?: string
}

export interface PaletteGroup {
  id: string
  heading: string
  items: readonly PaletteItem[]
}

export interface SectionLink {
  id: string
  label: string
  /** Liczba pozycji (realizacje, wpisy) — cicho obok etykiety w spisie. */
  count?: number
}
