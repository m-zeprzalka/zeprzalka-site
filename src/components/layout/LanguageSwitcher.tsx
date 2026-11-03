"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  PATH_BASES,
  ROUTES,
  otherLocale,
  postPath,
  categoryPath,
  tagPath,
  route,
  type Locale,
} from "@/i18n/config"
import { translateCategorySlug, translatePostSlug, translateTagSlug } from "@/i18n/blog-map"

/**
 * Przełącznik języka prowadzi na **odpowiednik oglądanej strony**, a nie na
 * stronę główną — inaczej każde przełączenie kosztowałoby czytelnika utratę
 * miejsca w serwisie. Adres liczy się z bieżącej ścieżki, więc komponent nie
 * potrzebuje żadnych propsów od stron: mapa adresów i mapa slugów bloga to
 * czyste dane, dostępne także po stronie przeglądarki.
 *
 * Gdy odpowiednika nie ma (wpis jeszcze nieprzetłumaczony), przycisk prowadzi
 * do najbliższej sensownej strony — indeksu bloga albo strony głównej.
 */
function counterpart(pathname: string, from: Locale, to: Locale): string {
  const clean = pathname.replace(/\/$/, "") || "/"

  // Strony statyczne: dokładne trafienie w mapę adresów.
  for (const paths of Object.values(ROUTES)) {
    if (paths[from] === clean) return paths[to]
  }

  // Kolejne strony archiwum: ten sam numer w drugim języku. Obie wersje
  // mają tyle samo wpisów, więc i tyle samo stron.
  const pageBase = PATH_BASES.blogPage[from]
  if (clean.startsWith(`${pageBase}/`)) {
    return `${PATH_BASES.blogPage[to]}/${clean.slice(pageBase.length + 1)}`
  }

  const blogBase = ROUTES.blog[from]
  const categoryBase = ROUTES.categories[from]
  const tagBase = PATH_BASES.tags[from]

  if (clean.startsWith(`${categoryBase}/`)) {
    const slug = clean.slice(categoryBase.length + 1)
    const translated = translateCategorySlug(slug, from, to)
    return translated ? categoryPath(to, translated) : route("blog", to)
  }

  if (clean.startsWith(`${tagBase}/`)) {
    const slug = clean.slice(tagBase.length + 1)
    const translated = translateTagSlug(slug, from, to)
    return translated ? tagPath(to, translated) : route("blog", to)
  }

  if (clean.startsWith(`${blogBase}/`)) {
    const slug = clean.slice(blogBase.length + 1)
    const translated = translatePostSlug(slug, from, to)
    return translated ? postPath(to, translated) : route("blog", to)
  }

  return route("home", to)
}

export function LanguageSwitcher({
  locale,
  label,
  aria,
}: {
  locale: Locale
  /** Napis na przycisku — kod języka docelowego („EN”). */
  label: string
  aria: string
}) {
  const pathname = usePathname()
  const target = otherLocale(locale)

  return (
    <Button asChild variant="outline" size="icon" aria-label={`${label} — ${aria}`}>
      {/*
        `hrefLang` mówi wyszukiwarce, dokąd prowadzi link — ten sam sygnał
        co znaczniki `alternate` w nagłówku, tylko widoczny dla czytelnika.
      */}
      <Link
        href={counterpart(pathname, locale, target)}
        hrefLang={target}
        className="text-xs font-medium tabular-nums"
      >
        {label}
      </Link>
    </Button>
  )
}
