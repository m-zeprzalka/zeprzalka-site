import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { FooterWordmark } from "@/app/main-page/_components/layout/footer-wordmark"
import { LocalTime } from "@/app/main-page/_components/layout/local-time"
import { Button } from "@/app/main-page/_components/ui/button"
import { getShellContent } from "@/app/main-page/_lib/content/shell"

/** Klocki stopki (`SiteFooter`) z jej prawdziwymi danymi — bez `<footer>`, który chowa tory. */
export function FooterExample() {
  const { footer } = getShellContent("pl")

  return (
    <div className="grid w-full gap-6">
      {/* Linki podstron: ujemny margines = wcięcie przycisku, tekst stoi na linii kolumny. */}
      <ul className="-mx-3 flex flex-wrap">
        {footer.pages.map((page) => (
          <li key={page.href}>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link href={page.href}>{page.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col-reverse gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <span>{footer.copyright}</span>
          <LocalTime city={footer.city} label={footer.localTimeLabel} locale="pl" />
        </p>
        <ul className="flex flex-wrap gap-2">
          {footer.profiles.map((profile) => (
            <li key={profile.href}>
              <Button asChild variant="secondary" size="sm">
                <a href={profile.href} target="_blank" rel="noopener noreferrer">
                  {profile.label}
                  <ArrowUpRightIcon />
                  <span className="sr-only">({footer.newTabLabel})</span>
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <FooterWordmark text={footer.wordmark} />
    </div>
  )
}
