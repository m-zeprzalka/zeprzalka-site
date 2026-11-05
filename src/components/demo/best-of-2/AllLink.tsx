import { ArrowUpRight } from "lucide-react"

/**
 * Minimalny link do pełnej strony („Wszystkie realizacje”, „Wszystkie artykuły”)
 * — bez licznika (właściciel: liczby realizacji i wpisów są zbędne). Pigułka
 * pojawia się dopiero na najechaniu; cel dotyku 44 px, wcięcia symetryczne.
 */
export function AllLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group -mx-4 inline-flex h-11 items-center gap-1.5 rounded-full ps-4 pe-3.5 text-sm font-medium text-fm-ink fm-focus transition-colors duration-150 hover:bg-fm-fill"
    >
      {label}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 text-fm-ink-3 transition-[translate,color] duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
      />
    </a>
  )
}
