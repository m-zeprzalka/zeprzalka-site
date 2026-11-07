import { LabelRow } from "@/app/main-page/_components/page/label-row"
import { PageHeader } from "@/app/main-page/_components/page/page-header"
import { breadcrumb } from "@/app/main-page/_lib/content/pages"
import { noOrphans } from "@/app/main-page/_lib/text"
import type { Locale } from "@/i18n/config"
import { getLegal } from "@/i18n/content/legal"
import { formatDate } from "@/i18n/format"

/** Polityka prywatności: rozdziały w rytmie kolumny etykiet, na końcu data aktualizacji. */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const copy = getLegal(locale)

  return (
    <>
      <PageHeader
        breadcrumb={breadcrumb(locale, copy.title)}
        title={copy.title}
        lead={copy.intro}
      />
      <div className="column mt-16 grid gap-12">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <LabelRow
              label={section.heading}
              labelAs="h2"
              labelClassName="text-base font-medium text-foreground md:text-sm"
            >
              <div className="grid gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-pretty text-muted-foreground">
                    {noOrphans(paragraph)}
                  </p>
                ))}
              </div>
            </LabelRow>
          </section>
        ))}
      </div>
      <p className="column mt-16 text-sm text-muted-foreground">
        {copy.updatedLabel}: <time dateTime={copy.updated}>{formatDate(copy.updated, locale)}</time>
      </p>
    </>
  )
}
