# Plan — jedyna lista otwartych zadań

Stan na 10 listopada 2026. Tu są **tylko rzeczy do zrobienia**: zrobione punkty
przenosimy do [DZIENNIK.md](DZIENNIK.md) i usuwamy stąd. Szczegóły, które nie mogą być
publiczne (bezpieczeństwo, marketing), są w `docs/prywatne/` — tutaj tylko odnośnik.

**[Kod]** — robi agent w repozytorium · **[Ty]** — Twoje konto, decyzja albo treść.

---

## 1. Teraz — po przepięciu (10.11.2026)

Nowa wersja jest na głównej domenie w obu językach; poprzednia — tag `v1-archiwum`, zrzuty
i kopia offline w `docs/prywatne/archiwum-v1/`. Warstwa widoku: [STRONA.md](STRONA.md)
(ocena gotowości 8,5/10 i braki do 10), zasady: [ZASADY.md](ZASADY.md).

- [ ] **[Ty]** Testy na żywo i na telefonie po przepięciu (PL i EN) — uwagi do kolejnej iteracji.
- [ ] **[Ty]** Google Search Console i Bing: ponowne zgłoszenie mapy strony, kontrola
      indeksowania po zmianie wyglądu (adresy te same; `/main-page/*` → 308).
- [ ] **[Ty]** Ręczny przegląd kodu — od czego zacząć: `docs/STRONA.md`, „Przegląd kodu”.
- [ ] **[Ty]** Decyzje: menu na telefonie (dziś ⌘K w arkuszu i stopka — czy menu w nagłówku?);
      sygnet bez końca to formalne odstępstwo od WCAG 2.2.2 (zostaje czy pauza / stop po kilku
      cyklach); zwijany „Spis treści” nad wpisem na telefonie (zostaje?); krzyżyk karty bez
      kadru z obwódką (`outline`) czy ciemny jak na kadrze; plakietki kategorii i tagów ok. 26 px
      (cel 44 px, próg AA 24 px spełniony).
- [ ] **[Ty]** Decyzje z audytu „agencji” (7.11): tło pod nagłówkiem (dziś samo rozmycie „bez koloru”
      — UX proponuje lekki gradient tła); oznaczenie pól wymaganych w formularzu; teksty
      alternatywne obrazów we wpisie „Claude Design” (dziś angielskie, ogólne) i literówka
      `**Pytania? **` na jego końcu; ujęcia ekipy w pętli wideo startu — sprawdzić, że to nie Ty.
- [ ] **[Kod]** Do 10/10 (z oceny 10.11): testy interakcji — maszyna stanów kart podglądu, spis
      rozdziałów i `useEdgeAbove`, akcja formularza — oraz automatyczny przebieg axe,
      przepełnienia i LCP w CI; strażnik sztuczki LCP wideo startu (`scale-[1.002]` — heurystyka
      Chrome, nie specyfikacja).
- [ ] **[Kod]** Design system `/design-system`: HTML ok. 1,3 MB (kod ~40 przykładów kolorowany
      na serwerze) — zwijać kod przykładów albo dzielić katalog na podstrony.
- [ ] **[Kod]** Wydajność: dane ⌘K jako statyczny plik pobierany z oknem (dziś w ładunku RSC
      każdej strony); `cva` i `tailwind-merge` poza wyspami klienckimi (ok. −8 KB gz); jedna wyspa
      nagłówka zamiast czterech (ok. 11 KB gz); `<Suspense>` wokół sekcji pod zgięciem — do
      zmierzenia; lżejsze wideo startu na telefon (przekodowanie klipów do ~600 kb/s); akordeon
      portfolio i kompetencji bez Radix (`<details name>`, ok. −12 KB JS), jeśli zostanie zgoda
      na odejście od shadcn w tym miejscu.
- [ ] **[Ty]** Treść wersji EN (z QA przepięcia 10.11): okładki wpisów EN z polskim napisem
      (np. `/en/blog/fable-5-social-manager`); zapis waluty na `/en/services` mieszany („from 30,000
      PLN” obok „PLN 490”); manifest aplikacji tylko po polsku; nieznany adres pod `/en` dostaje
      polską 404 (angielska wymaga trasy na żądanie — ROADMAP §4).
- [ ] **[Kod]** `/design-system` przy 320 px: 16 px przepełnienia (etykieta `MonitorSmartphone`
      i „fraza „webowych” (start)” w przykładach ikon i kart) — strona wewnętrzna.
- [ ] **[Ty]** → **[Kod]** Piaskownica `/demo` (dawne koncepcje, specyfikacja ruchu): zostaje
      czy usuwamy ją razem ze zmienną `DEMO_PUBLIC` w Vercelu i zależnościami `motion`,
      `@number-flow/react`, `gsap`, `ogl`, `src/hooks` (archiwum: tagi `v1-archiwum`,
      `piaskownica-archiwum-2026-11`).

## 2. Bezpieczeństwo — Twoje konta (ok. 30 min)

Komendy i kolejność: `docs/prywatne/BEZPIECZENSTWO.md`.

- [ ] **[Ty]** Poczta domeny: SPF, DMARC `quarantine` z raportami, DKIM hostingu, CAA `iodef`
      (trzy komendy do wklejenia — agent nie ma uprawnień do DNS).
- [ ] **[Ty]** Klucz Resend w Vercelu → **[Kod]** usunięcie SMTP i `nodemailer` po teście wysyłki.
- [ ] **[Ty]** 2FA, baza Neon, projekt `zeprzalka-test`, stare repo `zeprzalka`, Spend Management.
- [ ] **[Ty]** Next ≥ 16.4.4 w projektach klientów (lista wersji w pliku prywatnym).
- [ ] **[Kod]** Od 11 listopada: Bot Protection z *Log* na *Challenge* po przejrzeniu logów.

## 3. Treść i marka — Twoja część

Szczegóły, szkice tekstów i plan wpisów: `docs/prywatne/MARKETING.md`.

- [ ] **[Ty]** Opisy i kategorie realizacji w `src/lib/portfolio.ts` (4 nowe produkty, 7 filmów).
- [ ] **[Ty]** Teksty strony głównej pod nowy szkielet (rola i 15 lat już są).
- [ ] **[Ty]** LinkedIn → `NEXT_PUBLIC_LINKEDIN_URL` w Vercelu; GitHub (bio, README, archiwizacja).
- [ ] **[Ty]** Dane działalności (NIP, forma, VAT) → **[Kod]** stopka, kontakt, polityka prywatności.
- [ ] **[Ty]** Kalendarz (Cal.com/Calendly) → **[Kod]** link w CTA zamiast „bezpłatnej konsultacji”.
- [ ] **[Ty]** Polityka prywatności do przeczytania (`src/i18n/content/legal.ts`, okres 12 miesięcy).
- [ ] **[Ty]** Google Search Console + Bing (rekord TXT — komenda w MARKETING §5).
- [ ] **[Ty]** Wpis o transcendencji: 4 kategorie → „AI” (jedyne ostrzeżenie `pnpm check:content`).

## 4. Kod — backlog bez zmiany wyglądu

| Zadanie | Gdzie |
| --- | --- |
| Szablon case study `/portfolio/[slug]` (+ EN), `CreativeWork` — gdy będzie pierwszy tekst | nowe trasy, `ROUTES` |
| Podstrony usług (`/uslugi/strony-internetowe`, `…/wdrozenia-ai`…) — gdy będzie treść | nowe trasy |
| `llms.txt` generowany z `ROUTES`, usług i wpisów | nowa trasa |
| Wstępy do kategorii bloga (60–120 słów, link do usługi) i dłuższe opisy meta kategorii | `blog-map.ts`, `meta.ts` |
| `typedRoutes` — literówki w adresach łapane przy kompilacji | `next.config.ts` |
| Angielska 404 dla `/en/*` (wymaga trasy na żądanie — statyczny catch-all nie działa) | `global-not-found.tsx` |
| Slugi `markerkit-*` → `makerkit-*` z 308 (przy odświeżaniu wpisów) | `content/posts`, `next.config.ts` |
| Pary wpisów/kategorii/tagów w module bez zależności — `check-content` przestaje parsować TS wyrażeniem regularnym | `src/i18n/blog-map.ts`, `scripts/check-content.mjs` |
| CSP: sprawdzić w DevTools i usunąć `vitals.vercel-insights.com` z `connect-src` (Speed Insights wysyła na własną domenę) | `next.config.ts` |
| Drobne: `allowJs` bez plików JS, domyślne wartości w `vercel.json` | różne |
| Lucide 1.x, TypeScript 7, ESLint 10 — osobno, z pełnym testem | `package.json` |

## 5. Na końcu — pomiar

- [ ] **[Kod]** Zdarzenia Vercel Analytics (`lead_submitted`, `cta_click`, `email_click`,
      `cv_download`…) — lista w `docs/prywatne/MARKETING.md` §6, ok. 1 h.
- [ ] **[Ty]** Arkusz leadów i cele 30/60/90 dni po pierwszym miesiącu danych.
