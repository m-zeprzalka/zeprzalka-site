# Dziennik zmian

Co zrobiono w każdej iteracji i jak to sprawdzono — najnowsze na górze. Otwarte zadania
są wyłącznie w [ROADMAP.md](ROADMAP.md); szczegóły bezpieczeństwa i marketingu
w `docs/prywatne/` (poza repozytorium). Iteracja bez wpisu tutaj nie jest skończona.

---

## Iteracja 13 — 10 listopada 2026: wersja MVP, blog, audyty i ocena gotowości (`main-page`)

Zakres od właściciela: menu w lewym torze przesuwało się przy otwarciu ⌘K, jasna linia przy
krawędzi wideo startu, krzyżyk z powrotem na wszystkich kartach (jak przycisk odtwarzania),
„O mnie” prawie słowo po słowie jak w `/demo/indeks-1`, łapka na wszystkim, co się klika, ↗ jako
znak linku, wybór wielokrotny z „Inny” w formularzu, start każdej podstrony od góry, spis treści
wpisu w prawym torze z pełnymi nazwami, kontrastowa typografia bloga, najwyżej dwa działania
w wezwaniach; na koniec audyt, poprawki, dokumentacja i ocena gotowości. Bez przepięcia.

**Zrobione:**
- tory `fixed` odejmują połowę paska przewijania zdjętego przez okno (`--removed-body-scroll-bar-size`)
  — przy ⌘K nic się nie rusza (zmierzone 0,00 px przy pasku 15 px);
- wideo: `scale-[0.999]` (iteracja 12) odsłaniało rząd pikseli plakatu; teraz `scale-[1.002]`
  (wideo w transformacji nie jest kandydatem LCP), a plakat chowa się, gdy wideo gra — także przy
  ułamkowym DPR telefonów;
- krzyżyk na każdej karcie podglądu (popover i tor): na kadrze `variant="media"` 12 px od krawędzi,
  bez kadru — obwódka w barwach motywu; pole dotyku 44 px; w torze bez fokusu po kliknięciu;
  karta w torze nie ucieka już spod kursora w drodze z frazy;
- „O mnie”: każde słowo wypełnia się na odcinku trzech słów (ostra granica na 58% okna),
  niewypełnione 45% / 36% (najciemniej przy kontraście 3:1), frazy z kartą idą z falą;
- łapka: reguła bazowa dla przycisków i `summary` (Tailwind 4 zdjął ją z preflightu);
- `LinkArrow` (↗, wychyla się na najechaniu) na każdym linku; → tylko na wysyłce formularza;
- formularz: rodzaj projektu jako pola wyboru z „Inny” i podpowiedzią; akcja serwisu składa
  zaznaczenia w listę (`src/lib/contact-fields.ts` z testami; stary formularz bez zmian); błąd
  pola ogłaszany raz;
- przejścia: przyczyna „lądowania w połowie strony” — brak `data-scroll-behavior="smooth"`
  na `<html>` (Next 16 przewijał na górę płynnie od starej pozycji);
- wpis: spis rozdziałów w prawym torze (pełne nazwy, kropka za czytanym rozdziałem, chowa się
  za treścią i przy karcie podglądu, wejście z prawej); typografia od nowa: tytuł 36 → 48 px
  (`text-title`), h2 26 → 32 px, h3 20 → 24 px, tekst 17 → 19 px o ton cichszy od nagłówków,
  miara 34 em, kod 14 px, bloki ` ```mdx ` kolorowane (alias Markdown), bez sierot w treści
  (`rehypeNoOrphans`), wydruk łamie długi kod; `renderArticle` — jeden tor MDX nowej wersji;
- wezwania: `CtaPanel` przyjmuje najwyżej dwa działania (typ krotki); usługi i „O mnie” po dwa;
- audyty: przegląd kodu (P1: zepsuty hash `#50%` wywracał stronę → `hashId()`) i audyt UX
  (P1: zamknięcie ⌘K przewijało o 450–900 px → `focus({ preventScroll })`), dalej kropka spisu
  po zmianie szerokości, `useEdgeAbove` z `ResizeObserver` i tylko od 1280 px, dopasowanie ⌘K
  po słowach zamiast rozmytego (`matchScore` z testami), pola dotyku `sm`/`icon` 44 px na
  dotyku, wydruk bez przycisków nagłówka i menu stopki, spis po nagłówku w kolejności Tab;
- porządki: `.prettierignore` od korzenia (samo `content/` pomijało `src/i18n/content`
  i `_lib/content`), stałe klas torów w `layout/track-classes.ts`, części ⌘K w `search-parts.tsx`,
  design system zgodny z iteracją (tory, krzyżyk, strzałka, CTA, skala wpisu, `mdx`);
- dokumentacja: README nowej wersji z oceną gotowości (8/10, braki do 10/10) i ścieżką czytania
  kodu przed ręcznym przeglądem; ZASADY z decyzjami i pułapkami 10.11.

**Sprawdzone:** `pnpm check` w czystej kopii (z podglądem, 20 testów); axe 0 naruszeń WCAG 2.2 AA
i dobrych praktyk (audyt: 140 przebiegów; końcowy: 16 tras × 2 motywy × 390/1440), przepełnienie
0 px (320–1920), bez błędów konsoli; LCP plakatu 0,1–0,14 s (desktop), 0,7–1,8 s (telefon, wolne
4G) — wideo nie jest kandydatem; zamknięcie ⌘K bez przewinięcia; krzyżyk karty w torze trafiany
po skosie; stary formularz działa ze zmienioną akcją; `pnpm visual --all` — stara strona
identyczna co do piksela.

---

## Iteracja 12 — 9 listopada 2026: seria poprawek startu, design system, audyt (`main-page`)

Zakres od właściciela: poziome przewijanie na telefonie, sygnet w pętli, menu = podstrony (bez
kotwic w ⌘K i w lewym torze), wideo startu składane ze znaków, dowody kompetencji z wcięciem
i strzałką ↗, późniejsze wypełnianie „O mnie”, liczby w jednej kolumnie na telefonie, „harmonijka”
wejścia (czerń → nagłówek → tekst → wideo), uporządkowany design system z kolorowaniem składni,
audyt i wersja produkcyjna. Bez przepięcia na główną.

**Zrobione:**
- przepełnienie u źródła: `max-sm:*:w-full` w rzędzie przycisków startu rozciągał niewidoczny
  komunikat czytnika (`sr-only`, `absolute`) do szerokości ekranu (+15–20 px); rząd nagłówka przy
  320 px był o 5 px za szeroki — mniejszy odstęp i logo poniżej 360 px, `overflow-x-clip` usunięty;
- sygnet zmienia znak co sekundę bez końca, szum przy najechaniu (rytm rusza od nowa po szumie);
- siatka: tory boczne o stałej proporcji (3/8 kolumny, `--container-track`, `rail`, `stage-track`);
  menu główne (`RailNav`) w lewym torze na każdej stronie, bieżąca podstrona z kropką, prefetch
  dopiero przy najechaniu; spis rozdziałów wpisu (`TableOfContents`) pod menu, w szerokości toru,
  przewija się do czytanego rozdziału; poniżej 1280 px zwijany „Spis treści” nad treścią wpisu;
  ⌘K: podstrony (z opisami z metadanych), realizacje, wpisy, akcje — bez sekcji stron;
  spisy sekcji usunięte z usług, portfolio, o mnie i polityki prywatności;
- wideo startu: druk ze znaków sygnetu na canvasie (atlas znaków, rampa tonów z pomiaru pokrycia
  tuszem, przeskakiwanie znaków przy składaniu, front w wideo); kroje sygnetu wczytywane osobno
  (wspólne `fonts.load()` odrzucał krój zastępczy `local("Arial")` na Linuksie i Androidzie);
- „harmonijka”: znaleziona przyczyna braku animacji tekstu — nasze `@keyframes enter` przegrywało
  z tą samą nazwą z `tw-animate-css` od iteracji 9 (teraz `enter-up` + test); pory w `--enter-*`,
  nagłówek z góry, menu z boku, słowa tytułu i rozwinięcia, działania, na końcu kadr; bloki pod
  zgięciem wjeżdżają przy przewijaniu (`reveal`, sama oś CSS);
- LCP mimo „harmonijki”: plakat maluje się od pierwszej klatki pod zasłoną w kolorze tła, a ruch
  niesie canvas (start) albo zasłona i osiadanie kadru (`uncover`, `settle` — okładka wpisu);
  plakat dokładnie 16:9, wideo pomniejszone o 0,1% (pierwsza klatka nie wypiera plakatu);
- kompetencje: dowody jako wiersze 48 px z tłem i ↗; „O mnie”: słowo nabiera koloru między 62%
  a 46% wysokości okna; liczby w jednej kolumnie na telefonie;
- kolorowanie składni: `code.css` z paletą `--syntax-*` (kontrast ≥ 5:1 w obu motywach), ten sam
  tor w design systemie co na blogu (MDX → rehype-highlight → `CodeBlock`);
- design system przebudowany (agent): 12 rozdziałów — zasady, kolory (z paletą składni), pismo,
  siatka (schematy i nakładka siatki na stronę), kształty, ikony, komponenty, nawigacja i powłoka,
  strona główna, podstrony, treść wpisu (MDX w 7 językach kodu), ruch (oś „harmonijki”, druk ze
  znaków na żywo); wartości tokenów czytane z arkuszy przy buildzie;
- audyt (dwa niezależne agenty, UX/UI z dostępnością i senior dev) i poprawki: wydruk bez
  półprzezroczystych bloków (`reveal`, `scroll-fill` tylko na ekranie), menu nie znika na krótkich
  stronach (chowa się dopiero, gdy stopka do niego dojdzie), `aria-current` „page”/„true”, spis
  nazwany widocznym podpisem, rozmiary obrazów karty w torze, bez JS sam plakat (bez pustego
  odtwarzacza), fokus na `<main>` po przejściu na podstronę, pola dotyku okruszków 44 px,
  `tailwind-merge` zna `text-display`, wspólne `CHIP_ICONS` i `RAIL_DOT` zamiast kopii w przykładach.

**Weryfikacja:** `pnpm check` w czystej kopii (221 stron, 11 testów), build z podglądem; LCP na
buildzie produkcyjnym 0,2–0,6 s (start, wpis; 412, 1280, 1440, 1920 px — przed poprawką 2,5–3,1 s);
axe 0 naruszeń (13 stron × 2 motywy × 390/1440); bez przewijania w poziomie 320–414 px na
wszystkich stronach; bez błędów w konsoli; „harmonijka” nagrana klatka po klatce (desktop i telefon);
`pnpm visual --all` (lokalna baza z `75e78d9` kontra zmiana): stara strona identyczna co do piksela.

## Iteracja 11 — 7 listopada 2026: audyt „agencji” i wersja do oddania (`main-page`)

Zakres od właściciela: pogłębiony audyt UX/UI i kodu, poprawki wszystkiego, co możliwe, przed
dalszą pracą; dokumentacja rozbita na zasady i klasyczne README. Bez przepięcia na główną.

**Audyt:** pięciu niezależnych specjalistów równolegle (UX/UI, dostępność WCAG 2.2, senior dev,
wydajność i SEO, QA), każdy na żywym podglądzie i w kodzie, tylko do odczytu — razem ok. 140
ustaleń z plikami i scenariuszami. Poprawki wdrażał jeden agent, potem pełna weryfikacja.

**Najważniejsze poprawki:**
- ⌘K: najpierw sekcje oglądanej strony i podstrony (z polityką prywatności), własne sortowanie
  trafności (cmdk 1.1.1 nie przestawia grup — Enter brał przypadkowy wiersz), puste pole przy
  każdym otwarciu, okno na szerokość kolumny (`tailwind-merge` zna token `column`), potwierdzenie
  kopiowania i `mailto:` bez schowka, fokus na arkuszu i przycisk „Zamknij” na telefonie, nazwa
  pola i liczba wyników dla czytnika;
- karty podglądu: na karcie w torze da się stanąć kursorem i kliknąć link (WCAG 1.4.13), karta
  nie zostaje po szybkim przelocie przez dwie frazy, popover w kolejności Tab zaraz po frazie,
  zamyka się po kliknięciu linku;
- spis w lewym torze: osiągalny z klawiatury, długie rozdziały ucięte w szerokości toru, emoji
  poza etykietami; spis także w polityce prywatności;
- dostępność: napisy ze znaków czytane w całości (litery `aria-hidden`), obwódka fokusu ≥ 3:1
  w obu motywach, komunikat błędu pod każdym polem formularza, przełącznik języka z `lang`,
  okruszki bez „wyłączonego linku”, paginacja bez martwych linków, bloki kodu z przystankiem Tab
  tylko przy przewijaniu, linki zewnętrzne we wpisach zapowiadają nową kartę, sygnet zmienia się
  sam tylko przez 4,5 s (WCAG 2.2.2), reflow 320 px bez przewijania, pola dotyku 44 px
  w nagłówku bez zmiany rysunku;
- UX/UI: kompetencje i lista wpisów na osiach kolumny (wspólna kolumna etykiet), przyciski na
  wideo czytelne w obu motywach (wariant `media`), cena pakietu wyraźna na telefonie, zamknięcia
  z wezwaniem i rodzeństwo kategorii na stronach bloga, krótsze rozwinięcie w nagłówku wpisu,
  „Zwiń” bez odjeżdżania strony, popover 24 rem na tabletach, twarde spacje także w nagłówkach
  i przy liczbach, jeden zapis dat wpisów, podgląd 404 pod `/main-page/nie-znaleziono`;
- wydajność: plakat startu jako `next/image` (rozmiar kadru, preload, wysoki priorytet),
  próbkowanie druku poza głównym wątkiem (`createImageBitmap`) i rozmiar z `ResizeObserver`,
  wcześniejszy start frontu, ciemny motyw już w HTML (bez błysku), przejścia wstrzymywane tylko
  przy zmianie motywu (bez pełnego przeliczenia stylu przy każdym wczytaniu), `Intl` w stopce
  dopiero przy użyciu, obrazy realizacji dopiero po otwarciu wiersza (wcześniej ok. 233 KB przy
  starcie), priorytet pierwszego kafla galerii, logo bez prefetchu startu;
- kod: stabilne akcje kart (lista realizacji nie otwierała się sama po zmianie szerokości okna),
  przerywane przytrzymanie akordeonu, wspólne helpery (`copyText`, `useToggleTheme`,
  `useTransientFlag`, `focusTarget`), buforowane `useMediaQuery`, wspólne fabryki tras bloga dla
  serwisu i podglądu (`src/routes/blog-routes.tsx`), dowody kompetencji po slugu (działa dla
  „Course” w EN), `useId` w formularzu, pole-pułapka `hp` zamiast `company` (Chrome autouzupełniał
  je danymi firmy), granica błędów podglądu, Vercel Analytics i Speed Insights w powłoce,
  usunięte nieużywane części shadcn z angielskimi napisami, ochrona przed `javascript:` w MDX;
- SEO: węzeł autora w grafach, które się do niego odwołują (także w serwisie), spacje między
  nazwą i kategorią w nagłówkach wierszy;
- jakość: testy jednostkowe `pnpm test` (`node --test`, bez nowych paczek) w `pnpm check`; CI
  buduje też podgląd, jak Vercel.

**Dokumentacja:** `src/app/main-page/ZASADY.md` (zasady, kryteria, decyzje, pułapki) i
`README.md` (stan, uruchomienie, gdzie co zmieniać, struktura, jak działa, przepięcie).

**Sprawdzone:** `pnpm check` (221 stron, 10 testów) i build z podglądem w czystej kopii; axe na
15 stronach × 2 szerokości × 2 motywy: 0 błędów; tekst stron z JS i bez JS zgodny (bez JS panele
akordeonów stoją otwarte); konsola bez błędów; serwis identyczny co do piksela (`pnpm visual --all`).

---

## Iteracja 10 — 7 listopada 2026: podstrony w nowym systemie (`main-page`)

Zakres od właściciela: wszystkie strony starej wersji w nowym wydaniu, według zasad `main-page`.

**Strony** (podgląd pod `/main-page/…`, po polsku, `noindex`, karty OG z fabryk serwisu):
- usługi — pakiety jako indeks z ceną zawsze widoczną (zakres po rozwinięciu, w HTML także
  zwinięty), kroki współpracy, gwarancje, wycena;
- portfolio — galeria w naturalnych proporcjach, dwie kolumny; filmy dochodzą tuż przed
  kadrem i grają tylko w kadrze;
- o mnie — biogram i CV (doświadczenie, umiejętności, edukacja w kolumnie etykiet), PDF z CV;
  wykłady „2016–obecnie” bez nazw uczelni, jak na starcie;
- kontakt — e-mail do skopiowania, miejsce i czas odpowiedzi, ten sam formularz co na starcie;
- polityka prywatności;
- blog — kategorie pod nagłówkiem, dwa wyróżnione wpisy, indeks z okładką na marginesie,
  archiwum stron (shadcn `Pagination`); kategorie, kategoria, tag;
- wpis — spis rozdziałów w lewym torze, okładka, treść (`article.css`, tylko na wpisach), blok
  kodu z kopiowaniem, film YouTube bez śledzenia do kliknięcia, tagi, autor (bez zdjęcia),
  wezwanie do rozmowy, „Czytaj dalej”;
- 404 dla `notFound()` w podglądzie.

**System:**
- klocki podstron w `_components/page` (nagłówek z okruszkami w stopniu `text-display`, sekcja,
  wiersz z kolumną etykiety, panel wezwania, plakietki, indeks wpisów, paginacja);
- adresy podglądu w jednym miejscu (`_lib/routes.ts`; przy przepięciu `BASE = ""`), linki
  wewnętrzne we wpisach też zostają w podglądzie;
- stopka z listą podstron (jedyne ich linki w HTML), przełącznik języka prowadzi na angielski
  odpowiednik oglądanej strony, ⌘K z podstrony przechodzi do sekcji i realizacji startu;
- dane strukturalne podstron przeniesione do `src/lib/page-schema.ts` — serwis i podgląd mają
  jedną definicję (JSON-LD serwisu identyczny na 15 sprawdzonych stronach PL i EN);
- shadcn z CLI: `breadcrumb`, `pagination` (napisy z treści serwisu zamiast angielskich);
  wariant `row` akordeonu dla wierszy indeksu.

**Sprawdzone:**
- wszystkie trasy 200, nieznany wpis 404; tekst stron z JS i bez JS identyczny (dev i build);
- w trybie dev wiersz akordeonu znikał po hydratacji (`asChild` w komponencie klienckim
  z elementem z serwera) — poprawione, zasada w README;
- strona główna: zmiana tylko w stopce (porównanie pikseli dwóch buildów produkcyjnych);
- Lighthouse lokalnie (telefon): dostępność i dobre praktyki 100 po poprawkach listy opisowej
  i paginacji.
- Niezależny przegląd kodu (osobny agent) — poprawione: spis wpisu chowany przy stopce serwisu
  (nie przy stopce artykułu), klipy galerii tylko na żądanie (WCAG 2.2.2; wcześniej montowało się
  ok. 19 MB wideo), adresy w przykładach design systemu przez `_lib/routes.ts`, linki MDX do
  `/kategoria/next.js` nie są brane za pliki, kolejność czytania w CV (nagłówek przed okresem),
  bloki kodu i tabele bez mnożenia punktów orientacyjnych, link karty wpisu tylko na tytule,
  paginacja przez `next/link`, „Zobacz w portfolio” prowadzi wprost do kafla, rozmiar plakietek
  jako wariant `Badge`, jedna lista podstron dla stopki i ⌘K.
- Przełącznik języka czyta odpowiednik strony z jej `hreflang` w `<head>` — bez mapy adresów
  w JS (wersja z `counterpart()` dokładała ok. 9 KB gzip na każdej stronie).

---

## Iteracja 9 — 6–7 listopada 2026: refaktor `main-page`, ruch jak w Indeksie · I, design system

Zakres od właściciela: pogłębiony audyt i refaktor kodu, uwagi z testów ręcznych sekcja po
sekcji, ruch na poziom `/demo/indeks-1`, potem podstrona design systemu.

**Kod:**
- model treści rozbity na moduły (`_lib/content/`: source z `cache`, shell, home, peeks, search);
- kontekst kart rozdzielony na akcje i stan;
- jeden zestaw znaków (`_lib/glyphs.ts`) dla logo i `GlyphText`;
- `pnpm check:classes` (w `pnpm check`) pilnuje kanonicznego zapisu klas Tailwinda w całym
  `main-page` (np. `ease-(--ease-out)` → `ease-out`);
- Prettier sortuje klasy według tokenów `main-page`;
- poprawiona podpowiedź `supports-backdrop-filter:` w `globals.css` serwisu (bez zmiany wyglądu);
- jeden model wpisu (`card` dla klienta, opis i kategorie tylko na serwerze) zamiast dwóch
  równoległych tablic;
- „ogranicz ruch” w jednym miejscu (reguła w `globals.css`, `_lib/motion.ts`), wejście w kadr
  jednym wzorem (`observeReveal`), skok do kotwic jedną ścieżką (`goToAnchor`);
- formularz: wybór rodzaju projektu jako natywne radio (`ui/choice-group.tsx`) zamiast
  `ToggleGroup` — działa bez JS.

**Wydajność:**
- odsłanianie wideo rysuje w klatce tylko zmienione komórki (wcześniej całą siatkę), praca
  głównego wątku po 2 s: z 1,5 s do 0,6 s (CPU ×4);
- animacje „przy wejściu w kadr” bez `getBoundingClientRect` przy hydratacji (wymuszone
  przeliczenia układu: z 48 ms do 7 ms);
- plakat wideo startu (LCP) pobierany z wyprzedzeniem; klipy grają tylko w kadrze;
- JS 224 KB gzip (stara strona 208 KB): różnica to głównie akordeon Radix.

**Niezależny przegląd kodu** (osobny agent) — poprawione:
- karta na marginesie `inert` zamiast `aria-hidden` z linkiem w kolejności Tab; Enter/Spacja
  otwierają tę samą kartę jako popover z fokusem, Escape wraca na frazę; popover ma nazwę,
  `aria-haspopup`, `aria-controls`;
- karta pojawia się przy kursorze (gałąź „bez dojazdu” wcześniej nigdy się nie wykonywała);
- ⌘K: brak błędu przy `keydown` bez `key` (autouzupełnianie), na Apple tylko ⌘ (Ctrl+K w polu
  tekstowym zostaje systemowy);
- otwieranie realizacji z ⌘K i z dowodów kompetencji: wiersz nie ucieka przy zwijaniu
  poprzedniego, działa ponowny klik, fokus przechodzi na wiersz; podwójny odstęp nad kotwicą
  (`scroll-mt` + `scroll-padding`) usunięty;
- e-mail do skopiowania: nazwa zawiera widoczny adres (WCAG 2.5.3), odmowa schowka → `mailto:`;
- formularz: region komunikatu stale w drzewie dostępności, błędne pola opisane komunikatem,
  fokus na pierwszym błędnym;
- wydruk z ciemnego motywu: jasna paleta (jak w serwisie);
- przy „ogranicz ruch” stoją też karta, spis sekcji i akordeony;
- akordeony przed hydratacją nie rozpychają strony (własne `collapse`/`expand` od zera);
- nagłówki portfolio: grupa `h3`, wiersz `h4`; `article` dla wpisów i realizacji, `address`
  w stopce; `time` z `dateTime` w stopce;
- „i w domu”: łańcuch jednoliterowych słów sklejany cały;
- przelot kadru odporny na dwa szybkie kliknięcia; przycisk pauzy poza Tabem, póki niewidoczny;
  siatka szkieletu wideo w oczku canvasu na telefonie; wariant `stage:` = zapytanie z JS.

**Poprawki właściciela:**
- Nagłówek:
  - rysunek logo i ikona motywu na liniach kolumny;
  - stopniowane rozmycie tła (mocniej u góry, bez koloru i kreski);
  - logo z szumem sygnetu i falą znaków przez domenę na najechanie;
  - PL/EN jako przełącznik segmentowy tej samej wysokości co wyszukiwarka;
  - klawisze ⌘/Ctrl+K z obrysem (`Kbd`).
- Wyszukiwarka: wyższe pole (16 px), ikony i miniatury w wierszach, obły arkusz na telefonie.
- Spis sekcji: bez napisu „Na tej stronie”, sama bieżąca sekcja z kropką, rozwija się przy lewej
  krawędzi, znika przy stopce.
- Start i karty podglądu:
  - wejście słowo po słowie z rozmycia (nagłówek → tekst → przyciski → wideo);
  - na desktopie karta tylko na najechanie (bez przypinania), płynie za kursorem w pionie, kadry
    w naturalnych proporcjach;
  - na telefonie popover zawsze pod frazą, z dosunięciem strony;
  - „webowych” i „multimedialnych” — po jednym filmie.
- „O mnie”: nagłówek i liczby odczytują się ze znaków; fala wypełniania jak w Indeksie · I;
  podpisy liczb bez tła na najechanie.
- Kompetencje: najechanie na wiersz.
- Portfolio:
  - kategoria pod nazwą na telefonie;
  - kadr przelatuje z karty do otwartego panelu (View Transitions).
- Blog:
  - okładka najnowszego wpisu poniżej 1280 px;
  - rysowana obwódka „Nowy”;
  - linki „Pokaż wszystkie” i „Wszystkie artykuły” mieszczą się na telefonie.

**Design system:** `/main-page/design-system` z tokenami (kolory, pismo, siatka, kształty, ruch),
komponentami shadcn i kompozycjami strony. Każdy przykład jest żywy, a jego kod czytany jest
z pliku przykładu.

**Sprawdzone:**
- Lighthouse (telefon): dostępność 100, dobre praktyki 100. Wcześniej było 96: za niski kontrast
  niewypełnionych słów. SEO na podglądzie 58 przez celowe `noindex` i canonical do obecnej
  strony — po przepięciu odpada. Wydajność lokalnie (WSL) 87–92 przy 93–96 starej strony w tych
  samych warunkach.
- 360–1920 px: 0 poziomego przewijania, krawędzie na liniach kolumny.
- Zrzuty `/main-page` przed i po poprawkach z przeglądu: identyczne co do piksela (390, 768,
  1440 ciemny i jasny); zachowania (klawiatura, ⌘K, kotwice, wideo, formularz, wydruk) sprawdzone
  w Playwright.
- `pnpm check` i build z demami (`VERCEL_ENV=production DEMO_PUBLIC=1`) w czystej kopii;
  `pnpm visual --all`: serwis identyczny co do piksela.
- Po wdrożeniu (`1569d7a`) Lighthouse z WSL na produkcji, telefon: `/main-page` wydajność 73–89
  (TBT 420–1150 ms), stara strona główna 91–93 w tych samych przebiegach; dostępność i dobre
  praktyki 100 na obu. Różnicę robi hydratacja Reacta (większe wyspy klienckie: akordeony Radix,
  karty, napisy) — kierunki w ROADMAP. API PageSpeed bez klucza zwróciło limit (429), więc
  pomiar PSI zostaje do zrobienia ręcznie.
- `content-visibility: auto` dla sekcji sprawdzone i odrzucone (psuje skoki do kotwic).

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
