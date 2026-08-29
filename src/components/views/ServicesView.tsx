import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { formatPrice, packages, process } from "@/lib/services"
import { SITE_NAME, absoluteUrl } from "@/lib/site"
import { ROUTES, t, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"

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
  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: absoluteUrl(ROUTES.services[locale]),
    areaServed: "PL",
    priceRange: "1500-15000 PLN",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: copy.offerCatalog,
      itemListElement: packages.map((pack) => ({
        "@type": "Offer",
        name: t(pack.name, locale),
        description: t(pack.scope, locale),
        priceCurrency: "PLN",
        price: pack.from,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: pack.from,
          priceCurrency: "PLN",
        },
      })),
    },
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />

      <PageHeader
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

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
                  <h3 className="text-xl font-semibold tracking-tight">
                    {t(pack.name, locale)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(pack.scope, locale)}
                  </p>
                </div>
                {pack.highlight && (
                  <Badge variant="secondary">{copy.recurringBadge}</Badge>
                )}
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">
                  {copy.priceFrom}
                </span>
                <span className="text-3xl font-medium tabular-nums">
                  {formatPrice(pack.from, locale)} {copy.currency}
                </span>
                {pack.unit && (
                  <span className="text-sm text-muted-foreground">
                    / {t(pack.unit, locale)}
                  </span>
                )}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {t(pack.items, locale).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {copy.priceNote}
        </p>
      </section>

      <Separator className="my-16" />

      <section aria-labelledby={copy.processId}>
        <h2 id={copy.processId} className="text-2xl font-semibold tracking-tight">
          {copy.processHeading}
        </h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {process.map((step, index) => (
            <li key={t(step.title, locale)} className="flex flex-col gap-3">
              <span className="text-sm tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold">{t(step.title, locale)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(step.detail, locale)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="my-16" />

      <section
        aria-labelledby={copy.quoteId}
        className="rounded-xl border bg-muted/40 p-6 md:p-10"
      >
        <h2 id={copy.quoteId} className="text-2xl font-semibold tracking-tight">
          {copy.quoteHeading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          {copy.quoteBody}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-fit">
            <Link href={ROUTES.contact[locale]}>
              {copy.quotePrimary}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-fit">
            <Link href={ROUTES.about[locale]}>{copy.quoteSecondary}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
