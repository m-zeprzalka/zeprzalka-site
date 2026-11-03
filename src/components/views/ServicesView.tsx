import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { CtaPanel } from "@/components/CtaPanel"
import { packages, processSteps } from "@/lib/services"
import { JsonLd } from "@/components/JsonLd"
import { absoluteUrl } from "@/lib/site"
import { PERSON_ID, breadcrumbSchema, graph } from "@/lib/schema"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getMeta } from "@/i18n/content/meta"
import { getPages } from "@/i18n/content/pages"
import { formatNumber } from "@/i18n/format"

/**
 * Strona ofertowa. Jeden układ dla obu języków — pakiety i kwoty siedzą
 * w `src/lib/services.ts`, więc korekta stawki to nadal zmiana jednej liczby.
 */
export function ServicesView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).services

  /**
   * Katalog usług w danych strukturalnych. Wyszukiwarka dostaje wprost, co
   * i za ile jest oferowane, zamiast domyślać się z treści strony.
   */
  const offerJsonLd = graph(
    {
      // `Service` świadczona przez osobę (Person z @id), a nie `ProfessionalService`:
      // ten drugi to podtyp LocalBusiness i wymaga adresu siedziby.
      "@type": "Service",
      "@id": `${absoluteUrl(ROUTES.services[locale])}#service`,
      name: getMeta(locale).services.title,
      description: getMeta(locale).root.ogDescription,
      url: absoluteUrl(ROUTES.services[locale]),
      areaServed: "PL",
      provider: { "@id": PERSON_ID },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: copy.offerCatalog,
        itemListElement: packages.map((pack) => ({
          "@type": "Offer",
          name: pack.name[locale],
          description: pack.scope[locale],
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: pack.from,
            priceCurrency: "PLN",
          },
        })),
      },
    },
    breadcrumbSchema(locale, [
      { name: getCommon(locale).nav.services, path: ROUTES.services[locale] },
    ])
  )

  return (
    <div className="page-shell">
      <JsonLd data={offerJsonLd} />

      <PageHeader badge={copy.badge} title={copy.title} description={copy.description} />

      <section aria-labelledby={copy.packagesId}>
        <h2 id={copy.packagesId} className="sr-only">
          {copy.packagesHeading}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pack) => (
            <article
              key={pack.id}
              className={
                pack.highlight
                  ? "flex flex-col rounded-xl border-2 border-primary/40 p-6 md:p-8"
                  : "flex flex-col rounded-xl border p-6 md:p-8"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{pack.name[locale]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pack.scope[locale]}</p>
                </div>
                {pack.highlight && <Badge variant="secondary">{copy.recurringBadge}</Badge>}
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">{copy.priceFrom}</span>
                <span className="text-3xl font-medium tabular-nums">
                  {formatNumber(pack.from, locale)} {copy.currency}
                </span>
                {pack.unit && (
                  <span className="text-sm text-muted-foreground">/ {pack.unit[locale]}</span>
                )}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {pack.items[locale].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{copy.priceNote}</p>
      </section>

      <Separator className="my-16" />

      <section aria-labelledby={copy.processId}>
        <h2 id={copy.processId} className="text-2xl font-semibold tracking-tight">
          {copy.processHeading}
        </h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.title[locale]} className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold">{step.title[locale]}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.detail[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="my-16" />

      <CtaPanel
        id={copy.quoteId}
        heading={copy.quoteHeading}
        body={copy.quoteBody}
        actions={[
          { href: ROUTES.contact[locale], label: copy.quotePrimary },
          { href: ROUTES.portfolio[locale], label: copy.quotePortfolio, variant: "outline" },
          { href: ROUTES.about[locale], label: copy.quoteSecondary, variant: "ghost" },
        ]}
      />
    </div>
  )
}
