# Piaskownica `/demo`

Miejsce na pracę kreatywną: propozycje strony głównej i specimen systemu „Forma”.
Każda propozycja we własnym folderze, na wspólnym systemie i wspólnej treści. Granica z serwisem jest
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
├── layout.demo.tsx       # układ główny piaskownicy (html lang=pl, noindex, ciemny motyw na start)
├── demo.css              # Tailwind + system „Forma”
├── page.demo.tsx         # spis dem jako prezentacja: wersje z iteracji 7, niżej iteracje 6, 5 i 3
└── <slug>/page.demo.tsx  # jedna trasa na propozycję
src/components/demo/
├── registry.ts           # lista dem: zadanie z briefu, opis, mocne strony i ryzyka
├── shared/content.ts     # WSPÓLNA TREŚĆ propozycji: wszystko z obecnej strony głównej
│                         # i „O mnie” (+ wymiary plakatów) — serwerowe, do klientów przez propsy
├── shared/portrait/      # portrety ze zdjęcia; iteracja 7: tylko klatki twarzy ze znaków (face-glyphs-*)
├── shared/glyph/         # WSPÓLNY SILNIK ZNAKÓW (iteracja 7): portret, media, tekst, liczby, soczewka,
│                         # napis w stopce, figury, sygnet, przejście motywu — opis w README.md obok
├── forma/                # SYSTEM „Forma”: theme.css (tokeny → utility Tailwinda), cn.ts,
│                         # Button, Chip/LiveDot/Kbd, CopyButton, ThemeSwitch, Count, Reveal,
│                         # use-in-view, typo, Specimen, demo-action
├── indeks-1/ indeks-2/ best-of-2/ autorska/           # iteracja 7 — wersje bliskie wyboru
├── indeks-new/ glif-lab/ best-of/ rentgen/ kinetyka/  # iteracja 6 — pięć koncepcji
├── tryptyk/ esencja/ glif/ reedycja/ transformacja/   # iteracja 5 — pięć propozycji
└── zywy-interfejs/ indeks/ talia/                     # iteracja 3 — do porównania
```

Każda propozycja ma własny prefiks klas, animacji i `view-transition-name` (iteracja 5: `tk-`,
`es-`, `gl-`, `re-`, `tf-`; iteracja 6: `ixn-`, `gll-`, `bo-`, `rg-`, `kn-`; iteracja 7: `i1-`, `i2-`,
`b2-`, `au-`, silnik `gx-`) — arkusze dem są
globalne po przejściu między nimi.

Kroje z glifami to podzbiory OFL/wolnych krojów pod zmienioną nazwą, z licencją obok pliku:
`glif/glif-symbols.woff2`, `best-of/glyphs/`, `indeks-new/glyph/`, `kinetyka/kn-glyphs.woff2`
(podzbiory DejaVu Sans Mono) i `glif-lab/fonts/` (DejaVu Sans Mono, DejaVu Sans dla Braille'a,
M PLUS 1 Code dla katakany).

## System „Forma”

Tokeny w `forma/theme.css` (`.fm` na korzeniu koncepcji) zamieniają się w utility:
`bg-fm-surface`, `text-fm-ink-2`, `rounded-fm-3xl`, `shadow-fm-card`, `ease-fm-snap`,
`text-fm-display`… Klasy łączymy przez `forma/cn.ts` (zwykły `cn` serwisu nie zna
tokenów i gubi np. `text-fm-micro` obok `text-fm-ink-2`). Opis, rekomendacja i plan:
`docs/KIERUNEK-WIZUALNY.md`.

Zależności tylko dla piaskownicy (`devDependencies`): `motion` (gesty, animacje układu),
`@number-flow/react` (liczby), `gsap` (choreografia przewijania, podział tekstu, Flip) i `ogl`
(lekki WebGL — shadery glifów na obrazie i wideo). Serwis ich nie importuje (ESLint).

## Jak dodać nowe demo

1. Komponenty w `src/components/demo/<nazwa>/`, trasa w `src/app/demo/<nazwa>/page.demo.tsx`.
   **Końcówka `.demo.tsx` jest obowiązkowa** — zwykły `page.tsx` trafiłby na produkcję.
2. Wpis w `DEMOS` w `registry.ts`; korzeń z klasą `fm` i własnym prefiksem, treść
   z `shared/content.ts`, prymitywy z `forma/`, klasy przez `forma/cn.ts`.
3. Wdrożenie do serwisu: przepisujemy **od nowa** do `src/components/` według zasad serwisu —
   nie przenosimy plików z piaskownicy. Lista rzeczy do poprawienia przy migracji
   „Żywego interfejsu”: `docs/prywatne/referencje/migracja-piaskownicy.md`.
