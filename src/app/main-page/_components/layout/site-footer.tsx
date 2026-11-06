import { ArrowUpRightIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import type { Link } from "@/app/main-page/_lib/types"
import { FooterWordmark } from "./footer-wordmark"
import { LocalTime } from "./local-time"

/**
 * Stopka: profile jako chipy klikalne w całości (X pierwszy), prawa autorskie
 * i godzina w Warszawie, a pod nimi znak na całą szerokość okna.
 */
export function SiteFooter({
  copyright,
  profilesHeading,
  profiles,
  wordmark,
  city,
  localTimeLabel,
  newTabLabel,
}: {
  copyright: string
  profilesHeading: string
  profiles: readonly Link[]
  wordmark: string
  city: string
  localTimeLabel: string
  newTabLabel: string
}) {
  return (
    <footer className="mt-40 overflow-hidden">
      <div className="column flex flex-col-reverse gap-6 pb-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <span>{copyright}</span>
          <LocalTime city={city} label={localTimeLabel} />
        </p>
        <nav aria-label={profilesHeading}>
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
        </nav>
      </div>
      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        <FooterWordmark text={wordmark} />
      </div>
    </footer>
  )
}
