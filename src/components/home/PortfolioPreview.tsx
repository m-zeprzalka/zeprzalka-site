import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import { HomeSection } from "@/components/home/HomeSection"
import { featuredPortfolioItems } from "@/lib/portfolio"
import type { Locale } from "@/i18n/config"
import { getHome } from "@/i18n/content/home"

/** Zajawka portfolio: realizacje oznaczone `featured` w src/lib/portfolio.ts. */
export function PortfolioPreview({ locale }: { locale: Locale }) {
  const copy = getHome(locale).portfolio

  return (
    <HomeSection title={copy.title} lead={copy.lead} gridClassName="gap-6 lg:gap-8 xl:gap-10">
      <PortfolioGrid items={featuredPortfolioItems} locale={locale} className="mt-4" />
    </HomeSection>
  )
}
