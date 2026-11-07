import type { Metadata } from "next"
import { PortfolioPage } from "@/app/main-page/_components/views/portfolio-page"
import { preview } from "@/app/main-page/_lib/metadata"
import { portfolioMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = preview(portfolioMetadata("pl"))

/** Po przepięciu: `src/app/(pl)/portfolio/page.tsx`. */
export default function Page() {
  return <PortfolioPage locale="pl" />
}
