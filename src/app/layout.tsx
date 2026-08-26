import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Bar } from "@/components/layout/Bar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SITE_URL } from "@/lib/site"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Michał Zeprzałka - Digital Solutions Architect",
    template: "%s | Michał Zeprzałka",
  },
  description:
    "Strony internetowe, aplikacje webowe, design i integracje AI. Ponad 12 lat doświadczenia w tworzeniu rozwiązań webowych i multimedialnych dla biznesu.",
  authors: [{ name: "Michał Zeprzałka", url: SITE_URL }],
  creator: "Michał Zeprzałka",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE_URL,
    title: "Michał Zeprzałka - Digital Solutions Architect",
    description:
      "Strony internetowe, aplikacje webowe, design i integracje AI dla biznesu.",
    siteName: "Michał Zeprzałka - Portfolio i Blog",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Michał Zeprzałka - Digital Solutions Architect",
    description:
      "Strony internetowe, aplikacje webowe, design i integracje AI dla biznesu.",
  },
  // Potwierdzenie własności domeny w Google Search Console i Bing.
  // Tokeny są danymi wdrożeniowymi, nie kodem — wystarczy ustawić zmienne.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Blog - Michał Zeprzałka" },
      ],
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Zmienne krojów muszą siedzieć na <html>: Tailwind v4 ustawia
    // font-family właśnie na tym elemencie, więc deklaracja na <body>
    // była o poziom za nisko i serwis renderował się krojem systemowym.
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollToTop />
          <Bar />
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        {/*
          Pomiar ruchu i Core Web Vitals. Oba skrypty ładują się z tej samej
          domeny (/_vercel/...), nie ustawiają ciasteczek i nie profilują
          użytkowników — nie wymagają więc zgody na ciasteczka.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
