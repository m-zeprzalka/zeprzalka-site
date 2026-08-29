import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

/**
 * Zamknięcie każdego wpisu wezwaniem do rozmowy.
 *
 * docs/SEO.md §3 wymaga, żeby każdy tekst edukacyjny prowadził do strony
 * ofertowej — bez tego blog buduje ruch, ale nie zapytania. Komponent stoi
 * w szablonie wpisu, więc reguła obowiązuje wszystkie artykuły naraz,
 * także te napisane w przyszłości.
 */
export function PostCta({ locale }: { locale: Locale }) {
  const copy = getCommon(locale).postCta

  return (
    <aside className="rounded-lg border bg-muted/40 p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
        {copy.description}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={ROUTES.contact[locale]}>
            {copy.primary}
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.about[locale]}>{copy.secondary}</Link>
        </Button>
      </div>
    </aside>
  )
}
