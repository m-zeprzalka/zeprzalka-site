"use client"

import { BINARY, HALFTONE } from "./alphabet"
import { loadFont } from "./atlas"
import type { DecodeStyle, Wave } from "./decoder"
import { glyphFont } from "./fonts"

/** Geist Mono z układu piaskownicy (zmienna CSS z `next/font`). */
function monoFamily(): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() ||
    "monospace"
  )
}

let fonts: Promise<void> | null = null

/** Oba kroje odkodowania — ładowane raz, przy pierwszym użyciu. */
export function ensureGlyphFonts(): Promise<void> {
  fonts ??= Promise.all([
    loadFont(glyphFont.style.fontFamily, HALFTONE.join("")),
    loadFont(monoFamily(), BINARY.join("")),
  ]).then(() => undefined)
  return fonts
}

/**
 * Styl odkodowania: front fali to najpierw migające cyfry binarne (kod),
 * potem raster z kropek o gęstości obrazu (sygnał), potem obraz.
 * Komórka rośnie z kadrem: drobniej na karcie, grubiej na wideo w kolumnie.
 */
export function decodeStyle(width: number): DecodeStyle {
  const cell = width >= 560 ? 8 : width >= 300 ? 7 : 6
  return {
    code: { family: monoFamily(), glyphs: BINARY, pick: "random" },
    raster: { family: glyphFont.style.fontFamily, glyphs: HALFTONE, pick: "level" },
    cell,
  }
}

/** Tempa fali: karta na marginesie (często, więc krótko), panel w kolumnie, wideo na starcie. */
export const WAVES = {
  card: { duration: 300, front: 140, fade: 70, jitter: 50 },
  swap: { duration: 260, front: 120, fade: 60, jitter: 40 },
  panel: { duration: 520, front: 220, fade: 110, jitter: 90 },
  hero: { duration: 900, front: 340, fade: 150, jitter: 130 },
} satisfies Record<string, Omit<Wave, "origin" | "from">>

/** DPR płótna: ≤ 2, na dotyku ≤ 1,5 (glify 6 px nie zyskują na trzykrotnej gęstości). */
export function canvasDpr(): number {
  const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
  return Math.min(cap, window.devicePixelRatio || 1)
}
