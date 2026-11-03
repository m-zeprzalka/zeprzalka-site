import Link from "next/link"
import { Logo } from "@/components/layout/Logo"
import { ThemeToggle } from "@/components/ThemeToggle"
import { MobileNav } from "@/components/layout/MobileNav"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { mainNav } from "@/i18n/navigation"

export function Header({ locale }: { locale: Locale }) {
  const copy = getCommon(locale)

  return (
    <header className="sticky top-1 z-50 w-full border-b surface-glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo locale={locale} />
        <div className="flex items-center gap-2">
          <nav aria-label={copy.nav.mainAria} className="mr-2 hidden items-center gap-6 md:flex">
            {mainNav(locale).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher
            locale={locale}
            label={copy.languageSwitch.label}
            aria={copy.languageSwitch.aria}
          />
          <ThemeToggle label={copy.ui.themeToggle} />
          <MobileNav
            locale={locale}
            links={mainNav(locale, { withHome: true })}
            labels={{
              open: copy.nav.openMenu,
              close: copy.nav.closeMenu,
              title: copy.nav.menuTitle,
              nav: copy.nav.mobileAria,
              theme: copy.ui.themeToggle,
            }}
          />
        </div>
      </div>
    </header>
  )
}
