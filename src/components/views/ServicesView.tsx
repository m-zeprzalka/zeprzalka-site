import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { CtaPanel } from "@/components/CtaPanel"
import { guarantees, packages, processSteps } from "@/lib/services"
import { JsonLd } from "@/components/JsonLd"
import { servicesPageSchema } from "@/lib/page-schema"
import { ROUTES, type Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"
import { formatNumber } from "@/i18n/format"

/**
 * Strona ofertowa. Jeden układ dla obu języków — pakiety i kwoty siedzą
 * w `src/lib/services.ts`, więc korekta stawki to nadal zmiana jednej liczby.
 */
export function ServicesView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).services
  const badges = { start: copy.startBadge, recurring: copy.recurringBadge }

  return (
    <div className="page-shell">
      <JsonLd data={servicesPageSchema(locale)} />

      <PageHeader badge={copy.badge} title={copy.title} description={copy.description} />

      <section aria-labelledby={copy.packagesId}>
        <h2 id={copy.packagesId} className="sr-only">
          {copy.packagesHeading}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pack) => (
            <article
              key={pack.id}
              className={cn(
                "flex flex-col rounded-xl border p-6 md:p-8",
                pack.badge === "start" && "border-2 border-primary/40"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{pack.name[locale]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pack.scope[locale]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pack.duration[locale]}</p>
                </div>
                {pack.badge && <Badge variant="secondary">{badges[pack.badge]}</Badge>}
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                {!pack.fixed && (
                  <span className="text-sm text-muted-foreground">{copy.priceFrom}</span>
                )}
                <span className="text-3xl font-medium tabular-nums">
                  {formatNumber(pack.from, locale)} {copy.currency}
                </span>
                {pack.unit && (
                  <span className="text-sm text-muted-foreground">/ {pack.unit[locale]}</span>
                )}
                {pack.fixed && (
                  <span className="text-sm text-muted-foreground">{copy.fixedPrice}</span>
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
              {/* Numer jest wizualny — kolejność kroków podaje już lista numerowana. */}
              <span aria-hidden="true" className="text-sm text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold">{step.title[locale]}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.detail[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="my-16" />

      <section aria-labelledby={copy.guaranteesId}>
        <h2 id={copy.guaranteesId} className="text-2xl font-semibold tracking-tight">
          {copy.guaranteesHeading}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {guarantees[locale].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
        </ul>
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
