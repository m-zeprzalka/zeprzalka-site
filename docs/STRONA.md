# Strona — warstwa widoku i design system

Wygląd i zachowanie zeprzalka.com: strona główna i wszystkie podstrony w dwóch językach,
zbudowane od zera na shadcn/ui i Tailwind 4 (iteracje 8–13 jako podgląd `/main-page`,
na głównej domenie od przepięcia 10.11.2026). Poprzednia wersja jest w tagu `v1-archiwum`.

Zasady, kryteria i decyzje (normatywne): **[ZASADY.md](ZASADY.md)**. Ten plik opisuje, co
jest, gdzie leży i jak działa. Polecenia, publikacja i dwujęzyczność — [README](../README.md).

## Strony

| Strona                | Polski                                         | Angielski                                       | Widok (`src/components/views/`) |
| --------------------- | ---------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| Start                 | `/`                                            | `/en`                                           | `home-page.tsx`                 |
| Usługi                | `/uslugi`                                      | `/en/services`                                  | `services-page.tsx`             |
| Portfolio             | `/portfolio`                                   | `/en/portfolio`                                 | `portfolio-page.tsx`            |
| O mnie (biogram i CV) | `/o-mnie`                                      | `/en/about`                                     | `about-page.tsx`                |
| Kontakt               | `/kontakt`                                     | `/en/contact`                                   | `contact-page.tsx`              |
| Polityka prywatności  | `/polityka-prywatnosci`                        | `/en/privacy`                                   | `privacy-page.tsx`              |
| Blog i archiwum       | `/blog`, `/blog/strona/[strona]`               | `/en/blog`, `/en/blog/page/[page]`              | `blog-page.tsx`                 |
| Kategorie             | `/blog/kategoria`                              | `/en/blog/category`                             | `categories-page.tsx`           |
| Kategoria, tag        | `/blog/kategoria/[kategoria]`, `/blog/tag/[tag]` | `/en/blog/category/[category]`, `/en/blog/tag/[tag]` | `taxonomy-page.tsx`        |
| Wpis                  | `/blog/[slug]`                                 | `/en/blog/[slug]`                               | `post-page.tsx`                 |
| 404, błąd             | każdy nieznany adres                           | `notFound()` w trasach `/en`                    | `not-found-page.tsx`, `error-view.tsx` |
| Design system         | `/design-system` (`noindex`, tylko po polsku)  | —                                               | `src/design-system/`            |

Dawne adresy podglądu (`/main-page/…`) przekierowują na te same strony bez prefiksu
(`next.config.ts`, 308).

## Gdzie co zmieniać

| Co                                                                  | Gdzie                                                                       |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| napisy interfejsu, frazy otwierające karty, liczby, rodzaje projektu | `src/i18n/content/ui.ts` (podstrony: `pages.ts`, `common.ts`, `legal.ts`)  |
| pakiety i ceny                                                      | `src/lib/services.ts`                                                       |
| realizacje (opisy, kategorie, plakaty, wideo)                       | `src/lib/portfolio.ts`                                                      |
| wpisy bloga                                                         | `content/posts/*.mdx`, `content/en/posts/*.mdx`                             |
| które realizacje pokazuje karta danej frazy                         | `PEEK_WORKS` w `src/lib/content/peeks.ts`                                   |
| druk wideo startu ze znaków (oczko, czasy składania i frontu, tony) | `GLYPH_REVEAL` w `src/lib/glyph-reveal.ts`                                  |
| pory „harmonijki” wejścia (nagłówek, menu, tytuł, kadr)             | `--enter-*` w `src/app/globals.css`                                         |
| siatka: kolumna, tory boczne, górna krawędź torów                   | `--container-column`, `--container-track`, `--spacing-rail` w `globals.css` |
| menu główne w lewym torze i ⌘K (podstrony)                          | `rail` w `src/lib/content/shell.ts`, grupy w `src/lib/content/search.ts`    |
| spis rozdziałów wpisu (prawy tor, chowanie za treścią)              | `src/components/layout/table-of-contents.tsx`, `data-toc-scope` w widoku    |
| tekst wypełniany przewijaniem („O mnie”): granica, linia, ton       | `scroll-fill`, `@keyframes fill` i `--fill-from` w `globals.css`            |
| karta podglądu: treść, krzyżyk, link                                | `src/components/peek/peek-card.tsx` (nazwa krzyżyka: `ui.closeCard`)        |
| strzałka linku ↗                                                    | `src/components/page/link-arrow.tsx` (`LinkArrow` + `group/link` na linku)  |
| wezwanie na końcu podstrony (najwyżej dwa działania)                | `src/components/page/cta-panel.tsx`                                         |
| dopasowanie w ⌘K                                                    | `src/lib/search-match.ts`                                                   |
| kolory, promień, krzywe i czasy ruchu, stopnie pisma                | `src/app/globals.css`                                                       |
| wygląd przycisków, pól, akordeonu, okien, plakietek                 | `src/components/ui/*` (zmiany oznaczone `// zeprzalka:`)                    |
| adresy podstron, wpisów, kategorii i tagów                          | `src/lib/routes.ts` (mapa ścieżek: `src/i18n/config.ts`)                    |
| kotwice (realizacje, rozdziały wpisu), odstęp pod nagłówkiem        | `src/lib/anchors.ts` (`goToAnchor`, `hashId`, `HEADER_OFFSET`)              |
| `sizes` obrazów                                                     | `src/lib/media.ts`                                                          |
| typografia treści wpisu (MDX), tytuł wpisu                          | `src/components/blog/article.css`, `text-title` w `globals.css`             |
| kompilacja MDX (komponenty, aliasy kolorowania, polska typografia)  | `src/components/blog/render-article.ts`                                     |
| paleta kolorowania składni                                          | `--syntax-*` w `src/components/blog/code.css`                               |
| dekodowanie liter (czas, fala, tempo)                               | stałe na górze `src/components/motion/glyph-text.tsx`                       |
| „ogranicz ruch” i animacje „przy wejściu w kadr”                    | reguła na końcu `globals.css` + `src/lib/motion.ts`                         |
| dane strukturalne podstron                                          | `src/lib/page-schema.ts`                                                    |

Nowy komponent shadcn: `pnpm dlx shadcn@latest add <nazwa>` — `components.json` wskazuje
`src/components/ui`. CLI w wersji 4 dopisuje paczkę `cn`: po instalacji `pnpm remove cn`
i zamiana `from "cn"` na `from "@/lib/utils"`. Pytanie o nadpisanie `button.tsx` — zawsze „nie”.

## Struktura

```
src/
  app/
    globals.css               # tokeny shadcn, siatka, stopnie pisma, cały CSS ruchu
    (pl)/  en/                # trasy obu języków: cienkie pliki nad widokami i fabrykami
    global-not-found.tsx      # 404 nieznanych adresów w powłoce (MainShell + NotFoundPage)
    global-error.tsx          # błąd w samym układzie — własny dokument
    demo/                     # PIASKOWNICA: trasy *.demo.tsx, osobny arkusz (README w środku)
  components/
    ui/                       # shadcn z CLI (+ choice-group)
    layout/                   # powłoka: nagłówek, logo, ⌘K, motyw, język, menu i spis w torach, stopka
    sections/                 # sekcje strony głównej
    peek/                     # karty podglądu: tor na marginesie i popover
    page/                     # klocki podstron: nagłówek, sekcja, wiersz etykiety, CTA, listy, galeria, strzałka
    views/                    # widoki stron — jeden na stronę, wspólny dla obu języków
    blog/                     # treść wpisu: renderArticle, komponenty MDX, blok kodu, film, article.css
    motion/                   # GlyphText — dekodowanie liter ze znaków sygnetu
    seo/                      # JSON-LD
    demo/                     # PIASKOWNICA — system „Forma” i dawne propozycje (spec ruchu)
  lib/
    content/                  # model widoku (serwer): source (cache), shell, home, peeks, search, pages, blog
    routes.ts anchors.ts      # adresy, kotwice
    keep-in-view.ts morph.ts  # akordeon w kadrze, przelot kadru
    motion.ts video.ts media.ts           # ogranicz ruch i wejście w kadr, wideo w kadrze, sizes
    glyphs.ts glyph-reveal.ts             # znaki sygnetu, wideo startu z druku ze znaków
    hooks.ts text.ts types.ts search-match.ts …
    posts.ts mdx.ts og.tsx schema.ts page-schema.ts services.ts portfolio.ts mail.ts …   # dane i serwer
  routes/                     # fabryki tras bloga (blog.tsx z widokami, blog-routes.tsx, params.ts)
  design-system/              # katalog /design-system: rozdziały, przykłady (kod przykładu = plik), tokeny z arkuszy
  i18n/                       # teksty (pary pl/en), mapa adresów, metadane, formatowanie
  hooks/                      # hooki piaskownicy /demo
```

## Jak to działa

**Przepływ danych.** Treść pochodzi z `src/i18n` (teksty) i `src/lib` (posty MDX, portfolio,
usługi). `src/lib/content/source.ts` składa je raz na język (`cache`) w model widoku;
`shell.ts`, `home.ts`, `peeks.ts`, `search.ts`, `pages.ts` i `blog.ts` tną z niego to, czego
potrzebuje powłoka, start i podstrony. Widoki są komponentami serwerowymi; do wysp
klienckich trafiają tylko gotowe dane (typy w `src/lib/types.ts`).

**Trasy.** Wszystkie statyczne: trasy z segmentem mają `generateStaticParams` i literał
`dynamicParams = false` (parametry z `src/routes/params.ts`). Metadane: `src/i18n/page-metadata.ts`,
karty OG: fabryki `src/lib/og.tsx`. Każdy link wewnętrzny przechodzi przez `src/lib/routes.ts`.

**Wyspy klienckie** (wszystko inne renderuje serwer): nagłówek (logo z sygnetem, ⌘K ładowane
leniwie, przełącznik języka — odpowiednik strony z `counterpart()` już w HTML, motyw), menu główne w lewym torze, spis
rozdziałów wpisu w prawym, karty podglądu (kontekst, tor, popover ładowany leniwie, frazy),
listy z akordeonem (kompetencje, portfolio), lista wpisów startu, formularz, wideo startu,
galeria, blok kodu, film YouTube, napisy dekodowane, „Nowy”, znak stopki, godzina w stopce.

**Karty podglądu.** `PeekProvider` trzyma stan (która karta, przy czym, skąd) i nazwę krzyżyka,
`PeekStage` rysuje kartę w prawym torze (desktop z myszą), `PeekTrigger` i `usePeekHover`
podpinają frazy, wiersze i linki. Poza torem (dotyk, klawiatura) ta sama karta otwiera się jako
popover pod frazą. Każda karta ma krzyżyk (`PeekCard close`).

**Nawigacja.** Menu główne to podstrony: `RailNav` w lewym torze (od 1280 px, w powłoce, na każdej
stronie) i grupa „Podstrony” w ⌘K. Jedyne spisy kotwic to rozdziały wpisu i katalog design
systemu (`TableOfContents` w prawym torze). Przejście na inną stronę zaczyna od góry od razu
(`data-scroll-behavior` na `<html>`), a fokus przechodzi na `<main>` (`HashFocus`).

**Kotwice.** `goToAnchor(id)` to jedyna ścieżka skoku: ustawia hash, pozwala liście realizacji
przejąć zdarzenie (otwiera wiersz bez animacji zwijania), przewija i przenosi fokus. Hash
z adresu czyta tylko `hashId()` (zepsuty nie wywraca strony).

**Ruch.** Wejście strony to „harmonijka” z samego CSS (`--enter-*`, `enter-stagger`), bloki pod
zgięciem wjeżdżają przy przewijaniu (`reveal`), a wideo startu składa się ze znaków sygnetu na
canvasie (`src/lib/glyph-reveal.ts`: atlas znaków, ton komórki z plakatu, front w wideo).

## Gotowość (10.11.2026, po przepięciu)

Skala 1–10, braki do 10/10 są też w `docs/ROADMAP.md`.

| Obszar | Ocena | Stan | Brakuje do 10 |
| --- | --- | --- | --- |
| Wygląd i UX | 8,5 | Wszystkie serie poprawek właściciela wdrożone; wersja EN na tym samym systemie | Odbiór właściciela na telefonie; decyzje: menu na telefonie, spis rozdziałów nad treścią, sygnet bez pauzy |
| Architektura | 9 | Jeden przepływ danych (`src/i18n` + `src/lib` → `getSource` → widoki serwerowe → małe wyspy), jedna mapa adresów, piaskownica odcięta ESLintem | Indeks ⌘K pobierany z oknem (dziś w ładunku każdej strony); `cva` i `tailwind-merge` poza paczką klienta |
| Jakość kodu | 8,5 | Małe pliki z komentarzem „dlaczego”, Prettier na całym `src`, klasy w zapisie kanonicznym, stary kod widoku usunięty | Ręczny przegląd właściciela; najdłuższe pliki (`glyph-reveal.ts`, `work-list.tsx`) do ewentualnego podziału |
| Poprawność | 8,5 | Naprawione w iteracji 13: zepsuty hash, przewijanie po ⌘K, kropka spisu, fokus w warstwie `aria-hidden` | Testy logiki interakcji (karty podglądu, spis, `useEdgeAbove`); sztuczka LCP wideo opiera się na heurystyce Chrome |
| Dostępność | 9 | axe: 0 naruszeń WCAG 2.2 AA i dobrych praktyk (obie wersje językowe, oba motywy, 390/1440); klawiatura, „ogranicz ruch”, wydruk | Odstępstwo WCAG 2.2.2 (sygnet, decyzja właściciela); linki tekstowe i plakietki poniżej 44 px (próg AA 24 px spełniony) |
| Wydajność | 9 | Po przepięciu preload krojów działa: CLS 0,000 na wszystkich trasach; LCP 0,1–0,5 s (desktop i telefon, lokalny build) | Pomiar PSI na żywo; LCP portfolio na wolnym telefonie blisko budżetu; JS na start na granicy budżetu (ok. 210 KB gz) |
| SEO | 9 | Te same adresy co przed przepięciem (90 w mapie strony, 200, canonical, hreflang), JSON-LD, karty OG z buildu, `/main-page/*` → 308 | Weryfikacja w Search Console po wdrożeniu (właściciel) |
| Bezpieczeństwo | 9 | Akcja formularza: zod, CRLF i HTML zneutralizowane, limity długości, pułapka, limit wysyłek; filtr schematów linków w MDX; nagłówki i CSP bez zmian | Limit liczy też odrzucone wysyłki; limit w pamięci instancji |
| Design system | 9 | Żywy katalog `/design-system` (12 rozdziałów) zgodny z kodem | Regresja wizualna i axe w CI; HTML katalogu ok. 1,3 MB |
| Testy | 5 | 19 testów jednostkowych (adresy, typografia, nazwy animacji, dopasowanie ⌘K, rodzaje projektu) | Testy interakcji; automatyczny axe, przepełnienie i LCP w CI |

**Ogółem: 8,5 / 10.** Strona jest na głównej domenie w obu językach; do 10 brakuje testów
automatycznych i odbioru właściciela.

## Przegląd kodu — od czego zacząć

Kolejność czytania, w której każdy plik tłumaczy następny (ok. 2 h na całość):

1. **`docs/ZASADY.md`** — reguły, kryteria i świadome odstępstwa (§10): to, co wygląda na błąd, a jest decyzją.
2. **`src/app/globals.css`** — tokeny shadcn, siatka (`column`, `rail`, `stage-track`), stopnie
   pisma, pory „harmonijki” i całe CSS ruchu (`enter-stagger`, `reveal`, `scroll-fill`, `uncover`).
3. **`src/components/layout/main-shell.tsx`** — szkielet dokumentu: motyw, nagłówek, menu w torze,
   `<main>`, stopka.
4. **`src/lib/content/source.ts` → `home.ts` / `pages.ts`** — jedyny przepływ danych: `src/i18n` +
   `src/lib` → model widoku (typy w `src/lib/types.ts`) → komponenty serwerowe.
5. **`src/components/views/home-page.tsx` i `src/components/sections/*`** — start jako kompozycja sekcji.
6. **`src/components/peek/*`** — najbardziej złożona interakcja: kontekst (dwa konteksty — akcje
   stałe, stan zmienny), karta w torze (`peek-stage.tsx`), popover (`peek-popover.tsx`), frazy.
7. **`src/components/sections/hero-video.tsx` + `src/lib/glyph-reveal.ts`** — LCP pod zasłoną
   i druk ze znaków na canvasie (stan komórek, atlas, front).
8. **`src/components/layout/search-*.tsx`** — ⌘K ładowane leniwie; dopasowanie po słowach.
9. **`src/components/views/post-page.tsx` + `src/components/blog/*`** — wpis: `renderArticle`, spis
   rozdziałów, `article.css`, `code.css`.
10. **`src/components/ui/*`** — shadcn z CLI; każda nasza zmiana ma komentarz `// zeprzalka:`
    (`grep -rn "zeprzalka:" src/components/ui`).

Testy: `*.test.ts` obok czystych funkcji (`pnpm test`).

## Stos

| Obszar    | Wybór                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript strict; wszystko statyczne (SSG), formularz przez Server Action                                         |
| UI        | shadcn/ui (Radix) + Tailwind 4; ikony lucide-react; motyw next-themes (ciemny domyślnie)                                                              |
| ⌘K        | shadcn `Command` (cmdk) w `Dialog`, na telefonie `Drawer` (vaul)                                                                                      |
| Ruch      | CSS (przejścia, `@keyframes`, `tw-animate-css`, animacje sterowane przewijaniem), View Transitions API dla przelotu kadru, Canvas 2D dla wideo startu |
| Treść     | MDX (`next-mdx-remote`, rehype-slug, rehype-highlight), frontmatter walidowany przez zod, i18n własne typowane                                        |
| SEO       | Metadata API + `buildMetadata`, `alternates.ts`, JSON-LD (`schema.ts`, `page-schema.ts`), karty OG                                                    |
