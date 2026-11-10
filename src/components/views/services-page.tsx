import { CheckIcon } from "lucide-react"
import { CtaPanel } from "@/components/page/cta-panel"
import { LabelRow } from "@/components/page/label-row"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { JsonLd } from "@/components/seo/json-ld"
import { IndexAccordion } from "@/components/page/index-accordion"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { breadcrumb } from "@/lib/content/pages"
import { getSource } from "@/lib/content/source"
import { pageHref } from "@/lib/routes"
import { noOrphans } from "@/lib/text"
import type { Locale } from "@/i18n/config"
import { formatNumber } from "@/i18n/format"
import { servicesPageSchema } from "@/lib/page-schema"
import { guarantees, packages, processSteps, type ServicePackage } from "@/lib/services"

/** Cena w wierszu pakietu: „od 15 000 zł”, „490 zł / mies.”, „2900 zł · cena stała”. */
function price(
  pack: ServicePackage,
  locale: Locale,
  copy: ReturnType<typeof getSource>["pages"]["services"]
) {
  const amount = `${formatNumber(pack.from, locale)} ${copy.currency}`
  const unit = pack.unit ? ` / ${pack.unit[locale]}` : ""
  return pack.fixed ? `${amount}${unit} · ${copy.fixedPrice}` : `${copy.priceFrom} ${amount}${unit}`
}

/**
 * Usługi: pakiety jako indeks (nazwa i cena zawsze widoczne, zakres po
 * rozwinięciu — w HTML także zwinięty), kroki współpracy, gwarancje i wycena.
 * Kwoty i pakiety żyją w `src/lib/services.ts`, teksty w `src/i18n`.
 */
export function ServicesPage({ locale }: { locale: Locale }) {
  const { common, pages } = getSource(locale)
  const copy = pages.services
  const badges = { start: copy.startBadge, recurring: copy.recurringBadge }

  return (
    <>
      <JsonLd data={servicesPageSchema(locale)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, common.nav.services)}
        title={copy.title}
        lead={copy.description}
      />

      <Section id={copy.packagesId} title={copy.packagesHeading}>
        <IndexAccordion idPrefix="pakiet-" className="mt-6">
          {packages.map((pack) => (
            // Bez `asChild`: Slot w komponencie klienckim nie przyjmuje elementu z serwera
            // (w trybie dev przychodzi jako leniwa referencja i wiersz znikał po hydratacji).
            <AccordionItem
              key={pack.id}
              id={`pakiet-${pack.id}`}
              value={pack.id}
              className="border-0"
            >
              <article>
                <AccordionTrigger variant="row">
                  <span className="grid flex-1 gap-0.5 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      {pack.name[locale]}
                      {pack.badge && <Badge variant="outline">{badges[pack.badge]}</Badge>}
                    </span>{" "}
                    <span className="text-sm text-foreground tabular-nums sm:text-base">
                      {price(pack, locale, copy)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent forceMount className="grid gap-4 pt-3 pb-6">
                  <p className="text-base text-pretty text-muted-foreground">
                    {noOrphans(pack.scope[locale])}{" "}
                    <span className="whitespace-nowrap">({pack.duration[locale]})</span>
                  </p>
                  <ul className="grid gap-2.5 text-base">
                    {pack.items[locale].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
                        <span className="text-pretty">{noOrphans(item)}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </article>
            </AccordionItem>
          ))}
        </IndexAccordion>
        <p className="mt-6 max-w-[60ch] text-sm text-pretty text-muted-foreground">
          {noOrphans(copy.priceNote)}
        </p>
      </Section>

      <Section id={copy.processId} title={copy.processHeading}>
        <ol className="mt-8 grid gap-8">
          {processSteps.map((step, index) => (
            <li key={step.title[locale]}>
              {/* Numer jest wizualny — kolejność podaje już lista numerowana. */}
              <LabelRow
                label={<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
              >
                <h3 className="font-medium">{step.title[locale]}</h3>
                <p className="mt-1 text-pretty text-muted-foreground">
                  {noOrphans(step.detail[locale])}
                </p>
              </LabelRow>
            </li>
          ))}
        </ol>
      </Section>

      <Section id={copy.guaranteesId} title={copy.guaranteesHeading}>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {guarantees[locale].map((item) => (
            <li key={item} className="flex gap-3">
              <CheckIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <span className="text-pretty">{noOrphans(item)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaPanel
        id={copy.quoteId}
        heading={copy.quoteHeading}
        body={noOrphans(copy.quoteBody)}
        actions={[
          { label: copy.quotePrimary, href: pageHref("contact", locale) },
          { label: copy.quotePortfolio, href: pageHref("portfolio", locale) },
        ]}
      />
    </>
  )
}
