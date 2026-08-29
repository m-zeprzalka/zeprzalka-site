import Link from "next/link"
import { SOCIAL_PROFILES } from "@/lib/site"
import { ROUTES, type Locale } from "@/i18n/config"
import { fill, getCommon } from "@/i18n/content/common"

export function Footer({ locale }: { locale: Locale }) {
  const copy = getCommon(locale)
  const navLinks = [
    { href: ROUTES.services[locale], label: copy.nav.services },
    { href: ROUTES.blog[locale], label: copy.nav.blog },
    { href: ROUTES.about[locale], label: copy.nav.about },
    { href: ROUTES.contact[locale], label: copy.nav.contact },
  ]

  return (
    <footer className="border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link href={ROUTES.home[locale]} className="font-semibold text-lg tracking-tight hover:text-primary transition-colors">
              zeprzalka.com
            </Link>
            <p className="text-sm text-muted-foreground">
              {copy.footer.tagline} <br></br>{copy.footer.description}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h2 className="font-semibold" id="footer-nav">{copy.footer.navigation}</h2>
            <nav aria-labelledby="footer-nav" className="flex flex-col space-y-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h2 className="font-semibold" id="footer-social">{copy.footer.social}</h2>
            <nav aria-labelledby="footer-social" className="flex flex-col space-y-2">
              {SOCIAL_PROFILES.map(({ label, url }) => (
                <Link
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            {fill(copy.footer.copyright, { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
