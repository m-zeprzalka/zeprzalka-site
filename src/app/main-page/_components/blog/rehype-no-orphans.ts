import { noOrphans } from "@/app/main-page/_lib/text"

/** Tyle drzewa hast, ile trzeba do przejścia po tekście. */
interface HastNode {
  type: string
  tagName?: string
  value?: string
  children?: HastNode[]
}

/** Kod zostaje dosłownie — twarda spacja w nim to inny znak przy kopiowaniu. */
const VERBATIM = new Set(["pre", "code", "script", "style"])

/**
 * Polska typografia w treści wpisu: `noOrphans` na każdym węźle tekstu poza kodem —
 * jednoliterowe „w”, „z”, „i” nie zostają na końcu wiersza (ZASADY §7). Działa po
 * rehype-slug: kotwice nagłówków liczą się ze zwykłych spacji.
 */
export function rehypeNoOrphans() {
  const visit = (node: HastNode) => {
    if (node.type === "text" && node.value) node.value = noOrphans(node.value)
    if (node.type === "element" && VERBATIM.has(node.tagName ?? "")) return
    node.children?.forEach(visit)
  }
  return (tree: HastNode) => visit(tree)
}
