import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { CtaPanel } from "@/components/CtaPanel"
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid"
import { getPortfolioByGroup, portfolioGroups } from "@/lib/portfolio"
import { JsonLd } from "@/components/JsonLd"
import { portfolioPageSchema } from "@/lib/page-schema"
import { ROUTES, type Locale } from "@/i18n/config"
import { plural } from "@/i18n/format"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"

export function PortfolioView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).portfolio
  const common = getCommon(locale)

  return (
    <div className="page-shell">
      <JsonLd data={portfolioPageSchema(locale)} />

      <PageHeader badge={copy.badge} title={copy.title} description={copy.description} />

      {portfolioGroups.map((group, index) => {
        const items = getPortfolioByGroup(group.id)
        if (items.length === 0) return null

        return (
          <section key={group.id} aria-labelledby={group.id}>
            {index > 0 && <Separator className="my-16" />}

            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 id={group.id} className="text-2xl font-semibold tracking-tight">
                {group.label[locale]}
              </h2>
              <p className="text-sm text-muted-foreground tabular-nums">
                {plural(items.length, locale, common.plurals.projects)}
              </p>
            </div>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              {group.description[locale]}
            </p>

            <PortfolioGrid
              items={items}
              locale={locale}
              priorityCount={index === 0 ? 2 : 0}
              // Same zrzuty (bez wideo) mają równy kadr 16:10 — trzy kolumny masonry
              // zostawiały przy czterech kaflach pustą kolumnę; dwie dają równy blok.
              className={items.every((item) => !item.video) ? "lg:columns-2" : undefined}
            />
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
