import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Bar } from "@/components/layout/Bar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

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
  title: {
    default: "Michał Zeprzałka - Digital Solutions Architect",
    template: "%s | Michał Zeprzałka",
  },
  description:
    "Ponad 12+ lat doświadczenia w tworzeniu innowacyjnych rozwiązań webowych i multimedialnych",
  keywords: [
    "web development",
    "digital architect",
    "design",
    "full-stack",
    "design systems",
    "UX",
    "UI",
    "front-end",
    "graphic design",
    "branding",
    "digital solutions",
  ],
  authors: [{ name: "Michał Zeprzałka" }],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    title: "Michał Zeprzałka - Digital Solutions Architect",
    description: "Przekształcam ambitne wizje w cyfrową rzeczywistość",
    siteName: "Michał Zeprzałka Portfolio",
  },
  metadataBase: new URL("https://zeprzalka.com"), // Twoja domena
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Michał Zeprzałka - Digital Solutions Architect",
    description: "Przekształcam ambitne wizje w cyfrową rzeczywistość",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Bar />
          <Header />
          <main role="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
