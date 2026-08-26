import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Zamknięcie każdego wpisu wezwaniem do rozmowy.
 *
 * docs/SEO.md §3 wymaga, żeby każdy tekst edukacyjny prowadził do strony
 * ofertowej — bez tego blog buduje ruch, ale nie zapytania. Komponent stoi
 * w szablonie wpisu, więc reguła obowiązuje wszystkie artykuły naraz,
 * także te napisane w przyszłości.
 */
export function PostCta() {
  return (
    <aside className="rounded-lg border bg-muted/40 p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">
        Potrzebujesz czegoś podobnego u siebie?
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
        Projektuję i wdrażam strony, aplikacje oraz integracje AI. Napisz, co
        chcesz zbudować — odpowiem z propozycją rozwiązania i wyceną.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/kontakt">
            Bezpłatna wycena
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/o-mnie">Zobacz, czym się zajmuję</Link>
        </Button>
      </div>
    </aside>
  )
}
