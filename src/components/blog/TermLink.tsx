import type { ComponentProps, ReactNode } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

/**
 * Kategoria albo tag jako link w kształcie plakietki — jeden komponent dla
 * wpisu, karty wpisu i indeksu kategorii. Link jest samą plakietką
 * (`asChild`), więc stany hover i fokus należą do elementu, który je dostaje.
 */
export function TermLink({
  href,
  children,
  variant = "outline",
  className,
}: {
  href: string
  children: ReactNode
  variant?: ComponentProps<typeof Badge>["variant"]
  className?: string
}) {
  return (
    <Badge asChild variant={variant} className={className}>
      {/* Bez prefetchu: plakietki powtarzają się na listach (np. „AI” ×7 na /blog). */}
      <Link href={href} prefetch={false}>
        {children}
      </Link>
    </Badge>
  )
}
