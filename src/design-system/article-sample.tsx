import "@/components/blog/article.css"
import { renderArticle } from "@/components/blog/render-article"
import { readExample } from "@/design-system/example"

/**
 * Próbka wpisu: plik `examples/article.mdx` tym samym torem co wpis na blogu
 * (`renderArticle`), w `div.article` — typografia i bloki kodu dokładnie jak we wpisie.
 */
export async function ArticleSample() {
  const { content } = await renderArticle(readExample("article.mdx"), "pl")
  return <div className="article w-full">{content}</div>
}
