import { mdxComponents } from "@/app/main-page/_components/blog/mdx-components"
import "@/app/main-page/_components/blog/article.css"
import { readExample } from "@/app/main-page/_design-system/example"
import { renderMdx } from "@/lib/mdx"

/**
 * Próbka wpisu: plik `examples/article.mdx` tym samym torem co wpis na blogu (`renderMdx`
 * z komponentami MDX), w `div.article` — typografia i bloki kodu dokładnie jak we wpisie.
 */
export async function ArticleSample() {
  const { content } = await renderMdx(readExample("article.mdx"), mdxComponents("pl"))
  return <div className="article w-full">{content}</div>
}
