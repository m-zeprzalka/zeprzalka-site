import Link from "next/link"
import { Badge } from "@/app/main-page/_components/ui/badge"
import type { Link as LinkData } from "@/app/main-page/_lib/types"

/**
 * Kategorie i tagi jako plakietki-linki (ten sam kształt co tagi kompetencji).
 * Bez prefetchu — plakietki powtarzają się na listach.
 */
export function TermLinks({
  terms,
  variant = "secondary",
  label,
}: {
  terms: readonly (LinkData & { count?: number })[]
  variant?: "secondary" | "outline"
  /** Nazwa listy dla czytnika (np. „Kategorie”), gdy nie ma nad nią nagłówka. */
  label?: string
}) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {terms.map((term) => (
        <li key={term.href}>
          <Badge asChild variant={variant} size="md">
            <Link href={term.href} prefetch={false}>
              {term.label}
              {term.count !== undefined && (
                <span className="text-muted-foreground tabular-nums">{term.count}</span>
              )}
            </Link>
          </Badge>
        </li>
      ))}
    </ul>
  )
}
