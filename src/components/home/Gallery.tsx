import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import { featuredPortfolioItems } from "@/lib/portfolio"
import type { Locale } from "@/i18n/config"
import { getHome } from "@/i18n/content/home"

export function Gallery({ locale }: { locale: Locale }) {
  const copy = getHome(locale).portfolio

  return (
    <section className="flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto">
      <div className="grid gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:sticky top-22 self-start">
          <div>
            <h2 className="text-3xl md:text-4xl md:font-semi-bold font-medium">
              {copy.title}
            </h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              {copy.lead}
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          <PortfolioGrid
            items={featuredPortfolioItems}
            locale={locale}
            className="mt-4"
          />
        </div>
      </div>
    </section>
  )
}
