"use client"

import type { ReactNode } from "react"
import { peekHandlers } from "./peek-trigger"

/** Wiersz wpisu: link, który myszą pokazuje okładkę na marginesie. */
export function PostLink({
  slug,
  href,
  children,
}: {
  slug: string
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      {...peekHandlers(`post:${slug}`)}
      className="i1-row i1-bleed group flex min-h-12 items-baseline gap-4 rounded-fm-lg py-3 text-fm-ink fm-focus"
    >
      {children}
    </a>
  )
}
