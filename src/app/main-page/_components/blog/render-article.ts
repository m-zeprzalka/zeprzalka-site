import "server-only"
import type { Locale } from "@/i18n/config"
import { renderMdx } from "@/lib/mdx"
import { mdxComponents } from "./mdx-components"
import { rehypeNoOrphans } from "./rehype-no-orphans"

/**
 * Bloki ` ```mdx ` kolorujemy gramatyką Markdownu: highlight.js nie zna MDX, a jego
 * Markdown barwi nagłówki, pogrubienia, linki i — przez `xml` — znaczniki komponentów.
 */
const HIGHLIGHT = { aliases: { markdown: ["mdx"] } }

/**
 * Treść MDX nowej wersji — jeden tor dla wpisu i design systemu: komponenty MDX
 * (`mdxComponents`), spis nagłówków, składnia także w blokach `mdx` i polska typografia
 * (bez sierot) w tekście poza kodem.
 */
export function renderArticle(source: string, locale: Locale) {
  return renderMdx(source, mdxComponents(locale), {
    highlight: HIGHLIGHT,
    rehypePlugins: [rehypeNoOrphans],
  })
}
