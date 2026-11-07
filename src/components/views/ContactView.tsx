import { Separator } from "@/components/ui/separator"
import { Mail, MapPin, Clock } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { JsonLd } from "@/components/JsonLd"
import { PageHeader } from "@/components/PageHeader"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import { contactPageSchema } from "@/lib/page-schema"
import { CONTACT_EMAIL } from "@/lib/site"

export function ContactView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).contact

  const info = [
    {
      icon: Mail,
      label: copy.emailLabel,
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: MapPin,
      label: copy.locationLabel,
      value: copy.locationValue,
      href: null,
    },
    {
      icon: Clock,
      label: copy.responseLabel,
      value: copy.responseValue,
      href: null,
    },
  ]

  return (
    <div className="page-shell">
      <JsonLd data={contactPageSchema(locale)} />
      <PageHeader badge={copy.badge} title={copy.title} description={copy.description} />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Info boczna */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="top-24 space-y-8 lg:sticky">
            {/* Pary „etykieta — wartość” to lista opisowa. */}
            <dl className="space-y-8">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div key={label}>
                  <dt className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    {label}
                  </dt>
                  <dd>
                    {href ? (
                      <a
                        href={href}
                        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {value}
                      </a>
                    ) : (
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {value}
                      </p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <Separator />

            <p className="text-sm leading-relaxed text-muted-foreground">{copy.note}</p>
          </div>
        </aside>

        {/* Formularz */}
        {/* `relative`: kontekst pozycjonowania pola-pułapki formularza (absolute, -z-10). */}
        <div className="relative lg:col-span-8 xl:col-span-9">
          <ContactForm
            locale={locale}
            copy={getCommon(locale).form}
            privacyHref={ROUTES.privacy[locale]}
          />
        </div>
      </div>
    </div>
  )
}
