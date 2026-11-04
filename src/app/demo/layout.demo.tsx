import type { Metadata, Viewport } from "next"
import "./demo.css"
import { fontVariables } from "@/app/fonts"
import { ThemeProvider } from "next-themes"

/*
 * Układ główny piaskownicy `/demo` — celowo NIE używa `RootShell` ani
 * `globals.css` serwisu. Własny arkusz (`demo.css`: Tailwind + system „Forma”)
 * ma pełne skanowanie, a arkusz serwisu wyklucza katalogi demo (`@source not`
 * w `globals.css`) — klasy dem nie trafiają więc do CSS produkcji. Kroje te
 * same co w serwisie (`src/app/fonts.ts`). Bez analityki, zawsze noindex.
 */

export const viewport: Viewport = { width: "device-width", initialScale: 1 }

export const metadata: Metadata = {
  title: { default: "Demo", template: "%s · demo" },
  robots: { index: false, follow: false },
}

export default function DemoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
