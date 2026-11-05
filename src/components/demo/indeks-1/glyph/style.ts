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

/** Papier szkieletu — ta sama czerń co szkielet mediów wspólnego silnika (w obu motywach). */
export const SKELETON_PAPER = "#0b0b0b"

/**
 * Styl odkodowania: szkielet jak we wspólnym silniku glifów — białe i szare
 * kropki na czerni (raster o gęstości obrazu), front fali miga kodem binarnym,
 * potem obraz. Komórka rośnie z kadrem: drobniej na karcie, grubiej w kolumnie.
 */
export function decodeStyle(width: number): DecodeStyle {
  const cell = width >= 560 ? 8 : width >= 300 ? 7 : 6
  return {
    code: { family: monoFamily(), glyphs: BINARY, pick: "random" },
    raster: { family: glyphFont.style.fontFamily, glyphs: HALFTONE, pick: "level" },
    cell,
    paper: SKELETON_PAPER,
    mono: true,
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

/** Obraz gotowy do narysowania w canvasie (z pamięci podręcznej albo po wczytaniu). */
export async function imageReady(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) return
  try {
    await image.decode()
  } catch {
    await new Promise((resolve) => image.addEventListener("load", resolve, { once: true }))
  }
}
