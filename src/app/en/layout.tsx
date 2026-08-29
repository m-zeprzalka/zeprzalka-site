import type { Metadata, Viewport } from "next"
import { RootShell } from "@/components/layout/RootShell"
import { rootMetadata } from "@/i18n/metadata"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = rootMetadata("en")

/**
 * Układ główny angielskiej wersji serwisu (`/en`). Osobny od polskiego
 * wyłącznie dlatego, że atrybut `lang` na `<html>` ustawia w App Routerze
 * tylko układ główny — reszta jest wspólna, w `RootShell`.
 */
export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootShell locale="en">{children}</RootShell>
}
