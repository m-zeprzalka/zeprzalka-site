import type { Metadata } from "next"
import { PortfolioView } from "@/components/views/PortfolioView"
import { portfolioMetadata } from "@/i18n/page-metadata"

export const metadata: Metadata = portfolioMetadata("en")

export default function PortfolioPage() {
  return <PortfolioView locale="en" />
}
