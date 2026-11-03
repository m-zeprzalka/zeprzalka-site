# Dziennik zmian

Każda iteracja pracy nad serwisem dopisuje tu wpis: co zrobiono, jak to
sprawdzono, co zostało otwarte. Najnowszy wpis jest na górze. Szczegóły
diagnozy są w [AUDYT-2026-11.md](AUDYT-2026-11.md), a lista zadań w
[ROADMAP.md](ROADMAP.md).

**Zasada:** wpis powstaje razem z kodem, w tej samej gałęzi. Iteracja bez wpisu
w dzienniku nie jest skończona.

---

## Iteracja 3 — 3 listopada 2026: wdrożenie, GitHub i Vercel, przegląd seniorski, system „Forma”

Zakres wyznaczony przez właściciela: (1) pełne prawo do wdrożenia i porządków na GitHubie
i Vercelu, podręcznikowa jakość kodu, SEO i wydajność; (2) nowa próba UX/UI — „precyzja”
jako jakość wykonania, nie styl: minimalizm Vercel/shadcn z mikrointerakcjami, miękkie
kształty, mobile first, kilka koncepcji strony głównej w izolowanej piaskownicy.

**Gałąź `audyt-2026-11` jest na produkcji** (commit `0f901a7`, wdrożenie READY 3.11 o 20:08).

### Jak pracowaliśmy

- Cztery niezależne przeglądy równolegle: jakość kodu (7 błędów, 20 rzeczy „nie podręcznikowo”,
  40 drobnych), SEO/wydajność/dostępność buildu (Lighthouse ×3, axe, nagłówki, bajty),
  referencje projektowe (ponad 50 stron, style zmierzone w przeglądarce) i rzemiosło ruchu.
  Raporty: `docs/prywatne/raporty-2026-11/iteracja-3/`.
- Każda zmiana sprawdzona względem buildu bazowego (`fd218ed`): piksele 11 stron × 1440/390 px,
  style wyliczone treści wpisów (7 wpisów, 2 motywy), metadane 92 adresów, karty OG 95 stron.
  **Strona główna PL i EN: 0 px różnicy.**
- Ścieżka CI powtórzona lokalnie w czystym worktree z `VERCEL_ENV=production` przed wdrożeniem.
- Koncepcje „Indeks” i „Talia” zbudowali dwaj agenci w osobnych worktree (cherry-pick do gałęzi).

### GitHub (przez API)

- Opis, adres strony, tematy; wiki i projekty wyłączone; usuwanie gałęzi po scaleniu.
- Dependabot: alerty, poprawki bezpieczeństwa i `.github/dependabot.yml` (miesięcznie,
  zgrupowane, 7 dni karencji); secret scanning i push protection były włączone.
- Ruleset „main — ochrona produkcji”: zakaz force-push i usuwania `main`.
- Usunięte dwie stare gałęzie bota Vercela z łatkami CVE (zastąpione Next 16.4.4);
  wypchnięty tag `warianty-strony-glownej-2026-08`.
- Pierwsze przebiegi workflowów na GitHubie: CI zielone; strażnik pokazał względem starego
  `main` tylko znane zmiany z iteracji 1 (RODO pod formularzem, okładki WebP).

### Vercel (API i CLI 65)

- Ustawienia projektu zgodne z repozytorium: Node 24, bez nadpisań `npm install`/`npm run build`,
  region fra1, Fluid Compute, Skew Protection 12 h.
- Zmienne: usunięta nieużywana `DATABASE_URL` (baza Neon nadal istnieje po stronie Neon),
  `SMTP_*` jako *Sensitive* i tylko w Production (podglądy nie znają hasła do poczty).
- `zeprzalka-web.vercel.app` → 308 na `www.zeprzalka.com` (był duplikatem bez `noindex`);
  testowy projekt `zeprzalka-test` za logowaniem (był publiczny, z podatnym Next 16.2).
- Reguła zapory „Formularz — limit wysyłek” (5 POST z `next-action` / 10 min / IP)
  przygotowana jako szkic — CLI wymaga zatwierdzenia przez człowieka (ROADMAP, Dzień 0).

### Kod: błędy

- Spis treści z tego samego drzewa co artykuł (`src/lib/mdx.ts`) — w 4 wpisach wskazywał
  nieistniejące kotwice.
- Archiwum bloga i strony tagów: karta `summary_large_image` bez obrazka → własne karty OG.
- Fokus wraca na przycisk menu mobilnego; `ScrollToTop` bez nieaktualnej flagi; `div`
  w przycisku akordeonu; ciemny motyw nie przecieka na wydruk; 404 z własnym tytułem
  i jednym `robots`; `global-error.tsx`; `error.tsx` z `retry()`.

### Kod: struktura i jakość

- `src/i18n/alternates.ts` — jedno źródło „tej samej strony w drugim języku” (metadane,
  mapa strony, przełącznik), `src/routes/params.ts` — wspólne parametry stron i kart OG.
- `TermLink`, `PostGrid` z siatką i `sizes`, `Textarea`, `NavLink` (`aria-current`),
  `LazyVideo`, `use-in-view`; liczebniki tylko przez `plural()`; treść wpisu: semantyka
  w `mdx-components.tsx`, wygląd w jednej klasie `prose` (bez martwych i zdublowanych reguł).
- `import "server-only"` w modułach treści i serwerowych `lib/*`; `LayoutProps` z Next;
  `node:` w importach; `type: module`; formularz z `aria-invalid`, `useId`, jednym komunikatem.
- Dane strukturalne: `Blog`, `ContactPage`, `CollectionPage` + okruszki; stały `url` osoby.
- Mapa strony z archiwum bloga, prawdziwym `lastmod`, bez `priority`/`changefreq`.

### Wydajność (zmierzone)

- `cva` i `tailwind-merge` poza wspólnym JS: −9 KB br na podstronach (klasy liczone na serwerze).
- Poster hero nie wycieka już do prefetchu podstron: −28 KB i −1 żądanie High na każdej podstronie.
- Pasek postępu w CSS (`animation-timeline: scroll()`), kafle portfolio: plakat w HTML
  (LCP `/portfolio` bez czekania na JS), wideo tylko w kadrze, pauza poza nim.
- Cache: pliki `/_next` z hashem znów `immutable` (reguła mediów ich nie nadpisuje).
- Produkcja po wdrożeniu (Lighthouse, pojedynczy przebieg): desktop 100/100/100/100 na
  `/`, wpisie, `/uslugi`, `/portfolio` (LCP 0,5–0,6 s); telefon 86–97 (wydajność),
  100 (dostępność, dobre praktyki, SEO). Audytor (mediana z 3, kontrolowane warunki):
  telefon 97–100.

### Narzędzia kontroli

- `pnpm check:build` — kontrola gotowego HTML (karty OG, kotwice spisu treści, `lang`,
  canonical, `robots`, JSON-LD, `/demo` w buildzie produkcyjnym); na buildzie sprzed
  poprawek 87 problemów, dziś 0. W CI po buildzie produkcyjnym.
- CI: akcje przypięte do SHA (najnowsze wersje), audyt przed buildem, `next typegen` przed
  `tsc`, bez podwójnych przebiegów. Strażnik strony głównej przewija stronę i czeka na
  pierwsze klatki wideo — porównuje stan po lekturze.

### UX/UI: system „Forma” i trzy koncepcje

Opis i rekomendacja: [KIERUNEK-WIZUALNY.md](KIERUNEK-WIZUALNY.md). W skrócie:
`/demo/forma` (specimen), `/demo/zywy-interfejs` (rekomendacja), `/demo/indeks`,
`/demo/talia`; spis `/demo` jako prezentacja z mocnymi stronami i ryzykami.

### Otwarte po iteracji 3

- **[Ty]** zatwierdzenie reguły zapory (jedno polecenie, ROADMAP), baza Neon (usunąć
  albo zmienić hasło), osobne poświadczenia do wysyłki maili, rekordy poczty.
- **[Ty]** wybór koncepcji (KIERUNEK-WIZUALNY.md §8) — od niego zależy etap B.
- **[Zgoda]** wideo: przekodowanie klipów i mobilna wersja hero; treść zwiniętych sekcji
  akordeonu w HTML; dług wizualny z KIERUNEK-WIZUALNY.md §9.
- Angielska 404 dla `/en/*` wymaga trasy renderowanej na żądanie (sprawdzone: statyczny
  catch-all z `dynamicParams = false` i tak kończy się globalną 404) — do decyzji.

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
