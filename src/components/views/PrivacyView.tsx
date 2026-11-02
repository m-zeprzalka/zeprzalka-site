import { PageHeader } from "@/components/PageHeader"
import { formatDate, type Locale } from "@/i18n/config"
import { getLegal } from "@/i18n/content/legal"

/** Polityka prywatności — ten sam układ co pozostałe podstrony tekstowe. */
export function PrivacyView({ locale }: { locale: Locale }) {
  const copy = getLegal(locale)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-4xl">
      <PageHeader title={copy.title} description={copy.intro} />

      <div className="space-y-12">
        {copy.sections.map((section) => (
          <section key={section.heading} className="grid lg:grid-cols-12 gap-4 lg:gap-8">
            <h2 className="lg:col-span-4 text-base font-semibold">
              {section.heading}
            </h2>
            <div className="lg:col-span-8 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted-foreground">
        {copy.updatedLabel}:{" "}
        <time dateTime={copy.updated}>{formatDate(copy.updated, locale)}</time>
      </p>
    </div>
  )
}
