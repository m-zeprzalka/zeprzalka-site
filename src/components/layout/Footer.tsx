import Link from "next/link"
import { SOCIAL_PROFILES } from "@/lib/site"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { fill } from "@/i18n/format"
import { mainNav } from "@/i18n/navigation"

const LINK = "text-muted-foreground hover:text-foreground transition-colors"

export function Footer({ locale }: { locale: Locale }) {
  const copy = getCommon(locale)

  return (
    <footer className="border-t surface-glass">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link
              href={ROUTES.home[locale]}
              className="font-semibold text-lg tracking-tight hover:text-primary transition-colors"
            >
              zeprzalka.com
            </Link>
            <p className="text-sm text-muted-foreground">
              {copy.footer.tagline} <br />
              {copy.footer.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold" id="footer-nav">
              {copy.footer.navigation}
            </h2>
            <nav aria-labelledby="footer-nav">
              <ul className="flex flex-col space-y-2 text-sm">
                {mainNav(locale).map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={LINK}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Profile zewnętrzne to nie nawigacja serwisu — zwykła lista linków. */}
          <div className="space-y-4">
            <h2 className="font-semibold" id="footer-social">
              {copy.footer.social}
            </h2>
            <ul aria-labelledby="footer-social" className="flex flex-col space-y-2 text-sm">
              {SOCIAL_PROFILES.map(({ label, url }) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            {fill(copy.footer.copyright, { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
