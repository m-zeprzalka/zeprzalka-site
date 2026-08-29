import Link from "next/link"
import { Logo } from "@/components/layout/Logo"
import { ModeToggle } from "@/components/Toggle"
import { MobileNav } from "@/components/layout/MobileNav"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

export function Header({ locale }: { locale: Locale }) {
  const copy = getCommon(locale)
  const navLinks = [
    { href: ROUTES.services[locale], label: copy.nav.services },
    { href: ROUTES.blog[locale], label: copy.nav.blog },
    { href: ROUTES.about[locale], label: copy.nav.about },
    { href: ROUTES.contact[locale], label: copy.nav.contact },
  ]

  return (
    <header className="sticky top-1 z-50 w-full border-b bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo locale={locale} />
        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav
            aria-label={copy.nav.mainAria}
            className="hidden md:flex items-center gap-6 mr-2"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher locale={locale} />
          <ModeToggle label={copy.ui.themeToggle} />
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  )
}
