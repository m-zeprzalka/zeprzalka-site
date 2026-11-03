# Plan działania — od 2 listopada 2026 (aktualizacja 3 listopada, iteracja 3)

Jedyna lista rzeczy do zrobienia. Diagnoza i uzasadnienia: [AUDYT-2026-11.md](AUDYT-2026-11.md),
co już zrobiono: [DZIENNIK.md](DZIENNIK.md).
Odhaczaj tutaj (`[x]`), żeby plan nie rozjechał się z rzeczywistością jak ten z sierpnia.

**[Ty]** — Twoje konto, decyzja albo treść · **[Kod]** — praca w repozytorium ·
**[Zgoda]** — zmienia wygląd strony głównej, czeka na Twoją akceptację.

---

## Zasady pracy (nowe)

1. **Push na `main` = natychmiastowe wdrożenie na produkcję.** Dlatego pracuj na gałęzi:
   `git switch -c nazwa` → push → Vercel buduje **podgląd** (Preview) → GitHub Actions
   sprawdza treść, lint, typy, build i podatności → dopiero wtedy merge do `main`.
2. Przed każdym commitem: `pnpm check` (treść + formatowanie + lint + build + kontrola HTML
   `check:build`). Sam wpis: `pnpm check:content`.
3. Zmiany wyglądu zaczynamy w `/design-system`, nie na stronie głównej. I inicjujemy go później na przykładowe strony typu /page-test
   → **od iteracji 2 tym miejscem jest piaskownica `/demo`** (demo „Precyzja”, specimen
   `/demo/precyzja/system`; podstrony testowe trafią do `/demo/podstrony/*`). Na produkcji jej nie ma.
4. Każda zmiana pliku używanego przez stronę główną → `pnpm visual` z wynikiem 0 px
   (README, „Kontrola wizualna”). CI robi to samo automatycznie względem `main`.
5. Każda iteracja kończy się wpisem w [DZIENNIK.md](DZIENNIK.md) i aktualizacją dotkniętych dokumentów.

---

## Dzień 0 — wdrożenie (zrobione 3.11.2026, iteracja 3) i to, co zostało Tobie

- [x] **[Kod]** Ustawienia projektu w Vercelu zgodne z repozytorium (Node 24, bez nadpisań
      `npm`, fra1, Fluid, Skew Protection), sekrety SMTP jako *Sensitive* tylko w Production,
      usunięta `DATABASE_URL`, przekierowanie `zeprzalka-web.vercel.app`, `zeprzalka-test` za logowaniem.
- [x] **[Kod]** Push gałęzi, podgląd (log: `pnpm install --frozen-lockfile`, Next.js 16.4.4),
      CI na GitHubie zielone, **wdrożenie na produkcję** (`0f901a7`).
- [x] **[Kod]** Weryfikacja produkcji: Next 16.4.4 w publicznym JS, `/blog` z CDN (HIT),
      `/demo` = 404, karty OG 95/95, czcionki `immutable`, Lighthouse desktop 100 × 4.
- [x] **[Kod]** GitHub: opis i tematy, Dependabot, ruleset na `main`, stare gałęzie usunięte.
- [ ] **[Ty] Zatwierdź regułę zapory** (przygotowana jako szkic, CLI wymaga człowieka):
      ```bash
      vercel firewall diff --scope zeprzalka --project zeprzalka      # co się zmieni
      vercel firewall publish --scope zeprzalka --project zeprzalka --confirm-name zeprzalka
      ```
- [ ] **[Ty] Jedna prawdziwa wiadomość z formularza** na produkcji (skrzynka + odpowiedź na reply-to)
      i LinkedIn Post Inspector dla `/uslugi`.
- [ ] **[Ty] Baza Neon** z dawnej `DATABASE_URL`: usuń albo zmień hasło (szczegóły w
      `docs/prywatne/BEZPIECZENSTWO.md`).
- [ ] **[Ty] Przegląd zmian:** [DZIENNIK.md](DZIENNIK.md) (iteracje 1–3) i polityka
      prywatności (`src/i18n/content/legal.ts`, okres przechowywania — 12 miesięcy to propozycja).
- [ ] **[Ty]** PR-y Dependabota #1–#3 (zod, nodemailer, next na starym `main`) są zastąpione
      przez wdrożenie — zamknij je, jeśli nie zamkną się same.

## Dzień 1

- [ ] kompleksowa przebudowa strony pod kątem UX/UI. Nowy odświerzony lepszy Design, godny osoby z moim doświadczeniem. Obecna wersja wygląda bardzo słabo i jedynie poprawnie. Niegodnie osoby z takim doświadczeniem jak ja.
  - [x] **[Kod]** Audyt UX/UI produkcji (3,9/10), nowy kierunek „Precyzja”, piaskownica `/demo`
        z dawnymi wariantami, demo strony głównej `/demo/precyzja` i specimen systemu —
        [KIERUNEK-WIZUALNY.md](KIERUNEK-WIZUALNY.md) (iteracja 2, 3.11.2026).
  - [x] **[Kod]** Iteracja 3 (3.11.2026): „Precyzja” odrzucona; system „Forma” (miękki
        minimalizm Vercel/shadcn, `/demo/forma`) i trzy koncepcje strony głównej:
        `/demo/zywy-interfejs` (rekomendacja), `/demo/indeks`, `/demo/talia`; spis `/demo`
        jako prezentacja — [KIERUNEK-WIZUALNY.md](KIERUNEK-WIZUALNY.md).
  - [ ] **[Ty] Etap A:** wybierz szkielet i zapożyczenia; przy każdej sekcji „zostaje / zmień /
        wyrzuć” + materiały z KIERUNEK-WIZUALNY.md §8 (teksty, referencje, zdjęcia, case studies).
  - [ ] **[Kod] Etap B–D** po Twojej decyzji: system w serwisie, podstrony testowe w `/demo`,
        wdrożenie podstron (KIERUNEK-WIZUALNY.md §4). **[Zgoda] Etap E:** strona główna.


## Dni 1–3 — konta i pomiar (same Twoje działania, ok. 3 h)

- [ ] **Google Search Console**: właściwość domenowa (rekord TXT w Vercel DNS), zgłoś
      `https://www.zeprzalka.com/sitemap.xml`, sprawdź raporty „Strony” i „Wersje
      międzynarodowe”. Po tygodniu Rich Results Test dla wpisu, `/o-mnie` i `/uslugi`.
- [ ] **Bing Webmaster Tools**: import z GSC (2 minuty; Bing zasila m.in. Copilota).
- [ ] **LinkedIn**: ustaw `NEXT_PUBLIC_LINKEDIN_URL` w Vercelu (profil sam trafi do stopki
      i danych strukturalnych). Uporządkuj profil według MONETYZACJA.md §7.
- [ ] **Bezpieczeństwo konta** — lista w `docs/prywatne/BEZPIECZENSTWO.md` (sekrety,
      rekordy poczty, stare projekty Vercel, WAF, 2FA, ochrona `main`).
- [ ] **GitHub**: bio zgodne ze stroną (bez „financial freedom”), README profilu,
      archiwizacja repozytoriów testowych.
- [ ] Zapisz, ile zapytań przyszło od sierpnia i z jakimi budżetami — punkt odniesienia.

## Dni 4–7 — decyzje i pomiar konwersji

- [ ] **[Ty] Decyzje z AUDYT-2026-11.md §4**: staż, rola i propozycja wartości, ceny.
- [ ] **[Kod] Zdarzenia Vercel Analytics** (MONETYZACJA.md §6): `lead_submitted`
      i `lead_failed` po stronie serwera, `cta_click`, `email_click`, `cv_download`.
- [ ] **[Kod] Tożsamość ujednolicona** po decyzji: `src/lib/site.ts`, `src/i18n/content/*`.
- [ ] **[Ty] Dane firmy** (forma działalności, NIP, VAT) → **[Kod]** stopka/kontakt i polityka.
- [ ] **[Ty] Prośba o rekomendacje** do 5 klientów i 3 osób z uczelni (3 pytania:
      problem przed współpracą, co się zmieniło, komu byś mnie polecił).
- [ ] **[Ty] Treść**: transcendencja → kategorie „AI” (+ tagi), wpis o SaaS → tagi i obiecane
      linki do własnych produktów, `featured` tylko dla 2–4 wpisów. Potem `pnpm check:content`.

## Tydzień 2 — oferta, która sprzedaje

- [ ] **[Kod] `/uslugi` v2** (po decyzji o cenach): pakiety od najcenniejszego, „dla kogo”,
      terminy, CTA przy pakiecie, gwarancje, proces 6 kroków, FAQ (VAT, płatności, prawa
      autorskie), siatka bez osieroconej karty.
- [ ] **[Ty → Kod] Kalendarz** (Cal.com/Calendly) w CTA.
- [ ] **[Kod] Formularz v2**: temat z listy, widełki budżetu zgodne z cennikiem, termin;
      „Zapytaj o ten pakiet” wypełnia temat; komunikat sukcesu z kolejnymi krokami.
- [ ] **[Zgoda] Teksty strony głównej** (tylko tekst): hero, leady sekcji, CTA.
- [ ] **[Zgoda] Portfolio w nawigacji** albo link „Wszystkie realizacje” pod galerią.

## Tygodnie 3–4 — dowody

- [ ] **[Kod] Szablon case study** `/portfolio/[slug]` (+ `/en/portfolio/[slug]`): problem →
      rola → proces → wynik w liczbach → zakres i technologie, film jako hero, `CreativeWork`.
- [ ] **[Ty] Case study #1: aifeed.pl** (architektura, koszty LLM, ruch).
- [ ] **[Kod] Grupa „Własne produkty”** w portfolio (aifeed.pl, SocialManager).
- [ ] **[Ty + Kod] Specimen kierunku wizualnego** w `/design-system` (KIERUNEK-WIZUALNY.md).
- [ ] **[Kod] Szablon wpisu**: kolumna 66 znaków, `prose` 18 px, spis treści na telefonie,
      podpis zdjęcia pod obrazem, nawigacja serii (Makerkit, kurs).

---

## Cele mierzalne

Punkt startowy to brak danych — w tygodniu 2 zapisz poziom wyjściowy i skoryguj liczby.

| Termin | Cel |
| --- | --- |
| **30 dni** (2 grudnia) | 100% kluczowych zdarzeń mierzonych · GSC i Bing zweryfikowane · LinkedIn w serwisie · ≥ 3 rekomendacje · 1 case study · nowe `/uslugi` · ≥ 2 zapytania z budżetem ≥ 10 tys. zł |
| **60 dni** (1 stycznia) | 3 case studies · sekcja rekomendacji · wpis „Ile kosztuje strona w 2026” · Laboratorium #1 · magnes na leady + newsletter · ≥ 6 zakwalifikowanych zapytań · 1 sprzedany sprint diagnostyczny |
| **90 dni** (31 stycznia) | ≥ 2 podpisane projekty ≥ 10 tys. zł · ≥ 2 klientów na opiece · oferta szkoleń online · hub „Akademia” · 1 wystąpienie · indeksacja 100% sitemapy w GSC |

Przegląd raz w miesiącu: GSC (wyświetlenia, CTR, frazy), Vercel Analytics (lejek
`/uslugi` → `cta_click` → `lead_submitted`), Speed Insights (p75 LCP i INP z ruchu
rzeczywistego), arkusz leadów (źródło, budżet, status, wartość).

---

## Zaległości w kodzie (backlog)

Uporządkowane według zysku. Pozycje [Zgoda] czekają na decyzję o stronie głównej.

| P | Zadanie | Gdzie |
| --- | --- | --- |
| P1 | Zdarzenia konwersji (serwer + klient) | `src/app/actions/contact.ts`, przyciski CTA |
| P1 | `/uslugi` v2 + JSON-LD wyliczany z danych (`priceRange`, `UnitPriceSpecification` dla opieki) | `src/lib/services.ts`, `ServicesView.tsx` |
| P1 | Szablon case study + podstrony usług (`/uslugi/strony-internetowe`, `…/wdrozenia-ai`…) | nowe trasy + `ROUTES` |
| P1 [Zgoda] | Pauza wideo i stałe podpisy kafli portfolio (WCAG 2.2.2) | `PortfolioCard.tsx`, `Hero.tsx` |
| P2 | Szablon wpisu: szerokość kolumny, typografia, spis treści na mobile, podpis zdjęcia, H1 | `PostView.tsx` |
| P2 | Hub „Akademia” z lekcjami kursu (adresy wpisów bez zmian) | nowa trasa |
| P2 | Wstępy do kategorii (60–120 słów, link do usługi) | `blog-map.ts`, `TaxonomyView.tsx` |
| P2 | BotID dla formularza (po regule WAF) | `next.config.ts`, `contact.ts` |
| P2 | Menu mobilne jako „plansza” (e-mail, CTA, EN/PL) | `MobileNav.tsx` |
| P2 | `llms.txt` generowany z `ROUTES`, usług i wpisów | nowa trasa |
| P3 | Angielska 404 dla `/en/*` — wymaga trasy renderowanej na żądanie (sprawdzone w iteracji 3: statyczny catch-all z `dynamicParams = false` i tak kończy się globalną 404) | `global-not-found.tsx` |
| P1 [Zgoda] | Wideo: przekodowanie klipów portfolio do ~600 kb/s (−2,9 MB na `/`, −10 MB na `/portfolio`), mobilna wersja hero (−0,85 MB) — zmienia klatki | `public/*.mp4`, `HeroVideo.tsx` |
| P2 [Zgoda] | Treść zwiniętych sekcji akordeonu kompetencji w HTML (+55 słów dla SEO; zmienia animację zamykania) | `ui/accordion.tsx`, `Skills.tsx` |
| P2 [Ty] | Opisy meta 12 indeksowanych kategorii (dziś 24–37 znaków) | `src/i18n/content/meta.ts`, `blog-map.ts` |
| P2 | CSS typografii wpisów tylko na wpisach (ok. −3,5 KB na pozostałych stronach) | `globals.css`, `PostView.tsx` |
| P3 [Zgoda] | Pole wiadomości jak pozostałe pola (tło w ciemnym motywie, 16 px na telefonie — dziś iOS powiększa stronę) | `ContactForm.tsx` |
| P3 | `typedRoutes` (literówki w adresach łapane przy kompilacji) | `next.config.ts`, `ROUTES` |
| ~~P3~~ | ~~Poster hero pobierany na każdej podstronie~~ — naprawione w iteracji 3 (`preload` w `HeroVideo`, −28 KB na podstronach) | — |
| P3 [Zgoda] | Dług z `/design-system`: 5 rozmiarów CTA → 2, odstępy `HomeSection` → jedna skala, `bg-green-500` → token (rozwiąże go system „Forma”) | strona główna i podstrony |
| P3 | Lucide 0.544 → 1.x, TypeScript 7, ESLint 10 (major — osobno, z testem) | `package.json` |

---

## Historia

Iteracje od listopada 2026: [DZIENNIK.md](DZIENNIK.md). Ustalenia i prace z 12 i 26–29 sierpnia 2026 (domena kanoniczna, taksonomia, WebP,
CSP, `/uslugi`, CV w PDF, wersja angielska) są opisane w historii gita —
`git log --until=2026-08-30`. Stan po audycie z 2 listopada 2026 opisuje
[AUDYT-2026-11.md](AUDYT-2026-11.md).
