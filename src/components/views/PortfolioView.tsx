import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import {
  countRealizations,
  getPortfolioByGroup,
  portfolioGroups,
  portfolioItems,
} from "@/lib/portfolio"
import { SITE_NAME, absoluteUrl } from "@/lib/site"
import { ROUTES, t, type Locale } from "@/i18n/config"
import { fill } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"

export function PortfolioView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).portfolio

  /**
   * Zbiór realizacji w danych strukturalnych. Świadomie `CreativeWork`, a nie
   * `VideoObject`: ten drugi wymaga daty publikacji i opisu każdego materiału,
   * a tych danych po prostu nie mam — lepiej podać mniej i prawdziwie.
   */
  const portfolioJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: fill(copy.collectionName, { name: SITE_NAME }),
    url: absoluteUrl(ROUTES.portfolio[locale]),
    about: portfolioGroups.map((group) => t(group.label, locale)),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: portfolioItems.length,
      itemListElement: portfolioItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: t(item.title, locale),
          genre: t(item.category, locale),
          image: absoluteUrl(item.poster),
          creator: { "@type": "Person", name: SITE_NAME },
        },
      })),
    },
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd) }}
      />

      <PageHeader
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      {portfolioGroups.map((group, index) => {
        const items = getPortfolioByGroup(group.id)
        if (items.length === 0) return null

        return (
          <section key={group.id} aria-labelledby={group.id}>
            {index > 0 && <Separator className="my-16" />}

            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2
                id={group.id}
                className="text-2xl font-semibold tracking-tight"
              >
                {t(group.label, locale)}
              </h2>
              <p className="text-sm tabular-nums text-muted-foreground">
                {countRealizations(items.length, locale)}
              </p>
            </div>
            <p className="mb-8 max-w-2xl text-muted-foreground leading-relaxed">
              {t(group.description, locale)}
            </p>

            <PortfolioGrid items={items} locale={locale} />
          </section>
        )
      })}

      <Separator className="my-16" />

      <section
        aria-labelledby={copy.ctaId}
        className="rounded-xl border bg-muted/40 p-6 md:p-10"
      >
        <h2 id={copy.ctaId} className="text-2xl font-semibold tracking-tight">
          {copy.ctaHeading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          {copy.ctaBody}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-fit">
            <Link href={ROUTES.contact[locale]}>
              {copy.ctaPrimary}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-fit">
            <Link href={ROUTES.services[locale]}>{copy.ctaSecondary}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
