# Strategia SEO — zeprzalka.com

Cel: pozycja eksperta (web development + design + AI) i stały napływ zapytań
o zlecenia z wyszukiwarki. Horyzont: pierwsze efekty 2–3 miesiące, stabilny
ruch 6–12 miesięcy.

Stan na: 2026-08-26 (po wdrożeniu strony technicznej).

---

## 1. Stan techniczny

| Obszar | Stan |
| --- | --- |
| Adres kanoniczny zgodny z serwowaną domeną | ✅ `www` wszędzie (było: sprzeczne) |
| Canonicale na wszystkich podstronach | ✅ |
| `metadataBase` + jedno źródło adresu | ✅ `src/lib/site.ts` |
| sitemap.xml (strony, wpisy, kategorie) | ✅ 38 adresów, tagi celowo poza |
| robots.txt | ✅ |
| RSS `/feed.xml` + `<link rel=alternate>` | ✅ |
| JSON-LD: WebSite + Person (home) | ✅ |
| JSON-LD: ProfilePage (/o-mnie) | ✅ |
| JSON-LD: BlogPosting + BreadcrumbList (wpisy) | ✅ z `dateModified` |
| JSON-LD: ProfessionalService + OfferCatalog (/uslugi) | ✅ nowe |
| Dedykowany obraz OG 1200×630 | ✅ osobny dla każdego wpisu |
| Meta description 140–160 znaków | ✅ wszystkie 27 wpisów |
| Tytuły ≤ 60 znaków | ✅ wszystkie 27 wpisów |
| Paginacja: canonical na /blog | ✅ |
| `lang="pl"`, semantyczny HTML, breadcrumbs | ✅ |
| Dostępność (axe) | ✅ 0 naruszeń na każdym typie strony |
| Wydajność (Lighthouse) | ✅ desktop 100, mobile 95, CLS 0 |
| Weryfikacja w GSC / Bing | ⏳ kod gotowy, czeka na tokeny |

**Do zrobienia (poza kodem):** weryfikacja w Google Search Console i Bing
(zmienne `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`), zgłoszenie
sitemapy, Rich Results Test po wdrożeniu, PageSpeed na produkcji.

## 2. Fundament: jedna domena, jeden adres ✅

**Rozstrzygnięte.** Apex (`zeprzalka.com`) odpowiada przekierowaniem 308 na
`www.zeprzalka.com` — to `www` jest domeną główną. Kod wskazywał apex, więc
każda podstrona wysyłała wyszukiwarce sprzeczny sygnał: „mieszkam pod www, ale
kanoniczny jestem pod apex, który i tak przekierowuje na www".

Adres jest teraz w `src/lib/site.ts` i domyślnie wskazuje `www`. Pozostaje
ustawić `NEXT_PUBLIC_SITE_URL=https://www.zeprzalka.com` w Vercelu albo usunąć
tę zmienną (wartość domyślna jest poprawna).

## 3. Strategia treści — klastry tematyczne

Blog ma 27 wpisów, głównie edukacyjnych. To buduje ruch, ale nie zapytania
ofertowe. Docelowa struktura: **3 klastry**, każdy z treściami edukacyjnymi
(ruch) i komercyjnymi (konwersja).

**Klaster A — „Strona internetowa dla firmy" (komercyjny, priorytet)**
- ✅ `/uslugi` — strona ofertowa z widełkami cen (główny cel klastra).
- „Ile kosztuje strona internetowa w 2026?" ← najwyższa intencja zakupowa;
  wpis powinien linkować do `/uslugi`, nie tylko do formularza.
- „Strona na WordPressie czy Next.js — co wybrać dla firmy?"
- „Ile trwa zrobienie strony? Proces krok po kroku"
- „Czego wymagać od wykonawcy strony (checklist dla zamawiającego)"

**Klaster B — „AI w małej firmie" (wyróżnik ekspercki)**
- Case study aifeed.pl (jak zbudowałem autonomiczny serwis AI)
- „Automatyzacje AI dla małych firm — 5 realnych wdrożeń"
- „Integracja modelu językowego ze stroną firmową — od czego zacząć"

**Klaster C — istniejące treści edukacyjne** (Next.js, HTML/CSS, Makerkit)
- Kontynuować serie; budują ruch long-tail i zaplecze linkowania wewnętrznego.

**Zasada linkowania:** ✅ wdrożona w kodzie — komponent `PostCta` zamyka każdy
wpis wezwaniem do wyceny z odnośnikami do `/kontakt` i `/o-mnie`. Reguła
obowiązuje automatycznie także przyszłe artykuły. Do ręcznego dopisania zostają
odnośniki tematyczne między wpisami (edukacyjny → komercyjny).

## 4. Higiena treści ✅

Wykonane 2026-08-26:

- **Kategorie: 48 → 6.** Web development (15), Next.js (10), AI (9), SaaS (5),
  Design (4), Projekty (2). Wcześniej 30 kategorii miało po jednym wpisie.
- **Tagi: 114 → 18** przekrojowych. Wcześniej 86 tagów występowało raz.
- **Tytuły:** 12 skróconych do ≤60 znaków, fraza kluczowa z przodu.
- **Opisy:** 20 przepisanych; wszystkie mieszczą się w 140–165 znakach.
- **Efekt:** 207 → 70 stron statycznych. Zniknęły dziesiątki stron z jednym
  wpisem, które rozpraszały budżet indeksowania i wyglądały jak thin content.

Zasada na przyszłość: **maksymalnie 2 kategorie i 3–5 tagów na wpis**, wyłącznie
z istniejących list. Nowy tag zakładamy dopiero, gdy ma objąć min. 3 wpisy.

## 5. E-E-A-T (sygnały eksperckości)

- ✅ `Person` / `ProfilePage`, bio autora pod każdym wpisem, strona `/o-mnie`
  z doświadczeniem i edukacją (Nagroda Rektora — mocny sygnał, zostaw).
- ✅ **Spójny autor**: dane strukturalne podawały „zeprzalka.com", a strona
  „Michał Zeprzałka". Teraz jedno źródło (`AUTHOR` w `src/lib/site.ts`).
- ✅ **Data aktualizacji**: pole `updated` we frontmatterze trafia do
  `dateModified` i do mapy strony. Używaj przy odświeżaniu starszych wpisów —
  to jeden z tańszych sposobów na odzyskanie pozycji.
- ✅ **CV do pobrania** (PDF generowany ze strony `/o-mnie`).
- ⏳ **LinkedIn**: ustaw `NEXT_PUBLIC_LINKEDIN_URL`, a profil dopisze się do
  stopki i do `sameAs`. To wciąż najważniejszy brakujący kanał.
- ⏳ **Case studies z nazwami klientów** (Orlen, Vinci) — masz je w portfolio,
  brakuje opisu: problem → rozwiązanie → wynik.

## 6. Pozyskiwanie linków (link building bez spamu)

1. **LinkedIn** — regularne posty PL z linkiem do wpisów (ruch + marka).
2. **aifeed.pl** — Twój drugi serwis; naturalny cross-link w stopce.
3. **Uczelnie** — bio wykładowcy z linkiem (Civitas, WSR) — mocne domeny .edu.pl.
4. **Katalogi branżowe / mapy**: Google Business Profile, Clutch, Useme.
5. **Publikacje gościnne**: JustJoin.it, Bulldogjob, dev.to (wersje EN
   z canonicalem na oryginał).
6. **GitHub** — README projektów z linkiem do serwisu.

## 7. Pomiar (co miesiąc)

- GSC: wyświetlenia, CTR, pozycje fraz → decyzja o kolejnych tematach.
- Vercel Analytics: ruch na `/uslugi` i wpisy komercyjne, ścieżka do formularza.
- Speed Insights: Core Web Vitals z ruchu rzeczywistego (nie z laboratorium).
- Cel na 3 miesiące: indeksacja 100% sitemapy, 500+ wyświetleń/dzień w GSC,
  pierwsze zapytanie ofertowe z organica.
