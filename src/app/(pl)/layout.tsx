import type { Metadata, Viewport } from "next"
import { RootShell } from "@/components/layout/RootShell"
import { rootMetadata } from "@/i18n/metadata"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = rootMetadata("pl")

/**
 * Układ główny polskiej wersji serwisu (katalog główny adresu).
 * Bliźniaczy układ angielski stoi w `src/app/en/layout.tsx`; wspólną treść
 * obu trzyma `RootShell`, żeby nie mogły się rozjechać.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootShell locale="pl">{children}</RootShell>
}
