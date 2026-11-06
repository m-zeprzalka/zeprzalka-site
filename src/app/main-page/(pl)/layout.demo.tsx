import type { Metadata } from "next"
import { MainShell } from "@/app/main-page/_components/layout/main-shell"
import { rootMetadata, rootViewport } from "@/i18n/metadata"

export const viewport = rootViewport

/** Podgląd nowej wersji: metadane serwisu, ale zawsze poza indeksem wyszukiwarek. */
export const metadata: Metadata = {
  ...rootMetadata("pl"),
  robots: { index: false, follow: false },
}

/** Układ główny polskiej wersji (po przepięciu: `src/app/(pl)/layout.tsx`). */
export default function MainPageLayout({ children }: { children: React.ReactNode }) {
  return <MainShell locale="pl">{children}</MainShell>
}
