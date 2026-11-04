"use client"

import "./globals.css"
import { fontVariables } from "./fonts"
import type { ErrorBoundaryProps } from "@/components/system/ErrorView"
import { LazyErrorView } from "@/components/system/LazyErrorView"
import { DEFAULT_LOCALE } from "@/i18n/config"

/**
 * Błąd w samym układzie głównym (`RootShell`). Zastępuje układ, więc musi mieć
 * własne `<html>`, `<body>`, style i kroje — bez tego Next pokazałby swój
 * angielski, nieostylowany ekran. Motyw aplikacji tu nie działa, więc ekran ma
 * motyw domyślny serwisu (ciemny); tytuł dokumentu podaje `ErrorView`.
 */
export default function GlobalError(props: ErrorBoundaryProps) {
  return (
    <html lang={DEFAULT_LOCALE} className={`${fontVariables} dark`}>
      <body className="antialiased">
        <LazyErrorView locale={DEFAULT_LOCALE} documentTitle {...props} />
      </body>
    </html>
  )
}
