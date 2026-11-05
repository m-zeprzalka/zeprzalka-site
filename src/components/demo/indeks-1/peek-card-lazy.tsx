"use client"

import { useId, useState } from "react"
import dynamic from "next/dynamic"
import { useColumnFit } from "./hooks"
import { mutePeek } from "./peek-store"

const load = () => import("./PeekCard").then((module) => module.PeekCard)

/** Karta pod słowem jako osobny fragment JS (Radix Popover + treść podglądu). */
export const PeekCardLazy = dynamic(load, { ssr: false })

/** Wczytanie z wyprzedzeniem — pierwsze dotknięcie frazy nie czeka. */
export function preloadPeekCard() {
  void load()
}

/**
 * Stan karty pod słowem dla frazy albo liczby: wyzwalacz dostaje gotowe
 * atrybuty (ARIA, `data-state` dla stylów), karta montuje się przy pierwszym
 * otwarciu i staje na szerokości kolumny (pomiar przy każdym otwarciu).
 * Otwarta karta wycisza podgląd na marginesie.
 */
export function usePeekCard<T extends HTMLElement>(key: string, { row = false } = {}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { trigger, fit, measure } = useColumnFit<T>({ row })
  const id = useId()

  function change(next: boolean) {
    if (next) {
      measure()
      setMounted(true)
    }
    setOpen(next)
    mutePeek(next ? key : null)
  }

  return {
    open,
    change,
    mounted,
    fit,
    id,
    trigger,
    triggerProps: {
      ref: trigger,
      "aria-haspopup": "dialog" as const,
      "aria-expanded": open,
      "aria-controls": open ? id : undefined,
      "data-state": open ? "open" : "closed",
      onClick: () => change(!open),
    },
  }
}
