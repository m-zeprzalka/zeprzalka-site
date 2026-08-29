"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

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
  const copy = getCommon(locale).error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.title}</h2>
      <p className="text-muted-foreground mb-8">
        {copy.description}
      </p>
      <Button onClick={reset} variant="default">{copy.cta}</Button>
    </div>
  )
}
