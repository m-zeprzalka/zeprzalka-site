import { CtaPanel } from "@/app/main-page/_components/page/cta-panel"
import { GalleryTile } from "@/app/main-page/_components/page/gallery-tile"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { Section } from "@/app/main-page/_components/page/section"
import { SectionNav } from "@/app/main-page/_components/layout/section-nav"
import { JsonLd } from "@/app/main-page/_components/seo/json-ld"
import { SECTION } from "@/app/main-page/_lib/anchors"
import { breadcrumb } from "@/app/main-page/_lib/content/pages"
import { getSource, need } from "@/app/main-page/_lib/content/source"
import { pageHref } from "@/app/main-page/_lib/routes"
import { noOrphans } from "@/app/main-page/_lib/text"
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
  const { common, copy: mainPage, pages, groups } = getSource(locale)
  const copy = pages.portfolio
  const description = (id: string) =>
    need(
      portfolioGroups.find((group) => group.id === id),
      `grupa ${id}`
    ).description[locale]

  return (
    <>
      <JsonLd data={portfolioPageSchema(locale)} />
      <SectionNav
        label={mainPage.ui.onPage}
        sections={[
          { id: SECTION.start, label: mainPage.ui.start },
          ...groups.map((group) => ({ id: group.id, label: group.label })),
        ]}
      />
      <PageHeader
        breadcrumb={breadcrumb(locale, common.nav.portfolio)}
        title={copy.title}
        lead={copy.description}
      />
      {groups.map((group) => (
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
            {group.works.map((work) => (
              <GalleryTile
                key={work.slug}
                work={work}
                labels={{
                  newTab: common.ui.newTab,
                  play: mainPage.ui.playVideo,
                  pause: mainPage.ui.pauseVideo,
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
