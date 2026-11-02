# Monetyzacja, oferta i marka — jak zeprzalka.com ma zarabiać

Serwis nie jest produktem — jest **maszyną do pozyskiwania zleceń, pracy i autorytetu**.
Stan na 2 listopada 2026. Ceny i liczby w nawiasach kwadratowych `[ ]` to
**rekomendacje do Twojej decyzji**, nie fakty.

> Repozytorium jest publiczne — ten plik widzą też klienci i konkurenci. Jeśli to
> przeszkadza, przenieś go do `docs/prywatne/` (katalog jest w `.gitignore`).

---

## 1. Diagnoza w pięciu zdaniach

1. Serwis jest wykonany na poziomie elity, ale **nie wie, komu sprzedaje** — każdy element
   mówi „umiem wszystko” (strony, aplikacje, UX, grafika, wideo, social media, AI, kursy,
   eseje). Dla kupującego to szum.
2. **Tytuł i cena się gryzą**: „Architect” obok landing page'a za 2 500 zł.
3. **Dowody są wizualne, nie biznesowe**: kafel „Orlen Paczka — UX/UI” nie mówi, co zrobiłeś,
   w jakiej roli i z jakim efektem.
4. **Blog buduje publiczność studentów** (15 z 29 wpisów to materiały z zajęć), a dwa
   najmocniejsze teksty (transcendencja, SaaS) nie są powiązane z ofertą.
5. **Plan z sierpnia stoi** — nie ma LinkedIna, case study ani rekomendacji. Kod nie jest
   wąskim gardłem; są nim treści i decyzje.

## 2. Pozycjonowanie

### 2.1 Jedna tożsamość

Dziś: pięć opisów roli (hero, stopka, `/o-mnie` ×2, GitHub) i dwie liczby stażu.

- **EN:** „Design Engineer · AI products” — ugruntowana nazwa roli łączącej projektowanie
  z frontendem; dokładnie Twoje połączenie.
- **PL:** „Projektant i programista produktów cyfrowych z AI”
  (w nagłówkach krócej: „Projektuję i programuję produkty z AI”).
- „Architect” zostaw tylko, jeśli świadomie celujesz w role architektoniczne — wtedy
  potrzebne jest case study architektoniczne (aifeed.pl się nadaje).
- Jedna liczba lat, jedno zdanie bio — na stronie, LinkedInie, GitHubie i w CV.

Gdzie w kodzie: `src/lib/site.ts` (`SITE_TITLE`, `AUTHOR`), `src/i18n/content/meta.ts`,
`home.ts` (`subtitleRole`), `pages.ts` (`about.role`), `common.ts` (`footer.tagline`).

### 2.2 Trzy propozycje wartości (wybierz jedną)

**A. „Design engineer od produktów z AI”** — rekomendowana (łączy klientów, rekruterów i szkolenia).
> **H1:** Projektuję i programuję produkty z AI, które działają w prawdziwej firmie.
> **Podtytuł:** Jestem projektantem i programistą w jednej osobie. Od pomysłu, przez interfejs,
> po wdrożenie modelu językowego na produkcji — bez agencji pośrodku. [15] lat projektów
> dla m.in. Orlenu i Vinci, twórca autonomicznego serwisu aifeed.pl.
> **CTA:** Umów 20-minutową rozmowę · Zobacz realizacje
>
> *EN:* I design and build AI products that work inside real businesses. / Designer and
> engineer in one person — from idea, through interface, to a production LLM integration,
> with no agency in between.

**B. „Jedna osoba zamiast agencji”** — dla dyrektorów marketingu i właścicieli firm.
> **H1:** Strona, aplikacja i AI od jednej osoby, która je projektuje, programuje i odpowiada za wynik.
> **CTA:** Sprawdźmy, czy pasujemy

**C. „Wiem, co tam wpisać”** — najbardziej zapamiętywalna; wymaga sprzedaży wdrożeń AI i szkoleń.
> **H1:** AI potrafi już prawie wszystko. Moja praca to wiedzieć, o co je poprosić.
> **CTA:** Porozmawiajmy o Twoim procesie

### 2.3 Mikrocopy strony głównej (tylko tekst, układ bez zmian — [Zgoda])

| Element | Dziś | Propozycja |
| --- | --- | --- |
| Status | Gotowy do współpracy | Przyjmuję projekty od [grudnia 2026] |
| Podtytuł | Digital Solutions Architect - ponad 12+ lat… | wg wariantu A/B/C (bez tautologii „ponad 12+”) |
| CTA hero | Zarezerwuj Bezpłatną Konsultację | z kalendarzem: **Umów 20-minutową rozmowę**; bez: **Opisz projekt — odpowiem w 24 h** |
| Kompetencje | Umiejętności, które pomogą w sukcesie Twojego projektu | Trzy dyscypliny, jeden wykonawca odpowiedzialny za całość |
| Portfolio | Wszechstronne, kompleksowe i innowacyjne realizacje | Wybrane projekty dla marek, instytucji i startupów — oraz produkty, które zbudowałem dla siebie |
| Kontakt | Wyślij niezobowiązującą wiadomość, aby otrzymać wycenę | Napisz, co chcesz osiągnąć. W ciągu dnia roboczego odpowiem z pierwszą propozycją i widełkami. |
| „Bezpłatna wycena” | — | **Poproś o wycenę** — słowo „bezpłatna” przyciąga łowców darmowych konsultacji |

## 3. Oferta i ceny

### 3.1 Rynek (2026)

Polskie cenniki: landing **2–7 tys. zł**, strona firmowa z CMS **6–20 tys. zł**, WordPress
z indywidualnym projektem **od ok. 14 tys. zł**. Senior frontend na B2B: **18–30 tys. zł
netto/mc**, realna stawka projektowa niezależnego seniora **150–250 zł/h**. Landing
z projektem, wdrożeniem i SEO to uczciwie 25–40 h, czyli 4–10 tys. zł. Za 2 500 zł zostaje
10–17 h: albo szablon, albo dopłacasz. **Najniższa cena na stronie wyznacza, kto napisze.**

### 3.2 Proponowana struktura `/uslugi` (od najcenniejszego)

| # | Oferta | Zakres i termin | Cena [propozycja] |
| --- | --- | --- | --- |
| 0 | **Sprint diagnostyczny** (wejście) | 3–5 dni: warsztat, audyt, specyfikacja, makieta, wycena ryczałtowa | [2 900 zł], odliczane od projektu |
| 1 | **Wdrożenie AI w firmie** | audyt procesu → prototyp → wdrożenie → szkolenie; 3–8 tyg. | od [15 000 zł] + koszty modeli |
| 2 | **Produkt / aplikacja (MVP)** | UX/UI, frontend, backend, wdrożenie; 6–12 tyg. | od [30 000 zł] |
| 3 | **Strona firmowa, która sprzedaje** | strategia treści, projekt, wdrożenie, CMS, analityka; 4–6 tyg. | od [12 000 zł] |
| 4 | **Landing page w 10 dni** (stały zakres) | 1 strona, copy z Tobą, Lighthouse ≥ 95, analityka | [6 900 zł] ryczałt |
| 5 | **Warsztaty AI dla zespołów** | 1 dzień, do 12 osób, ćwiczenia na Waszych zadaniach | od [5 500 zł / dzień] |
| 6 | **Partner produktowy** (abonament) | [24] h/mc, 1 zadanie naraz | od [6 900 zł / mc] |
| 7 | **Opieka techniczna** | 3 warianty (niżej) | od [490 zł / mc] |
| 8 | **B2B / kontrakt** | dołączenie do zespołu, white-label dla agencji | stawka dzienna + CV |

Grafika, wideo i animacja: poza główną siatką, jako „dodatki do projektów”. Portfolio
wideo zostaje jako dowód warsztatu.

**Kolejność zmian:** teraz usuń 2 500 zł i grafikę z kafli, ustaw próg wejścia ok. 5–7 tys. zł,
dodaj sprint diagnostyczny. Po 2–3 case studies (ok. 60. dzień) podnieś stawki do tabeli.
W kodzie: `src/lib/services.ts` (dane) i `src/i18n/content/pages.ts` (`services`).

### 3.3 Opieka — trzy warianty z limitami

| Wariant | Cena | Zawiera | Reakcja |
| --- | --- | --- | --- |
| Start | [490 zł/mc] | aktualizacje, kopie, monitoring, **1 h zmian/mc** | 2 dni robocze |
| Biznes | [1 200 zł/mc] | + **4 h/mc**, raport miesięczny (ruch, GSC, CWV, zapytania) | 1 dzień roboczy |
| Rozwój | od [2 900 zł/mc] | + **12 h/mc** na rozwój, testy A/B, treści SEO | 4 h robocze |

Dziś „opieka od 300 zł/mc z drobnymi zmianami bez osobnej wyceny” nie ma limitu — zakres
będzie rósł bez końca.

### 3.4 Gwarancje, które możesz udowodnić własną stroną

- Stała cena po sprincie diagnostycznym.
- Lighthouse ≥ 90 na telefonie i 0 błędów dostępności w kluczowych szablonach — albo
  poprawiam na własny koszt.
- 30 dni bezpłatnych poprawek błędów po starcie.
- Kod i majątkowe prawa autorskie przechodzą na klienta po zapłacie.
- Pracujesz ze mną, nie z podwykonawcą.

### 3.5 Proces w 6 krokach

Rozmowa 20 min → sprint diagnostyczny albo oferta w 2 dni → projekt (2 rundy uwag) →
wdrożenie z podglądem od 1. tygodnia → start (testy, analityka, szkolenie) → opieka
albo komplet dostępów i dokumentacji.

## 4. Dowody

### 4.1 Szablon case study

**Kontekst** (klient, branża, rok, Twoja rola) → **Problem** (jedno zdanie, liczba, jeśli jest)
→ **Rozwiązanie** (3–5 decyzji z uzasadnieniem, zrzuty, film) → **Wynik** (liczby: konwersja,
czas, koszt, ruch; cytat klienta) → **Zakres i technologie** → **CTA** do pasującej usługi.

Kolejność: aifeed.pl (masz wszystkie dane sam), Orlen lub Vinci, projekt z 2026.

### 4.2 Rekomendacje

Poproś 5 klientów i 3 osoby z uczelni o odpowiedź na trzy pytania: jaki był problem przed
współpracą, co się zmieniło, komu byś mnie polecił. Imię, nazwisko, rola, firma, zdjęcie, zgoda.

### 4.3 Wzorce elity

Dennis Snellenberg (lista realizacji z nazwą, dyscypliną i rokiem; czas lokalny; „Let's work
together” z e-mailem), Brittany Chiang (lepka lewa kolumna z zachowaniem), Rauno Freiberg
i Emil Kowalski (rzemiosło interakcji), Josh Comeau (blog jako produkt), Huncwot (case
studies jako opowieść z danymi). Wspólne: **status budowany dowodami, nie tytułem**.

## 5. Lejek

- **Ścieżki wejścia:** Google → wpis → CTA → `/uslugi` → formularz/kalendarz;
  LinkedIn → strona główna → case study → kontakt; rekruter → `/o-mnie` → CV.
- **Formularz v2:** temat z listy (strona, aplikacja, AI, szkolenie, B2B, inne),
  widełki budżetu zgodne z cennikiem, termin, „Zapytaj o ten pakiet” z `/uslugi`
  wypełnia temat, komunikat sukcesu z kolejnymi krokami.
- **Kalendarz:** Cal.com lub Calendly, 20 minut — CTA w hero przestanie obiecywać coś,
  czego nie ma.
- **Magnes na leady:** „Checklista zamawiającego stronę/wdrożenie AI” (PDF za e-mail)
  + miesięcznik oparty na danych z aifeed.pl. Przed newsletterem — regulamin serwisu.

## 6. Pomiar — zdarzenia Vercel Analytics ([Kod], ok. 1 h)

Bez danych osobowych we właściwościach, maks. 2 właściwości na zdarzenie.

| Zdarzenie | Gdzie | Właściwości |
| --- | --- | --- |
| `lead_submitted` | **serwer**, `src/app/actions/contact.ts` po udanym `sendMail` (`@vercel/analytics/server`) | `topic`, `budget` |
| `lead_failed` | serwer, gałęzie błędów | `reason` (validation / rate_limit / smtp) |
| `cta_click` | przyciski do `/kontakt` i `/uslugi` | `location`, `target` |
| `email_click` | linki `mailto:` | `location` |
| `cv_download` | przycisk PDF na `/o-mnie` | `lang` |
| `booking_click` | link do kalendarza | `location` |
| `outbound_click` | LinkedIn, GitHub, aifeed.pl | `target` |

Lejki co tydzień: `/uslugi` → `cta_click(services)` → `lead_submitted`; wpis →
`cta_click(post_cta)` → `lead_submitted`. Do tego **arkusz leadów** (data, źródło, budżet,
status, wartość) — analityka pokaże kliknięcia, nie pieniądze.

## 7. Kanały poza stroną

| Kanał | Priorytet | Co zrobić |
| --- | --- | --- |
| **LinkedIn** | P0 | Nagłówek z nową rolą, baner z propozycją wartości, „Polecane”: case studies i oferta. **3 posty/tydz.**: notatka z laboratorium, karuzela z case study, opinia o aktualnościach AI (materiał z aifeed). 15 min dziennie komentarzy u grupy docelowej |
| **GitHub** | P1 | Bio zgodne ze stroną, README profilu, 4–6 przypiętych repozytoriów z opisem, archiwizacja testowych (`lottomat`, `patobet`, `*-test`, `zajecia-*`). Kandydat na open source: wzorzec dwujęzycznego bloga MDX z parami PL/EN wymuszanymi typami — masz go w tym repo |
| **Uczelnie** | P1 | Biogramy z linkiem na stronach Civitas i WSR, wykład gościnny „AI w projektowaniu”, przedmiot na studiach podyplomowych |
| **Wystąpienia** | P1→P2 | Laboratorium #1 na meetupy (WarsawJS, AI/produktowe) i konferencje (infoShare, JS Poland). Cel: 1 wystąpienie w 90 dni |
| **Google Business Profile** | P2 | Firma z obszarem obsługi, opinie po każdym projekcie |
| **Behance** | P2 | Case studies wideo i UX z linkiem do strony |
| Dribbble, Clutch, Useme | P3 | Świadomie odłożyć — Useme to przetargi cenowe, kłóci się z pozycjonowaniem |

## 8. Blog jako narzędzie marki

**Linia redakcyjna:** „Jak budować produkty cyfrowe z AI — w praktyce, z liczbami
i bez hype'u.” Dla właścicieli firm, menedżerów produktu i marketingu oraz projektantów.

| Filar | Udział | Rola |
| --- | --- | --- |
| **Laboratorium AI** (flagowy) | 40% | autorytet, LinkedIn, media |
| Wdrożenia i case studies | 25% | konwersja |
| Design engineering | 20% | rekruterzy, klienci premium |
| Decyzje zakupowe („ile kosztuje…”, „X czy Y”) | 15% | SEO z intencją zakupu → `/uslugi` |
| Akademia (obecne lekcje) | poza blogiem | ruch, lista mailingowa, przyszły produkt |
| Eseje i predykcje | maks. 1/kwartał | zasięg — zawsze z wnioskiem dla biznesu |

**Format flagowy „Laboratorium”** — powtarzalny eksperyment z metodologią i danymi:
„Ten sam landing w 6 narzędziach AI” (czas, koszt, Lighthouse, błędy dostępności,
poprawki ręczne), kwartalny raport „Stan AI według aifeed.pl”, jawny rachunek kosztów
utrzymania produktu AI. Raporty kwartalne warto publikować też w Zenodo (darmowy DOI)
— to ścieżka do cytowań i współpracy naukowej, zgodna z Twoim wykształceniem
(socjologia nowych mediów) i celem „zaawansowanych badań”.

Rytm: **1 tekst flagowy w miesiącu + 2–3 krótkie notatki** zamiast czterech średnich poradników.

## 9. Formalności, które budują zaufanie

| Sprawa | Status |
| --- | --- |
| Polityka prywatności + informacja przy formularzu | ✅ w kodzie (do przeczytania przed wdrożeniem) |
| Dane usługodawcy (forma działalności, NIP) — wymóg ustawy o świadczeniu usług drogą elektroniczną | ❌ podaj dane |
| Informacja o VAT przy cenach | ❌ potwierdź status |
| Warunki współpracy (płatności, poprawki, prawa autorskie, gwarancja) — PDF z `/uslugi` | ❌ |
| Regulamin serwisu (przed newsletterem) | ❌ |

Nie jestem prawnikiem — politykę prywatności i warunki warto raz przejrzeć z prawnikiem.

## 10. Filary przychodu (kolejność)

1. **Usługi** — wdrożenia AI, produkty, strony; teraz.
2. **Opieka i abonament** — przychód powtarzalny; proponuj w każdej wycenie.
3. **Praca B2B / kontrakt** — `/o-mnie` jako CV, sekcja „Dla zespołów”, CV po angielsku
   (druk `/en/about` do PDF).
4. **Szkolenia i warsztaty** — Nagroda Rektora i 10 lat dydaktyki to przewaga, której
   konkurencja nie ma; po 60. dniu.
5. **Produkty cyfrowe** — kurs z lekcji Akademii, szablony Next.js; po 3–6 miesiącach.
6. ❌ Reklamy (AdSense) — przy tym ruchu grosze, a zaśmiecają stronę usług premium.
