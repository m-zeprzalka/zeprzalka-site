# Piaskownica `/demo`

Miejsce na pracę kreatywną: warianty strony głównej, prototypy i specimeny
nowego języka wizualnego. **Tu wolno eksperymentować** — ale nowe koncepcje trzymają
porządek: każda we własnym folderze, na wspólnym systemie „Forma”. Granica z serwisem jest
twarda i pilnowana w kilku miejscach naraz.

## Granica z serwisem

| Zasada | Jak jest wymuszona |
| --- | --- |
| Serwis nigdy nie importuje niczego z dem | reguła ESLint `no-restricted-imports` (błąd w `pnpm lint` i w CI) |
| Klasy Tailwinda z dem nie trafiają do CSS serwisu | `@source not` w `src/app/globals.css` |
| Dema mają własny arkusz i własny układ główny | `src/app/demo/layout.demo.tsx` + `src/app/demo/demo.css` (zamrożona kopia tokenów) |
| Produkcja nie zna dem | pliki tras mają końcówkę `*.demo.tsx`, którą `pageExtensions` w `next.config.ts` rozpoznaje tylko poza produkcją — na produkcji `/demo` to zwykła strona 404 serwisu, a paczka nie zawiera ani bajtu dem (wyjątek: `DEMO_PUBLIC=1`) |
| Dema nie są indeksowane ani mierzone | `robots: noindex, nofollow` w układzie, poza `sitemap.ts`, bez `Analytics` |
| Formularze w demach niczego nie wysyłają | `shared/demo-action.ts` zamiast prawdziwej akcji |

Gdzie oglądać: `pnpm dev` → http://localhost:3000/demo, albo podgląd (Preview)
gałęzi na Vercelu → `/demo`.

## Struktura

```
src/app/demo/
├── layout.demo.tsx       # układ główny piaskownicy (html lang=pl, noindex, motyw systemowy)
├── demo.css              # zamrożona kopia globals.css + import systemu „Forma”
├── page.demo.tsx         # spis dem jako prezentacja: trzy koncepcje, rekomendacja, archiwum
├── forma/ zywy-interfejs/ indeks/ talia/   # page.demo.tsx nowych koncepcji (iteracja 3)
├── precyzja/             # odrzucony kierunek z iteracji 2 (+ system/)
└── (serwis)/             # dawne warianty w nagłówku i stopce serwisu
    └── main-secondary/ main-third/ main-fourth/
src/components/demo/
├── registry.ts           # lista dem, metadane, mocne strony i ryzyka koncepcji
├── forma/                # SYSTEM „Forma”: theme.css (tokeny → utility Tailwinda), cn.ts,
│                         # Button, Chip/LiveDot/Kbd, CopyButton, ThemeSwitch, Count, Reveal,
│                         # use-in-view, typo, Specimen (/demo/forma)
├── zywy-interfejs/       # koncepcja „Żywy interfejs” (rekomendacja)
├── indeks/               # koncepcja „Indeks”
├── talia/                # koncepcja „Talia”
├── precyzja/             # odrzucona „Precyzja” (3.11.2026)
├── shared/               # kopie zależności dawnych wariantów (zamrożone)
└── main-secondary/ main-third/ main-fourth/   # warianty z 25.08.2026 (zamrożone)
```

## System „Forma” i trzy koncepcje (iteracja 3, 3 listopada 2026)

Miękki minimalizm w duchu Vercel/shadcn: płótno + powierzchnie, krawędź jako
cień-pierścień, koncentryczne promienie, pigułki dla akcji, Geist w dwóch tonach.
Tokeny w `forma/theme.css` (`.fm` na korzeniu koncepcji) zamieniają się w utility:
`bg-fm-surface`, `text-fm-ink-2`, `rounded-fm-3xl`, `shadow-fm-card`, `ease-fm-snap`,
`text-fm-display`… Klasy łączymy przez `forma/cn.ts` (zwykły `cn` serwisu nie zna
tokenów i gubi np. `text-fm-micro` obok `text-fm-ink-2`).

Każda koncepcja to osobny folder — odrzuconą usuwa się razem z jej trasą i wpisem
w `registry.ts`. Opis, rekomendacja i plan: `docs/KIERUNEK-WIZUALNY.md`.

Zależności tylko dla piaskownicy (`devDependencies`, import poza `/demo` blokuje ESLint):
`motion` (gesty, animacje układu), `@number-flow/react` (liczby),
`react-intersection-observer` (zamrożone warianty z sierpnia).

## „Precyzja” (3 listopada 2026, odrzucona)

`/demo/precyzja` i `/demo/precyzja/system` — kierunek „rysunku technicznego”. Właściciel
wyjaśnił, że „architektoniczna precyzja” to jakość wykonania, nie styl — zostaje do porównań.

## Dawne warianty (25 sierpnia 2026)

Odtworzone 1:1 z tagu `warianty-strony-glownej-2026-08`. Zmienione wyłącznie
ścieżki importów, zamiana prawdziwej akcji formularza na atrapę i usunięcie
JSON-LD. Kod jest zamrożony — nie poprawiamy go, służy do porównań.

## Jak dodać nowe demo

1. Komponenty w `src/components/demo/<nazwa>/`, trasa w `src/app/demo/<nazwa>/page.demo.tsx`
   (albo w `(serwis)/`, jeśli ma stać w nagłówku i stopce serwisu). **Końcówka
   `.demo.tsx` jest obowiązkowa** — zwykły `page.tsx` trafiłby na produkcję.
2. Wpis w `DEMOS` w `registry.ts`. Nowe koncepcje stoją na „Formie”: korzeń z klasą `fm`,
   tokeny z `forma/theme.css`, prymitywy z `forma/`, łączenie klas przez `forma/cn.ts`.
3. Jeśli demo dojrzeje do wdrożenia: przepisujemy je **od nowa** do `src/components/`
   według zasad serwisu — nie przenosimy plików z piaskownicy.
