import { PageHeader } from "@/components/PageHeader"
import type { Locale } from "@/i18n/config"
import { formatDate } from "@/i18n/format"
import { getLegal } from "@/i18n/content/legal"

/** Polityka prywatności — ten sam układ co pozostałe podstrony tekstowe. */
export function PrivacyView({ locale }: { locale: Locale }) {
  const copy = getLegal(locale)

  return (
    <div className="page-shell max-w-4xl">
      <PageHeader title={copy.title} description={copy.intro} />

      <div className="space-y-12">
        {copy.sections.map((section) => (
          <section key={section.heading} className="grid gap-4 lg:grid-cols-12 lg:gap-8">
            <h2 className="text-base font-semibold lg:col-span-4">{section.heading}</h2>
            <div className="space-y-4 lg:col-span-8">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted-foreground">
        {copy.updatedLabel}: <time dateTime={copy.updated}>{formatDate(copy.updated, locale)}</time>
      </p>
    </div>
  )
}
