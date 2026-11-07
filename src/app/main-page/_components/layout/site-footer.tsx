import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import type { LinkData } from "@/app/main-page/_lib/types"
import { FooterWordmark } from "./footer-wordmark"
import { LocalTime } from "./local-time"

/**
 * Stopka: podstrony (jedyne ich linki w HTML — nagłówek nawiguje przez ⌘K),
 * profile jako chipy klikalne w całości (X pierwszy), prawa autorskie i godzina
 * w Warszawie, a pod nimi znak na całą szerokość okna.
 */
export function SiteFooter({
  navigationHeading,
  pages,
  privacy,
  copyright,
  profilesHeading,
  profiles,
  wordmark,
  city,
  localTimeLabel,
  newTabLabel,
  locale,
}: {
  navigationHeading: string
  pages: readonly LinkData[]
  privacy: LinkData
  copyright: string
  profilesHeading: string
  profiles: readonly LinkData[]
  wordmark: string
  city: string
  localTimeLabel: string
  newTabLabel: string
  locale: string
}) {
  return (
    <footer data-site-footer="" className="mt-40 overflow-hidden">
      <nav aria-label={navigationHeading} className="column">
        {/* Ujemny margines = wcięcie przycisku: tekst pierwszego linku stoi na linii kolumny. */}
        <ul className="-mx-3 flex flex-wrap">
          {[...pages, privacy].map((page) => (
            <li key={page.href}>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link href={page.href}>{page.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="column mt-6 flex flex-col-reverse gap-6 pb-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <span>{copyright}</span>
          <LocalTime city={city} label={localTimeLabel} locale={locale} />
        </p>
        <nav aria-label={profilesHeading}>
          {/* Profile to kontakt z autorem strony — `address` (bez kursywy przeglądarki). */}
          <address className="not-italic">
            <ul className="flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <li key={profile.href}>
                  <Button asChild variant="secondary" size="sm">
                    <a href={profile.href} target="_blank" rel="noopener noreferrer me">
                      {profile.label}
                      <ArrowUpRightIcon />
                      <span className="sr-only">({newTabLabel})</span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </address>
        </nav>
      </div>
      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        <FooterWordmark text={wordmark} />
      </div>
    </footer>
  )
}
