/*
 * Wspólny silnik efektów ze znaków (iteracja 7) — publiczne API.
 * Opis, przykłady i ustawienia: README.md obok.
 */
export { GlyphPortrait } from "./Portrait"
export { PortraitPlayground } from "./PortraitPlayground"
export { GlyphMedia } from "./Media"
export { GlyphText } from "./Text"
export { GlyphNumber } from "./Number"
export { GlyphWordmark } from "./Wordmark"
export { GlyphLens } from "./Lens"
export { GlyphFigure, type FigureShape } from "./Figure"
export { GlyphMark } from "./Mark"
export {
  useThemeTransition,
  type ThemeTransitionOptions,
  type ThemeTransitionStyle,
} from "./theme-transition"
export { setGlyphsPaused, useGlyphsPaused } from "./motion"
export { deferGlyphEngine } from "./engine/load"
export { FONT_FAMILIES, glyphFontVariables } from "./fonts"
export { LOGO_GLYPHS, TEXT_GLYPHS } from "./charsets"
export {
  CHARSETS,
  CELL_OPTIONS,
  FPS_OPTIONS,
  GLYPH_DEFAULTS,
  MODES,
  PRESETS,
  type Cell,
  type Charset,
  type Fps,
  type GlyphSettings,
  type Mode,
  type Render,
} from "./settings"
