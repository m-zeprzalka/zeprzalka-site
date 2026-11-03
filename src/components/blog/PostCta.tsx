import { CtaPanel } from "@/components/CtaPanel"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

/**
 * Zamknięcie każdego wpisu wezwaniem do rozmowy.
 *
 * docs/SEO.md wymaga, żeby każdy tekst edukacyjny prowadził do strony
 * ofertowej (z cenami) — bez tego blog buduje ruch, ale nie zapytania. Stoi
 * w szablonie wpisu, więc reguła obowiązuje wszystkie artykuły naraz,
 * także te napisane w przyszłości.
 */
export function PostCta({ locale }: { locale: Locale }) {
  const copy = getCommon(locale).postCta

  return (
    <CtaPanel
      as="aside"
      size="md"
      heading={copy.title}
      body={copy.description}
      actions={[
        { href: ROUTES.contact[locale], label: copy.primary },
        { href: ROUTES.services[locale], label: copy.secondary, variant: "outline" },
      ]}
    />
  )
}
