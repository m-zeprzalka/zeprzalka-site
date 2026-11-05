import type { Palette, SurfaceKind } from "./engine"

/*
 * Kolory glifów dla GPU (liniowo 0–1, sRGB) — odpowiedniki tokenów Formy.
 * Jedyny ton: atrament (na jasnym — ciemny, na ciemnym — jasny). Wyjątki
 * z wyboru właściciela: szkielet mediów to białe i szare znaki na czerni
 * (w obu motywach, jak klatka wideo), a soczewka CTA ma wnętrze w 100% czarne.
 */

type RGB = [number, number, number]

const hex = (value: string): RGB => [
  parseInt(value.slice(1, 3), 16) / 255,
  parseInt(value.slice(3, 5), 16) / 255,
  parseInt(value.slice(5, 7), 16) / 255,
]

const luminance = ([r, g, b]: RGB) => 0.2126 * r + 0.7152 * g + 0.0722 * b

/** [tło, glif, głowa kropli] dla motywu. */
const INK = { light: ["#fafafa", "#171717", "#000000"], dark: ["#0a0a0a", "#f2f2f2", "#ffffff"] }
/** Szkielet mediów: „ciemny” (domyślny — jak wideo) albo w kolorach motywu. */
const SKELETON = {
  dark: ["#0b0b0b", "#9a9a9a", "#ffffff"],
  light: ["#f2f2f2", "#454545", "#000000"],
  themeDark: ["#161616", "#b4b4b4", "#ffffff"],
}
/** Soczewka CTA: czarne wnętrze, jasny kod. */
const LENS = ["#000000", "#d4d4d4", "#ffffff"]

export type SkeletonTone = "dark" | "theme"

export function palette(
  kind: SurfaceKind,
  dark: boolean,
  skeleton: SkeletonTone = "dark"
): Palette {
  let scheme = INK[dark ? "dark" : "light"]
  if (kind === "media") {
    scheme = skeleton === "dark" ? SKELETON.dark : dark ? SKELETON.themeDark : SKELETON.light
  }
  if (kind === "lens") scheme = LENS
  const [back = "#000000", glyph = "#ffffff", head = "#ffffff"] = scheme
  const backRgb = hex(back)
  const ink = hex(glyph)
  const paper: [number, number, number, number] =
    kind === "media" || kind === "lens" ? [backRgb[0], backRgb[1], backRgb[2], 1] : [0, 0, 0, 0]
  return { ink, head: hex(head), paper, polarity: luminance(ink) < luminance(backRgb) ? 1 : 0 }
}
