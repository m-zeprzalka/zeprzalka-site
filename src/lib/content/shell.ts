/** Treść powłoki: nagłówek (logo, wyszukiwarka, język, motyw) i stopka. */
import "server-only"
import type { Locale } from "@/i18n/config"
import { mapLocales } from "@/i18n/alternates"
import { fill } from "@/i18n/format"
import { getBlogPageCount } from "@/lib/blog-pages"
import { CONTACT_EMAIL, SITE_DOMAIN, SOCIAL_PROFILES } from "@/lib/site"
import { PAGE_KEYS, pageHref } from "../routes"
import type { LinkData } from "../types"
import { buildSearch } from "./search"
import { getSource } from "./source"

/** Profile w stopce — te same i w tej samej kolejności co `sameAs` danych strukturalnych. */
const PROFILES: readonly LinkData[] = SOCIAL_PROFILES.map((profile) => ({
  label: profile.label,
  href: profile.url,
  external: true,
}))

export function getShellContent(locale: Locale) {
  const source = getSource(locale)
  const { common, copy, about } = source

  return {
    skipToContent: common.ui.skipToContent,
    header: {
      domain: SITE_DOMAIN,
      homeHref: pageHref("home", locale),
      themeLabel: common.ui.themeToggle,
      language: {
        label: copy.ui.language,
        aria: common.languageSwitch.aria,
        locale,
        pageCounts: mapLocales(getBlogPageCount),
      },
      search: {
        groups: buildSearch(source),
        email: CONTACT_EMAIL,
        locale,
        labels: {
          search: copy.ui.search,
          title: copy.ui.searchTitle,
          description: copy.ui.searchDescription,
          placeholder: copy.ui.searchPlaceholder,
          empty: copy.ui.searchEmpty,
          copied: common.ui.copied,
          results: copy.ui.searchResults,
          hints: copy.ui.searchHints,
        },
      },
    },
    rail: {
      label: common.nav.mainAria,
      homeHref: pageHref("home", locale),
      items: [
        { label: common.nav.home, href: pageHref("home", locale) },
        ...PAGE_KEYS.map((key) => ({ label: common.nav[key], href: pageHref(key, locale) })),
      ],
    },
    footer: {
      navigationHeading: common.footer.navigation,
      pages: PAGE_KEYS.map((key) => ({ label: common.nav[key], href: pageHref(key, locale) })),
      privacy: { label: common.form.privacyLink, href: pageHref("privacy", locale) },
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
