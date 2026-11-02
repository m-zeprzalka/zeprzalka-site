# Plan działania — od 2 listopada 2026

Jedyna lista rzeczy do zrobienia. Diagnoza i uzasadnienia: [AUDYT-2026-11.md](AUDYT-2026-11.md).
Odhaczaj tutaj (`[x]`), żeby plan nie rozjechał się z rzeczywistością jak ten z sierpnia.

**[Ty]** — Twoje konto, decyzja albo treść · **[Kod]** — praca w repozytorium ·
**[Zgoda]** — zmienia wygląd strony głównej, czeka na Twoją akceptację.

---

## Zasady pracy (nowe)

1. **Push na `main` = natychmiastowe wdrożenie na produkcję.** Dlatego pracuj na gałęzi:
   `git switch -c nazwa` → push → Vercel buduje **podgląd** (Preview) → GitHub Actions
   sprawdza treść, lint, typy, build i podatności → dopiero wtedy merge do `main`.
2. Przed każdym commitem: `pnpm check` (treść + lint + build). Sam wpis: `pnpm check:content`.
3. Zmiany wyglądu zaczynamy w `/design-system`, nie na stronie głównej.
4. Każda zmiana pliku używanego przez stronę główną → porównanie zrzutów przed/po
   (metoda w README, „Kontrola wizualna”).

---

## Dzień 0 — wdrożenie tej rundy (ok. 1 h)

- [ ] **1. Przejrzyj zmiany.** `git log --oneline main..audyt-2026-11` i ten katalog `docs/`.
      Przeczytaj politykę prywatności: `src/i18n/content/legal.ts` (szczególnie okres
      przechowywania — 12 miesięcy to moja propozycja).
- [ ] **2. Ustawienia projektu w Vercelu** (Settings):
      - *Build and Deployment* → wyłącz nadpisania **Install Command** i **Build Command**
        (dziś `npm install` / `npm run build`). `vercel.json` i tak ma pierwszeństwo,
        ale panel nie powinien mówić czego innego niż repozytorium.
      - *Functions* → region **fra1** (Frankfurt) i włączone **Fluid Compute**.
      - *Environment Variables* → `NEXT_PUBLIC_SITE_URL` = `https://www.zeprzalka.com`
        albo usuń (wartość domyślna jest poprawna). Resztę zmiennych uporządkuj według
        `docs/prywatne/BEZPIECZENSTWO.md`.
- [ ] **3. Podgląd przed produkcją:**
      ```bash
      git push -u origin audyt-2026-11
      git push origin warianty-strony-glownej-2026-08   # tag z kodem odrzuconych wariantów
      ```
      Vercel zbuduje podgląd, GitHub Actions uruchomi CI. Jeśli push zostanie odrzucony
      z powodu `.github/workflows`, Twój token potrzebuje uprawnienia `workflow`
      (albo użyj `gh auth login`).
- [ ] **4. Sprawdź log buildu podglądu:** ma być `Running "install" command: pnpm install
      --frozen-lockfile` i `Next.js 16.4.4`. Przejdź po podglądzie: strona główna, wpis,
      `/blog/strona/2`, `/polityka-prywatnosci`, formularz (bez wysyłania).
- [ ] **5. Wdrożenie:**
      ```bash
      git switch main && git merge --ff-only audyt-2026-11 && git push origin main
      ```
      Pierwszy deploy po zmianie ustawień: w Vercelu *Redeploy* z odznaczonym
      „Use existing Build Cache”.
- [ ] **6. Weryfikacja na produkcji:**
      ```bash
      # wersja Next w publicznym JS (oczekiwane 16.4.4)
      for j in $(curl -s https://www.zeprzalka.com/ | grep -oE '/_next/static/[^"]+\.js' | sort -u); do
        curl -s "https://www.zeprzalka.com$j" | grep -oE 'version:"16\.[0-9.]+"' && break; done
      # blog statyczny (oczekiwane: x-vercel-cache HIT po drugim wywołaniu, bez no-store)
      curl -sI https://www.zeprzalka.com/blog | grep -iE 'cache'
      ```
      Plus: PageSpeed Insights dla `/` i jednego wpisu, LinkedIn Post Inspector dla `/uslugi`,
      **jedna prawdziwa wiadomość z formularza** (sprawdź skrzynkę i odpowiedź na reply-to).
- [ ] **7. Sprzątanie gałęzi:**
      ```bash
      git push origin --delete vercel/react-flight-rce-vulnerability-t4208i vercel/react-server-components-cve-vu-06xirk
      git branch -d audyt-2026-11
      ```

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
| P2 | Wstępy do kategorii (60–120 słów, link do usługi) | `blog-map.ts`, `CategoryView.tsx` |
| P2 | BotID dla formularza (po regule WAF) | `next.config.ts`, `contact.ts` |
| P2 | Menu mobilne jako „plansza” (e-mail, CTA, EN/PL) | `MobileNav.tsx` |
| P2 | `llms.txt` generowany z `ROUTES`, usług i wpisów | nowa trasa |
| P3 | Angielska 404 dla `/en/*` | `global-not-found.tsx` |
| P3 | Lazy load panelu menu mobilnego (Radix Dialog, 11 KB na każdej stronie) | `MobileNav.tsx` |
| P3 [Zgoda] | Hero: poster przez `next/image` zamiast `preload()` (dziś prefetch strony głównej pobiera 28 KB postera na każdej podstronie), wersja wideo dla telefonów | `HomeView.tsx`, `Hero.tsx` |
| P3 [Zgoda] | Dług z `/design-system`: 5 rozmiarów CTA → 2, `top-22/24` → jedna zmienna, `md:font-semi-bold`, `bg-green-500` → token | strona główna i podstrony |
| P3 | Lucide 0.544 → 1.x, TypeScript 7, ESLint 10 (major — osobno, z testem) | `package.json` |

---

## Historia

Ustalenia i prace z 12 i 26–29 sierpnia 2026 (domena kanoniczna, taksonomia, WebP,
CSP, `/uslugi`, CV w PDF, wersja angielska) są opisane w historii gita —
`git log --until=2026-08-30`. Stan po audycie z 2 listopada 2026 opisuje
[AUDYT-2026-11.md](AUDYT-2026-11.md).
