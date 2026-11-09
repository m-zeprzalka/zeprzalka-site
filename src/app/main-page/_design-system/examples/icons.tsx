import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeXmlIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { pageHref } from "@/app/main-page/_lib/routes"
import { CV_PDF, SOCIAL_PROFILES } from "@/lib/site"

export function IconsExample() {
  const [profile] = SOCIAL_PROFILES

  return (
    <>
      {/* → główne wezwanie: ikona po tekście, 16 px z wariantu. */}
      <Button asChild size="lg">
        <Link href={pageHref("contact", "pl")}>
          Porozmawiajmy
          <ArrowRightIcon />
        </Link>
      </Button>
      {/* Ikona przed tekstem mówi, czym jest działanie. */}
      <Button asChild size="lg" variant="outline">
        <a href={CV_PDF.pl} download>
          <DownloadIcon />
          Pobierz CV
        </a>
      </Button>
      {/* ↗ adres zewnętrzny: nowa karta zapowiedziana czytnikowi. */}
      {profile && (
        <Button asChild variant="secondary" size="sm">
          <a href={profile.url} target="_blank" rel="noopener noreferrer">
            {profile.label}
            <ArrowUpRightIcon />
            <span className="sr-only">(otwiera się w nowej karcie)</span>
          </a>
        </Button>
      )}
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
