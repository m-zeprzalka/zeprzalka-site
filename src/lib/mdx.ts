import "server-only"
import type { ReactElement } from "react"
import { compileMDX, type MDXRemoteProps } from "next-mdx-remote/rsc"
import rehypeHighlight, { type Options as HighlightOptions } from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import remarkEmoji from "remark-emoji"
import remarkGfm from "remark-gfm"

/** Nagłówek wpisu w spisie treści — `id` nadaje rehype-slug. */
export interface Heading {
  id: string
  level: 2 | 3 | 4
  text: string
}

/** Tyle drzewa hast, ile potrzeba do zebrania nagłówków. */
interface HastNode {
  type: string
  tagName?: string
  properties?: { id?: unknown }
  value?: string
  children?: HastNode[]
}

const HEADING_LEVEL: Record<string, Heading["level"]> = { h2: 2, h3: 3, h4: 4 }

function textOf(node: HastNode): string {
  return node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(textOf).join("")
}

/**
 * Spis treści powstaje z tego samego drzewa, które trafia na stronę — po
 * rehype-slug, więc `id` w spisie i w artykule są tym samym napisem.
 * (Wcześniej spis liczył osobny parser na wyrażeniach regularnych i rozjeżdżał
 * się z artykułem przy zagnieżdżonych blokach kodu i kodzie w nagłówkach.)
 */
function rehypeCollectHeadings({ into }: { into: Heading[] }) {
  const visit = (node: HastNode) => {
    const level = node.tagName ? HEADING_LEVEL[node.tagName] : undefined
    const id = node.properties?.id
    if (level && typeof id === "string") {
      into.push({ id, level, text: textOf(node).trim() })
      return
    }
    node.children?.forEach(visit)
  }
  return (tree: HastNode) => visit(tree)
}

type RehypePlugins = NonNullable<
  NonNullable<NonNullable<MDXRemoteProps["options"]>["mdxOptions"]>["rehypePlugins"]
>

/**
 * Kompiluje treść wpisu i zwraca ją razem ze spisem nagłówków. `highlight` — opcje
 * kolorowania składni (np. aliasy języków); bez nich domyślne rehype-highlight.
 * `rehypePlugins` — dodatkowe kroki po wbudowanych (kotwice, spis, składnia).
 */
export async function renderMdx(
  source: string,
  components: MDXRemoteProps["components"],
  {
    highlight,
    rehypePlugins = [],
  }: { highlight?: HighlightOptions; rehypePlugins?: RehypePlugins } = {}
): Promise<{ content: ReactElement; headings: Heading[] }> {
  const headings: Heading[] = []
  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkEmoji],
        rehypePlugins: [
          rehypeSlug,
          [rehypeCollectHeadings, { into: headings }],
          [rehypeHighlight, highlight ?? {}],
          ...rehypePlugins,
        ],
      },
    },
  })
  return { content, headings }
}
