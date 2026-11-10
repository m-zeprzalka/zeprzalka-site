"use client"

import { useEffect } from "react"
import { RotateCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

export interface ErrorBoundaryProps {
  /** W komponentach klienckich rzucić można cokolwiek, nie tylko `Error`. */
  error: unknown
  /** Ponowne pobranie i wyrenderowanie segmentu (Next 16.3+). */
  retry: () => void
}

/**
 * Ekran błędu w powłoce serwisu (nagłówek i stopka zostają) — ten sam
 * stopień i rytm co nagłówek podstrony. Ładowany leniwie (`error.tsx` trasy):
 * granica błędu jest w drzewie każdej trasy, a ekran potrzebny dopiero przy błędzie.
 * Teksty z małego `content/system.ts` — wyjątek z AGENTS.md dla granic błędów.
 */
export function ErrorView({ locale, error, retry }: ErrorBoundaryProps & { locale: Locale }) {
  const copy = getSystem(locale).error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div role="alert" className="column pt-14 md:pt-24">
      <div className="text-display">
        <h1>{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>
      <Button size="lg" className="mt-8" onClick={retry}>
        <RotateCwIcon />
        {copy.cta}
      </Button>
    </div>
  )
}
