import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { CtaPanel } from "@/components/CtaPanel"
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import {
  countRealizations,
  getPortfolioByGroup,
  portfolioGroups,
  portfolioItems,
} from "@/lib/portfolio"
import { JsonLd } from "@/components/JsonLd"
import { SITE_NAME, absoluteUrl } from "@/lib/site"
import { PERSON_ID, breadcrumbSchema, graph } from "@/lib/schema"
import { INTL_LOCALE, ROUTES, type Locale } from "@/i18n/config"
import { fill } from "@/i18n/format"
import { getPages } from "@/i18n/content/pages"

export function PortfolioView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).portfolio

  /**
   * Zbiór realizacji w danych strukturalnych. Świadomie `CreativeWork`, a nie
   * `VideoObject`: ten drugi wymaga daty publikacji i opisu każdego materiału,
   * a tych danych po prostu nie mam — lepiej podać mniej i prawdziwie.
   */
  const portfolioJsonLd = graph(
    {
    "@type": "CollectionPage",
    inLanguage: INTL_LOCALE[locale],
    author: { "@id": PERSON_ID },
    name: fill(copy.collectionName, { name: SITE_NAME }),
    url: absoluteUrl(ROUTES.portfolio[locale]),
    about: portfolioGroups.map((group) => group.label[locale]),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: portfolioItems.length,
      itemListElement: portfolioItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: item.title[locale],
          genre: item.category[locale],
          image: absoluteUrl(item.poster),
          creator: { "@id": PERSON_ID },
        },
      })),
    },
    },
    breadcrumbSchema(locale, [{ name: copy.title, path: ROUTES.portfolio[locale] }])
  )

  return (
    <div className="page-shell">
      <JsonLd data={portfolioJsonLd} />

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
                {group.label[locale]}
              </h2>
              <p className="text-sm tabular-nums text-muted-foreground">
                {countRealizations(items.length, locale)}
              </p>
            </div>
            <p className="mb-8 max-w-2xl text-muted-foreground leading-relaxed">
              {group.description[locale]}
            </p>

            <PortfolioGrid items={items} locale={locale} />
          </section>
        )
      })}

      <Separator className="my-16" />

      <CtaPanel
        id={copy.ctaId}
        heading={copy.ctaHeading}
        body={copy.ctaBody}
        actions={[
          { href: ROUTES.contact[locale], label: copy.ctaPrimary },
          { href: ROUTES.services[locale], label: copy.ctaSecondary, variant: "outline" },
        ]}
      />
    </div>
  )
}
