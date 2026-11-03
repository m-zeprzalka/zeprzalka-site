import { ROUTES, type Locale, type RouteKey } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

/** Pozycje nawigacji głównej — jedna lista dla nagłówka, stopki i menu mobilnego. */
const MAIN_NAV = ["services", "blog", "about", "contact"] as const satisfies readonly RouteKey[]

export interface NavLink {
  href: string
  label: string
}

/** Nawigacja główna; menu mobilne dokłada na początku stronę główną. */
export function mainNav(locale: Locale, { withHome = false } = {}): NavLink[] {
  const labels = getCommon(locale).nav
  const keys = withHome ? (["home", ...MAIN_NAV] as const) : MAIN_NAV
  return keys.map((key) => ({ href: ROUTES[key][locale], label: labels[key] }))
}
