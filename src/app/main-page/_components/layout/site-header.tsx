import type { ComponentProps } from "react"
import { LanguageSwitch } from "./language-switch"
import { Logo } from "./logo"
import { SearchMenu } from "./search-menu"
import { ThemeToggle } from "./theme-toggle"

/**
 * Nagłówek na osi kolumny. Tło to samo rozmycie, które zanika ku dołowi
 * (maska gradientu) — bez koloru i bez kreski. Wchodzi pierwszy w „harmonijce”.
 */
export function SiteHeader({
  domain,
  homeHref,
  themeLabel,
  language,
  search,
}: {
  domain: string
  homeHref: string
  themeLabel: string
  language: ComponentProps<typeof LanguageSwitch>
  search: ComponentProps<typeof SearchMenu>
}) {
  return (
    <header className="motion-safe:animate-enter sticky top-0 z-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-8 [mask-image:linear-gradient(to_bottom,black_45%,transparent)] backdrop-blur-md"
      />
      <div className="column relative flex h-16 items-center justify-between gap-3">
        <Logo domain={domain} href={homeHref} />
        <div className="flex items-center gap-1">
          <SearchMenu {...search} />
          <LanguageSwitch {...language} />
          <ThemeToggle label={themeLabel} />
        </div>
      </div>
    </header>
  )
}
