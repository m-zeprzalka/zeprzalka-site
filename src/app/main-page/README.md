# main-page — nowa wersja zeprzalka.com

Nowa wersja strony (strona główna i wszystkie podstrony) zbudowana od zera na shadcn/ui
i Tailwind 4, równolegle z działającym serwisem. Dopóki nie nastąpi przepięcie, żyje pod
adresem `/main-page` jako podgląd: po polsku, zawsze `noindex`, poza mapą strony.

Zasady, kryteria i decyzje (normatywne): **[ZASADY.md](ZASADY.md)**. Ten plik opisuje, co jest,
gdzie leży, jak działa i jak to uruchomić.

## Stan (9.11.2026)

| Strona                | Adres podglądu                                                       | Widok                                 |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------- |
| Start (wariant 1)     | `/main-page`                                                         | `_variants/wariant-1/home-page.tsx`   |
| Usługi                | `/main-page/uslugi`                                                  | `_components/views/services-page.tsx` |
| Portfolio             | `/main-page/portfolio`                                               | `portfolio-page.tsx`                  |
| O mnie (biogram i CV) | `/main-page/o-mnie`                                                  | `about-page.tsx`                      |
| Kontakt               | `/main-page/kontakt`                                                 | `contact-page.tsx`                    |
| Polityka prywatności  | `/main-page/polityka-prywatnosci`                                    | `privacy-page.tsx`                    |
| Blog i archiwum       | `/main-page/blog`, `/main-page/blog/strona/[strona]`                 | `blog-page.tsx`                       |
| Kategorie             | `/main-page/blog/kategoria`                                          | `categories-page.tsx`                 |
| Kategoria, tag        | `/main-page/blog/kategoria/[kategoria]`, `/main-page/blog/tag/[tag]` | `taxonomy-page.tsx`                   |
| Wpis                  | `/main-page/blog/[slug]`                                             | `post-page.tsx`                       |
| 404 (podgląd ekranu)  | `/main-page/nie-znaleziono`                                          | `not-found-page.tsx`                  |
| Design system         | `/main-page/design-system`                                           | `(pl)/design-system/page.demo.tsx`    |

Na zeprzalka.com podgląd jest widoczny, bo w Vercelu jest ustawione `DEMO_PUBLIC=1`. Wersja
angielska nowego systemu powstanie po akceptacji polskiej; do tego czasu przełącznik EN prowadzi
na angielską stronę serwisu (odpowiednik oglądanej strony).

## Uruchomienie

```bash
pnpm dev                                        # http://localhost:3000/main-page (dema i podgląd w dev zawsze)
pnpm check                                      # treść, klasy, formatowanie, lint, build, kontrola HTML
VERCEL_ENV=production DEMO_PUBLIC=1 pnpm build  # build jak na Vercelu (z podglądem)
pnpm check:classes --fix                        # zapis kanoniczny klas Tailwinda w main-page
pnpm visual <bazowy> <zmiana> [--all]           # strażnik pikseli starego serwisu
```

Gdy `pnpm dev` działa w repozytorium, build produkcyjny rób w czystej kopii (pułapka w `AGENTS.md`).

## Gdzie co zmieniać

| Co                                                                  | Gdzie                                                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| teksty nowej strony (napisy, frazy otwierające karty, liczby)       | `src/i18n/content/main-page.ts` (podstrony: `pages.ts`, `common.ts`, `legal.ts`) |
| pakiety i ceny                                                      | `src/lib/services.ts`                                                            |
| realizacje (opisy, kategorie, plakaty, wideo)                       | `src/lib/portfolio.ts`                                                           |
| wpisy bloga                                                         | `content/posts/*.mdx`                                                            |
| które realizacje pokazuje karta danej frazy                         | `PEEK_WORKS` w `_lib/content/peeks.ts`                                           |
| druk wideo startu ze znaków (oczko, czasy składania i frontu, tony) | `GLYPH_REVEAL` w `_lib/glyph-reveal.ts`                                          |
| pory „harmonijki” wejścia (nagłówek, menu, tytuł, kadr)             | `--enter-*` w `globals.css`                                                      |
| siatka: kolumna, tory boczne, górna krawędź menu                    | `--container-column`, `--container-track`, `--spacing-rail` w `globals.css`      |
| menu główne w lewym torze i ⌘K (podstrony)                          | `rail` w `_lib/content/shell.ts`, grupy w `_lib/content/search.ts`               |
| paleta kolorowania składni w blokach kodu                           | `--syntax-*` w `_components/blog/code.css`                                       |
| dekodowanie liter (czas, fala, tempo)                               | stałe na górze `_components/motion/glyph-text.tsx`                               |
| kolory, promień, kolumna, krzywe i czasy ruchu, stopnie pisma       | `globals.css`                                                                    |
| wygląd przycisków, pól, akordeonu, okien, plakietek                 | `_components/ui/*` (zmiany oznaczone `// zeprzalka:`)                            |
| adresy podstron w podglądzie (prefiks `/main-page`)                 | `_lib/routes.ts` — jedyne miejsce                                                |
| kotwice (realizacje, rozdziały wpisu), odstęp pod nagłówkiem        | `_lib/anchors.ts` (`goToAnchor`, `HEADER_OFFSET`)                                |
| `sizes` obrazów                                                     | `_lib/media.ts`                                                                  |
| typografia treści wpisu (MDX)                                       | `_components/blog/article.css` (tylko na wpisach)                                |
| „ogranicz ruch” i animacje „przy wejściu w kadr”                    | reguła na końcu `globals.css` + `_lib/motion.ts`                                 |
| dane strukturalne podstron                                          | `src/lib/page-schema.ts` (wspólne z serwisem)                                    |

Nowy komponent shadcn: `pnpm dlx shadcn@latest add <nazwa>` — `components.json` wskazuje
`_components/ui`. CLI w wersji 4 dopisuje paczkę `cn`: po instalacji `pnpm remove cn` i zamiana
`from "cn"` na `from "@/lib/utils"`. Pytanie o nadpisanie `button.tsx` — zawsze „nie”.

## Struktura

```
src/app/main-page/
  README.md, ZASADY.md
  globals.css                 # tokeny shadcn, siatka, stopnie pisma, ruch       → src/app/globals.css
  (pl)/layout.demo.tsx        # układ główny PL (<html lang="pl">)              → src/app/(pl)/layout.tsx
  (pl)/page.demo.tsx          # start — wariant 1                                → src/app/(pl)/page.tsx
  (pl)/<podstrona>/page.demo.tsx + opengraph-image.demo.tsx   # trasy podstron   → src/app/(pl)/<podstrona>/
  (pl)/not-found.demo.tsx     # 404 dla notFound() w trasach podglądu
  (pl)/design-system/         # żywy katalog systemu
  _components/
    ui/                       # shadcn z CLI (+ choice-group)                    → src/components/ui
    layout/                   # powłoka: nagłówek, logo, ⌘K, motyw, język, menu w torze, spis wpisu, stopka
    sections/                 # sekcje startu (wspólne dla wariantów)
    peek/                     # karty podglądu: tor na marginesie i popover
    page/                     # klocki podstron: nagłówek, sekcja, wiersz etykiety, CTA, listy, galeria
    views/                    # widoki podstron                                   → src/components/views
    blog/                     # treść wpisu: komponenty MDX, blok kodu, film, article.css
    motion/                   # GlyphText — dekodowanie liter ze znaków sygnetu
    seo/                      # JSON-LD
  _lib/
    content/                  # model widoku (serwer): source (cache), shell, home, peeks, search, pages, blog
    routes.ts, metadata.ts    # adresy podglądu (withBase) i noindex (preview)
    anchors.ts, keep-in-view.ts, morph.ts   # kotwice, akordeon w kadrze, przelot kadru
    motion.ts, video.ts, media.ts           # ogranicz ruch i wejście w kadr, wideo w kadrze, sizes
    glyphs.ts, glyph-reveal.ts              # znaki sygnetu, wideo startu z druku ze znaków
    hooks.ts, text.ts, types.ts
  _routes/blog.tsx            # fabryki tras bloga z parametrem                   → src/routes/blog.tsx
  _variants/wariant-1/        # kompozycja startu (kolejne warianty — tylko kompozycja)
  _design-system/             # katalog: rozdziały (`chapters/`), przykłady (`examples/`, kod przykładu = plik),
                              # tokeny czytane z arkuszy (`css-tokens.ts`), nakładka siatki
```

Foldery z podkreślnikiem są prywatne (kolokacja Next): leżą obok tras, ale nie tworzą adresów.

## Jak to działa

**Przepływ danych.** Treść pochodzi z `src/i18n` (teksty) i `src/lib` (posty MDX, portfolio,
usługi). `_lib/content/source.ts` składa je raz na język (`cache`) w model widoku; `shell.ts`,
`home.ts`, `peeks.ts`, `search.ts`, `pages.ts` i `blog.ts` tną z niego to, czego potrzebuje
powłoka, start i podstrony. Widoki są komponentami serwerowymi; do wysp klienckich trafiają
tylko gotowe dane (typy w `_lib/types.ts`).

**Trasy.** Wszystkie statyczne: trasy z segmentem mają `generateStaticParams` i literał
`dynamicParams = false` (parametry z `src/routes/params.ts`, wspólne z serwisem). Metadane to
funkcje serwisu z `src/i18n/page-metadata.ts` opakowane w `preview()` (`noindex`). Karty OG —
te same fabryki co w serwisie (`src/lib/og.tsx`).

**Adresy.** Każdy link wewnętrzny przechodzi przez `_lib/routes.ts` (`pageHref`, `postHref`,
`categoryHref`, `tagHref`, `blogPageHref`, `homeAnchor`), także linki we wpisach MDX.

**Wyspy klienckie** (wszystko inne renderuje serwer): nagłówek (logo z sygnetem, ⌘K ładowane
leniwie, przełącznik języka z `hreflang` strony, motyw), menu główne w lewym torze i spis
rozdziałów wpisu, karty podglądu
(kontekst, tor, popover ładowany leniwie, frazy), listy z akordeonem (kompetencje, portfolio),
lista wpisów startu, formularz, wideo startu, galeria, blok kodu, film YouTube, napisy
dekodowane, „Nowy”, znak stopki, godzina w stopce.

**Karty podglądu.** `PeekProvider` trzyma stan (która karta, przy czym, skąd), `PeekStage` rysuje
kartę w prawym torze (desktop z myszą), `PeekTrigger` i `usePeekHover` podpinają frazy, wiersze
i linki. Poza torem (dotyk, klawiatura) ta sama karta otwiera się jako popover pod frazą.

**Nawigacja.** Menu główne to podstrony: `RailNav` w lewym torze (od 1280 px, w powłoce, na każdej
stronie) i grupa „Podstrony” w ⌘K — sekcji stron jako kotwic nie ma (decyzja 9.11). Jedyne
spisy kotwic to rozdziały wpisu (`TableOfContents`, pod menu) i katalog design systemu.

**Kotwice.** `goToAnchor(id)` to jedyna ścieżka skoku: ustawia hash, pozwala liście realizacji
przejąć zdarzenie (otwiera wiersz bez animacji zwijania), przewija i przenosi fokus.

**Ruch.** Wejście strony to „harmonijka” z samego CSS (`--enter-*`, `enter-stagger`), bloki pod
zgięciem wjeżdżają przy przewijaniu (`reveal`), a wideo startu składa się ze znaków sygnetu na
canvasie (`_lib/glyph-reveal.ts`: atlas znaków, ton komórki z plakatu, front w wideo).

## Jakość

- `pnpm check` przed każdym commitem: treść, testy (`pnpm test` — `node --test` na plikach
  `*.test.ts`, alias `@/` z `scripts/test-hooks.mjs`), klasy, formatowanie, lint, build i kontrola
  HTML. CI buduje też podgląd (`DEMO_PUBLIC=1`), jak Vercel.
- Strona główna serwisu jest nietykalna: `pnpm visual` musi pokazać 0 px.
- Klasy w zapisie kanonicznym (`check:classes`), Prettier sortuje je według tokenów `main-page`.
- Każda iteracja: wpis w `docs/DZIENNIK.md`, otwarte zadania tylko w `docs/ROADMAP.md`.

## Przepięcie

1. Przenosimy system, zwycięski wariant i podstrony w miejsce obecnych (`→` w drzewie wyżej).
2. Zmieniamy `.demo.tsx` na `.tsx`.
3. Raz zamieniamy prefiks importów `@/app/main-page/_components/` → `@/components/`.
4. `BASE = ""` w `_lib/routes.ts`, `preview()` zdjęte z metadanych tras.
5. `src/app/global-error.tsx` importuje `main-page/globals.css` (dziś arkusz serwisu: każda trasa,
   także podgląd, pobiera go z wyprzedzeniem — ok. 17 KB), a `src/app/global-not-found.tsx` dostaje
   `MainShell` i `NotFoundPage` (dziś nieznany adres pokazuje starą 404). Trasa `nie-znaleziono`
   znika.
6. Sprawdzić po buildzie: preload krojów w HTML (dla `.demo.tsx` Next go nie dokleja — stąd CLS
   podglądu przy wczytywaniu krojów) i karty OG każdej podstrony (dziś 404 przez sufiks `.demo`).
7. Wersja angielska nowego systemu (moduły treści są już parami `pl`/`en`).
8. Pozostałe warianty i stare pliki usuwamy w tym samym commicie; obecna strona zostaje w gicie
   jako tag archiwum (np. `v1-archiwum`). Potem usunięcie `/demo`, `DEMO_PUBLIC` i zbędnych
   zależności (`gsap`, `@number-flow/react`, `ogl`).

## Stos

| Obszar    | Wybór                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript strict; wszystko statyczne (SSG), formularz przez Server Action                                         |
| UI        | shadcn/ui (Radix) + Tailwind 4; ikony lucide-react; motyw next-themes (ciemny domyślnie)                                                              |
| ⌘K        | shadcn `Command` (cmdk) w `Dialog`, na telefonie `Drawer` (vaul)                                                                                      |
| Ruch      | CSS (przejścia, `@keyframes`, `tw-animate-css`, animacje sterowane przewijaniem), View Transitions API dla przelotu kadru, Canvas 2D dla wideo startu |
| Treść     | MDX (`next-mdx-remote`, rehype-slug, rehype-highlight), frontmatter walidowany przez zod, i18n własne typowane                                        |
| SEO       | Metadata API + `buildMetadata`, `alternates.ts`, JSON-LD (`schema.ts`, `page-schema.ts`), karty OG                                                    |
