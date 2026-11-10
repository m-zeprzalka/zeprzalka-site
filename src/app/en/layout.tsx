import type { Metadata } from "next"
import { MainShell } from "@/components/layout/main-shell"
import { rootMetadata, rootViewport } from "@/i18n/metadata"

export const viewport = rootViewport

export const metadata: Metadata = rootMetadata("en")

/**
 * Układ główny angielskiej wersji serwisu (`/en`). Osobny od polskiego wyłącznie
 * dlatego, że atrybut `lang` na `<html>` ustawia w App Routerze tylko układ główny —
 * reszta jest wspólna, w `MainShell`.
 */
export default function EnRootLayout({ children }: LayoutProps<"/en">) {
  return <MainShell locale="en">{children}</MainShell>
}
