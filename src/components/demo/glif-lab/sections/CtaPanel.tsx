"use client"

import type { ReactNode } from "react"
import { useVariant } from "../lab/store"

/** Panel CTA w kolorze trybu wariantu E (atrament, odwrócony, Matrix) — tło maluje CSS. */
export function CtaPanel({ children }: { children: ReactNode }) {
  const { tone } = useVariant("cta")
  return (
    <div
      data-tone={tone}
      className="gll-cta relative isolate grid overflow-hidden rounded-fm-4xl lg:min-h-[32rem] lg:grid-cols-12"
    >
      {children}
    </div>
  )
}
