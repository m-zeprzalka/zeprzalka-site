"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

/** Ekran błędu — jedna treść, dwa układy główne. */
export function ErrorView({
  locale,
  error,
  reset,
}: {
  locale: Locale
  error: Error & { digest?: string }
  reset: () => void
}) {
  const copy = getSystem(locale).error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">{copy.title}</h1>
      <p className="mb-8 text-muted-foreground">{copy.description}</p>
      <Button onClick={reset} variant="default">
        {copy.cta}
      </Button>
    </div>
  )
}
