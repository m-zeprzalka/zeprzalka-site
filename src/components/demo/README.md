# Piaskownica `/demo`

Miejsce na pracę kreatywną: warianty strony głównej, prototypy i specimeny
nowego języka wizualnego. **Tu wolno bałaganić.** Granica z serwisem jest
twarda i pilnowana w kilku miejscach naraz.

## Granica z serwisem

| Zasada | Jak jest wymuszona |
| --- | --- |
| Serwis nigdy nie importuje niczego z dem | konwencja + przegląd (`grep -r "components/demo" src --exclude-dir=demo` musi być pusty) |
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
├── layout.demo.tsx       # układ główny piaskownicy (html lang=pl, noindex, demo.css)
├── demo.css              # zamrożona kopia globals.css z pełnym skanowaniem Tailwinda
├── page.demo.tsx         # spis dem
└── (serwis)/             # dema osadzone w nagłówku i stopce serwisu
    ├── layout.demo.tsx
    └── main-secondary/ main-third/ main-fourth/
src/components/demo/
├── registry.ts           # lista dem i ich metadane
├── shared/               # kopie zależności dawnych wariantów (zamrożone)
└── main-secondary/ main-third/ main-fourth/   # kod wariantów z 25.08.2026
```

## Dawne warianty (25 sierpnia 2026)

Odtworzone 1:1 z tagu `warianty-strony-glownej-2026-08`. Zmienione wyłącznie
ścieżki importów, zamiana prawdziwej akcji formularza na atrapę i usunięcie
JSON-LD. Kod jest zamrożony — nie poprawiamy go, służy do porównań.

## Jak dodać nowe demo

1. Komponenty w `src/components/demo/<nazwa>/`, trasa w `src/app/demo/<nazwa>/page.demo.tsx`
   (albo w `(serwis)/`, jeśli ma stać w nagłówku i stopce serwisu). **Końcówka
   `.demo.tsx` jest obowiązkowa** — zwykły `page.tsx` trafiłby na produkcję.
2. Wpis w `DEMOS` w `registry.ts`.
3. Jeśli demo dojrzeje do wdrożenia: przepisujemy je **od nowa** do `src/components/`
   według zasad serwisu — nie przenosimy plików z piaskownicy.
