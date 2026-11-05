# Plan — jedyna lista otwartych zadań

Stan na 5 listopada 2026. Tu są **tylko rzeczy do zrobienia**: zrobione punkty
przenosimy do [DZIENNIK.md](DZIENNIK.md) i usuwamy stąd. Szczegóły, które nie mogą być
publiczne (bezpieczeństwo, marketing), są w `docs/prywatne/` — tutaj tylko odnośnik.

**[Kod]** — robi agent w repozytorium · **[Ty]** — Twoje konto, decyzja albo treść.

---

## 1. Teraz — nowy wygląd (dziś i najbliższe dni)

Plan i budżet jakości: [KIERUNEK-WIZUALNY.md](KIERUNEK-WIZUALNY.md) §3.

- [ ] **[Ty]** Wybór z wersji iteracji 7 (https://www.zeprzalka.com/demo — Indeks · I, Indeks · II,
      The Best Of · II, wersja autorska), ewentualnie test A/B dwóch Indeksów; ustawienia znaków
      do wyboru w `src/components/demo/shared/glyph/settings.ts` — KIERUNEK §2–4.
- [ ] **[Ty]** Tekst w serwisie: „Wykładowca akademicki 2016–2026” w `/o-mnie` i CV → „2016–obecnie”
      (wykłady trwają), a zdania o WSR i Civitas w czasie przeszłym; X (`x.com/zeprzalka_com`)
      w profilach serwisu — w demach już jest, w serwisie dopiero na Twoją prośbę.
- [ ] **[Kod]** System „Forma” w serwisie: tokeny w `globals.css`, prymitywy w `src/components/ui/`,
      `/design-system` na nowym systemie.
- [ ] **[Kod]** Strona główna w wybranej koncepcji; potem podstrony (wpis, `/uslugi`, `/o-mnie`,
      `/portfolio`, `/kontakt`, menu mobilne) — z długiem z KIERUNEK §5 (pauza wideo, podpisy
      kafli, pole wiadomości, akordeon w HTML, `/portfolio` w nawigacji, CTA przy pakietach, FAQ).
- [ ] **[Kod]** Wideo: przekodowanie klipów do ~600 kb/s i lżejsze hero na telefon (po decyzji).
- [ ] **[Kod]** Po wdrożeniu: usunięcie piaskownicy `/demo`, zmiennej `DEMO_PUBLIC` z Vercela
      (dziś dema są na zeprzalka.com/demo do testów na telefonie) i zależności `motion`,
      `@number-flow/react`, `gsap`, jeśli nowy serwis ich nie używa (archiwum: tag
      `piaskownica-archiwum-2026-11`); silnik znaków `shared/glyph` (z `ogl`) przenosimy do serwisu.

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
| CSS typografii wpisów tylko na wpisach (ok. −3,5 KB na pozostałych stronach) | `globals.css`, `PostView.tsx` |
| `typedRoutes` — literówki w adresach łapane przy kompilacji | `next.config.ts` |
| Angielska 404 dla `/en/*` (wymaga trasy na żądanie — statyczny catch-all nie działa) | `global-not-found.tsx` |
| Slugi `markerkit-*` → `makerkit-*` z 308 (przy odświeżaniu wpisów) | `content/posts`, `next.config.ts` |
| Pary wpisów/kategorii/tagów w module bez zależności — `check-content` przestaje parsować TS wyrażeniem regularnym | `src/i18n/blog-map.ts`, `scripts/check-content.mjs` |
| CSP: sprawdzić w DevTools i usunąć `vitals.vercel-insights.com` z `connect-src` (Speed Insights wysyła na własną domenę) | `next.config.ts` |
| Drobne: `allowJs` bez plików JS, domyślne wartości w `vercel.json`, stałe klas poza `cn()` (`ActiveTOC`, `PostCard`), `CodeBlock` z `bg-white` i `!important` | różne |
| Lucide 1.x, TypeScript 7, ESLint 10 — osobno, z pełnym testem | `package.json` |

## 5. Na końcu — pomiar

- [ ] **[Kod]** Zdarzenia Vercel Analytics (`lead_submitted`, `cta_click`, `email_click`,
      `cv_download`…) — lista w `docs/prywatne/MARKETING.md` §6, ok. 1 h.
- [ ] **[Ty]** Arkusz leadów i cele 30/60/90 dni po pierwszym miesiącu danych.
