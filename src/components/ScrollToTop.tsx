"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Przy przejściu na nową stronę App Router przewija do pierwszego zmienionego
 * segmentu — u nas to `<main>` pod przyklejonym nagłówkiem, więc strona
 * lądowała przewinięta o wysokość nagłówka („skok"). Ten komponent wymusza
 * start od samej góry.
 *
 * Wcześniej robił to bezwarunkowo, co psuło dwie rzeczy, które przeglądarka
 * robi sama dobrze: powrót przyciskiem „wstecz" na zapamiętaną pozycję listy
 * i wejście z linku z kotwicą (`/blog/wpis#sekcja`). Teraz pomija:
 * - pierwsze wyrenderowanie (przeładowanie i wejście z zewnątrz) — porównujemy
 *   z poprzednią ścieżką, więc podwójny efekt w StrictMode niczego nie przewija,
 * - nawigację wstecz/naprzód (zdarzenie `popstate`) — zapamiętujemy, dokąd
 *   prowadziła, i czyścimy zapis przy każdej zmianie strony, żeby `popstate`
 *   samej kotwicy (spis treści → „wstecz”) nie zatrzymał przewinięcia
 *   przy następnym, zwykłym przejściu,
 * - adresy z kotwicą.
 */
export function ScrollToTop() {
  const pathname = usePathname()
  const previous = useRef(pathname)
  const traversedTo = useRef<string | null>(null)

  useEffect(() => {
    const onPopState = () => {
      traversedTo.current = window.location.pathname
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    const isTraversal = traversedTo.current === pathname
    traversedTo.current = null
    if (isTraversal || window.location.hash) return

    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
