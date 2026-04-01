import { Separator } from "@/components/ui/separator"
import { Mail, MapPin, Clock } from "lucide-react"
import { KontaktForm } from "./KontaktForm"
import type { Metadata } from "next"
import { PageHeader } from "@/components/PageHeader"

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z Michałem Zeprzałką. Bezpłatna konsultacja dla nowych projektów webowych, design systemów i rozwiązań AI.",
}

const info = [
  {
    icon: Mail,
    label: "Email",
    value: "m@zeprzalka.com",
    href: "mailto:m@zeprzalka.com",
  },
  {
    icon: MapPin,
    label: "Lokalizacja",
    value: "Polska — praca zdalna",
    href: null,
  },
  {
    icon: Clock,
    label: "Czas odpowiedzi",
    value: "Do 24h w dni robocze",
    href: null,
  },
]

export default function KontaktPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <PageHeader
        badge="Kontakt"
        title="Porozmawiajmy"
        description="Masz pomysł na projekt? Chętnie go omówię i zaproponuję rozwiązanie dopasowane do Twoich potrzeb."
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
              Każde zlecenie zaczyna się od krótkiej rozmowy — bez zobowiązań,
              bez ukrytych kosztów.
            </p>
          </div>
        </aside>

        {/* Formularz */}
        <div className="lg:col-span-8 xl:col-span-9">
          <KontaktForm />
        </div>
      </div>
    </div>
  )
}
