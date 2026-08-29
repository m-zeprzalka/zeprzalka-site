# Dwujęzyczność serwisu

Serwis ma dwie pełne wersje językowe. Ten dokument opisuje, gdzie mieszkają
teksty i co trzeba zrobić, żeby dodać nową stronę albo nowy wpis.

## Adresy

| Strona     | Polski              | Angielski             |
| ---------- | ------------------- | --------------------- |
| Start      | `/`                 | `/en`                 |
| Usługi     | `/uslugi`           | `/en/services`        |
| O mnie     | `/o-mnie`           | `/en/about`           |
| Kontakt    | `/kontakt`          | `/en/contact`         |
| Portfolio  | `/portfolio`        | `/en/portfolio`       |
| Blog       | `/blog`             | `/en/blog`            |
| Kategorie  | `/blog/kategoria`   | `/en/blog/category`   |
| Tagi       | `/blog/tag`         | `/en/blog/tag`        |
| Kanał RSS  | `/feed.xml`         | `/en/feed.xml`        |

**Polskie adresy nie zmieniły się ani o znak.** Są zaindeksowane, więc polska
wersja została w katalogu głównym, a angielska stanęła obok pod `/en`.
Mapa adresów siedzi w jednym miejscu: `ROUTES` w `src/i18n/config.ts`.

## Jedno źródło prawdy dla tekstów

Zasada jest jedna: **żaden tekst nie może istnieć tylko w jednym języku**.
Pilnuje tego kompilator, nie czujność. Służą do tego dwa mechanizmy:

### 1. Lustrzane drzewa treści (`src/i18n/content/*`)

Copy stron. Każdy moduł ma dwa drzewa — `pl` i `en` — przy czym `en` ma typ
`typeof pl`. Brak choćby jednego klucza zatrzymuje build.

| Plik         | Co zawiera                                              |
| ------------ | ------------------------------------------------------- |
| `common.ts`  | nawigacja, stopka, formularz, komunikaty błędów, 404     |
| `home.ts`    | strona główna (hero, kompetencje, sekcje)                |
| `pages.ts`   | usługi, o mnie, kontakt, portfolio, blog                 |
| `meta.ts`    | tytuły i opisy dla wyszukiwarki, karty Open Graph        |

### 2. Pary `Localized<T>` przy danych

Tam, gdzie tekst jest **polem danych**, a nie copy strony, para `{ pl, en }`
stoi w miejscu jego deklaracji. Tak jest w:

- `src/lib/portfolio.ts` — tytuły i kategorie realizacji,
- `src/lib/services.ts` — nazwy pakietów, zakresy, listy punktów, kroki
  współpracy (kwoty i identyfikatory są wspólne, więc występują raz),
- `src/lib/site.ts` — opis serwisu i nota o autorze.

Typ `Localized<T> = Record<Locale, T>` wymusza obie wersje.

## Jak dodać nową stronę

1. Dopisz parę adresów do `ROUTES` w `src/i18n/config.ts`.
2. Dopisz copy do `src/i18n/content/pages.ts` (najpierw `pl`, potem `en` —
   kompilator sam wskaże, czego brakuje) i metadane do `meta.ts`.
3. Zbuduj **jeden** widok w `src/components/views/`, przyjmujący `locale`.
4. Dodaj dwa cienkie pliki trasy: `src/app/(pl)/…/page.tsx` i
   `src/app/en/…/page.tsx`; każdy woła ten sam widok i builder metadanych.
5. Dopisz stronę do `src/app/sitemap.ts`.

## Jak dodać nowy wpis na blogu

1. Napisz wpis po polsku: `content/posts/<slug>.mdx`.
2. Napisz wersję angielską: `content/en/posts/<slug-en>.mdx` (własny,
   angielski slug — lepszy dla wyszukiwarki).
3. Dopisz parę slugów do `POST_SLUGS` w `src/i18n/blog-map.ts`. Bez tego
   znaczniki `hreflang` i przełącznik języka nie skojarzą obu wersji.
4. Kategorie i tagi w wersji angielskiej muszą mieć pary w `CATEGORY_LABELS`
   i `TAG_LABELS` w tym samym pliku.

Wpis bez tłumaczenia nie psuje serwisu: po prostu nie dostaje `alternate`
dla drugiego języka, a przełącznik prowadzi wtedy do indeksu bloga.

## Dwa układy główne

`src/app/(pl)/layout.tsx` i `src/app/en/layout.tsx` to **dwa niezależne układy
główne**. Powód jest jeden: atrybut `lang` na `<html>` ustawia w App Routerze
wyłącznie układ główny, a `lang="pl"` na angielskiej stronie to błąd i dla
czytnika ekranu, i dla wyszukiwarki. Wspólną treść obu trzyma
`src/components/layout/RootShell.tsx`, więc nie mogą się rozjechać.

Konsekwencja: nieznany adres obsługuje `src/app/global-not-found.tsx` (przy
dwóch układach zwykły `not-found.tsx` renderowałby się bez arkusza stylów).
Wymaga to flagi `experimental.globalNotFound` w `next.config.ts`.

## SEO

- `hreflang` na każdej stronie, z `x-default` wskazującym wersję polską —
  buduje je `alternatesFor()` w `src/i18n/config.ts`, więc nie da się o nim
  zapomnieć w JSX-ie.
- Mapa strony wymienia obie wersje i powtarza te same pary jako `alternates`.
- Osobny kanał RSS dla `/en` z własnym znacznikiem `<language>`.
- Dane strukturalne (`inLanguage`) i karty Open Graph (`og:locale`,
  `og:locale:alternate`) w obu językach.
