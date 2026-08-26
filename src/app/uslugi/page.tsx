import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/PageHeader"
import { formatPrice, packages, process } from "@/lib/services"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Usługi i cennik",
  description:
    "Ile kosztuje strona internetowa? Widełki cenowe dla landing page'a, strony firmowej, wdrożeń AI i opieki miesięcznej. Wycena w 24 godziny, bez zobowiązań.",
  alternates: { canonical: "/uslugi" },
  openGraph: {
    title: "Usługi i cennik | Michał Zeprzałka",
    description:
      "Widełki cenowe dla stron, aplikacji, wdrożeń AI i opieki miesięcznej. Wycena w 24 godziny.",
    type: "website",
  },
}

/**
 * Katalog usług w danych strukturalnych. Wyszukiwarka dostaje wprost, co
 * i za ile jest oferowane, zamiast domyślać się z treści strony.
 */
const offerJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  url: `${SITE_URL}/uslugi`,
  areaServed: "PL",
  priceRange: "1500-15000 PLN",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Usługi cyfrowe",
    itemListElement: packages.map((pack) => ({
      "@type": "Offer",
      name: pack.name,
      description: pack.scope,
      priceCurrency: "PLN",
      price: pack.from,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: pack.from,
        priceCurrency: "PLN",
      },
    })),
  },
}

export default function UslugiPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />

      <PageHeader
        badge="Usługi"
        title="Ile kosztuje strona internetowa?"
        description="Poniżej realne widełki, od których zaczynamy rozmowę. Ostateczna cena zależy od zakresu — wycenę dostajesz w 24 godziny, bez zobowiązań."
      />

      <section aria-labelledby="pakiety">
        <h2 id="pakiety" className="sr-only">
          Pakiety i ceny
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pack) => (
            <article
              key={pack.id}
              className={
                pack.highlight
                  ? "flex flex-col rounded-xl border-2 border-primary/40 p-6 md:p-8"
                  : "flex flex-col rounded-xl border p-6 md:p-8"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {pack.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pack.scope}
                  </p>
                </div>
                {pack.highlight && <Badge variant="secondary">Powtarzalnie</Badge>}
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">od</span>
                <span className="text-3xl font-medium tabular-nums">
                  {formatPrice(pack.from)} zł
                </span>
                {pack.unit && (
                  <span className="text-sm text-muted-foreground">
                    / {pack.unit}
                  </span>
                )}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {pack.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Ceny netto, orientacyjne. Nie znalazłeś swojego przypadku? Opisz go —
          większość projektów i tak wyceniam indywidualnie.
        </p>
      </section>

      <Separator className="my-16" />

      <section aria-labelledby="proces">
        <h2 id="proces" className="text-2xl font-semibold tracking-tight">
          Jak wygląda współpraca
        </h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {process.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="text-sm tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="my-16" />

      <section
        aria-labelledby="wycena"
        className="rounded-xl border bg-muted/40 p-6 md:p-10"
      >
        <h2 id="wycena" className="text-2xl font-semibold tracking-tight">
          Opisz projekt, odpowiem w 24 godziny
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          Wycena jest bezpłatna i nie zobowiązuje do niczego. Jeśli uznam, że
          Twojego problemu nie rozwiąże strona internetowa — powiem to wprost.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-fit">
            <Link href="/kontakt">
              Bezpłatna wycena
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-fit">
            <Link href="/o-mnie">Kim jestem</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
