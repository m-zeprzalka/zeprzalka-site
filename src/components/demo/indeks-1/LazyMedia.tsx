"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type { GlyphMedia } from "./GlyphMedia"

type Props = ComponentProps<typeof GlyphMedia>

const load = () => import("./GlyphMedia").then((module) => module.GlyphMedia)

/** Wczytanie z wyprzedzeniem (gdy przeglądarka odpocznie) — pierwsze rozwinięcie nie czeka. */
export function preloadPanelMedia() {
  void load()
}

/**
 * Kadr panelu realizacji (dekoder glifów) jako osobny fragment JS: panel
 * istnieje dopiero po rozwinięciu wiersza, więc kod nie obciąża wejścia na
 * stronę. Do czasu wczytania stoi szkielet (kropki na czerni) w tym samym
 * kadrze — opakowanie w `Works.tsx`, bez skoku układu.
 */
export const PanelMedia = dynamic<Props>(load, {
  ssr: false,
  loading: () => null,
})
