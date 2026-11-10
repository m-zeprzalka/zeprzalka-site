import type { Metadata } from "next"
import { PortfolioPage } from "@/components/views/portfolio-page"
import { portfolioMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = portfolioMetadata("en")

export default function Page() {
  return <PortfolioPage locale="en" />
}
