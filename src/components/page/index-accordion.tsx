"use client"

import type { ReactNode } from "react"
import { Accordion } from "@/components/ui/accordion"
import { keepInView } from "@/lib/keep-in-view"

/**
 * Akordeon indeksu na podstronie (pakiety usług): wiersze renderuje serwer, a ta
 * wyspa tylko pilnuje, żeby otwierany wiersz został w kadrze (`keepInView`) — jak
 * listy na starcie. Wiersz ma `id` = `${idPrefix}${value}`.
 */
export function IndexAccordion({
  idPrefix,
  className,
  children,
}: {
  idPrefix: string
  className?: string
  children: ReactNode
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className={className}
      onValueChange={(value) => {
        const item = value ? document.getElementById(`${idPrefix}${value}`) : null
        if (item) keepInView(item)
      }}
    >
      {children}
    </Accordion>
  )
}
