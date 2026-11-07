# Zasady nowej wersji zeprzalka.com

Zasady, kryteria i decyzje dla `src/app/main-page`. To dokument normatywny — dla właściciela,
agentów i każdego, kto dotyka kodu. Opis architektury, uruchomienia i przepięcia jest w
[README.md](README.md). Zmiana decyzji = zmiana tutaj (z datą), potem kod.

## 1. Cel i kryteria sukcesu

Strona **i kod źródłowy** są wizytówką: repozytorium jest publiczne, a zaglądać będą seniorzy,
którzy mogą zatrudnić autora. Sukces mierzymy, a nie oceniamy na oko. Drobne odstępstwa są
dopuszczalne, jeśli wymaga tego wygląd — wtedy opisujemy je w sekcji 10.

- **Lighthouse 100 / 100 / 100 / 100** (wydajność, dostępność, dobre praktyki, SEO) na telefonie;
- **LCP < 1,8 s** (telefon, 4G), **CLS = 0**, **INP < 200 ms**;
- **JS na start nie więcej niż obecna strona** (ok. 210 KB gzip; sama baza Next 16 + React 19 to
  ok. 170 KB) — cięższe części (wyszukiwarka, popover) ładują się dopiero przy użyciu;
- **0 błędów axe** (WCAG 2.2 AA), **0 błędów** w testach danych strukturalnych;
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
     (natywne radio: działa bez JS; `RadioGroup` i `ToggleGroup` shadcn to Radix ze stanem).
3. **Własny CSS tylko na tokeny** (`@theme`), `@keyframes` i opisane wyjątki (`article.css` —
   treść wpisu). `globals.css` jak najkrótszy.
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
  ciemny motyw domyślny i tylko na ekranie (wydruk zawsze jasny), obłości jako zasada.
- **Siatka:** jedna kolumna treści (`column`), dwa tory boczne od 1280 px (lewy — spis, prawy —
  karta podglądu). Ikony na krawędziach kolumny dostają ujemny margines równy wcięciu.
- **Stopnie pisma:** `text-display` (h1 startu i podstron), nagłówek sekcji „Tytuł — rozwinięcie”
  (`SectionHeading`), tekst, drugorzędny, najmniejszy. Żywy katalog: `/main-page/design-system`.

## 5. Semantyka i SEO

- Szkielet: link „Przejdź do treści”, `header` z `nav`, `main` z sekcjami `aria-labelledby`, jeden
  `h1`, nagłówki bez przeskoków, `article` dla wpisów, realizacji i pakietów, `dl` dla par
  „etykieta — wartość”, `time` dla dat, `footer` z `address`.
- Link to link, a przycisk to przycisk. Tekst nigdy tylko w canvasie: efekty znaków mają tekst
  w DOM, a warstwa graficzna jest `aria-hidden`.
- Metadane przez `buildMetadata` (`src/i18n/page-metadata.ts`): canonical, hreflang `pl`/`en`
  + `x-default`, karta OG na stronę z fabryk `src/lib/og.tsx`. W podglądzie `preview()` dokłada
  `noindex`.
- JSON-LD: `Person`, `WebSite`, `ProfilePage`, `BlogPosting` z `BreadcrumbList`, `Service`
  z katalogiem ofert, `CollectionPage` z `ItemList` dla portfolio — z `src/lib/page-schema.ts`.
- Obrazy przez `next/image` (wymiary, `alt`, `sizes` z `_lib/media.ts`), kadr LCP z `preload`.

## 6. Ruch i interakcje

- **Spoczynek zawsze kompletny.** Wyjątek: tekst „Mam 15 lat…” wypełniany przewijaniem.
- **„Ogranicz ruch” w jednym miejscu:** reguła w `globals.css` skraca każde przejście i animację
  do 1 ms (zdarzenia końca nadal przychodzą), JS pyta `prefersReducedMotion()` / `useReducedMotion()`.
- **Budżet:** jedna sygnatura na sekcję; wejście strony ≤ 0,9 s i nigdy nie czeka na JS; napisy
  ok. 600–900 ms.
- **Wejście „harmonijka”:** nagłówek, status, słowa tytułu i zdania (z rozmycia, jedno po drugim),
  przyciski, na końcu wideo albo okładka — samo CSS (`enter-stagger`). Kadr będący LCP wchodzi
  tylko wyostrzeniem (`animate-sharpen`, bez `opacity`), żeby LCP liczył się od pierwszego malowania.
- **Wejście w kadr bez pomiarów:** napisy, „Nowy” i stopka pytają pierwszy odczyt
  IntersectionObservera (`observeReveal`), a nie `getBoundingClientRect` przy hydratacji.
- **Znaki (6.11, poprawka 7.11):** sygnet logo zmienia znak co sekundę przez pierwsze 4,5 s
  (WCAG 2.2.2: ruch dłuższy niż 5 s wymagałby pauzy), potem stoi; najechanie albo fokus puszcza
  szum sygnetu i falę przez domenę; czytnik dostaje napisy w całości (`sr-only`), litery są
  `aria-hidden`; nagłówki sekcji i liczby odczytują się ze znaków przy wejściu w kadr; wideo startu
  wyłania się z druku ze znaków. W kartach podglądu i w stopce znaków nie ma.
- **Karta podglądu (desktop z myszą, od 1280 px):** tylko na czas najechania albo fokusu —
  kliknięcie myszą jej nie przypina. Kursor może przejechać na kartę (zwłoka ukrycia 300 ms)
  i kliknąć jej link (WCAG 1.4.13). Tor jest `aria-hidden`, linki w nim poza Tabem; Enter
  i Spacja otwierają tę samą kartę jako popover z fokusem na karcie, Tab za jej ostatnim
  elementem idzie dalej po frazie, Escape oddaje fokus frazie. Karta stoi przy kursorze i płynie
  za nim w pionie; przewijanie pod nieruchomym kursorem nic nie otwiera.
- **Karta na dotyku:** popover pod frazą na szerokość kolumny (od 768 px — 24 rem), zawsze pod
  spodem — gdy brakuje miejsca, strona się dosuwa.
- **Portfolio na starcie:** kliknięcie wiersza z kartą na marginesie — kadr przelatuje z karty do
  panelu (View Transition); kotwice `#realizacja-…` idą jedną ścieżką (`goToAnchor`): wiersz
  otwiera się od razu, potem strona przewija, a fokus przechodzi na wiersz.
- **Wideo:** start gra w kadrze z pauzą; poza startem klip gra tylko na żądanie (WCAG 2.2.2) —
  w galerii najechanie myszą to podgląd, przycisk włącza i wyłącza; plik pobiera się dopiero wtedy.
- **Spis w lewym torze (od 1280 px):** w starcie i przy stopce serwisu go nie ma (ale fokus
  z klawiatury go pokazuje); w spoczynku sama bieżąca pozycja (ostatnia, której górna krawędź
  minęła 45% okna) z kropką; długie rozdziały ucięte wielokropkiem w szerokości toru.
- **Nawigacja:** nagłówek bez menu — podstrony prowadzi ⌘K (na telefonie arkusz wyszukiwarki),
  stopka ma ich listę; każda podstrona ma okruszki, a podstrony z sekcjami — spis. ⌘K pokazuje
  najpierw sekcje oglądanej strony, potem podstrony, sekcje startu, realizacje, wpisy i akcje.
- **Zamknięcia:** usługi, portfolio, blog (kategorie, tagi, wpis) kończą się kartą z wezwaniem;
  kontakt kończy formularz, „O mnie” — rząd działań (z pobraniem CV).
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
- **`tailwind-merge` zna token `column`** (`src/lib/utils.ts`) — inaczej `max-w-column` nie gasi
  `max-w-*` z komponentu shadcn.
- **Preload krojów i karty OG w podglądzie:** dla tras `.demo.tsx` Next nie dokleja preloadu krojów
  (tnie tylko ostatnie rozszerzenie nazwy pliku), a adresy kart OG dostają sufiks `.demo` (404).
  Wyniki CLS i SEO podglądu są przez to gorsze niż po przepięciu.
- **Odrzucone (7.11): `content-visibility: auto`** na sekcjach — oszczędza 150–550 ms głównego
  wątku, ale skoki do kotwic lądują w złym miejscu (pozycja z szacowanych wysokości).
- **404 w podglądzie:** `not-found.demo.tsx` obsługuje `notFound()` z tras; nieznany adres
  (`/main-page/xyz`) dostaje `global-not-found.tsx` serwisu.
- **Cele dotyku poniżej 44 px:** plakietki kategorii i tagów (ok. 26 px) — próg AA (24 px)
  spełniony; decyzja właściciela w ROADMAP.

## 11. Do potwierdzenia

1. Nagłówek bez menu (⌘K + stopka) czy klasyczne menu.
2. Analityka ruchu: GA4 (wymaga zgody na ciasteczka) albo Vercel Web Analytics (bez ciasteczek).
3. Język komentarzy w kodzie po przepięciu (dziś polski, jak reszta repozytorium).
