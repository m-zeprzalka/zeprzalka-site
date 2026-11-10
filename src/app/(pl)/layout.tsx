import type { Metadata } from "next"
import { MainShell } from "@/components/layout/main-shell"
import { rootMetadata, rootViewport } from "@/i18n/metadata"

export const viewport = rootViewport

export const metadata: Metadata = rootMetadata("pl")

/**
 * Układ główny polskiej wersji serwisu (katalog główny adresu). Bliźniaczy układ
 * angielski stoi w `src/app/en/layout.tsx`; wspólny szkielet dokumentu trzyma
 * `MainShell`, żeby wersje nie mogły się rozjechać.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <MainShell locale="pl">{children}</MainShell>
}
