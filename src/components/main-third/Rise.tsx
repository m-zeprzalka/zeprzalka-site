import { createElement, type CSSProperties, type HTMLAttributes } from "react"

type RiseTag =
  | "div"
  | "span"
  | "p"
  | "h2"
  | "h3"
  | "li"
  | "article"
  | "figure"
  | "header"
  | "section"

interface RiseProps extends HTMLAttributes<HTMLElement> {
  as?: RiseTag
  /** Indeks w grupie — przesuwa zakres animacji, dając schodkowe wejście. */
  i?: number
}

/**
 * Wejście elementu przy scrollu — **bez JavaScriptu**. Znacznik `data-rise`
 * podpina animację sterowaną osią przewijania (`animation-timeline: view()`).
 * Przeglądarki bez wsparcia (i użytkownicy z `prefers-reduced-motion`)
 * dostają treść od razu widoczną — patrz main-third.css.
 *
 * Server Component: nie dokłada ani bajta do bundla klienta.
 */
export function Rise({ as = "div", i = 0, style, ...props }: RiseProps) {
  return createElement(as, {
    "data-rise": "",
    style: { "--rise-i": i, ...style } as CSSProperties,
    ...props,
  })
}
