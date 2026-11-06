# Dziennik zmian

Co zrobiono w każdej iteracji i jak to sprawdzono — najnowsze na górze. Otwarte zadania
są wyłącznie w [ROADMAP.md](ROADMAP.md); szczegóły bezpieczeństwa i marketingu
w `docs/prywatne/` (poza repozytorium). Iteracja bez wpisu tutaj nie jest skończona.

---

## Iteracja 8 — 6 listopada 2026: nowa strona główna na shadcn (`src/app/main-page`)

Zakres od właściciela: koniec nowych koncepcji. Strona główna w kanonie Indeksu (`/demo/indeks-1`)
przepisana od zera jako kod produkcyjny — shadcn i Tailwind nadrzędnie, semantyka i SEO, tylko
polska wersja. Decyzje i plan przepięcia: `src/app/main-page/README.md`.

**Architektura:**
- `src/app/main-page/` to lustro `src/app` (trasy `.demo.tsx`, własne układy główne, `globals.css`
  z tokenami shadcn);
- prywatne foldery `_components`, `_lib`, `_variants` (wariant 1);
- komponenty shadcn instalowane CLI do `_components/ui` (`components.json` wskazuje tam), zmiany
  systemowe oznaczone `// zeprzalka:`: pigułki, pola 44 px, „+/−” w akordeonie, okna bez krzyżyka,
  wyraźny stan zaznaczenia przełączników;
- treść tylko z `src/i18n` i `src/lib` — nowy moduł `content/main-page.ts` (pl + en) z napisami
  interfejsu, frazami otwierającymi karty i liczbami;
- frazy w tekście są weryfikowane przy buildzie;
- `posterSize` w danych portfolio;
- ESLint pilnuje izolacji w obie strony;
- `motion` przeniesione do zależności (na razie nieużywane);
- doszły `cmdk` i `vaul` (z komponentami shadcn).

**Poprawki właściciela wdrożone:**
- Nagłówek:
  - logo minimalnie większe, glif w stałym pudełku z własnym krojem;
  - tło nagłówka to samo rozmycie z maską gradientu, bez kreski.
- Wyszukiwarka ⌘K:
  - na telefonie nie włącza klawiatury;
  - od tabletu ma szerokość kolumny;
  - ⌘/Ctrl ustawiane przed malowaniem;
  - fokus wraca do przycisku.
- Motyw i język:
  - zmiana motywu bez animacji (shadcn);
  - przełącznik PL/EN.
- Karty podglądu:
  - ten sam wygląd na najechanie i po kliknięciu, bez krzyżyka;
  - na telefonie popover na szerokość kolumny;
  - morf między frazami (płynięcie, wysokość, przenikanie z rozmyciem);
  - bez fal znaków w tekście.
- Wideo startu wyłania się z druku ze znaków (wzór kart z `/demo/glif`), jedyny efekt znaków w MVP.
- Kompetencje: treść otwartej karty od ikony do „+”.
- Stopka:
  - X pierwszy, chipy klikalne w całości;
  - „Zeprzałka” na 100% szerokości okna z rozmycia.

**Sprawdzone:**
- 360–1920 px w obu motywach, 0 poziomego przewijania;
- krawędzie elementów na liniach kolumny;
- „ogranicz ruch”, klawiatura i fokus;
- `pnpm check` i build z podglądem w czystej kopii;
- JS na start 222 KB gzip (obecna strona 209 KB, sama baza frameworka ok. 168 KB); wyszukiwarka
  (`cmdk`, `vaul`) i popover kart ładują się dopiero przy użyciu;
- treść zamkniętych akordeonów (kompetencje, realizacje) jest w HTML (`forceMount`), ale poza
  kolejnością Tab.

---

## Iteracja 7 — 5 listopada 2026: wersje bliskie wyboru i wspólny silnik znaków

Zakres od właściciela: ostatnia pętla przed wdrożeniem. Wygrywa wąski Indeks — powstają dwie
jego wersje (dopracowanie po uwagach i wariacja), The Best Of z dopracowanymi animacjami, a na
końcu wersja autorska. Rentgen i Kinetyka odrzucone.

**Wspólne decyzje właściciela** (obowiązują wszystkie wersje):
- ciemny motyw na start;
- obłości jako zasada systemu i jednolite wcięcia;
- siatka trzymana przez nagłówek i paletę ⌘K;
- bez liczników realizacji i wpisów;
- nagłówki sekcji „Tytuł — dalej małą literą”;
- X pierwszy w profilach, chip klikalny w całości;
- wykłady „2016–obecnie” bez nazw uczelni;
- logo = obecny komponent (glif co sekundę + domena);
- znaki: zestaw „Sygnet” (z logo), bez katakany i skanera, 6–24 kl./s, małe komórki, portret
  tonalny, kursor jako nieregularny szum;
- prawdziwe zdjęcie twarzy nigdy nie jest widoczne.

**Wspólny silnik znaków** — `src/components/demo/shared/glyph/` (opis i ustawienia w README),
następca silników z Glifu, laboratorium, Indeksu · nowego i The Best Of:
- jeden kontekst WebGL2 (OGL), ładowany leniwie (ok. 16 KB gzip) po wejściu strony
  (`deferGlyphEngine`); powierzchnie powstają kolejno w bezczynności i tylko blisko ekranu;
- twarz to sama głowa (bez szyi i ubrania); tony siedzą w module danych, nie w obrazie — przeglądarka
  pobiera tylko statyczną klatkę ze znaków;
- komponenty:
  - portret z wyborem znaków dla odwiedzającego;
  - wideo wyłaniające się ze szkieletu znaków (najechany kafel gra, z zwłoką na przewijanie);
  - dekodowanie napisów i liczb;
  - „Zeprzałka” w stopce reagujące na mysz i dotyk;
  - organiczna soczewka kodu w CTA;
  - cztery figury;
  - sygnet logo;
  - przejście motywu jako rozpad kafli od góry (nie koło od przycisku);
- kroje znaków: podzbiory DejaVu i STIX Two Math (licencje obok); zestaw logo kompletny (165 znaków).

**Wersje** (`/demo/<slug>`)
- **Indeks · I** (`indeks-1`, kandydat do produkcji):
  - indeks-new punkt po punkcie;
  - siatka trzech torów na liczbach całkowitych;
  - paleta ⌘K na osi kolumny, ⌘/Ctrl ustawiane przed malowaniem;
  - obłe pigułki pod frazami, karty z wideo w prawym torze (na telefonie na szerokość siatki);
  - akordeon na krawędziach kolumny, zawsze w kadrze na telefonie;
  - liczby i nagłówek „O mnie” dekodowane ze znaków;
  - wejście „harmonijka” bez czekania na silnik (H1 ostry ok. 0,85 s na telefonie przy CPU ×4, CLS 0);
  - CSS z 1029 do 658 linii.
- **Indeks · II** (`indeks-2`):
  - asymetryczna siatka 12 kolumn;
  - na marginesie twarz ze znaków, która przy wskazaniu frazy zamienia się w kartę z chipami
    i filmem kategorii;
  - segmenty kompetencji z figurą;
  - masonry ze szkieletem i dryfem kolumn;
  - soczewka kodu w CTA.
- **The Best Of · II** (`best-of-2`):
  - zoom wideo od 64% do kontenera;
  - slider portfolio bez pustych okien na telefonie;
  - segmenty kompetencji (log komend, rozmowa AI, figury);
  - masonry ze znaków z paralaksą kolumn;
  - CTA z soczewką, twarz przy formularzu, napis w stopce ze znaków.
- **Warstwy** (`autorska`, bonus po skończeniu trzech wersji): rozdziały jako obłe karty
  nasuwające się na siebie (sticky + CSS sterowany przewijaniem), nawigacja jak panel warstw
  w Figmie pod ⌘K, stopka-kurtyna z „Zeprzałka” ze znaków.

**Proces:**
- agent na wersję plus agent silnika (kamienie M1–M4);
- dwie rundy odbiorów art directora;
- niezależny krytyk na buildzie produkcyjnym: ranking Indeks · I > Indeks · II > The Best Of · II;
- trzecia runda po krytyku: długie zadania przy wejściu, fokus po palecie, ucięte pigułki,
  CLS, kopiowanie klatek silnika, napis „demo” w kaflu AI.

**Sprawdzone:**
- build z demami w czystej kopii;
- JS na start (gzip): 229 / 236 / 236 KB (Warstwy 234 KB);
- 0 poziomego przewijania i 0 błędów konsoli na produkcji;
- jedyne pobierane pliki twarzy to klatki ze znaków.

---

## Iteracja 6 — 5 listopada 2026: pięć koncepcji, najlepsze z dwóch iteracji

Zakres od właściciela: znowu pięć koncepcji strony głównej w piaskownicy, poprzednie zostają.
Opinia o iteracji 5:
- Tryptyk „położony” — trzy stałe kolumny to nieporozumienie;
- z Esencji chwalone: wejścia z rozmycia, zoom wideo, manifest „Mam 15 lat…” i wielki znak w stopce;
- Glif „kosmos”, ale twarz z ciemnymi oczodołami, za szybkie napisy i dziury po kliknięciu;
- Reedycja „solidny test”, Transformacja zawiodła.

Zadania:
- nowy „Indeks”;
- laboratorium glifów („pole minowe” wariantów);
- „The Best Of”;
- dwie własne inwencje po analizie Awwwards.

**Proces:** jak w iteracji 5 — agent na koncepcję z planem i pętlą zrzutów, dwie rundy uwag
art directora, niezależny krytyk na buildzie produkcyjnym (oceny, usterki z dowodami, ranking),
trzecia runda z filtrem gustu właściciela (np. H1 Indeksu zostaje dwutonowym zdaniem, choć
krytyk chciał skali display).

**Wspólne przygotowanie**
- Nowy portret ze zdjęcia właściciela: wycięte tło, podniesione cienie (oczy jasne), cztery
  warianty w `src/components/demo/shared/portrait/`. Surowe zdjęcie nie trafia do repozytorium.
- GSAP 3.15 i OGL 1.0 jako zależności piaskownicy (ESLint blokuje je w serwisie).
- Spis `/demo` pokazuje trzy iteracje od najnowszej.

**Koncepcje** (`/demo/<slug>`, porównanie: KIERUNEK §2)
- **Indeks · nowy:** wąziutka kolumna; spis sekcji i media pojawiają się tylko, gdy są potrzebne;
  karta na marginesie i wideo odkodowują się z glifów; pauza zamienia kadr w kod; morf przy
  przełączaniu realizacji z wierszem pod kursorem; ⌘K.
- **Glif · laboratorium:** strona jako pole wyboru efektu — sekcje A–H z podpisanym wariantem,
  panel z 7 zestawami znaków (m.in. binarny, katakana OFL, Braille), animacjami, tempem,
  kolorem i wyzwalaczem; portret czytelny w każdym zestawie; ustawienia kopiowane jako JSON.
  Jeden kontekst WebGL2 (OGL) na stronę.
- **The Best Of:** hero z rozmycia, zoom wideo „na zewnątrz” do siatki, jeden nieskończony
  slider kart przeciągany kciukiem, manifest, prosty log deployu, czat AI, masonry z dekodowaniem
  glifów, portret z koła 0/1 za kursorem w kontakcie, ⌘K, „Zeprzałka” na 100vw.
- **Rentgen:** kursor (na telefonie palec) jest soczewką, pod którą strona pokazuje prawdziwy kod:
  reguły CSS, dane realizacji, frontmatter, pola formularza; przełącznik Projekt/Kod zamienia
  całą stronę w inspektor.
- **Kinetyka:** typografia Geist w skali plakatu (GSAP ScrollTrigger + SplitText), „Portfolio”
  jako okno na reel w literach, taśma realizacji z tytułami wypełnianymi klipem, projekcja FLIP,
  wielki znak w stopce.

**Krytyka i trzecia runda:** ranking krytyka — The Best Of, Indeks · nowy, Kinetyka, Rentgen,
Glif · laboratorium. Główny wzorzec usterek: efekty scrubowane przewijaniem zostawiały po
zatrzymaniu stan pośredni (bełkot znaków, fałszywe liczby, czarna belka). Reguła na finał:
przewijanie najwyżej uruchamia animację, a stan spoczynkowy jest zawsze kompletny (wyjątek:
tekst wypełniany przewijaniem, ulubiony efekt właściciela).

---

## Iteracja 5 — 4 listopada 2026: pięć propozycji strony głównej

Zakres od właściciela: tylko strona główna, tylko piaskownica. Pięć propozycji:
- ulepszony „Indeks”;
- wolna interpretacja jego wskazówek;
- „zaskocz mnie”;
- wariacja obecnej strony;
- „Projekt X”.

Wymagania: czerń i biel, mobile first, shadcn na własnych tokenach, ruch w duchu Framera
(rozmycia, tekst wypełniany przewijaniem, nieskończone slidery, masonry), sygnet z migającym
glifem jako motyw. Poprzednie dema zostają.

**Proces (jak w studiu)**
- Pięciu agentów: każdy z jedną propozycją, własnym planem i pętlą zrzutów 360–1920 px w obu
  motywach i przy „ogranicz ruch”.
- Dwie rundy uwag art directora (odbiór własnymi zrzutami).
- Niezależna krytyka: agent bez kontekstu, na buildzie produkcyjnym, z rankingiem i dowodami.
- Trzecia runda poprawek z krytyki, z filtrem gustu właściciela (np. żywe kafle kompetencji
  zostały, choć krytyk chciał je usunąć).

**Propozycje** (`/demo/<slug>`, opis i porównanie: KIERUNEK §2)
- **Tryptyk:** trzy kolumny od 1280 px (spis z ⌘K i scroll-spy, dokument, scena multimediów),
  H1 w skali display, portfolio jako galeria albo lista, przelot kadru do sceny.
- **Esencja:** Framer w czerni i bieli; pokaz prac cyfrowych w dwóch rzędach, manifest
  wypełniany przewijaniem, cztery żywe kompetencje (karta prfct.dev, deploy, czat z wpisów
  bloga, oś czasu animacji), masonry wideo, wielki znak w stopce.
- **Glif:** portret ASCII jako pole glifów reagujące na kursor; realizacje jako rastrowe wydruki
  z glifów, które odkodowują się w kolor przy pierwszym spojrzeniu. Własny krój „Glif Symbols”
  (podzbiór DejaVu, licencja obok pliku).
- **Reedycja:** obecny układ i treść na „Formie”, ciemny motyw jako główny, reel rosnący przy
  przewijaniu, zakładki z 19 realizacjami i dialog z morfem. Spłaca w piaskownicy 10 z 13
  pozycji długu z KIERUNEK §5.
- **Transformacja:** hero od klatki 0, a rama obok przy przewijaniu (250 vh, sam CSS) zamienia
  ten sam nagłówek: szkic → projekt → kod (build → Ready) → produkt. Na koniec inspektor tokenów.

**Wspólne:**
- `src/components/demo/shared/content.ts`: cała treść z obecnej strony i „O mnie”, wymiary
  plakatów znane z góry, bez `fs`.
- Spis `/demo` jako prezentacja iteracji 5; rejestr z zadaniem, mocnymi stronami i ryzykami.
- Prefiksy klas na propozycję.

**Najważniejsze poprawki po krytyce**
- **Esencja:** media przy przewinięciu na telefonie 15,9 → 2,1 MB; portfolio bez duplikatu;
  rozmycie tylko na H1, wejście ≤ 700 ms.
- **Glif:** kafle zostają w kolorze po pierwszym spojrzeniu, czytelny portret;
  przewijanie na telefonie przy CPU ×4 wzrosło z 32–44 do 48–60 fps.
- **Transformacja:** hero sprzedaje od pierwszej klatki, nakładki bez kolizji.
- **Reedycja:** komplet realizacji i formularz z własną walidacją.

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
