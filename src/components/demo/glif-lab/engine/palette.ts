import type { Tone } from "../lab/config"
import type { Palette, SurfaceKind } from "./engine"

/*
 * Kolory glifów dla GPU (liniowo 0–1, sRGB) — odpowiedniki tokenów Formy.
 * Tło paneli (odwrócony, Matrix) maluje CSS (`[data-tone]` w gll.css), żeby
 * stało od pierwszej klatki; GPU zakrywa papierem tylko media (obraz pod spodem).
 */

type RGB = [number, number, number]

const hex = (value: string): RGB => [
  parseInt(value.slice(1, 3), 16) / 255,
  parseInt(value.slice(3, 5), 16) / 255,
  parseInt(value.slice(5, 7), 16) / 255,
]

const luminance = ([r, g, b]: RGB) => 0.2126 * r + 0.7152 * g + 0.0722 * b

/** Tło panelu i tusz glifów dla trybu i motywu. */
const SCHEME: Record<Tone, { light: [string, string, string]; dark: [string, string, string] }> = {
  // [tło, glif, głowa kropli / promień skanera]
  ink: { light: ["#fafafa", "#171717", "#000000"], dark: ["#141414", "#f2f2f2", "#ffffff"] },
  inverse: { light: ["#171717", "#f5f5f5", "#ffffff"], dark: ["#ededed", "#141414", "#000000"] },
  matrix: { light: ["#030a06", "#5cf29a", "#e9ffef"], dark: ["#030a06", "#5cf29a", "#e9ffef"] },
}

/** Zakodowane media: miękki wydruk (ink-2 na fm-fill), żeby kafel nie był ścianą znaków. */
const PRINT = { light: ["#f2f2f2", "#454545"], dark: ["#1d1d1d", "#c4c4c4"] } as const

export function palette(tone: Tone, dark: boolean, kind: SurfaceKind): Palette {
  const [panel, glyph, head] = SCHEME[tone][dark ? "dark" : "light"]
  let back = hex(panel)
  let ink = hex(glyph)
  if (kind === "media" && tone === "ink") {
    const [paper, print] = PRINT[dark ? "dark" : "light"]
    back = hex(paper)
    ink = hex(print)
  }
  const paper: [number, number, number, number] =
    kind === "media" ? [back[0], back[1], back[2], 1] : [0, 0, 0, 0]
  return {
    ink,
    head: hex(head),
    paper,
    polarity: luminance(ink) < luminance(back) ? 1 : 0,
  }
}
