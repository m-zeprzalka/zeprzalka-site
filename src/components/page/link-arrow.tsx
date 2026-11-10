import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Strzałka linku (↗) — znak każdego przejścia w serwisie: podstrona, wpis, realizacja,
 * profil, adres zewnętrzny. Na najechaniu albo fokusie linku (`group/link` na nim) wychyla
 * się o 2 px w swoją stronę. Ozdoba — czytnik czyta sam link (lucide dokłada `aria-hidden`).
 */
export function LinkArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRightIcon
      className={cn(
        "size-4 shrink-0 transition-[translate,color] duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-focus-visible/link:translate-x-0.5 group-focus-visible/link:-translate-y-0.5",
        className
      )}
    />
  )
}
