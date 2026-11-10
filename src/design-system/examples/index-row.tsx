import Link from "next/link"
import { INDEX_ROW } from "@/components/page/index-row"
import { categoryLinks } from "@/lib/content/pages"
import { getSource } from "@/lib/content/source"
import { plural } from "@/i18n/format"

/** Kategorie bloga jako indeks — cały wiersz jest linkiem. */
export function IndexRowExample() {
  const { common } = getSource("pl")

  return (
    <ul className="grid w-full">
      {categoryLinks("pl")
        .slice(0, 4)
        .map((category) => (
          <li key={category.href}>
            <Link href={category.href} className={INDEX_ROW}>
              {category.label}
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {plural(category.count, "pl", common.plurals.articles)}
              </span>
            </Link>
          </li>
        ))}
    </ul>
  )
}
