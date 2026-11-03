"use client"

import "./globals.css"
import { ErrorView, type ErrorBoundaryProps } from "@/components/system/ErrorView"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

/**
 * Błąd w samym układzie głównym (`RootShell`). Zastępuje układ, więc musi mieć
 * własne `<html>`, `<body>` i style — bez tego Next pokazałby swój angielski,
 * nieostylowany ekran. Metadane nie działają w komponencie klienckim, stąd `<title>`.
 */
export default function GlobalError(props: ErrorBoundaryProps) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="antialiased">
        <title>{getSystem(DEFAULT_LOCALE).error.title}</title>
        <ErrorView locale={DEFAULT_LOCALE} {...props} />
      </body>
    </html>
  )
}
