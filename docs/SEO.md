# Strategia SEO — zeprzalka.com

Cel: pierwsze skojarzenie w wyszukiwarce dla „projektant i programista produktów
z AI” i stały napływ zapytań ofertowych z Google. Horyzont: pierwsze efekty
2–3 miesiące, stabilny ruch 6–12 miesięcy.

Stan na: **2 listopada 2026** (po audycie i refaktorze — [AUDYT-2026-11.md](AUDYT-2026-11.md)).

---

## 1. Stan techniczny (zweryfikowany)

| Obszar | Stan | Gdzie w kodzie |
| --- | --- | --- |
| Domena kanoniczna `www`, apex → 308 | ✅ | `src/lib/site.ts` |
| Canonical na każdej stronie, wskazujący ją samą | ✅ 86/86 adresów sitemapy | `buildMetadata` w `src/i18n/page-metadata.ts` |
| `hreflang` pl/en + `x-default`, także w sitemapie | ✅ | `alternatesFor` w `src/i18n/config.ts` |
| `og:url`, `og:image` 1200×630, `og:site_name` na każdej stronie | ✅ (było: 60 stron z `og:url` strony głównej) | `buildMetadata` + pliki `opengraph-image.tsx` |
| Karty OG wpisów z tytułem (zamiast zdjęć WebP/SVG) | ✅ prerenderowane | `postOgCard` w `src/components/og.tsx` |
| Link do RSS w `<head>` | ✅ na każdej stronie (było: 1 z 232) | `buildMetadata` |
| Treść w `<main>` bez JavaScriptu | ✅ (było: ukryta za stopką przez `loading.tsx`) | — |
| Wszystkie strony statyczne | ✅ 0 tras dynamicznych | paginacja `/blog/strona/N` |
| JSON-LD: jedna encja `Person` z `@id` + `WebSite`, `BlogPosting`, `ProfilePage`, `ProfessionalService`, `CollectionPage`, `BreadcrumbList` | ✅ 0 błędów parsowania | `src/lib/schema.ts` |
| `max-image-preview:large` (Google Discover) | ✅ | `rootMetadata` w `src/i18n/metadata.ts` |
| Tagi `noindex, follow`, poza sitemapą | ✅ | `tagMetadata` |
| Kategorie z 1 wpisem `noindex`, poza sitemapą | ✅ automatycznie (`MIN_POSTS_TO_INDEX_CATEGORY = 2`) | `categoryMetadata`, `sitemap.ts` |
| Długie tytuły bez sufiksu „\| Michał Zeprzałka” | ✅ automatycznie przy > 60 znakach | `pageTitle` w `page-metadata.ts` |
| „Czytaj dalej” — 3 powiązane wpisy pod artykułem | ✅ | `getRelatedPosts` w `src/lib/posts.ts` |
| Kontrola reguł treści przy każdym commicie | ✅ `pnpm check:content` + CI | `scripts/check-content.mjs` |
| Weryfikacja Google Search Console / Bing | ❌ **do zrobienia** (kod gotowy: `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` albo rekord TXT) | — |
| LinkedIn w `sameAs` | ❌ **do zrobienia** (`NEXT_PUBLIC_LINKEDIN_URL`) | `src/lib/site.ts` |

**Techniki już nie trzeba poprawiać.** Każda kolejna godzina pracy nad SEO powinna
iść w treść komercyjną (sekcje 3–6), nie w znaczniki.

## 2. Pomiar — warunek wszystkiego

1. GSC: **właściwość domenowa** (rekord TXT w Vercel DNS — obejmuje www, apex i `/en`).
   Zgłoś sitemapę. Po tygodniu sprawdź „Strony” (co jest w indeksie) i „Wersje
   międzynarodowe” (hreflang).
2. Bing Webmaster Tools: import z GSC. Bing zasila Copilota i część wyszukiwarek AI.
3. Co miesiąc: wyświetlenia, CTR i pozycje fraz → decyzje o kolejnych tematach.
   Strony z wyświetleniami i niskim CTR → nowy tytuł i opis.

## 3. Tytuły stron kluczowych (zmiana tytułu dokumentu, nie wyglądu)

Konkurencja (zmierzone): „Filip Staniec - projektant stron, UI/UX i branding | Warszawa”,
„Tworzenie stron internetowych Warszawa | Filip Staniec”. Dziś strona główna to
„Michał Zeprzałka - Digital Solutions Architect” — bez jednej frazy, której szuka klient.

Propozycje (do decyzji razem z nową rolą — MONETYZACJA.md §2):

| Strona | Propozycja `<title>` |
| --- | --- |
| `/` | „Michał Zeprzałka – strony internetowe i aplikacje z AI, Warszawa” |
| `/uslugi` | „Tworzenie stron internetowych – cennik i wdrożenia AI \| Zeprzałka” |
| `/en` | „Freelance Next.js Developer & Product Designer, Poland \| Michał Zeprzałka” |

Gdzie: `src/i18n/content/meta.ts` (`root.titleDefault`, `services.title`).
H1 strony głównej zmienia jej wygląd — osobna decyzja.

## 4. Architektura treści komercyjnej (największa luka)

Polscy konkurenci wygrywają nie znacznikami, tylko **liczbą stron, które odpowiadają
na pytania kupującego**: podstrony usług, case studies pod osobnymi adresami,
strony branżowe. Tu jest jedna strona ofertowa i zero case studies.

1. **Case studies** `/portfolio/[slug]` (400–800 słów): problem → Twoja rola →
   rozwiązanie → wynik w liczbach → zakres i technologie, film jako hero.
   Kolejność: aifeed.pl, Orlen (Mistrzowie Podwórek / Paczka), Klinika Berbecki.
2. **Podstrony usług**, każda z FAQ, procesem, ceną „od”, case study i CTA:
   `/uslugi/strony-internetowe`, `/uslugi/landing-page`, `/uslugi/wdrozenia-ai`,
   `/uslugi/opieka-nad-strona`. `/uslugi` zostaje hubem z cennikiem.
3. **Strona lokalna** „Strony internetowe Warszawa” — tylko z prawdziwą lokalną treścią
   (klienci z Mazowsza, spotkania na miejscu). Bez tego to doorway page.

## 5. Higiena treści — reguły (pilnuje ich `pnpm check:content`)

- Maksymalnie **2 kategorie** i **3–5 tagów** na wpis, wyłącznie z list w
  `src/i18n/blog-map.ts`. Nowy tag zakładamy, gdy obejmie min. 3 wpisy.
- Opis meta **120–160 znaków**, tytuł **≤ 60 znaków**.
- Okładka w WebP (nie SVG), min. 1200 px szerokości.
- Każdy wpis ma parę PL↔EN w `POST_SLUGS` albo świadomie jej nie ma.
- Odświeżony wpis dostaje `updated: YYYY-MM-DD` (trafia do `dateModified` i sitemapy).
- `featured: true` tylko dla 2–4 wpisów filarowych (dziś 24 z 29 — wyróżnienie nic nie znaczy).
- Bez emoji w nagłówkach H2/H3 (psują kotwice i fragmenty w wynikach).

**Do poprawy teraz** (z `pnpm check:content` i audytu): transcendencja ma 4 kategorie
(3 nowe, każda z jednym wpisem) i 0 tagów; wpis o SaaS 0 tagów; 13 opisów poza zakresem;
3 tytuły EN za długie.

## 6. Plan treści

### 6.1 Istniejące wpisy (29 + 29)

| Rekomendacja | Wpisy |
| --- | --- |
| **Zostaw** (część z drobnymi poprawkami) | html, css, ppg, twoja-pierwsza-strona, bootstrap, twoja-strona-w-internecie, typescript-1 (te w hubie kursu), next-shadcn, dashboard, tailwind-netlify, seria Makerkit #1–#4, social-manager-fable-5, transcendencja, budowa SaaS |
| **Odśwież** (+ `updated:`) | grafiki (dopisz własny pomiar −90% wagi), trendy-socialmedia, mdx (Next 16, błąd z `getStaticProps`), od-html-do-ai (pod klienta), promptowanie (agenci 2026), tailwind (v4), wordpress (bez „2025” w tytule), claude-design |
| **Przepisz pod klienta** | zaliczenie → „Brief strony internetowej — szablon dla firm”; aifeed → case study |
| **Połącz / rozbuduj** | player → do next-shadcn (308); Makerkit #5 → rozbuduj albo połącz z #4 |
| **Slug** | `markerkit-*` → `makerkit-*` (literówka) — tylko przy odświeżeniu, zawsze z 308 |

Pełna tabela z frazami i intencjami: `docs/prywatne/raporty-2026-11/seo.md` §7.

### 6.2 Nowe tematy (fraza → intencja → link docelowy)

1. Koszt utrzymania strony internetowej: hosting, domena, opieka → komercyjna → opieka
2. Co wpływa na cenę strony? Rozbijam wycenę 3 projektów → komercyjna → `/uslugi`
3. Strona internetowa dla firmy — od czego zacząć → info-komercyjna → strony internetowe
4. WordPress czy Next.js dla strony firmowej → porównawcza → strony internetowe
5. Ile trwa zrobienie strony? Proces krok po kroku → komercyjna → `/uslugi#proces`
6. Landing page czy strona z podstronami → porównawcza → landing page
7. Wdrożenie AI w małej firmie: 7 automatyzacji z kosztami → komercyjna → wdrożenia AI
8. Chatbot AI na stronę firmową — ile kosztuje, kiedy ma sens → komercyjna → wdrożenia AI
9. Jak podłączyć ChatGPT lub Claude do danych firmy bez wycieku → info-komercyjna → wdrożenia AI
10. Europejski Akt o Dostępności: czy Twoja strona musi spełniać WCAG → informacyjna (pilna) → audyt
11. Redesign strony: kiedy przebudować, a kiedy poprawić → komercyjna → `/uslugi`
12. Audyt strony przed zleceniem nowej — 25 punktów → komercyjna → `/kontakt`
13. Case study: strona dla kliniki (Klinika Berbecki) → branżowa → case study
14. Next.js developer: kiedy warto, ile kosztuje, jak sprawdzić wykonawcę → B2B → `/uslugi`, `/o-mnie`
15. (EN) Hiring a freelance Next.js developer in Poland → B2B EN → `/en/services`

Każdy: 1200–2500 słów, własne liczby i zrzuty, FAQ jako treść, 2–4 linki wewnętrzne,
CTA do konkretnej podstrony usług. Fraza „ile kosztuje strona internetowa” należy już
do `/uslugi` — wpisy celują w długi ogon i linkują do niej.

## 7. Wersja angielska

EN ma służyć dwóm celom: zleceniom zagranicznym (nearshore) i rekrutacji B2B.
Lekcje kursu po angielsku (HTML/CSS basics, Bootstrap, GitHub Pages) konkurują z MDN
i freeCodeCamp — szansa na ruch jest bliska zeru. Po 90 dniach danych z GSC: lekcje
bez wyświetleń → `noindex`, usunięcie z sitemapy i z `POST_SLUGS`. Nowych lekcji nie
tłumaczyć. Rozważyć ceny w EUR i `x-default` → EN dla usług, o mnie i portfolio.

## 8. Encja i panel wiedzy (6–12 miesięcy)

Na stronie jest już jedna encja `Person` z `@id`, `alumniOf`, `knowsAbout` i `sameAs`.
Brakuje sygnałów zewnętrznych, w kolejności siły:

1. LinkedIn z linkiem do serwisu i tą samą rolą (i zmienna `NEXT_PUBLIC_LINKEDIN_URL`).
2. Biogramy wykładowcy na stronach Uniwersytetu Civitas i WSR z linkiem (domeny .edu.pl).
3. Google Business Profile jako firma z obszarem obsługi (bez publicznego adresu),
   ten sam zapis nazwy, miasta i kontaktu wszędzie.
4. GitHub (README profilu), Behance dla case studies wideo i UX.
5. Wystąpienia i publikacje gościnne z biogramem.
6. To samo zdjęcie (≥ 800 px) i to samo zdanie opisu we wszystkich kanałach.

Do dopisania w `personSchema` po decyzji: `award` (Nagroda Rektora), `worksFor`
/ `affiliation`, `knowsLanguage`, większe zdjęcie.

## 9. Linki przychodzące (bez spamu)

LinkedIn (posty z linkami do wpisów) · aifeed.pl (cross-link) · uczelnie (biogramy,
wykład gościnny) · Google Business Profile · publikacje gościnne (JustJoin.it,
Bulldogjob, dev.to w EN z canonicalem na oryginał) · GitHub README projektów ·
meetupy i konferencje (nagranie + strona prelegenta).
