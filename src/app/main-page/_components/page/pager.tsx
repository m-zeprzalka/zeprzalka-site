import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/main-page/_components/ui/pagination"
import { paginationRange } from "@/lib/blog-pages"

/**
 * Strony archiwum (`/blog`, `/blog/strona/2`…): zawsze pierwsza, ostatnia
 * i sąsiedzi bieżącej, w lukach wielokropek. Adresy liczy `href`.
 */
export function Pager({
  current,
  total,
  href,
  labels,
}: {
  current: number
  total: number
  href: (page: number) => string
  labels: { aria: string; previous: string; next: string }
}) {
  if (total < 2) return null
  return (
    <Pagination aria-label={labels.aria} className="column mt-12 justify-start">
      <PaginationContent className="-ms-2.5 flex-wrap">
        <PaginationItem>
          <PaginationPrevious
            label={labels.previous}
            href={current > 1 ? href(current - 1) : undefined}
            aria-hidden={current <= 1 || undefined}
            className="aria-hidden:pointer-events-none aria-hidden:opacity-40"
          />
        </PaginationItem>
        {paginationRange(current, total).map((item, index) => (
          <PaginationItem key={item === "ellipsis" ? `ellipsis-${index}` : item}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={href(item)} isActive={item === current}>
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            label={labels.next}
            href={current < total ? href(current + 1) : undefined}
            aria-hidden={current >= total || undefined}
            className="aria-hidden:pointer-events-none aria-hidden:opacity-40"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
