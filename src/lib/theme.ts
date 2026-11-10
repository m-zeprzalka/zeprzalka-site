/**
 * Kolor paska przeglądarki (`<meta name="theme-color">`) dla motywu — tło strony
 * (`--background` w globals.css). Metadane serwisu podają ciemny, bo ciemny jest
 * domyślny; jasny ustawia skrypt powłoki i przełącznik motywu.
 */
export const THEME_COLOR = { dark: "#0a0a0a", light: "#fafafa" } as const

export function applyThemeColor(theme: string | undefined) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? THEME_COLOR.light : THEME_COLOR.dark)
}
