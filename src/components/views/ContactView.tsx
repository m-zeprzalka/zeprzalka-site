import { Separator } from "@/components/ui/separator"
import { Mail, MapPin, Clock } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { PageHeader } from "@/components/PageHeader"
import type { Locale } from "@/i18n/config"
import { getPages } from "@/i18n/content/pages"

export function ContactView({ locale }: { locale: Locale }) {
  const copy = getPages(locale).contact

  const info = [
    {
      icon: Mail,
      label: copy.emailLabel,
      value: "m@zeprzalka.com",
      href: "mailto:m@zeprzalka.com",
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
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Info boczna */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="space-y-8 lg:sticky top-24">
            {info.map(({ icon: Icon, label, value, href }) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    {value}
                  </a>
                ) : (
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    {value}
                  </p>
                )}
              </div>
            ))}

            <Separator />

            <p className="text-sm text-muted-foreground leading-relaxed">
              {copy.note}
            </p>
          </div>
        </aside>

        {/* Formularz */}
        <div className="lg:col-span-8 xl:col-span-9 relative">
          <ContactForm locale={locale} />
        </div>
      </div>
    </div>
  )
}
