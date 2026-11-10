import { CtaPanel } from "@/components/page/cta-panel"
import { GalleryTile } from "@/components/page/gallery-tile"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumb } from "@/lib/content/pages"
import { getSource, need } from "@/lib/content/source"
import { pageHref } from "@/lib/routes"
import { noOrphans } from "@/lib/text"
import type { Locale } from "@/i18n/config"
import { plural } from "@/i18n/format"
import { portfolioPageSchema } from "@/lib/page-schema"
import { portfolioGroups } from "@/lib/portfolio"

/**
 * Portfolio jako galeria: grupy (produkty, strony, wideo) z opisem i liczbą
 * realizacji, kafle w dwóch kolumnach w naturalnych proporcjach kadrów (start
 * ma ten sam materiał jako indeks z rozwijanymi wierszami).
 */
export function PortfolioPage({ locale }: { locale: Locale }) {
  const { common, copy: strings, pages, groups } = getSource(locale)
  const copy = pages.portfolio
  const description = (id: string) =>
    need(
      portfolioGroups.find((group) => group.id === id),
      `grupa ${id}`
    ).description[locale]

  return (
    <>
      <JsonLd data={portfolioPageSchema(locale)} />
      <PageHeader
        breadcrumb={breadcrumb(locale, common.nav.portfolio)}
        title={copy.title}
        lead={copy.description}
      />
      {groups.map((group, groupIndex) => (
        <Section
          key={group.id}
          id={group.id}
          title={group.label}
          lead={plural(group.works.length, locale, common.plurals.projects)}
        >
          <p className="mt-3 max-w-[60ch] text-pretty text-muted-foreground">
            {noOrphans(description(group.id))}
          </p>
          <div className="mt-8 gap-6 sm:columns-2">
            {group.works.map((work, index) => (
              <GalleryTile
                key={work.slug}
                work={work}
                priority={groupIndex === 0 && index === 0}
                labels={{
                  newTab: common.ui.newTab,
                  play: strings.ui.playVideo,
                  pause: strings.ui.pauseVideo,
                }}
              />
            ))}
          </div>
        </Section>
      ))}
      <CtaPanel
        id={copy.ctaId}
        heading={copy.ctaHeading}
        body={noOrphans(copy.ctaBody)}
        actions={[
          { label: copy.ctaPrimary, href: pageHref("contact", locale) },
          { label: copy.ctaSecondary, href: pageHref("services", locale) },
        ]}
      />
    </>
  )
}
