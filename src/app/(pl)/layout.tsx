import type { Metadata } from "next"
import { RootShell } from "@/components/layout/RootShell"
import { rootMetadata, rootViewport } from "@/i18n/metadata"

export const viewport = rootViewport

export const metadata: Metadata = rootMetadata("pl")

/**
 * Układ główny polskiej wersji serwisu (katalog główny adresu).
 * Bliźniaczy układ angielski stoi w `src/app/en/layout.tsx`; wspólną treść
 * obu trzyma `RootShell`, żeby nie mogły się rozjechać.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <RootShell locale="pl">{children}</RootShell>
}
