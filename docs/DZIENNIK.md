# Dziennik zmian

Każda iteracja pracy nad serwisem dopisuje tu wpis: co zrobiono, jak to
sprawdzono, co zostało otwarte. Najnowszy wpis jest na górze. Szczegóły
diagnozy są w [AUDYT-2026-11.md](AUDYT-2026-11.md), a lista zadań w
[ROADMAP.md](ROADMAP.md).

**Zasada:** wpis powstaje razem z kodem, w tej samej gałęzi. Iteracja bez wpisu
w dzienniku nie jest skończona.

---

## Iteracja 2 — 3 listopada 2026: jakość kodu, piaskownica, kierunek wizualny

Gałąź `audyt-2026-11` (dalej niewdrożona). Zakres wyznaczony przez właściciela:
(1) kod, struktura, wydajność, SEO i hosting na poziomie seniorskim — **bez zmiany
tekstów na stronie**; (2) audyt UX/UI, nowy kierunek (monochrom, „chirurgiczna
i architektoniczna precyzja z designerskim sznytem”), dawne dema do wglądu
w odizolowanym folderze i jedno nowe demo strony głównej.

### Jak pracowaliśmy

- Trzy niezależne przeglądy równolegle: kod (cały `src/`, konfiguracja), UX/UI
  produkcji (138 zrzutów, oba motywy, dwie szerokości), research inspiracji
  i narzędzi (151 zweryfikowanych linków). Raporty: `docs/prywatne/raporty-2026-11/iteracja-2/`.
- Każda zmiana pliku strony głównej sprawdzona porównaniem pikseli z punktem
  wyjścia (19 stron × 1440/390 px). **Strona główna PL i EN: 0 px różnicy
  w każdej partii.**
- Metadane wszystkich 86 adresów z mapy strony porównane przed i po
  (tytuły, canonical, hreflang, Open Graph, JSON-LD) — każda różnica zamierzona.
- Style wyliczone treści wpisów porównane przed i po (5 wpisów, 2 motywy).

### Commity

| Commit | Co |
| --- | --- |
| `feat(demo): piaskownica /demo` | trzy warianty z sierpnia z powrotem do wglądu — w izolacji (niżej) |
| `refactor: konsolidacja kodu…` | błędy z przeglądu, fabryki tras i kart OG, jedna karta wpisu, granica serwer/klient |
| `chore: higiena kodu i konfiguracji` | tsconfig, ESLint, jeden pakiet Radix, cache, hosting, CtaPanel |
| `style: formatowanie Prettierem` | jednorazowe formatowanie + `pnpm format:check` w CI |
| `ci: strażnik strony głównej` | `pnpm visual` i workflow porównujący `/` i `/en` z `main` |
| `refactor: katalog /design-system…` | katalog renderuje prawdziwy `PostCard` |
| `feat(demo): „Precyzja”` | nowa strona główna i specimen systemu w piaskownicy |

### Naprawione błędy (widoczne dla czytelnika lub robota)

- Polska odmiana: „11 **artykułów** w tej kategorii” (było „11 artykuły”), także na
  kartach udostępniania bloga i kategorii — `plural()` na `Intl.PluralRules`.
- Spis treści wpisów pokazywał surowy markdown (`**InstaWP**`, `` `const` ``) w ok. 10 wpisach.
- Kod w linii we wpisach nie miał tła ani obrysu (reguła `hsl(var(--muted))` przy
  tokenach w `oklch`, z `!important`) — przywrócony zamierzony wygląd.
- Tabele we wpisach były `display: block` (traciły semantykę w czytnikach) — teraz
  tabela w przewijanym kontenerze.
- `/design-system` pokazywał fałszywe wartości ciemnej palety dla 16 tokenów.
- JSON-LD oferty: `Service` zamiast `ProfessionalService` (wymagał adresu siedziby),
  bez polskiego „od” w wersji angielskiej; okruszki na `/portfolio`.
- `og:title` bez sufiksu marki na każdej stronie (było niekonsekwentnie),
  `rel=author` → `/o-mnie`, `en-GB` / `en_GB` zgodnie z brytyjskim copy, daty w UTC.
- Awatar autora pod wpisem był pusty do hydratacji (Radix Avatar) — `next/image`.
- Nieaktywne „Poprzednia/Następna” w paginacji były linkiem do bieżącej strony.

### Struktura i kod

- **20 plików `opengraph-image.tsx`** → po 6–8 linii nad fabrykami w `src/lib/og.tsx`.
- **8 lustrzanych tras bloga** (PL/EN) → re-eksport z `src/routes/blog.tsx`
  (literałem zostaje tylko `dynamicParams`, które Next czyta statycznie).
- **Jedna karta wpisu** `PostCard` (było 3 kopie + kopia w katalogu), `TaxonomyView`
  zamiast `CategoryView` + `TagView`, `CtaPanel` zamiast 3 paneli, `HomeSection`
  zamiast 4 kopii nagłówka sekcji, `StatusBadge`.
- `src/lib/posts.ts`: jeden indeks taksonomii (`getTerms`, `getTerm`) zamiast 7
  bliźniaczych funkcji; memo treści przy buildzie; czas lektury jako liczba.
- `src/i18n/format.ts` (interpolacja, liczebniki, daty, liczby, czas lektury),
  `src/i18n/navigation.ts` (jedna lista menu), `src/i18n/content/system.ts`
  (teksty 404 i błędu), `src/lib/blog-pages.ts` (paginacja), `src/lib/escape.ts`.
- `ROUTES` (strony) oddzielone od `PATH_BASES` (prefiksy bez własnej strony).
- Martwy kod: tokeny `sidebar-*` i `chart-*`, komponenty avatar/tooltip/skeleton,
  klucze copy bez użycia, `theme-provider` (przelotka), martwe gałęzie, nieaktualne komentarze.
- Nazwy: `ThemeToggle`, `ReadingProgress`, `PortfolioPreview`, `ErrorPage`.

### Wydajność

- Teksty do komponentów klienckich przez propsy: moduły treści w obu językach
  nie trafiają już do JavaScriptu przeglądarki. `Hero` i `Logo` serwerowe
  (klienckie zostały tylko `HeroVideo` i `LogoGlyph`), `Separator` bez Radiksa.
- Panel menu mobilnego (Radix Dialog) ładowany przy pierwszym dotknięciu.
- **−11…13 KB gzip JS na każdej stronie** (`/`: 224,5 → 213,4 KB; wpis 220,3 → 207,1 KB).
- Jeden pakiet `radix-ui` zamiast czterech (w lockfile była podwójna wersja `react-slot`).

### Konfiguracja i hosting

- `tsconfig`: `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `noUnused*`,
  `noImplicitReturns`, `noImplicitOverride`, `target: ES2022`.
- ESLint: `consistent-type-imports`, `jsx-no-useless-fragment` i **twarda granica
  piaskownicy** (serwis nie może importować z `/demo`).
- Prettier z sortowaniem klas Tailwinda, `.editorconfig`, `.env.example`.
- `vercel.json`: region **fra1** (Frankfurt, było `iad1` — Waszyngton) i **Fluid
  Compute**; `engines.node: 24.x`.
- Cache mediów z `public/`: jedna reguła, tydzień + rewalidacja w tle (było: rok
  `immutable` dla wideo o niewersjonowanych nazwach); `robots.txt` bez dyrektywy
  `host`; maskowalna ikona PWA z marginesem bezpieczeństwa; `themeColor`.
- CI: na każdą gałąź, `permissions: contents: read`, Node z `.nvmrc`, formatowanie,
  cache `.next`. **Nowy workflow „Strona główna — regresja wizualna”.**

### Piaskownica `/demo` i kierunek wizualny

- `/demo` — odizolowane miejsce na pracę kreatywną (`src/app/demo`,
  `src/components/demo`): własny układ i arkusz, `@source not` w `globals.css`,
  zakaz importów w ESLint, pliki tras `*.demo.tsx` rozpoznawane **tylko poza
  produkcją** (`pageExtensions`) — build produkcyjny nie zawiera ani bajtu dem.
- Dawne warianty z 25.08: `/demo/main-secondary`, `/demo/main-third`, `/demo/main-fourth`.
- **Nowe demo `/demo/precyzja`** i specimen `/demo/precyzja/system` — opis
  w [KIERUNEK-WIZUALNY.md](KIERUNEK-WIZUALNY.md).

### Otwarte po iteracji 2

- Wdrożenie gałęzi (ROADMAP.md, „Dzień 0”) — nic nie jest wypchnięte.
- Angielska strona 404 dla `/en/*` (statyczna `global-not-found` nie zna adresu).
- Zmiany wyglądu strony głównej czekające na decyzję: pole wiadomości w formularzu
  (inne tło w ciemnym motywie, 14 px → zoom na iOS), `md:font-semibold`, kursor na
  kaflach portfolio, `h-dvh` w menu mobilnym, ujednolicenie odstępów sekcji.
- Wszystko z AUDYT-2026-11.md §4–5 (decyzje i dane właściciela).

---

## Iteracja 1 — 2 listopada 2026: pełny audyt i refaktor

Pięć niezależnych audytów (SEO, UX/UI, wydajność, bezpieczeństwo, marketing)
i 11 commitów: 29 podatności → 0, build na Vercelu z lockfile'a, wszystkie strony
statyczne, jeden builder metadanych i karty OG na każdej stronie, JSON-LD z jedną
encją `Person`, polityka prywatności, CI, `pnpm check:content`. Pełny opis:
[AUDYT-2026-11.md](AUDYT-2026-11.md) §2.
