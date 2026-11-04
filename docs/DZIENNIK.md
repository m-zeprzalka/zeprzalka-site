# Dziennik zmian

Co zrobiono w każdej iteracji i jak to sprawdzono — najnowsze na górze. Otwarte zadania
są wyłącznie w [ROADMAP.md](ROADMAP.md); szczegóły bezpieczeństwa i marketingu
w `docs/prywatne/` (poza repozytorium). Iteracja bez wpisu tutaj nie jest skończona.

---

## Iteracja 4 — 4 listopada 2026: ostatni przegląd przed nowym wyglądem

Zakres od właściciela: werdykt audytu (galeria zamiast case studies, 15 lat, oferta
premium, pomiar na koniec), jedna gałąź, nowa rola, własne produkty w portfolio,
bezpieczeństwo poczty, porządek w dokumentacji, ostateczny przegląd kodu i treści.

**Organizacja i infrastruktura**
- Jedna gałąź `main`: gałąź `audyt-2026-11` usunięta (lokalnie i na GitHubie), jej cache
  w Actions skasowany. Strażnik pikseli uruchamiany ręcznie (`workflow_dispatch`, wejście
  przez `env`), bez cache, który blokował `git worktree add`, i z buildem produkcyjnym.
- Piaskownica bez archiwum: Precyzja, warianty z sierpnia, `shared/` i
  `react-intersection-observer` usunięte; kod w tagu `piaskownica-archiwum-2026-11`.
- Vercel: reguła WAF „Formularz — limit wysyłek” (5 POST z `next-action` / 10 min / IP)
  i Bot Protection w trybie Log — opublikowane. CLI 65.11. Zmiany DNS (SPF, DMARC, CAA)
  zablokowane przez uprawnienia agenta — gotowe komendy w pliku prywatnym.

**Marka, oferta, portfolio (na prośbę właściciela)**
- Rola: PL „Projektant i programista produktów cyfrowych”, EN „Digital Product Designer
  & Developer”; **15 lat** wszędzie (hero, o mnie, metadane, karty OG, manifest, nota pod
  wpisem — `AUTHOR.jobTitle` jest teraz parą `Localized`).
- Oferta premium wg dawnego `MONETYZACJA.md`: 8 pakietów od wdrożenia AI (od 15 000 zł)
  po opiekę (od 490 zł), sprint diagnostyczny 2900 zł jako wejście, ceny stałe, czas
  realizacji, gwarancje, proces w 6 krokach, nota o VAT i B2B; JSON-LD z `price`/`minPrice`.
- Portfolio: grupa „Produkty cyfrowe” — aifeed.pl, prfct.dev, BrandMaker, fizjorank.pl
  (zrzuty 1200×750 WebP, 30–67 KB, link do serwisu w nowej karcie, krótkie opisy);
  `video` opcjonalne; grupy bez wideo w dwóch kolumnach.

**Korekta treści** (134 poprawki obiektywne): polski Title Case w hero, kompetencjach
i 23 tytułach wpisów, myślniki „ — ” zamiast łączników, „…”, „E-mail”, odmiana
(„YouTube'a”, „CMS-em”, „baner”), fałszywi przyjaciele w EN („service” → „website”,
„Rollerblading” → „Lifestyle reels”), prawa majątkowe w ofercie, 3 tytuły EN > 60 znaków,
14 opisów meta poza 120–160 znaków, `{count}` realizacji z poprawną odmianą na karcie OG.

**Kod — błędy z niezależnego przeglądu (zmierzone w przeglądarce)**
- Wideo w portfolio: `play()` przed ustawieniem `src` było przerywane — na `/portfolio`
  grał 1 z 5 kafli w kadrze, teraz 6 z 6 (`LazyVideo` z `useInViewOnce` + efekt po commicie).
- Wpisy: `hover:prose-a:underline` podkreślało wszystkie linki przy najechaniu na artykuł
  → `prose-a:hover:*`.
- `global-error` ciągnął `Button`/`cva`/`tailwind-merge` do każdej strony: `LazyErrorView`
  dla trzech granic błędów — **−9,1 KB gzip JS na podstronach** (`/uslugi`: 199,5 → 190,4 KB);
  `global-error` z krojami i ciemnym motywem (`src/app/fonts.ts`).
- Przełącznik języka jako zwykłe `<a hrefLang>` — znikł prefetch ~40 KB drugiej wersji
  strony na każdej odsłonie (przejście między układami głównymi i tak przeładowuje).
- `pnpm visual` bez progu tolerancji (`threshold: 0`, z antyaliasingiem); szum nadal 0 px.
- Drobne: mapa strony (prawdziwy `lastmod` archiwum, bez aliasów i zgadywania adresu),
  RSS bez złych wymiarów ikony, `SITE_DOMAIN` w JSON-LD, `server-only` w danych oferty
  i portfolio, jedna zasada 404 w kartach OG, `ScrollToTop` odporny na StrictMode,
  `ui/sheet` bez jednojęzycznego „Close”, ESLint blokuje też podścieżki `motion`,
  opis serwisu i czas lektury przeniesione do modułów treści, liczebniki w skryptach.

**Formularz i bezpieczeństwo**
- `src/lib/mail.ts`: wysyłka przez API Resend, gdy jest `RESEND_API_KEY` (klucz tylko do
  wysyłki), SMTP przejściowo; sprawdzone: brak konfiguracji → komunikat „niedostępny”,
  fałszywy klucz → 401 z Resend → komunikat o błędzie.
- CV w PDF w obu językach z „O mnie” (`pnpm cv`, `CV_PDF` w `site.ts`) — stary PDF miał
  błędy poprawione już na stronie.

**Dokumentacja:** `AUDYT-2026-11.md`, `SEO.md`, `DWUJEZYCZNOSC.md` i `MONETYZACJA.md`
usunięte — instrukcje do README, strategia do `docs/prywatne/MARKETING.md`, otwarte punkty
do ROADMAP (tylko otwarte), bezpieczeństwo do `docs/prywatne/BEZPIECZENSTWO.md`; surowe
raporty audytów skasowane, referencje projektowe w `docs/prywatne/referencje/`.

**Dema na telefonie (po uwadze właściciela):** `/demo` było celowo poza produkcją, a bez
podglądów gałęzi nie dało się go obejrzeć na telefonie → `DEMO_PUBLIC=1` w Vercelu (Production).
Build z demami ujawnił błąd z tej iteracji: `format.ts` (wspólny dla klienta) zaczął importować
serwerowy `common.ts` → `formatReadingTime` przeniesiony do `src/lib/posts.ts`, a ESLint
blokuje odtąd importy modułów `server-only` w modułach wspólnych.

**Sprawdzone:** `pnpm check` (0 błędów treści, format, lint, typy, 275 stron statycznych,
`check:build` 134 strony bez problemów, także `--production`); piksele 11 stron × 2
szerokości względem produkcji — różnice wyłącznie z zamówionych tekstów i nowej oferty;
zrzuty hero, stopki, `/uslugi` i `/portfolio` przejrzane.

---

## Iteracja 3 — 3 listopada 2026: wdrożenie, GitHub i Vercel, system „Forma”

- **Wdrożenie** gałęzi audytu na produkcję (Next 16.4.4, build przez pnpm z lockfile'a).
- **GitHub:** opis i tematy, Dependabot (alerty, poprawki, miesięczne grupy), ruleset na
  `main` (bez force-push i usuwania), secret scanning + push protection.
- **Vercel:** Node 24, fra1, Fluid Compute, Skew Protection; `SMTP_*` tylko w Production
  jako *Sensitive*; usunięta `DATABASE_URL`; `zeprzalka-web.vercel.app` → 308 na www;
  `zeprzalka-test` za logowaniem.
- **Kod:** spis treści z drzewa MDX (4 wpisy wskazywały złe kotwice), karty OG archiwum
  i tagów, `src/i18n/alternates.ts` jako jedno źródło hreflang, `src/routes/params.ts`,
  `server-only` w modułach treści, `pnpm check:build` (87 problemów → 0), CI z akcjami
  przypiętymi do SHA. Poster hero poza prefetchem podstron (−28 KB), pasek postępu w CSS.
- **Lighthouse po wdrożeniu:** desktop 100/100/100/100 na 4 stronach, telefon 86–97 / 100.
- **Projekt:** „Precyzja” odrzucona (chodziło o jakość wykonania, nie styl); system
  „Forma” i trzy koncepcje w `/demo` — [KIERUNEK-WIZUALNY.md](KIERUNEK-WIZUALNY.md).

## Iteracja 2 — 3 listopada 2026: jakość kodu, piaskownica

- Poprawki widoczne: polska odmiana liczebników (`plural()` na `Intl.PluralRules`), surowy
  markdown w spisach treści, kod w linii bez tła, tabele tracące semantykę, puste awatary.
- Struktura: 20 plików kart OG → fabryki w `src/lib/og.tsx`, 8 lustrzanych tras bloga →
  `src/routes/blog.tsx`, jedna karta wpisu, `TaxonomyView`, `CtaPanel`, `HomeSection`,
  jeden indeks taksonomii w `posts.ts`, `format.ts`, `navigation.ts`, `system.ts`.
- Teksty do komponentów klienckich przez propsy: −11…13 KB gzip JS na każdej stronie.
- Ostrzejszy `tsconfig` i ESLint, Prettier z sortowaniem klas, `vercel.json` (fra1, Fluid),
  strażnik pikseli strony głównej, piaskownica `/demo` z twardą granicą (`pageExtensions`,
  `@source not`, ESLint).

## Iteracja 1 — 2 listopada 2026: pełny audyt i refaktor

- Pięć audytów (SEO, UX/UI, wydajność, bezpieczeństwo, marketing).
- Podatności zależności 29 → 0 (Next 16.4.4, nodemailer 10, zod 4.6), build z lockfile'a.
- Wszystkie strony statyczne (paginacja `/blog/strona/2` z 308 ze starych adresów,
  `dynamicParams = false`), bez `loading.tsx` ukrywającego treść przed robotami.
- Jeden builder metadanych (`buildMetadata`), karty OG na każdej stronie, JSON-LD z jedną
  encją `Person`, RSS, `noindex` dla tagów i jednowpisowych kategorii.
- Formularz zachowujący dane po błędzie, RODO (polityka prywatności, fasada YouTube),
  nagłówki bezpieczeństwa, `security.txt`, frontmatter walidowany przez zod,
  `pnpm check:content`, CI.
- Starsze prace (sierpień 2026): `git log --until=2026-08-30`.
