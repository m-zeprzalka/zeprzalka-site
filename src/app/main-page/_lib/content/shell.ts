/** Treść powłoki: nagłówek (logo, wyszukiwarka, język, motyw) i stopka. */
import "server-only"
import { ROUTES, type Locale } from "@/i18n/config"
import { fill } from "@/i18n/format"
import { CONTACT_EMAIL, SITE_DOMAIN, SOCIAL_PROFILES } from "@/lib/site"
import type { Link } from "../types"
import { buildSearch } from "./search"
import { getSource } from "./source"

/** Adres strony głównej w podglądzie; po przepięciu: `ROUTES.home[locale]`. */
export const HOME_HREF = "/main-page"

/** Profil X jest pierwszy (prośba właściciela); przy przepięciu trafi do `SOCIAL_PROFILES`. */
const PROFILES: readonly Link[] = [
  { label: "X", href: "https://x.com/zeprzalka_com", external: true },
  ...SOCIAL_PROFILES.map((profile) => ({ label: profile.label, href: profile.url, external: true })),
]

export function getShellContent(locale: Locale) {
  const source = getSource(locale)
  const { common, copy, about } = source

  return {
    skipToContent: common.ui.skipToContent,
    header: {
      domain: SITE_DOMAIN,
      homeHref: HOME_HREF,
      themeLabel: common.ui.themeToggle,
      language: {
        label: copy.ui.language,
        links: [
          { label: "PL", href: ROUTES.home.pl, current: locale === "pl" },
          { label: "EN", href: ROUTES.home.en, current: locale === "en" },
        ],
      },
      search: {
        groups: buildSearch(source),
        email: CONTACT_EMAIL,
        labels: {
          search: copy.ui.search,
          title: copy.ui.searchTitle,
          description: copy.ui.searchDescription,
          placeholder: copy.ui.searchPlaceholder,
          empty: copy.ui.searchEmpty,
          hints: copy.ui.searchHints,
        },
      },
    },
    footer: {
      copyright: fill(common.footer.copyright, { year: String(new Date().getFullYear()) }),
      profilesHeading: common.footer.social,
      profiles: PROFILES,
      wordmark: "Zeprzałka",
      city: about.addressLocality,
      localTimeLabel: copy.ui.localTime,
      newTabLabel: common.ui.newTab,
    },
  }
}
