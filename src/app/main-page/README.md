# main-page — nowa wersja zeprzalka.com

Decyzje dla przebudowy strony (blog i strona wizytówkowa). Ten plik jest instrukcją dla agenta i
opisem architektury. Zmiany decyzji wpisujemy tutaj.

## Stan (7.11.2026)

Wariant 1 strony głównej po polsku: `/main-page`, a jego design system z żywymi przykładami:
`/main-page/design-system` (lokalnie i na zeprzalka.com przy `DEMO_PUBLIC=1`). Kanon Indeksu
(`/demo/indeks-1`) przepisany od zera na shadcn i Tailwind, z poprawkami z testów właściciela.
Gdzie co zmieniać:

| Co | Gdzie |
| --- | --- |
| teksty nowej strony (napisy, frazy otwierające karty, liczby) | `src/i18n/content/main-page.ts` |
| które realizacje pokazuje karta danej frazy (filmy „webowych” / „multimedialnych”) | `PEEK_WORKS` w `_lib/content/peeks.ts` |
| efekt znaków w wideo startu (komórka, tempo, front, kontrast) | `GLYPH_REVEAL` w `_lib/glyph-reveal.ts` |
| dekodowanie liter (czas, fala, tempo) | stałe na górze `_components/motion/glyph-text.tsx` |
| kolory, promień, kolumna, krzywe i czasy ruchu | `globals.css` |
| wygląd przycisków, pól, akordeonu, okien | `_components/ui/*` (zmiany oznaczone `// zeprzalka:`) |
| kotwice, skok do sekcji i realizacji, odstęp pod nagłówkiem | `_lib/anchors.ts` (`goToAnchor`, `HEADER_OFFSET`) |
| „ogranicz ruch” i animacje „przy wejściu w kadr” | reguła na końcu `globals.css` + `_lib/motion.ts` |

Nowy komponent shadcn: `pnpm dlx shadcn@latest add <nazwa> -y` — `components.json` wskazuje już
`_components/ui`. CLI w wersji 4 wpisuje import `cn` z paczki `cn` i ją instaluje: po każdej
instalacji `pnpm remove cn` i zamiana `from "cn"` na `from "@/lib/utils"` w nowych plikach.

## 1. Cel i kryteria sukcesu

Strona **i kod źródłowy** są wizytówką: repozytorium jest publiczne, a zaglądać będą seniorzy,
którzy mogą zatrudnić autora. Sukces mierzymy, a nie oceniamy na oko. Drobne odstępstwa od
poniższych punktów są dopuszczalne, jeśli wymaga tego wygląd:

- **Lighthouse 100 / 100 / 100 / 100** (wydajność, dostępność, dobre praktyki, SEO) na telefonie;
- **LCP < 1,8 s** (telefon, 4G), **CLS = 0**, **INP < 200 ms**;
- **JS na start nie więcej niż obecna strona** (ok. 210 KB gzip; sama baza Next 16 + React 19 to ok. 170 KB) — cięższe części (wyszukiwarka, popover) ładują się dopiero przy użyciu;
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
3. **Własny CSS tylko na tokeny** (`@theme`), `@keyframes` i opisane wyjątki. `globals.css` jak
   najkrótszy.
4. **Domyślnie komponenty serwerowe.** `"use client"` tylko na małych wyspach interakcji.
5. **Teksty wyłącznie z `src/i18n`.** Najpierw tylko polska strona główna; wersja angielska po
   akceptacji polskiej (moduły treści są już parami `pl`/`en`).
6. **Każdy efekt ma powód** (hierarchia, informacja zwrotna, ciągłość) i jest opisany. Bez
   ozdobników, czyli bez AI slopu.
7. **Jedna rzecz, jedno miejsce:** jedno `cn()`, jeden zestaw tokenów, jeden wzór sekcji, jeden
   silnik znaków.
8. **Perfekcyjny design system** oparty na shadcn, o seniorskim charakterze:
   - idealne RWD i mobile first, piękny wygląd na każdej rozdzielczości;
   - najlepsze praktyki UX/UI.
9. **Idealne SEO, semantyka i optymalizacja kodu.**
10. **Warstwa widoku od zera, zero duplikatów:**
    - komponenty, sekcje, style i interakcje strony głównej piszemy na nowo;
    - nie kopiujemy kodu z `/demo` ani ze starych komponentów serwisu;
    - dema są wyłącznie specyfikacją wyglądu i zachowań;
    - przy okazji refaktor: wydajniej, prościej, czytelniej.

    Z serwisu importujemy (nie kopiujemy) tylko treść `src/i18n` i logikę `src/lib`.

## 3. Gdzie powstaje kod

**Decyzja:** cała nowa wersja żyje w `src/app/main-page/` na gałęzi `main`. Jej układ jest
lustrem obecnego `src/app`. Foldery z podkreślnikiem (`_components`) są prywatne: leżą obok tras,
ale nie tworzą adresów (oficjalny wzorzec kolokacji Next).

```
src/app/main-page/
  README.md
  globals.css                 # tokeny shadcn, siatka, ruch, 4 keyframes  → src/app/globals.css
  (pl)/layout.demo.tsx        # układ główny PL (<html lang="pl">)        → src/app/(pl)/layout.tsx
  (pl)/page.demo.tsx          # /main-page — wariant 1                    → src/app/(pl)/page.tsx
  (pl)/wariant-2/page.demo.tsx  # kolejne warianty tak samo (jeszcze nie ma)
  en/…                        # wersja angielska — po akceptacji polskiej
  (pl)/design-system/page.demo.tsx  # /main-page/design-system — tokeny, komponenty, ruch
  _components/
    ui/                       # shadcn z CLI, zmiany systemowe z `// zeprzalka:` → src/components/ui
    layout/                   # powłoka, nagłówek, logo, ⌘K, motyw, język, spis, stopka → src/components/layout
    sections/                 # sekcje strony głównej (wspólne dla wariantów)   → src/components/home
    peek/                     # karty podglądu: margines (desktop) i popover     → src/components/peek
    motion/                   # GlyphText — dekodowanie liter ze znaków sygnetu
    seo/                      # dane strukturalne
  _lib/
    content/                  # model widoku (serwer): source (cache), shell, home, peeks, search
    types.ts, text.ts, hooks.ts, glyphs.ts
    anchors.ts                # kotwice, `goToAnchor` (jedna ścieżka skoku), `HEADER_OFFSET`
    motion.ts                 # „ogranicz ruch” i `observeReveal` (wejście w kadr bez pomiarów)
    keep-in-view.ts, morph.ts # akordeon w kadrze, przelot kadru (View Transitions)
    video.ts                  # klip gra tylko w kadrze
    glyph-reveal.ts           # wideo startu wyłaniające się z druku ze znaków
  _variants/
    wariant-1/home-page.tsx   # kompozycja strony głównej wariantu         → src/components/views
  _design-system/             # sekcje i przykłady design systemu (kod przykładu = plik)
```

- **Warianty strony głównej** (2–3 do testów UX i A/B) korzystają z jednego systemu: jednego `ui/`,
  jednych tokenów, wspólnych sekcji i silnika. Różnią się wyłącznie kompozycją w `_variants/`.
- **Poza produkcją jak dema:** końcówka `.demo.tsx`, więc na zeprzalka.com tylko przy
  `DEMO_PUBLIC=1`, zawsze `noindex` i poza mapą strony.
- **Izolacja:**
  - ESLint zabrania serwisowi importów z `main-page`;
  - `globals.css` serwisu dostaje `@source not "./main-page"`;
  - `main-page` nie importuje niczego z `/demo`.
- **Z serwisu importujemy wprost** `src/i18n` i `src/lib` (treść, posty, SEO, mail, `cn()`).
- **shadcn tylko do `_components/ui/`:** obecne `src/components/ui/` zostaje nietknięte. Po każdej
  instalacji z CLI importy między komponentami poprawiamy na `@/app/main-page/_components/ui/…`
  (`components.json` wskazuje stary alias), a ESLint zabrania `main-page` importów ze starego `ui/`.
- **Przepięcie (etap 4):**
  1. przenosimy system, zwycięski wariant i podstrony w miejsce obecnych;
  2. zmieniamy `.demo.tsx` na `.tsx`;
  3. raz zamieniamy prefiks importów `@/app/main-page/_components/` → `@/components/`;
  4. pozostałe warianty i stare pliki usuwamy w tym samym commicie;
  5. obecna strona zostaje w gicie jako tag archiwum (np. `v1-archiwum`), nie jako folder w repo;
  6. `src/app/global-error.tsx` dostaje nowy arkusz — dziś importuje arkusz serwisu, więc każda
     trasa (także `/main-page`) pobiera go z wyprzedzeniem (`preload`, ok. 17 KB gzip).

## 4. Stos technologiczny

| Obszar | Wybór |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript strict; wszystko statyczne (SSG), formularz przez Server Action |
| UI | shadcn/ui (prymitywy Radix) + Tailwind 4 |
| Paleta ⌘K | shadcn `Command` (cmdk) w `Dialog` |
| Arkusze na telefonie | shadcn `Drawer` (vaul) |
| Karty podglądu | własny tor na marginesie (`PeekStage`, `inert`) + shadcn `Popover` (dotyk, klawiatura) |
| Ikony | lucide-react |
| Motyw | next-themes, ciemny domyślnie |
| Animacje | CSS: przejścia, `@keyframes`, `tw-animate-css`, animacje sterowane przewijaniem; przelot kadru karta → panel przez View Transitions API. Bez bibliotek animacji (Motion zostaje w zależnościach na gesty, gdy będą potrzebne). Bez GSAP |
| Efekt znaków | jeden zestaw znaków (`_lib/glyphs.ts`, krój `font-logo`): sygnet logo, `GlyphText` (dekodowanie nagłówków i liczb, fala w logo) i wideo startu (`_lib/glyph-reveal.ts`, Canvas 2D) |
| Treść | MDX (blog), frontmatter walidowany przez zod, i18n własne typowane (lustrzane drzewa `pl`/`en`) |
| Formularz | Server Action + zod + pole-pułapka + limit zapytań |
| SEO | Metadata API + `buildMetadata`, `alternates.ts`, JSON-LD (`schema.ts`, typy `schema-dts`), mapa strony, robots, RSS, karty OG |
| Testy | Vitest (logika), Playwright (e2e, axe, regresja wizualna), Lighthouse CI z budżetami |
| CI/CD | GitHub Actions + Vercel |
| Pomiar | Google Search Console i PageSpeed Insights (dane CrUX) — bezpłatne; analityka ruchu do potwierdzenia (sekcja 12) |

**Zakres przepisania:** od zera piszemy warstwę prezentacji (system projektowy, komponenty,
strony), bez kopiowania kodu z dem (zasada 10). Silnik znaków powstaje na nowo w zakresie
potrzebnym stronie głównej, a `shared/glyph` służy tylko za referencję (sprawdzone parametry
i algorytmy). Moduły treści i infrastruktury zostają po przeglądzie i uporządkowaniu: `src/i18n`,
`src/lib` (posty, `schema`, `og`, `mail`, `rate-limit`) i skrypty `check-*`, `cv-pdf`.

## 5. Design system

Szczegóły (skale, tokeny, warianty) powstają razem ze stroną główną i są zapisywane w
`/design-system`. Stałe są tylko trzy reguły:

- **komponenty shadcn instalujemy wyłącznie przez CLI;**
- **system w `ui/`, układ w stronie:**
  - to, co wspólne dla całej strony (promienie, rozmiary, warianty, fokus), trafia do tokenów
    i wariantów `cva` w `ui/*`;
  - na stronie `className` służy tylko układowi (odstęp, szerokość, miejsce w siatce);
  - zmiany w `ui/*` są oznaczone komentarzem `// zeprzalka:`;
- **tokeny w jednym miejscu** (`globals.css`), kolory semantyczne jak w shadcn, ciemny motyw
  domyślny, obłości jako zasada.

## 6. Semantyka i SEO

- Szkielet: link „Przejdź do treści”, `header` z `nav`, `main` z sekcjami `aria-labelledby`, jeden
  `h1`, nagłówki bez przeskoków, `article` dla wpisów i realizacji, `dl` dla liczb, `time` dla dat,
  `footer` z `address`.
- Link to link, a przycisk to przycisk. Tekst nigdy tylko w canvasie: efekty znaków mają tekst
  w DOM, a warstwa graficzna jest `aria-hidden`.
- Metadane przez `buildMetadata`: canonical, hreflang `pl`/`en` + `x-default`, karta OG na stronę.
- JSON-LD: `Person` (`sameAs`: X, GitHub, LinkedIn…), `WebSite`, `ProfilePage`, `BlogPosting`
  z `BreadcrumbList`, `ItemList` dla portfolio.
- Mapa strony z alternatywami językowymi, RSS, `robots.ts`, `llms.txt`.
- Obrazy przez `next/image` (AVIF/WebP, wymiary, `alt`), plakat LCP z priorytetem.

## 7. Ruch i interakcje

- **Trzy warstwy:** CSS → Motion (morf i gesty) → `glyph` (sygnatura).
- **Budżet ruchu:**
  - jedna sygnatura na sekcję;
  - wejście strony (nawigacja → tekst → wideo) ≤ 0,9 s i nigdy nie czeka na JS;
  - napisy nie za szybkie (ok. 600–900 ms).
- **Spoczynek zawsze kompletny.** Wyjątek: tekst „Mam 15 lat…” wypełniany przewijaniem.
  Przy `prefers-reduced-motion` od razu stan końcowy: jedna reguła w `globals.css` skraca każde
  przejście i animację do 1 ms (zdarzenia końca nadal przychodzą), JS pyta `prefersReducedMotion()`.
- **Wejście w kadr bez pomiarów:** napisy, „Nowy” i stopka pytają pierwszy odczyt
  IntersectionObservera (`observeReveal`), a nie `getBoundingClientRect` przy hydratacji.
- **Wejście „harmonijka”:** nagłówek, status, słowa tytułu i zdania (z rozmycia, jedno po drugim),
  przyciski, na końcu wideo — samo CSS (`enter-stagger`), bez czekania na JS.
- **Znaki (decyzja 6.11, druga):** sygnet logo zmienia znak co sekundę, najechanie na logo puszcza
  szum sygnetu i falę znaków przez domenę; nagłówki sekcji i cztery liczby odczytują się ze znaków
  przy wejściu w kadr (`GlyphText`); wideo startu wyłania się z druku ze znaków. W kartach
  podglądu i w stopce znaków nie ma.
- **Karta podglądu (desktop):** tylko na czas najechania albo fokusu — kliknięcie myszą jej nie
  przypina. Tor jest czysto wizualny (`inert`); Enter i Spacja (klawiatura, czytnik) otwierają tę
  samą kartę jako popover z fokusem w środku, Escape oddaje fokus frazie.
  Stoi środkiem przy kursorze i płynie za nim w pionie, kadry w naturalnych proporcjach, wysokość
  i treść przenikają przy zmianie (wzór: `/demo/indeks-1`). Przewijanie pod nieruchomym kursorem
  nic nie otwiera.
- **Karta na dotyku:** popover pod frazą na szerokość kolumny, zawsze pod spodem — gdy brakuje
  miejsca, strona się dosuwa. Frazy „webowych” i „multimedialnych” pokazują jeden film.
- **Portfolio:** kliknięcie wiersza z kartą na marginesie — kadr przelatuje z karty do panelu
  (View Transition, `_lib/morph.ts`); bez API albo przy „ogranicz ruch” zwykłe rozwinięcie.
  Kotwice `#realizacja-…` (adres, ⌘K, dowody kompetencji, wstecz/dalej) idą jedną ścieżką:
  wiersz otwiera się od razu, potem strona przewija, a fokus przechodzi na wiersz.
- **„O mnie”:** fala koloru słowo po słowie na jednej osi czasu akapitu (`scroll-fill`, wzór
  `/demo/indeks-1`); niewypełnione słowo ma kontrast ≥ 3:1.
- **Spis sekcji (od 1280 px):** w starcie i przy stopce go nie ma; w spoczynku sama bieżąca sekcja
  z kropką, przy kursorze blisko lewej krawędzi pozostałe wyostrzają się kolejno.
- **Motyw:** zwykła zmiana klasy bez animacji (shadcn, `disableTransitionOnChange`).
- **Stopka:** „Zeprzałka” na całą szerokość okna wyostrza się z rozmycia przy wejściu w kadr.
- **Interakcje:**
  - karty na marginesie z zamiarem wskazania (zwłoka, nic przy samym przewijaniu);
  - wideo tylko na żądanie i w kadrze;
  - akordeon zawsze w kadrze na telefonie;
  - skrót ⌘/Ctrl ustalony przed pierwszym malowaniem.

## 8. Treść i i18n

- Wszystkie teksty z `src/i18n/content/*` (pary `pl`/`en`, typ `en: typeof pl`), nowe napisy
  interfejsu dopisujemy w obu językach.
- Do serwisu przenosimy poprawki z iteracji 7: wykłady „2016–obecnie” bez nazw uczelni jako
  obecnych, X w profilach.

## 9. Wydajność i media

- Budżety pilnowane w CI: JS nie więcej niż obecna strona (ok. 210 KB gzip), CSS ≤ 20 KB, LCP, CLS, INP.
- Kroje przez `next/font` z preloadem tego, co nad zgięciem; krój znaków jako mały podzbiór ze
  stałą metryką.
- Wideo:
  - przekodowane do ok. 600 kb/s (H.264 + WebM/AV1), plakaty AVIF;
  - `preload="none"`, gra tylko w kadrze;
  - pauza dla zapętlonego ruchu (WCAG 2.2.2).
- Silnik znaków i Motion ładowane leniwie; żadnych długich zadań > 50 ms w pierwszych 1,2 s.
  Odsłanianie wideo rysuje w klatce tylko komórki, które zmieniły stan (komórki posortowane progiem).
- Stan 7.11: JS 224 KB gzip (stara strona 208 KB) — różnica to głównie akordeon Radix (ok. 12 KB);
  HTML 34 KB gzip (dane wyszukiwarki i kart w ładunku RSC — do przeniesienia do osobnego pliku).

## 10. Dostępność i jakość

- **WCAG 2.2 AA:**
  - kontrast w obu motywach;
  - fokus widoczny i wracający;
  - cele dotyku ≥ 44 px;
  - pełna obsługa klawiaturą;
  - formularz z etykietami i komunikatami błędów;
  - testy axe w Playwright.
- **Bramki:**
  - przed commitem: `pnpm check` + `pnpm typecheck` + testy;
  - w CI: te same + Playwright + Lighthouse CI.
- **ESLint:** zakaz importów piaskownicy w serwisie, zakaz `style={{}}` poza zmiennymi CSS,
  porządek importów.
- **Klasy Tailwinda w zapisie kanonicznym:** `pnpm check:classes` (część `pnpm check`) sprawdza każdą
  klasę systemem projektowym Tailwinda — to samo, co podpowiedzi edytora, dla wszystkich plików;
  `--fix` poprawia. Prettier sortuje klasy według tokenów `main-page/globals.css`.
- **Decyzje architektoniczne** jako krótkie ADR w `docs/adr/`, commity `feat:` / `fix:` / `docs:`.

## 11. Plan etapów

1. **Fundament:**
   - tokeny i `globals.css`;
   - komponenty shadcn z CLI;
   - układy główne, nagłówek, stopka, ⌘K, motyw;
   - `/design-system` na nowym systemie.
2. **Strona główna po polsku** wg specyfikacji Indeksu, z testami i budżetami; potem warianty 2–3
   i wersja angielska.
3. **Podstrony:** blog i wpis, usługi, o mnie, portfolio, kontakt, polityka, 404.
4. **Testy UX i A/B wariantów,** wybór zwycięzcy.
5. **Przepięcie** (sekcja 3) i sprawdzenie SEO na produkcji.
6. **Sprzątanie:**
   - usunięcie `/demo` i `DEMO_PUBLIC`;
   - usunięcie zbędnych zależności (`gsap`, `@number-flow/react`…);
   - tag archiwum.

## 12. Do potwierdzenia

1. **Baza zachowań:** Indeks · I (z uwagami z iteracji 7) — do potwierdzenia sekcja po sekcji.
2. **Język komentarzy i README w nowym kodzie:** angielski (szerszy odbiór), dokumenty procesu
   w `docs/` po polsku.
3. **Analityka ruchu:**
   - GA4 wymaga zgody na ciasteczka (baner);
   - Vercel Web Analytics działa bez ciasteczek, ale zależy od planu.
   
   Wybór przed wdrożeniem.
