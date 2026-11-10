# main-page — nowa wersja zeprzalka.com

Nowa wersja strony (strona główna i wszystkie podstrony) zbudowana od zera na shadcn/ui
i Tailwind 4, równolegle z działającym serwisem. Dopóki nie nastąpi przepięcie, żyje pod
adresem `/main-page` jako podgląd: po polsku, zawsze `noindex`, poza mapą strony.

Zasady, kryteria i decyzje (normatywne): **[ZASADY.md](ZASADY.md)**. Ten plik opisuje, co jest,
gdzie leży, jak działa i jak to uruchomić.

## Stan (10.11.2026)

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
| siatka: kolumna, tory boczne, górna krawędź torów                   | `--container-column`, `--container-track`, `--spacing-rail` w `globals.css`      |
| menu główne w lewym torze i ⌘K (podstrony)                          | `rail` w `_lib/content/shell.ts`, grupy w `_lib/content/search.ts`               |
| spis rozdziałów wpisu (prawy tor, chowanie za treścią)              | `_components/layout/table-of-contents.tsx`, `data-toc-scope` w widoku            |
| tekst wypełniany przewijaniem („O mnie”): granica, linia, ton       | `scroll-fill`, `@keyframes fill` i `--fill-from` w `globals.css`                 |
| karta podglądu: treść, krzyżyk, link                                | `_components/peek/peek-card.tsx` (nazwa krzyżyka: `ui.closeCard`)                |
| strzałka linku ↗                                                    | `_components/page/link-arrow.tsx` (`LinkArrow` + `group/link` na linku)          |
| wezwanie na końcu podstrony (najwyżej dwa działania)                | `_components/page/cta-panel.tsx`                                                 |
| rodzaje projektu w formularzu (wybór wielokrotny)                   | `contact.projectTypes` w `src/i18n/content/main-page.ts`                         |
| paleta kolorowania składni w blokach kodu                           | `--syntax-*` w `_components/blog/code.css`                                       |
| dekodowanie liter (czas, fala, tempo)                               | stałe na górze `_components/motion/glyph-text.tsx`                               |
| kolory, promień, kolumna, krzywe i czasy ruchu, stopnie pisma       | `globals.css`                                                                    |
| wygląd przycisków, pól, akordeonu, okien, plakietek                 | `_components/ui/*` (zmiany oznaczone `// zeprzalka:`)                            |
| adresy podstron w podglądzie (prefiks `/main-page`)                 | `_lib/routes.ts` — jedyne miejsce                                                |
| kotwice (realizacje, rozdziały wpisu), odstęp pod nagłówkiem        | `_lib/anchors.ts` (`goToAnchor`, `HEADER_OFFSET`)                                |
| `sizes` obrazów                                                     | `_lib/media.ts`                                                                  |
| typografia treści wpisu (MDX), tytuł wpisu                          | `_components/blog/article.css` (tylko na wpisach), `text-title` w `globals.css`  |
| kompilacja MDX nowej wersji (komponenty, aliasy kolorowania)        | `_components/blog/render-article.ts`                                             |
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
    page/                     # klocki podstron: nagłówek, sekcja, wiersz etykiety, CTA, listy, galeria, strzałka linku
    views/                    # widoki podstron                                   → src/components/views
    blog/                     # treść wpisu: renderArticle, komponenty MDX, blok kodu, film, article.css
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
leniwie, przełącznik języka z `hreflang` strony, motyw), menu główne w lewym torze, spis
rozdziałów wpisu w prawym, karty podglądu
(kontekst, tor, popover ładowany leniwie, frazy), listy z akordeonem (kompetencje, portfolio),
lista wpisów startu, formularz, wideo startu, galeria, blok kodu, film YouTube, napisy
dekodowane, „Nowy”, znak stopki, godzina w stopce.

**Karty podglądu.** `PeekProvider` trzyma stan (która karta, przy czym, skąd) i nazwę krzyżyka,
`PeekStage` rysuje kartę w prawym torze (desktop z myszą), `PeekTrigger` i `usePeekHover`
podpinają frazy, wiersze i linki. Poza torem (dotyk, klawiatura) ta sama karta otwiera się jako
popover pod frazą. Każda karta ma krzyżyk (`PeekCard onClose`).

**Nawigacja.** Menu główne to podstrony: `RailNav` w lewym torze (od 1280 px, w powłoce, na każdej
stronie) i grupa „Podstrony” w ⌘K — sekcji stron jako kotwic nie ma (decyzja 9.11). Jedyne
spisy kotwic to rozdziały wpisu i katalog design systemu (`TableOfContents` w prawym torze).
Przejście na inną stronę zaczyna od góry od razu (`data-scroll-behavior` na `<html>`), a fokus
przechodzi na `<main>` (`HashFocus`).

**Kotwice.** `goToAnchor(id)` to jedyna ścieżka skoku: ustawia hash, pozwala liście realizacji
przejąć zdarzenie (otwiera wiersz bez animacji zwijania), przewija i przenosi fokus.

**Ruch.** Wejście strony to „harmonijka” z samego CSS (`--enter-*`, `enter-stagger`), bloki pod
zgięciem wjeżdżają przy przewijaniu (`reveal`), a wideo startu składa się ze znaków sygnetu na
canvasie (`_lib/glyph-reveal.ts`: atlas znaków, ton komórki z plakatu, front w wideo).

## Gotowość do wdrożenia (10.11.2026)

Ocena po iteracji 13: dwa niezależne audyty (UX z dostępnością i wydajnością na buildzie
produkcyjnym; seniorski przegląd kodu) i poprawki ich znalezisk. Skala 1–10; przepinamy przy 10
w każdym wierszu. Braki są też w `docs/ROADMAP.md`.

| Obszar | Ocena | Stan | Brakuje do 10 |
| --- | --- | --- | --- |
| Wygląd i UX | 8,5 | Wszystkie serie poprawek właściciela wdrożone i sprawdzone w przeglądarce | Odbiór właściciela na telefonie; decyzje: menu na telefonie, spis rozdziałów nad treścią, sygnet bez pauzy |
| Architektura | 9 | Jeden przepływ danych (`src/i18n` + `src/lib` → `getSource` → widoki serwerowe → małe wyspy), jedna mapa adresów, izolacja pilnowana ESLintem | Indeks ⌘K pobierany z oknem (dziś w ładunku każdej strony); `cva` i `tailwind-merge` poza paczką klienta |
| Jakość kodu | 8,5 | Małe pliki z komentarzem „dlaczego”, Prettier na całym `src` (dotąd pomijał `content/`), klasy w zapisie kanonicznym | Ręczny przegląd właściciela; najdłuższe pliki (`glyph-reveal.ts`, `search-dialog.tsx`, `work-list.tsx`) do ewentualnego podziału |
| Poprawność | 8,5 | Naprawione: zepsuty hash wywracał stronę, zamknięcie ⌘K przewijało o 450–900 px, kropka spisu po zmianie szerokości, fokus w warstwie `aria-hidden` | Testy logiki interakcji (karty podglądu, spis, `useEdgeAbove`); sztuczka LCP wideo opiera się na heurystyce Chrome |
| Dostępność | 9 | axe: 0 naruszeń WCAG 2.2 AA i dobrych praktyk w 140 przebiegach (16 tras × 2 motywy × 390/1440 × ruch/bez ruchu); klawiatura, „ogranicz ruch”, wydruk | Odstępstwo WCAG 2.2.2 (sygnet, decyzja właściciela); linki tekstowe i plakietki poniżej 44 px (próg AA 24 px spełniony) |
| Wydajność | 8,5 | LCP 0,1–0,2 s (desktop), 0,7–1,8 s (telefon, wolne 4G, CPU ×4); JS na start ok. 210 KB gz (na granicy budżetu), CSS ok. 15 KB gz; INP < 160 ms | CLS z podmiany krojów w podglądzie (0,1–0,3; z preloadem krojów zmierzone 0) — do potwierdzenia po przepięciu; LCP portfolio na telefonie blisko budżetu |
| SEO | 8,5 | Semantyka, metadane `buildMetadata`, hreflang, JSON-LD każdego typu strony; podgląd celowo `noindex` | Karty OG i preload krojów działają dopiero po przepięciu (sufiks `.demo`); `check:build` nie obejmuje podglądu |
| Bezpieczeństwo | 9 | Akcja formularza: walidacja zod, CRLF i HTML zneutralizowane, limity długości, pułapka, limit wysyłek; filtr schematów linków w MDX | Limit liczy też odrzucone wysyłki (wspólne z serwisem); limit w pamięci instancji |
| Design system | 9 | Żywy katalog 12 rozdziałów z kodem z plików i tokenami czytanymi z arkuszy, zgodny z iteracją 13 | Regresja wizualna i axe dla podglądu w CI; HTML katalogu ok. 1,3 MB |
| Testy | 5 | 20 testów jednostkowych (adresy, typografia, nazwy animacji, dopasowanie ⌘K, rodzaje projektu) | Testy interakcji; automatyczny axe, przepełnienie i LCP dla `/main-page` w CI |
| Kompletność do przepięcia | 6 | Wszystkie podstrony PL w nowym systemie | Wersja angielska nowego systemu; kroki z „Przepięcia” (404, `global-error`, OG, preload krojów) |

**Ogółem: 8 / 10** — gotowe do ręcznego przeglądu kodu i testów właściciela, jeszcze nie do
przepięcia (brak wersji EN i testów automatycznych podglądu).

## Przegląd kodu — od czego zacząć

Kolejność czytania, w której każdy plik tłumaczy następny (ok. 2 h na całość):

1. **`ZASADY.md`** — reguły, kryteria i świadome odstępstwa (§10): to, co wygląda na błąd, a jest decyzją.
2. **`globals.css`** — tokeny shadcn, siatka (`column`, `rail`, `stage-track`), stopnie pisma, pory
   „harmonijki” i całe CSS ruchu (`enter-stagger`, `reveal`, `scroll-fill`, `uncover`).
3. **`_components/layout/main-shell.tsx`** — szkielet dokumentu: motyw, nagłówek, menu w torze,
   `<main>`, stopka.
4. **`_lib/content/source.ts` → `home.ts` / `pages.ts`** — jedyny przepływ danych: `src/i18n` +
   `src/lib` → model widoku (typy w `_lib/types.ts`) → komponenty serwerowe.
5. **`_variants/wariant-1/home-page.tsx` i `_components/sections/*`** — start jako kompozycja sekcji.
6. **`_components/peek/*`** — najbardziej złożona interakcja: kontekst (dwa konteksty — akcje
   stałe, stan zmienny), karta w torze (`peek-stage.tsx`), popover (`peek-popover.tsx`), frazy.
7. **`_components/sections/hero-video.tsx` + `_lib/glyph-reveal.ts`** — LCP pod zasłoną i druk
   ze znaków na canvasie (stan komórek, atlas, front).
8. **`_components/layout/search-*.tsx`** — ⌘K ładowane leniwie; filtrowanie po naszej stronie.
9. **`_components/views/post-page.tsx` + `_components/blog/*`** — wpis: `renderArticle`, spis
   rozdziałów, `article.css`, `code.css`.
10. **`_components/ui/*`** — shadcn z CLI; każda nasza zmiana ma komentarz `// zeprzalka:`
    (`grep -rn "zeprzalka:" _components/ui`).

Testy: `*.test.ts` obok czystych funkcji (`pnpm test`). Wspólne z serwisem i dotknięte przez
nową wersję: `src/lib/mdx.ts` (opcje kolorowania), `src/lib/utils.ts` (tokeny w `tailwind-merge`),
`src/app/actions/contact.ts` (lista rodzajów projektu) — stara strona działa i wygląda bez zmian
(`pnpm visual --all`: 0 px).

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
