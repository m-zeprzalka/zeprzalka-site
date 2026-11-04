"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

export interface ErrorBoundaryProps {
  /** W komponentach klienckich rzucić można cokolwiek, nie tylko `Error`. */
  error: unknown
  /** Ponowne pobranie i wyrenderowanie segmentu (Next 16.3+; `reset` tylko renderuje). */
  retry: () => void
}

/**
 * Ekran błędu — jedna treść, dwa układy główne. Ładowany leniwie przez
 * `LazyErrorView`: granice błędów są w drzewie każdej trasy, a ten ekran
 * (z `Button`, czyli `cva` i `tailwind-merge`) potrzebny jest dopiero przy błędzie.
 */
export function ErrorView({
  locale,
  error,
  retry,
  documentTitle = false,
}: ErrorBoundaryProps & {
  locale: Locale
  /** `global-error` zastępuje układ, więc tytuł dokumentu podaje sam ekran. */
  documentTitle?: boolean
}) {
  const copy = getSystem(locale).error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      {documentTitle && <title>{copy.title}</title>}
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">{copy.title}</h1>
      <p className="mb-8 text-muted-foreground">{copy.description}</p>
      <Button onClick={() => retry()} variant="default">
        {copy.cta}
      </Button>
    </div>
  )
}
