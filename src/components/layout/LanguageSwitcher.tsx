"use client"

import { usePathname } from "next/navigation"
import { counterpart } from "@/i18n/alternates"
import { otherLocale, type Locale, type Localized } from "@/i18n/config"

/**
 * Przełącznik języka prowadzi na **odpowiednik oglądanej strony**, a nie na
 * stronę główną — inaczej każde przełączenie kosztowałoby czytelnika utratę
 * miejsca w serwisie. Adres liczy `counterpart()` z bieżącej ścieżki (ta sama
 * logika co `hreflang`); liczbę stron archiwum w obu językach i klasę przycisku
 * podaje serwer (bez `cva` i `tailwind-merge` w paczce przeglądarki).
 *
 * Zwykłe `<a>`, nie `next/link`: wersje językowe mają osobne układy główne,
 * więc przejście i tak jest pełnym przeładowaniem — `Link` pobierał tylko
 * w tle ok. 40 KB drugiej wersji strony, z których nic nie korzystało.
 */
export function LanguageSwitcher({
  locale,
  label,
  aria,
  pageCounts,
  className,
}: {
  locale: Locale
  /** Napis na przycisku — kod języka docelowego („EN”). */
  label: string
  aria: string
  pageCounts: Localized<number>
  className: string
}) {
  const pathname = usePathname()
  const target = otherLocale(locale)

  return (
    // `hrefLang` mówi wyszukiwarce, dokąd prowadzi link — ten sam sygnał
    // co znaczniki `alternate` w nagłówku, tylko widoczny dla czytelnika.
    <a
      href={counterpart(pathname, locale, target, pageCounts)}
      hrefLang={target}
      aria-label={`${label} — ${aria}`}
      data-slot="button"
      className={`${className} text-xs font-medium tabular-nums`}
    >
      {label}
    </a>
  )
}
