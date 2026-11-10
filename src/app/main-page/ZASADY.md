# Zasady nowej wersji zeprzalka.com

Zasady, kryteria i decyzje dla `src/app/main-page`. To dokument normatywny — dla właściciela,
agentów i każdego, kto dotyka kodu. Opis architektury, uruchomienia i przepięcia jest w
[README.md](README.md). Zmiana decyzji = zmiana tutaj (z datą), potem kod.

## 1. Cel i kryteria sukcesu

Strona **i kod źródłowy** są wizytówką: repozytorium jest publiczne, a zaglądać będą seniorzy,
którzy mogą zatrudnić autora. Sukces mierzymy, a nie oceniamy na oko. Drobne odstępstwa są
dopuszczalne, jeśli wymaga tego wygląd — wtedy opisujemy je w sekcji 10.

- **Lighthouse 100 / 100 / 100 / 100** (wydajność, dostępność, dobre praktyki, SEO) na telefonie;
- **LCP < 1,8 s** (telefon, 4G), **CLS = 0**, **INP < 200 ms** — także przy „harmonijce”, w której
  kadr wchodzi ostatni: ruch niesie warstwa, która nie jest kandydatem LCP (§6);
- **JS na start nie więcej niż obecna strona** (ok. 210 KB gzip; sama baza Next 16 + React 19 to
  ok. 170 KB) — cięższe części (wyszukiwarka, popover) ładują się dopiero przy użyciu;
- **0 błędów axe** (WCAG 2.2 AA), **0 błędów** w testach danych strukturalnych — z jednym
  świadomym odstępstwem: sygnet logo zmienia znak bez końca (§10);
- **kod do zrozumienia w 30 sekund na plik:** małe pliki, jedna odpowiedzialność, zero magii.

Wygląd: kanon **Indeksu** (wąska kolumna, menu i media na żądanie, ⌘K). Dema z iteracji 6–7
(`/demo/indeks-new`, `/demo/indeks-1`) są **specyfikacją zachowań i wyglądu**, nie źródłem kodu.

## 2. Zasady nadrzędne

1. **Najpierw semantyczny HTML,** potem style (Tailwind, własnego CSS jak najmniej), na końcu JS.
   Mobile first.
2. **shadcn/ui zawsze nadrzędnie, z Tailwindem jako jedynym systemem UI.**
   - Przed napisaniem czegokolwiek sprawdzamy, czy komponent albo funkcja jest w ui.shadcn.com.
   - Własny komponent tylko wtedy, gdy shadcn go nie ma.
   - Żadnych własnych prymitywów obok `ui/`. Jedyny własny prymityw w `ui/` to `choice-group.tsx`
     (natywne radio albo pola wyboru: działa bez JS; `RadioGroup`, `Checkbox` i `ToggleGroup`
     shadcn to Radix ze stanem).
3. **Własny CSS tylko na tokeny** (`@theme`), `@keyframes` i opisane wyjątki (`article.css` —
   treść wpisu; `code.css` — blok kodu i paleta składni `--syntax-*`, importowana przez
   `CodeBlock`). `globals.css` jak najkrótszy.
4. **Domyślnie komponenty serwerowe.** `"use client"` tylko na małych wyspach interakcji.
5. **Teksty wyłącznie z `src/i18n`,** zawsze w parze `pl`/`en`. Najpierw polska wersja; angielska
   po akceptacji polskiej.
6. **Każdy efekt ma powód** (hierarchia, informacja zwrotna, ciągłość) i jest opisany. Bez
   ozdobników, czyli bez AI slopu.
7. **Jedna rzecz, jedno miejsce:** jedno `cn()`, jeden zestaw tokenów, jeden wzór sekcji, jeden
   silnik znaków, jedna mapa adresów (`_lib/routes.ts`), jedna definicja danych strukturalnych
   (`src/lib/page-schema.ts`).
8. **Perfekcyjny design system** oparty na shadcn, o seniorskim charakterze: idealne RWD i mobile
   first, piękny wygląd na każdej rozdzielczości, najlepsze praktyki UX/UI.
9. **Idealne SEO, semantyka i optymalizacja kodu.**
10. **Warstwa widoku od zera, zero duplikatów:** nie kopiujemy kodu z `/demo` ani ze starych
    komponentów serwisu; dema są wyłącznie specyfikacją. Z serwisu importujemy (nie kopiujemy)
    treść `src/i18n`, logikę `src/lib` i `src/routes/params.ts`.

## 3. Izolacja i miejsce kodu

- Cała nowa wersja żyje w `src/app/main-page/` na gałęzi `main` (układ = lustro `src/app`).
- Trasy mają końcówkę `.demo.tsx` → na zeprzalka.com tylko przy `DEMO_PUBLIC=1`, zawsze `noindex`
  i poza mapą strony.
- ESLint zabrania serwisowi importów z `main-page`, a `main-page` — importów z `@/components/*`
  i z `/demo`. Arkusz serwisu ma `@source not "./main-page"`.
- shadcn instalujemy wyłącznie przez CLI do `_components/ui/` (stare `src/components/ui/` zostaje
  nietknięte).

## 4. Design system

- **System w `ui/`, układ w stronie:** to, co wspólne dla całej strony (promienie, rozmiary,
  warianty, fokus), trafia do tokenów i wariantów `cva` w `ui/*`; na stronie `className` służy
  tylko układowi (odstęp, szerokość, miejsce w siatce). Zmiany w `ui/*` mają komentarz
  `// zeprzalka:`.
- **Tokeny w jednym miejscu** (`globals.css`): kolory semantyczne jak w shadcn (paleta neutral),
  ciemny motyw domyślny i tylko na ekranie (wydruk zawsze jasny), obłości jako zasada. Wyjątek:
  paleta składni `--syntax-*` żyje przy bloku kodu (`_components/blog/code.css`) — sześć barw
  o jednej jasności na motyw, kontrast ≥ 5:1 do tła bloku; jedyne kolory poza paletą neutral.
- **Siatka (9.11, tory 10.11):** od 1280 px `[margines][tor][odstęp][kolumna][odstęp][tor][margines]`.
  Kolumna treści (`column`, 40 → 44 → 48 rem), dwa symetryczne tory o stałej proporcji do kolumny
  (`--container-track` = 3/8 kolumny: 240 → 264 → 288 px; `rail` po lewej — menu główne,
  `stage-track` po prawej — karta podglądu, a we wpisie spis rozdziałów), odstęp toru
  `--spacing-track`, górna krawędź obu torów `top-rail`. Szerokość okna ponad to biorą marginesy —
  nic w torze nie rośnie z oknem. Tory są `fixed`, więc odejmują połowę paska przewijania zdjętego
  przez okno modalne (`--removed-body-scroll-bar-size`) — stoją w miejscu razem z kolumną. Ikony
  na krawędziach kolumny dostają ujemny margines równy wcięciu.
- **Stopnie pisma:** `text-title` (tytuł wpisu), `text-display` (h1 startu i podstron), nagłówek
  sekcji „Tytuł — rozwinięcie” (`SectionHeading`), tekst, drugorzędny, najmniejszy. Treść wpisu ma
  własną skalę o wyraźnym kontraście wielkości (`article.css`, 10.11): tekst 17 → 19 px o ton
  cichszy od nagłówków, h3 ≈ 21 → 24 px, h2 ≈ 26 → 32 px, tytuł 32 → 48 px. Żywy katalog:
  `/main-page/design-system`.
- **Strzałka ↗ to znak linku (decyzja 10.11):** każdy link ze strzałką — podstrona, wpis,
  realizacja, profil, adres zewnętrzny — ma `LinkArrow` (`ArrowUpRight`, wychyla się o 2 px przy
  najechaniu `group/link`). `ArrowRight` zostaje tylko na wysyłce formularza (działanie, nie link).
- **Kontrolki na kadrze:** `Button variant="media"`, 12 px od krawędzi kadru (`right-3 bottom-3`
  — odtwarzanie, `top-3 right-3` — zamknięcie karty).
- **Wezwania (CTA): najwyżej dwa działania** — główne ze strzałką i ciche obok (`CtaPanel` nie
  przyjmie trzeciego w typie). Trzecie rozmywało wybór (10.11).
- **Kursor:** wszystko, co się klika, ma łapkę — reguła w `globals.css` (Tailwind 4 zdjął ją
  przyciskom).

## 5. Semantyka i SEO

- Szkielet: link „Przejdź do treści”, `header` z `nav`, `main` z sekcjami `aria-labelledby`, jeden
  `h1`, nagłówki bez przeskoków, `article` dla wpisów, realizacji i pakietów, `dl` dla par
  „etykieta — wartość”, `time` dla dat, `footer` z `address`.
- Link to link, a przycisk to przycisk. Tekst nigdy tylko w canvasie: efekty znaków mają tekst
  w DOM, a warstwa graficzna jest `aria-hidden`.
- Metadane przez `buildMetadata` (`src/i18n/page-metadata.ts`): canonical, hreflang `pl`/`en`
  - `x-default`, karta OG na stronę z fabryk `src/lib/og.tsx`. W podglądzie `preview()` dokłada
    `noindex`.
- JSON-LD: `Person`, `WebSite`, `ProfilePage`, `BlogPosting` z `BreadcrumbList`, `Service`
  z katalogiem ofert, `CollectionPage` z `ItemList` dla portfolio — z `src/lib/page-schema.ts`.
- Obrazy przez `next/image` (wymiary, `alt`, `sizes` z `_lib/media.ts`), kadr LCP z `preload`.

## 6. Ruch i interakcje

- **Spoczynek zawsze kompletny.** Wyjątek: tekst „Mam 15 lat…” wypełniany przewijaniem.
- **„Ogranicz ruch” w jednym miejscu:** reguła w `globals.css` skraca każde przejście i animację
  do 1 ms (zdarzenia końca nadal przychodzą), JS pyta `prefersReducedMotion()` / `useReducedMotion()`.
- **Budżet:** jedna sygnatura na sekcję; wejście strony nigdy nie czeka na JS (samo CSS); napisy
  ok. 600–900 ms.
- **Budżet wejścia startu (decyzja 9.11):** „harmonijka” trwa ok. 2 s, a druk wideo ze znaków
  kolejne ~2,5 s — strona nadrabia prostotę ruchem.
- **Kadr LCP nigdy nie dostaje `opacity` w animacji:** przeglądarka liczy LCP dopiero po końcu
  takiej animacji (zmierzone 9.11: 2,3–2,5 s zamiast 0,2–0,4 s). Obraz maluje się od pierwszej
  klatki pod zasłoną w kolorze tła (zasłanianie się do LCP nie liczy), a ruch niesie warstwa nad
  nim: na starcie canvas z drukiem (`enter-media`), we wpisie zasłona (`uncover`) i osiadanie
  kadru (`settle`). Plakat startu ma dokładnie 16:9 jak kadr, a wideo stoi w transformacji
  (`scale-[1.002]`, nadmiar przycina ramka) — Chrome nie bierze go wtedy za kandydata LCP, więc
  pierwsza klatka klipu nie wypiera plakatu (bez tego LCP ok. 3 s, zmierzone 10.11).
- **Wejście „harmonijka” (9.11):** najpierw czerń, potem z góry nagłówek, z boku menu w torze,
  status (okruszki), słowa tytułu i szarego rozwinięcia jedno po drugim, działania, a na końcu
  kadr: druk wideo startu wjeżdża z dołu i rośnie do szerokości kolumny, okładkę wpisu odsłania
  zasłona. Samo CSS,
  pory w jednym miejscu (`--enter-*` w `globals.css`), ten sam rytm na starcie i na podstronach.
- **Wjazd przy przewijaniu:** nagłówki sekcji i bloki treści pod zgięciem wjeżdżają z dołu
  (`reveal` — oś `view()`, krycie i przesunięcie, zakres w długości: 10 rem przewinięcia). Nie na
  elementach, które same zmieniają `opacity`. Firefox bez osi przewijania — bez ruchu.
- **Wejście w kadr bez pomiarów:** napisy, „Nowy” i stopka pytają pierwszy odczyt
  IntersectionObservera (`observeReveal`), a nie `getBoundingClientRect` przy hydratacji.
- **Znaki — wspólny język ruchu (9.11):** każda animacja „treści” opiera się na znakach sygnetu
  (`GLYPHS`, kroje `font-logo`) — ich układaniu i przeskakiwaniu. Sygnet logo zmienia znak co
  sekundę bez końca (decyzja właściciela; „ogranicz ruch” go zatrzymuje), najechanie albo fokus
  puszcza szybki szum sygnetu i falę przez domenę; nagłówki sekcji i liczby odczytują się ze
  znaków przy wejściu w kadr; wideo startu składa się ze znaków (`_lib/glyph-reveal.ts`: znak
  dobrany do tonu obrazu według zmierzonego pokrycia tuszem, krótki druk, front w wideo). Czytnik
  dostaje napisy w całości, warstwy znaków są `aria-hidden`. W kartach podglądu i w stopce znaków nie ma.
- **Tekst wypełniany przewijaniem (9.11, 10.11):** prawie słowo po słowie, z ostrą granicą jak
  w `/demo/indeks-1` — każde słowo nabiera koloru na odcinku przewinięcia równym trzem słowom,
  a granica stoi na 58% wysokości okna (idzie z czytaniem, nie przed nim). Niewypełnione słowo —
  najciemniej, jak pozwala kontrast dużego tekstu 3:1: 45% koloru tekstu w jasnym motywie, 36%
  w ciemnym (`--fill-from`). Frazy z kartą idą z falą.
- **Karta podglądu (desktop z myszą, od 1280 px):** tylko na czas najechania albo fokusu —
  kliknięcie myszą jej nie przypina. Kursor może przejechać na kartę (zwłoka ukrycia 300 ms),
  kliknąć jej link (WCAG 1.4.13) albo zamknąć ją krzyżykiem. Tor jest `aria-hidden`, linki w nim poza Tabem; Enter
  i Spacja otwierają tę samą kartę jako popover z fokusem na karcie, Tab za jej ostatnim
  elementem idzie dalej po frazie, Escape oddaje fokus frazie. Karta stoi przy kursorze i płynie
  za nim w pionie; przewijanie pod nieruchomym kursorem nic nie otwiera.
- **Karta na dotyku:** popover pod frazą na szerokość kolumny (od 768 px — 24 rem), zawsze pod
  spodem — gdy brakuje miejsca, strona się dosuwa.
- **Krzyżyk na każdej karcie (decyzja 10.11, odwraca „karty bez krzyżyka” z 6.11):** kartę
  trudno było zamknąć. Delikatny przycisk w prawym górnym rogu — na kadrze jak przycisk
  odtwarzania (`variant="media"`, 12 px od krawędzi), na karcie bez kadru w cichej wersji przy
  tytule. Ten sam w popoverze i w torze; fokus po zamknięciu wraca na frazę.
- **Portfolio na starcie:** kliknięcie wiersza z kartą na marginesie — kadr przelatuje z karty do
  panelu (View Transition); kotwice `#realizacja-…` idą jedną ścieżką (`goToAnchor`): wiersz
  otwiera się od razu, potem strona przewija, a fokus przechodzi na wiersz.
- **Wideo:** start gra w kadrze z pauzą; poza startem klip gra tylko na żądanie (WCAG 2.2.2) —
  w galerii najechanie myszą to podgląd, przycisk włącza i wyłącza; plik pobiera się dopiero wtedy.
- **Nawigacja = podstrony (decyzja 9.11, bez kotwic):** menu główne w lewym torze (od 1280 px,
  `RailNav` w powłoce, każda strona) i ⌘K to te same podstrony — sekcji stron nie ma ani tu, ani tu.
  Menu stoi w całości (bez pokazywania jednej pozycji naraz), bieżąca podstrona z kropką, chowa się
  nad stopką. Poniżej 1280 px podstrony prowadzi ⌘K (na telefonie arkusz) i stopka. ⌘K: podstrony,
  realizacje (otwierają swój wiersz na starcie), wpisy, akcje. Każda podstrona ma okruszki.
- **Przejście na inną stronę zaczyna od góry, bez przewijania na oczach:** `data-scroll-behavior`
  na `<html>` — Next 16 wyłącza wtedy płynne przewijanie na czas przejścia (bez atrybutu nowa
  strona rysowała się na wysokości poprzedniej i płynęła na górę). Fokus przechodzi na `<main>`.
- **Spis rozdziałów wpisu (10.11):** jedyny spis kotwic — w prawym torze (`TableOfContents`;
  we wpisie karta podglądu jest tylko przy „Czytaj dalej”), pełne nazwy rozdziałów łamane
  w szerokości toru, kropka przy czytanym rozdziale. Chowa się za końcem treści
  (`data-toc-scope`) i na czas karty podglądu w tym samym torze. Poniżej 1280 px — zwijany
  `details` nad treścią.
- **Zamknięcia:** usługi, portfolio, blog (kategorie, tagi, wpis) kończą się kartą z wezwaniem
  (dwa działania); kontakt kończy formularz, „O mnie” — rozmowa i pobranie CV.
- **Formularz:** rodzaj projektu to wybór wielokrotny z „Inny” na końcu (natywne pola wyboru,
  działa bez JS); akcja serwisu składa zaznaczenia w jedną listę po przecinku (stary formularz
  z polem tekstowym działa bez zmian).
- **Motyw:** ciemny już w HTML (bez błysku jasnych tokenów); zmiana klasy bez animacji —
  przejścia wstrzymane tylko na czas przełączenia (`useToggleTheme`), nie przy każdym wczytaniu.
  Kolor paska przeglądarki idzie za motywem.

## 7. Treść i i18n

- Wszystkie teksty z `src/i18n/content/*` (pary `pl`/`en`, typ `en: typeof pl`); nowe napisy
  interfejsu dopisujemy w obu językach (`src/i18n/content/main-page.ts`). Wyjątek: katalog
  `/main-page/design-system` (wewnętrzny, tylko po polsku).
- Polska typografia: twarde spacje po jednoliterowych słowach (`noOrphans`), półpauzy w okresach.
- Wykłady „2016–obecnie” bez nazw uczelni (prośba właściciela, 5.11).

## 8. Wydajność i media

- Budżety: JS jak wyżej, CSS ≤ 20 KB, żadnych długich zadań > 50 ms w pierwszych 1,2 s.
- Kroje przez `next/font` z preloadem tego, co nad zgięciem; krój znaków jako mały podzbiór.
- Wideo: ok. 600 kb/s, `preload="none"`, gra tylko w kadrze, pauza dla zapętlonego ruchu.
- Typografia artykułów (`article.css`) tylko na wpisach.

## 9. Dostępność i jakość

- **WCAG 2.2 AA:** kontrast w obu motywach, fokus widoczny (`--ring` pełnym kolorem, ≥ 3:1)
  i wracający, cele dotyku ≥ 44 px (w nagłówku pole dotyku powiększone `after:` bez zmiany
  rysunku), pełna obsługa klawiaturą, formularz z etykietami i komunikatem pod każdym błędnym
  polem, reflow 320 px bez przewijania w poziomie.
- **Bramki przed commitem:** `pnpm check` (treść, testy jednostkowe, klasy, formatowanie, lint,
  build, kontrola HTML). Czyste funkcje (`_lib/text.ts`, `_lib/routes.ts`…) mają testy obok.
- **Klasy Tailwinda w zapisie kanonicznym:** `pnpm check:classes`.

## 10. Pułapki, odstępstwa i decyzje odrzucone

- **`asChild` w komponentach klienckich tylko z dzieckiem z klienta.** Slot Radix nie przyjmuje
  elementu z komponentu serwerowego (w dev przychodzi jako leniwa referencja RSC — wiersz akordeonu
  znikał po hydratacji). `Button`, `Badge` i `Breadcrumb` są serwerowe — tam `asChild` jest bezpieczne.
- **`tailwind-merge` zna tokeny siatki i stopnie pisma** (kontener `column`, odstępy `page`,
  `track`, `rail`; `text-display`, `text-title` — `src/lib/utils.ts`) — inaczej `max-w-column`
  nie gasi `max-w-*` z komponentu shadcn, a `text-title` zgasiłby kolor tekstu.
- **Stałej z modułu `"use client"` nie importujemy do komponentu serwerowego:** każdy eksport
  takiego modułu jest po stronie serwera referencją klienta, nie wartością (napis selektora
  przyszedłby jako obiekt). Wspólne stałe — w modułach bez dyrektywy (`_lib/*`,
  `layout/track-classes.ts`, `page/index-row.ts`).
- **Hash z adresu tylko przez `hashId()`** (`_lib/anchors.ts`): zepsuty (`#50%`) rzucał
  `URIError` w powłoce i wywracał całą stronę na ekran błędu (10.11).
- **`data-scroll-behavior="smooth"` na `<html>`** — warunek, żeby Next 16 przewijał na górę
  bez animacji przy przejściu (arkusz ma `scroll-behavior: smooth` dla kotwic).
- **Wideo nad plakatem — powiększenie, nie pomniejszenie:** `scale-[0.999]` (iteracja 12) chował
  wideo przed LCP, ale spod krawędzi prześwitywał jasny rząd pikseli plakatu; `scale-[1.002]`
  działa tak samo, a nadmiar przycina zaokrąglona ramka.
- **Przepełnienie w poziomie szukamy u źródła, nie gasimy `overflow`:** `*:w-full` na rzędzie
  rozciągał niewidoczny komunikat czytnika (`sr-only`, `absolute`) do szerokości ekranu; przy
  320 px rząd nagłówka był o 5 px za szeroki. Pomiar: `scrollWidth` dokumentu = szerokość okna.
- **Nazwy `@keyframes` nie mogą powtarzać nazw z `tw-animate-css`** (`enter`, `exit`,
  `accordion-*`, `collapsible-*`, `caret-blink`): Tailwind zostawia jedną definicję, wygrywa
  biblioteka, a nasza animacja po cichu nie działa — tak od iteracji 9 nie wjeżdżał tekst startu
  i podstron (nasze `enter` → `enter-up`, 9.11). Pilnuje test `globals.test.ts`.
- **Tekst wyglądający jak klasa Tailwinda potrafi zepsuć cały arkusz:** skaner czyta wszystkie
  pliki `main-page`; napis z `&apos;` w miejscu klasy dał niepoprawny CSS i 500 na każdej trasie
  w `pnpm dev` (9.11, design system). Po poprawce pełne przebudowanie arkusza (`touch globals.css`).
- **`document.fonts.load()` z krojem zastępczym `next/font`:** zastępczy to `local("Arial")`,
  którego na Linuksie i Androidzie nie ma — wspólne `load()` odrzuca się w całości. Wczytujemy
  każdy krój sygnetu osobno (`_lib/glyph-reveal.ts`).
- **Preload krojów i karty OG w podglądzie:** dla tras `.demo.tsx` Next nie dokleja preloadu krojów
  (tnie tylko ostatnie rozszerzenie nazwy pliku), a adresy kart OG dostają sufiks `.demo` (404).
  Wyniki CLS i SEO podglądu są przez to gorsze niż po przepięciu.
- **Odrzucone (7.11): `content-visibility: auto`** na sekcjach — oszczędza 150–550 ms głównego
  wątku, ale skoki do kotwic lądują w złym miejscu (pozycja z szacowanych wysokości).
- **404 w podglądzie:** `not-found.demo.tsx` obsługuje `notFound()` z tras; nieznany adres
  (`/main-page/xyz`) dostaje `global-not-found.tsx` serwisu.
- **Odstępstwo od WCAG 2.2.2 (poziom A), decyzja właściciela 9.11:** sygnet logo zmienia znak co
  sekundę bez końca i nie ma przycisku pauzy (zatrzymuje go tylko „ogranicz ruch”). To mały znak
  w nagłówku, nie treść, ale formalnie automat > 5 s bez pauzy — audyt axe go nie wykrywa,
  ręczny audyt WCAG wskaże. Wcześniej (7.11) stawał po 4,5 s.
- **Cele dotyku poniżej 44 px:** plakietki kategorii i tagów (ok. 26 px) — próg AA (24 px)
  spełniony; decyzja właściciela w ROADMAP.

## 11. Do potwierdzenia

1. Menu poniżej 1280 px: dziś ⌘K (arkusz) i stopka — czy telefon dostaje menu w nagłówku.
2. Analityka ruchu: GA4 (wymaga zgody na ciasteczka) albo Vercel Web Analytics (bez ciasteczek).
3. Język komentarzy w kodzie po przepięciu (dziś polski, jak reszta repozytorium).
