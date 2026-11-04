/**
 * Kształty danych „Transformacji”, które przechodzą z serwera do komponentów
 * klienckich. Same typy — plik może trafić do paczki klienta.
 */

export interface Stage {
  id: "szkic" | "projekt" | "kod" | "produkt"
  label: string
  /** Indeks kompetencji (Projektowanie produktu, Development, Komunikacja wizualna). */
  competency: number
}

export type CodeToken = {
  kind: "keyword" | "fn" | "tag" | "attr" | "string" | "punct" | "text"
  text: string
}
export type CodeLine = readonly CodeToken[]

export interface LogLine {
  kind: "command" | "info" | "step" | "route" | "ready"
  text: string
  detail?: string
}
