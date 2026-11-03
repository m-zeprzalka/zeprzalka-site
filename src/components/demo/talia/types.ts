import type { PortfolioGroup } from "@/lib/portfolio"

/** Realizacja w postaci, którą komponent kliencki może dostać przez propsy. */
export interface Project {
  slug: string
  title: string
  category: string
  group: PortfolioGroup
  video: string
  poster: string
}

/** Grupa portfolio z opisem — źródło przełącznika filtrów i opisu w karcie. */
export interface ProjectGroup {
  id: PortfolioGroup
  label: string
  description: string
}

/**
 * Skąd otwarto kartę. Ta sama realizacja żyje w trzech taliach naraz
 * (wachlarz, stos, siatka), a nazwa przejścia widoku musi być unikalna —
 * dlatego wchodzi do niej miejsce pochodzenia.
 */
export type Origin = "fan" | "stack" | "works"

/** Klatka filmu z chwili kliknięcia i jej czas — dialog startuje dokładnie stąd. */
export interface Still {
  canvas: HTMLCanvasElement
  time: number
}

export interface OpenCard {
  slug: string
  origin: Origin
  /** Proporcje plakatu odczytane z klikniętej karty — dialog zna je od razu. */
  aspect: number
  still?: Still
}

export interface NavItem {
  href: string
  label: string
}
