import Link from "next/link"
import { ArrowRightIcon, CodeXmlIcon, DownloadIcon, SearchIcon } from "lucide-react"
import { LinkArrow } from "@/components/page/link-arrow"
import { Button } from "@/components/ui/button"
import { pageHref } from "@/lib/routes"
import { CV_PDF, SOCIAL_PROFILES } from "@/lib/site"

export function IconsExample() {
  const [profile] = SOCIAL_PROFILES

  return (
    <>
      {/* ↗ każdy link: `LinkArrow` po tekście, `group/link` na linku — najechanie ją wychyla. */}
      <Button asChild size="lg" className="group/link">
        <Link href={pageHref("contact", "pl")}>
          Porozmawiajmy
          <LinkArrow />
        </Link>
      </Button>
      {/* Ikona przed tekstem mówi, czym jest działanie. */}
      <Button asChild size="lg" variant="outline">
        <a href={CV_PDF.pl} download>
          <DownloadIcon />
          Pobierz CV
        </a>
      </Button>
      {/* Ta sama ↗ przy adresie zewnętrznym; nową kartę zapowiada dopisek dla czytnika. */}
      {profile && (
        <Button asChild variant="secondary" size="sm" className="group/link">
          <a href={profile.url} target="_blank" rel="noopener noreferrer">
            {profile.label}
            <LinkArrow />
            <span className="sr-only">(otwiera się w nowej karcie)</span>
          </a>
        </Button>
      )}
      {/* → tylko na wysyłce formularza: to działanie, nie przejście. */}
      <Button type="button" size="lg">
        Wyślij wiadomość
        <ArrowRightIcon />
      </Button>
      {/* Sama ikona: rozmiar `icon` i nazwa w `aria-label`. */}
      <Button variant="ghost" size="icon" aria-label="Szukaj">
        <SearchIcon />
      </Button>
      <span className="grid size-9 place-items-center rounded-xl border bg-background">
        <CodeXmlIcon className="size-4" />
      </span>
    </>
  )
}
