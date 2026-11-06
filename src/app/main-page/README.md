# main-page — nowa wersja zeprzalka.com

Decyzje dla przebudowy strony (blog i strona wizytówkowa). Ten plik jest instrukcją dla agenta i
opisem architektury. Zmiany decyzji wpisujemy tutaj.

## Stan (6.11.2026)

Wariant 1 strony głównej po polsku: `/main-page` (lokalnie i na zeprzalka.com przy
`DEMO_PUBLIC=1`). Kanon Indeksu (`/demo/indeks-1`) przepisany od zera na shadcn i Tailwind,
z poprawkami z testów właściciela. Gdzie co zmieniać:

| Co | Gdzie |
| --- | --- |
| teksty nowej strony (napisy, frazy otwierające karty, liczby) | `src/i18n/content/main-page.ts` |
| które realizacje pokazuje karta danej frazy | `PEEK_WORKS` w `_lib/content.ts` |
| efekt znaków w wideo startu (komórka, tempo, front, kontrast) | `GLYPH_REVEAL` w `_lib/glyph-reveal.ts` |
| kolory, promień, kolumna, krzywe ruchu | `globals.css` |
| wygląd przycisków, pól, akordeonu, okien | `_components/ui/*` (zmiany oznaczone `// zeprzalka:`) |

Nowy komponent shadcn: `pnpm dlx shadcn@latest add <nazwa> -y` — `components.json` wskazuje już
`_components/ui`. CLI w wersji 4 wpisuje import `cn` z paczki `cn` i ją instaluje: po każdej
instalacji `pnpm remove cn` i zamiana `from "cn"` na `from "@/lib/utils"` w nowych plikach.

## 1. Cel i kryteria sukcesu

Strona **i kod źródłowy** są wizytówką: repozytorium jest publiczne, a zaglądać będą seniorzy,
którzy mogą zatrudnić autora. Sukces mierzymy, a nie oceniamy na oko. Drobne odstępstwa od
poniższych punktów są dopuszczalne, jeśli wymaga tego wygląd:

- **Lighthouse 100 / 100 / 100 / 100** (wydajność, dostępność, dobre praktyki, SEO) na telefonie;
- **LCP < 1,8 s** (telefon, 4G), **CLS = 0**, **INP < 200 ms**;
- **JS na start nie więcej niż obecna strona** (ok. 210 KB gzip; sama baza Next 16 + React 19 to ok. 170 KB) — wariant 1 ma 222 KB, a cięższe części (wyszukiwarka, popover) ładują się dopiero przy użyciu;
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
   - Żadnych własnych prymitywów obok `ui/`.
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
  _components/
    ui/                       # shadcn z CLI, zmiany systemowe z `// zeprzalka:` → src/components/ui
    layout/                   # powłoka, nagłówek, logo, ⌘K, motyw, język, stopka → src/components/layout
    sections/                 # sekcje strony głównej (wspólne dla wariantów)   → src/components/home
    peek/                     # karty podglądu: margines (desktop) i popover     → src/components/peek
    seo/                      # dane strukturalne
  _lib/
    content.ts                # model widoku z src/i18n i src/lib (serwer)
    types.ts, anchors.ts, text.ts, hooks.ts, keep-in-view.ts
    glyph-reveal.ts           # jedyny efekt znaków: odsłanianie wideo w starcie
  _variants/
    wariant-1/home-page.tsx   # kompozycja strony głównej wariantu         → src/components/views
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
  5. obecna strona zostaje w gicie jako tag archiwum (np. `v1-archiwum`), nie jako folder w repo.

## 4. Stos technologiczny

| Obszar | Wybór |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript strict; wszystko statyczne (SSG), formularz przez Server Action |
| UI | shadcn/ui (prymitywy Radix) + Tailwind 4 |
| Paleta ⌘K | shadcn `Command` (cmdk) w `Dialog` |
| Arkusze na telefonie | shadcn `Drawer` (vaul) |
| Karty na marginesie | shadcn `HoverCard` / `Popover` |
| Ikony | lucide-react |
| Motyw | next-themes, ciemny domyślnie |
| Animacje | CSS: przejścia, `@keyframes`, `tw-animate-css`, animacje sterowane przewijaniem. Karta podglądu płynie i przenika bez biblioteki. Motion (`motion/react`) zostaje w zależnościach do morfa karty w panel i gestów, gdy będą potrzebne. Bez GSAP |
| Efekt znaków | MVP: tylko wideo startu (`_lib/glyph-reveal.ts`, Canvas 2D, wzór kart z `/demo/glif`) i sygnet logo. Reszta efektów znaków wraca po dopracowaniu ręcznym |
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
  Przy `prefers-reduced-motion` od razu stan końcowy.
- **Znaki w MVP (decyzja 6.11):** tylko duże wideo startu wyłania się z druku ze znaków
  (wzór kart portfolio z `/demo/glif`) i sygnet logo zmienia znak co sekundę. Bez dekodowania
  nagłówków i liczb, bez znaków w kartach i stopce, bez kafelkowej zmiany motywu.
- **Morf zamiast znaków:** karta podglądu płynie za wskazaną frazą, dopasowuje wysokość, a treść
  przenika z lekkim rozmyciem (wzór: pierwszy `/demo/indeks`). Najechanie i kliknięcie dają ten sam
  wygląd karty; bez krzyżyka (Escape i klik obok zamykają).
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
