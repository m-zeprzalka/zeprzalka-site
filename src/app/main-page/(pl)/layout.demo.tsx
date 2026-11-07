import type { Metadata } from "next"
import { MainShell } from "@/app/main-page/_components/layout/main-shell"
import { preview } from "@/app/main-page/_lib/metadata"
import { rootMetadata, rootViewport } from "@/i18n/metadata"

export const viewport = rootViewport

/** Podgląd nowej wersji: metadane serwisu, ale zawsze poza indeksem wyszukiwarek. */
export const metadata: Metadata = preview(rootMetadata("pl"))

/** Układ główny polskiej wersji (po przepięciu: `src/app/(pl)/layout.tsx`). */
export default function MainPageLayout({ children }: { children: React.ReactNode }) {
  return <MainShell locale="pl">{children}</MainShell>
}
