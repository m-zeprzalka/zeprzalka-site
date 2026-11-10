import { TermLinks } from "@/components/page/term-links"
import { categoryLinks, termLinks } from "@/lib/content/pages"
import { getSource } from "@/lib/content/source"

export function TermLinksExample() {
  const categories = categoryLinks("pl").slice(0, 4)
  const [post] = getSource("pl").posts

  return (
    <div className="grid gap-4">
      {/* Kategorie z liczbą wpisów; bieżąca (strona tej kategorii) — wyróżniona, `aria-current`. */}
      <TermLinks label="Kategorie" terms={categories} current={categories[0]?.href} />
      {/* Tagi wpisu — obrys, „#” przed nazwą. */}
      <TermLinks variant="outline" terms={termLinks("pl", "tags", post?.tags ?? [])} />
    </div>
  )
}
