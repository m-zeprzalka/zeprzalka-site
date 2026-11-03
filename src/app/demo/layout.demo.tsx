import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./demo.css"
import { ThemeProvider } from "@/components/theme-provider"

/*
 * Układ główny piaskownicy `/demo` — celowo NIE używa `RootShell` ani
 * `globals.css` serwisu. Własny arkusz (`demo.css`, zamrożona kopia tokenów
 * z 3 listopada 2026) ma pełne skanowanie Tailwinda, a arkusz serwisu wyklucza
 * katalogi demo (`@source not` w `globals.css`) — klasy dem nie trafiają więc
 * do CSS produkcji. Bez analityki, zawsze noindex.
 */
const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] })
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] })

export const viewport: Viewport = { width: "device-width", initialScale: 1 }

export const metadata: Metadata = {
  title: { default: "Demo", template: "%s · demo" },
  robots: { index: false, follow: false },
}

export default function DemoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
