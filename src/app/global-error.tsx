"use client"

import "./globals.css"
import { fontVariables } from "./fonts"
import { ErrorView, type ErrorBoundaryProps } from "@/components/views/error-view"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { getSystem } from "@/i18n/content/system"

/**
 * Błąd w samym układzie głównym (`MainShell`). Zastępuje układ, więc musi mieć własne
 * `<html>`, `<body>`, style i kroje — bez tego Next pokazałby swój angielski, nieostylowany
 * ekran. Motyw aplikacji tu nie działa, więc ekran ma motyw domyślny serwisu (ciemny);
 * tytuł dokumentu React przenosi do `<head>`.
 */
export default function GlobalError(props: ErrorBoundaryProps) {
  return (
    <html lang={DEFAULT_LOCALE} className={`dark ${fontVariables}`} style={{ colorScheme: "dark" }}>
      <body className="font-sans antialiased">
        <title>{getSystem(DEFAULT_LOCALE).error.title}</title>
        <ErrorView locale={DEFAULT_LOCALE} {...props} />
      </body>
    </html>
  )
}
