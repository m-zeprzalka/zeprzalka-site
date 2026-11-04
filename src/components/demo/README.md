# Piaskownica `/demo`

Miejsce na pracę kreatywną: koncepcje strony głównej i specimen systemu „Forma”.
Każda koncepcja we własnym folderze, na wspólnym systemie. Granica z serwisem jest
twarda i pilnowana w kilku miejscach naraz. Oglądanie: https://www.zeprzalka.com/demo (na czas
prac nad wyglądem `DEMO_PUBLIC=1` w Vercelu, tylko Production) albo `pnpm dev` → http://localhost:3000/demo.
Odrzucone kierunki (Precyzja, warianty z sierpnia): tag `piaskownica-archiwum-2026-11`.

## Granica z serwisem

| Zasada | Jak jest wymuszona |
| --- | --- |
| Serwis nigdy nie importuje niczego z dem ani ich zależności | ESLint `no-restricted-imports` (błąd w `pnpm lint` i w CI) |
| Klasy Tailwinda z dem nie trafiają do CSS serwisu | `@source not` w `src/app/globals.css` |
| Dema mają własny arkusz i układ główny | `src/app/demo/layout.demo.tsx` + `src/app/demo/demo.css` |
| Produkcja nie zna dem | trasy `*.demo.tsx` rozpoznaje `pageExtensions` w `next.config.ts` tylko poza produkcją (wyjątek: `DEMO_PUBLIC=1`); `pnpm check:build --production` to sprawdza |
| Dema nie są indeksowane ani mierzone | `robots: noindex, nofollow` w układzie, poza `sitemap.ts`, bez `Analytics` |
| Formularze w demach niczego nie wysyłają | `forma/demo-action.ts` zamiast prawdziwej akcji |

## Struktura

```
src/app/demo/
├── layout.demo.tsx       # układ główny piaskownicy (html lang=pl, noindex, motyw systemowy)
├── demo.css              # Tailwind + system „Forma”
├── page.demo.tsx         # spis dem jako prezentacja: koncepcje, mocne strony i ryzyka
└── forma/ zywy-interfejs/ indeks/ talia/   # page.demo.tsx
src/components/demo/
├── registry.ts           # lista dem, metadane, mocne strony i ryzyka koncepcji
├── forma/                # SYSTEM „Forma”: theme.css (tokeny → utility Tailwinda), cn.ts,
│                         # Button, Chip/LiveDot/Kbd, CopyButton, ThemeSwitch, Count, Reveal,
│                         # use-in-view, typo, Specimen, demo-action
├── zywy-interfejs/       # koncepcja „Żywy interfejs” (rekomendacja)
├── indeks/               # koncepcja „Indeks”
└── talia/                # koncepcja „Talia”
```

## System „Forma”

Tokeny w `forma/theme.css` (`.fm` na korzeniu koncepcji) zamieniają się w utility:
`bg-fm-surface`, `text-fm-ink-2`, `rounded-fm-3xl`, `shadow-fm-card`, `ease-fm-snap`,
`text-fm-display`… Klasy łączymy przez `forma/cn.ts` (zwykły `cn` serwisu nie zna
tokenów i gubi np. `text-fm-micro` obok `text-fm-ink-2`). Opis, rekomendacja i plan:
`docs/KIERUNEK-WIZUALNY.md`.

Zależności tylko dla piaskownicy (`devDependencies`): `motion` (gesty, animacje układu)
i `@number-flow/react` (liczby).

## Jak dodać nowe demo

1. Komponenty w `src/components/demo/<nazwa>/`, trasa w `src/app/demo/<nazwa>/page.demo.tsx`.
   **Końcówka `.demo.tsx` jest obowiązkowa** — zwykły `page.tsx` trafiłby na produkcję.
2. Wpis w `DEMOS` w `registry.ts`; korzeń z klasą `fm`, prymitywy z `forma/`, klasy przez `forma/cn.ts`.
3. Wdrożenie do serwisu: przepisujemy **od nowa** do `src/components/` według zasad serwisu —
   nie przenosimy plików z piaskownicy. Lista rzeczy do poprawienia przy migracji
   „Żywego interfejsu”: `docs/prywatne/referencje/migracja-piaskownicy.md`.
