/**
 * Kształty danych, które serwer (`content.ts`) podaje komponentom klienckim.
 * Same typy — żadnych importów treści, więc plik może trafić do paczki klienta.
 */

/** Ikony przechodzą przez granicę serwer → klient jako nazwy, nie komponenty. */
export type IconName =
  | "history"
  | "web"
  | "motion"
  | "design"
  | "code"
  | "ai"
  | "visual"
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

/**
 * Karta na marginesie (≥ 1024 px, mysz) albo u dołu ekranu (dotyk, tablet):
 * jeden kształt dla wszystkiego, co da się wskazać — fakt, słowo w zdaniu,
 * realizacja, wpis. Media to dedykowany film kategorii albo plakat.
 */
export interface Card {
  heading: string
  /** Okres, kategoria albo data — cicho obok nagłówka. */
  meta?: string
  body?: string
  /** Narzędzia i tagi jako chipy (hybryda z pierwszego „Indeksu”). */
  chips?: readonly string[]
  media?: { poster: Frame; video?: string }
  /** Oś czasu (doświadczenie). */
  entries?: readonly { period: string; role: string; company: string }[]
  link?: { label: string; href: string; external?: boolean }
}

/** Zdanie podzielone na tekst i chipy — chip wskazuje kartę z `cards`. */
export type Segment = { text: string } | { text: string; card: string; icon?: IconName }

export interface Fact {
  id: string
  value: number
  suffix?: string
  /** „od 2016” — liczba to rok początku, który trwa do dziś. */
  since?: boolean
  /** Procent z przecinkiem (99,28%). */
  percent?: boolean
  label: string
  card: string
}

export interface Skill {
  id: string
  icon: IconName
  /** Figura ze znaków (silnik): 0 kostka, 1 torus, 2 kropla, 3 ośmiościan. */
  figure: 0 | 1 | 2 | 3
  title: string
  description: string
  tags: readonly string[]
  proofs: readonly { label: string; meta: string; href: string; card: string }[]
}

export interface Work {
  slug: string
  title: string
  category: string
  group: string
  poster: Frame
  video?: string
  url?: string
  /** W widoku „Wybrane”. */
  selected: boolean
}

export interface WorkFilter {
  id: string
  label: string
}

export interface PostRow {
  slug: string
  title: string
  href: string
  year: string
  /** „02.11” — dzień i miesiąc; rok stoi w kolumnie grupy. */
  day: string
  iso: string
  isNew: boolean
}

export interface PaletteItem {
  id: string
  label: string
  hint?: string
  icon: IconName
  thumb?: string
  detail?: string
  href?: string
  action?: "copy-email" | "toggle-theme"
  /** Klucz karty — pozycja otwiera kartę zamiast przewijać (realizacje). */
  card?: string
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
}
