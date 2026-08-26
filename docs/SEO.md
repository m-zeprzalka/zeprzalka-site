# Strategia SEO — zeprzalka.com

Cel: pozycja eksperta (web development + design + AI) i stały napływ
zapytań o zlecenia z wyszukiwarki. Horyzont: pierwsze efekty 2–3 miesiące,
stabilny ruch 6–12 miesięcy.

---

## 1. Stan techniczny (wdrożone w audycie 2026-08-12)

| Obszar | Stan |
| --- | --- |
| Canonicale na wszystkich podstronach | ✅ (`alternates.canonical`) |
| `metadataBase` + jeden adres kanoniczny | ✅ (wymaga decyzji www/apex — ROADMAP Etap 1) |
| sitemap.xml (strony, wpisy, kategorie) | ✅ (tagi celowo poza — thin content) |
| robots.txt | ✅ |
| RSS `/feed.xml` + `<link rel=alternate>` | ✅ |
| JSON-LD: WebSite + Person (home) | ✅ |
| JSON-LD: ProfilePage (/o-mnie) | ✅ |
| JSON-LD: BlogPosting + BreadcrumbList (wpisy) | ✅ |
| OG/Twitter cards + domyślny OG image | ✅ |
| Meta description na każdej podstronie | ✅ |
| Paginacja: canonical na /blog | ✅ |
| `lang="pl"`, semantyczny HTML, breadcrumbs | ✅ |
| Wydajność: SSG 196 stron, cache wideo | ✅ |

**Do zrobienia (techniczne):** weryfikacja w Google Search Console +
zgłoszenie sitemapy; Rich Results Test; PageSpeed na produkcji;
dedykowany OG image 1200×630 (obecnie ogólny PNG).

## 2. Fundament: jedna domena, jeden adres

Najpilniejsza rzecz w całym SEO tego serwisu: **`NEXT_PUBLIC_SITE_URL`
musi być identyczny z domeną primary w Vercel** (www albo apex — wybierz
jedno). Dziś canonicale mówią `zeprzalka.com`, a strona żyje na
`www.zeprzalka.com` — Google dostaje sprzeczne sygnały na każdej stronie.

## 3. Strategia treści — klastry tematyczne

Blog ma już 26 wpisów, głównie edukacyjnych (HTML, CSS, kursy). To buduje
ruch, ale nie zapytania ofertowe. Docelowa struktura: **3 klastry**, każdy
z treściami edukacyjnymi (ruch) + komercyjnymi (konwersja):

**Klaster A — "Strona internetowa dla firmy" (komercyjny, priorytet)**
- "Ile kosztuje strona internetowa w 2026?" ← najwyższa intencja zakupowa
- "Strona na WordPressie czy Next.js — co wybrać dla firmy?"
- "Ile trwa zrobienie strony internetowej? Proces krok po kroku"
- "Czego wymagać od wykonawcy strony (checklist dla zamawiającego)"
- Każdy wpis z CTA → /kontakt ("bezpłatna wycena").

**Klaster B — "AI w małej firmie" (wyróżnik ekspercki)**
- Case study aifeed.pl (jak zbudowałem autonomiczny serwis AI)
- "Automatyzacje AI dla małych firm — 5 realnych wdrożeń"
- "Integracja ChatGPT/Claude ze stroną firmową — od czego zacząć"
- Tu jest najmniejsza konkurencja po polsku i najlepszy efekt eksperta.

**Klaster C — istniejące treści edukacyjne (Next.js, HTML/CSS, Makerkit)**
- Kontynuować serie (Makerkit #6+, JS/TS #2+) — budują ruch long-tail
  i zaplecze linkowania wewnętrznego do klastrów A i B.

**Zasada linkowania:** każdy wpis edukacyjny linkuje do min. 1 wpisu
komercyjnego i do /kontakt lub /o-mnie.

## 4. Higiena treści

- **Tagi: max 3–5 na wpis.** Dziś ~110 unikalnych tagów na 26 wpisów —
  większość stron tagów ma 1 artykuł (thin content). Skonsoliduj do
  ~15–20 tagów przekrojowych.
- **Kategorie: docelowo 5–7** (np. AI, Next.js, Web development, Design,
  Projekty). Kategoria = temat klastra.
- **Meta description**: 140–160 znaków, z frazą kluczową i korzyścią.
- **Tytuły**: fraza kluczowa na początku, do ~60 znaków.
- **Częstotliwość**: 1 wpis/tydzień przez pierwsze 3 miesiące (jest 5
  szkiców w `content/drafts/` na start), potem min. 2/miesiąc.

## 5. E-E-A-T (sygnały eksperckości)

- ✅ Person/ProfilePage schema, bio autora pod każdym wpisem, strona /o-mnie
  z doświadczeniem i edukacją (Nagroda Rektora — dobry sygnał, zostaw).
- Do zrobienia: LinkedIn w `sameAs` + widoczny na stronie; realne case
  studies z nazwami klientów (Orlen, Vinci — masz je w portfolio, opisz je);
  data aktualizacji przy odświeżanych wpisach.

## 6. Pozyskiwanie linków (link building bez spamu)

1. **LinkedIn** — regularne posty PL z linkiem do wpisów (ruch + brand).
2. **aifeed.pl** — Twój drugi serwis; naturalny cross-link w stopce/o-nas.
3. **Uczelnie** — bio wykładowcy z linkiem (Civitas, WSR) — mocne domeny .edu.pl.
4. **Katalogi branżowe / mapy**: Google Business Profile ("usługi tworzenia
   stron, Warszawa/zdalnie"), Clutch, Useme, dobrzy freelancerzy PL.
5. **Publikacje gościnne**: JustJoin.it blog, Bulldogjob, dev.to (EN wersje
   najlepszych wpisów z canonical na oryginał).
6. **GitHub** — README projektów z linkiem do zeprzalka.com.

## 7. Pomiar (co miesiąc)

- GSC: wyświetlenia, CTR, pozycje frazy → decyzja o kolejnych tematach.
- Analytics: ruch na wpisy komercyjne, konwersje formularza (cel: każdy
  submit formularza = zdarzenie).
- Cel na 3 miesiące: indeksacja 100% sitemapy, 500+ wyświetleń/dzień w GSC,
  pierwsze zapytanie ofertowe z organica.
