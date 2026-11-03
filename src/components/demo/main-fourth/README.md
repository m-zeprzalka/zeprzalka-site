# /main-fourth — alternatywna strona główna (paradygmat: atelier)

Czwarty wariant strony głównej o **identycznej treści i architekturze**
(Hero → Kompetencje → Portfolio → Blog → Kontakt). Nie dotyka
`src/components/home/*`, `src/app/page.tsx`, pozostałych wariantów, layoutu
ani `globals.css`.

Trzy poprzednie warianty były chłodne i interfejsowe (grotesk, siatka, linie
włosowe). Ten jest **ciepły i drukarski**: papier zamiast bieli, tusz zamiast
czerni, jeden krój szeryfowy o dużym kontraście kresek, ziarno na całości
i ruch, który zwalnia zamiast hamować.

## Typografia

| | |
| --- | --- |
| Display | **Fraunces** — zmienny, oś optyczna `opsz` 9–144 |
| Tekst i UI | **Geist** (już w layoucie — wariant dokłada jeden krój, nie trzy) |

- W nagłówkach `opsz` idzie na maksimum: kontrast kresek rośnie i litera
  zachowuje się jak krój display, a nie jak powiększony tekst.
- Akcent to **prawdziwa kursywa** tej samej rodziny (inne kształty liter),
  a nie pochylenie. Stąd wrażenie „napisane", nie „przekrzywione".
- Krój display siedzi w jednej zmiennej `--m4-display` — podmiana rodziny to
  jedna linia w `fonts.ts` i jedna w CSS.

**Polska typografia:** `typography.ts` wstawia spacje nierozdzielające po
jednoliterowych spójnikach (a, i, o, u, w, z), więc żaden wiersz nie kończy się
samotnym „w". Nagłówek hero ma dodatkowo jawne łamanie (`hero.titleLines`) —
podział wypada tam, gdzie kończy się myśl, a nie tam, gdzie skończyła się
kolumna. W wyrenderowanym HTML jest ok. 70 takich spacji.

## Struktura

| Plik | Rola |
| --- | --- |
| `fonts.ts` | Fraunces (roman + kursywa) — jedyny krój dodany przez wariant |
| `typography.ts` | Reguła polskich sierotek (spacje nierozdzielające) |
| `Lines.tsx` | Nagłówek jako bloki-wiersze, każdy z własną maską |
| `Reveal.tsx` | Ujawnianie w kadrze — jednorazowe, JS ustawia tylko `data-shown` |
| `Section.tsx` | Rama sekcji: linia w mierze, numer, tytuł, wprowadzenie |
| `Magnetic.tsx` | Element przyciągany do kursora (tylko mysz, poza reduced-motion) |
| `Hero` `Skills` `Portfolio` `Blog` `Contact` | Sekcje — Server Components |
| `ContactForm.tsx` | shadcn Field/Input/Textarea; zmieniona geometria, nie kolory |
| `src/app/main-fourth/main-fourth.css` | Paleta, ziarno, skala, ruch |

Współdzielone z pozostałymi wariantami: `src/lib/home-content.ts`,
`src/components/media/SmartVideo.tsx`, `src/hooks/use-reduced-motion.ts`,
`public/portfolio/*`.

## Decyzje

- **Paleta** jest lokalna dla wariantu: nadpisuje tokeny shadcn wewnątrz
  `.main-fourth`, więc wszystkie komponenty dostosowują się same, a reszta
  serwisu zostaje nietknięta. Papier `oklch(0.985 0.004 85)` / tusz
  `oklch(0.195 0.012 55)`, w ciemnym motywie przygaszony węgiel z ciepłym
  podbiciem — nigdy czysta biel ani czysta czerń.
- **Ziarno** to jedna warstwa szumu z filtra SVG (zero zapytań sieciowych),
  `multiply` na papierze i `screen` na węglu.
- **Szew z nagłówkiem**: globalny `Header` jest półprzezroczysty i miesza się
  z tłem `body`, które ma paletę neutralną. Góra hero przechodzi gradientem
  z koloru globalnego do papierowego, więc styku nie widać.
- **Ruch**: wejścia sterowane obserwatorem (jednorazowo — raz pokazana treść
  zostaje widoczna), paralaksa osią przewijania (`view()`, wyłącznie transformy,
  klatka startowa niczego nie ukrywa). `prefers-reduced-motion`, druk i brak JS
  wyłączają ruch, nie treść.
- **Kurtyna nagłówka trwa 0,6 s** — dopóki wiersz stoi za maską, przeglądarka
  nie liczy go jako namalowanej treści, więc dłuższy gest to wprost gorszy LCP.
- **SEO**: jeden `h1`, sekcje `aria-labelledby`, `figure/figcaption`,
  `time[datetime]`, JSON-LD WebSite + Person, `canonical → /`.

## Znane ograniczenia

- Podgląd okładek w sekcji Blog korzysta z `:has()` (Chrome 105+, Safari 15.4+,
  Firefox 121+). Bez wsparcia panel pokazuje pierwszą okładkę i nie przełącza
  się — treść wiersza jest kompletna bez niego.
- Miniatury bloga pobierają pełnowymiarowe pliki: skutek globalnego
  `images.unoptimized: true` (limit planu Vercel Hobby, docs/ROADMAP.md).
