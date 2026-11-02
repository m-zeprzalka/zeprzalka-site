# Kierunek wizualny — jak dojść do poziomu elity

Stan na 2 listopada 2026. To propozycja, nie wdrożenie: **wygląd strony głównej
zmienia się wyłącznie za Twoją zgodą**, a każda zmiana zaczyna się jako specimen
w `/design-system` (żywy katalog języka wizualnego, `src/app/(pl)/design-system`).

---

## 1. Diagnoza

Ocena audytu UX/UI: **osobowość marki 3/10, spójność komponentów 5/10, kolor 4/10.**

- Serwis wygląda jak dobrze złożony szablon: Geist + shadcn „neutral” + odznaki
  i przyciski `outline`. Doświadczony recenzent rozpozna go w 3 sekundy.
- Paleta to nietknięta instalacja shadcn. Jedynym kolorem serwisu jest surowe
  `bg-green-500` w kropce „Gotowy do współpracy” — klisza szablonów.
- Trzy różne „głosy” nagłówków (H1 `font-medium` w hero, `font-medium tracking-tight`
  na podstronach, `font-bold tracking-tighter` we wpisie), trzy skale odstępów sekcji,
  pięć rozmiarów CTA.
- Najmocniejszy kapitał — **kinowy materiał wideo** (Hilton, 4F, Porsche, wiolonczela)
  — nie przekłada się na resztę strony. Realizacje web to białe mockupy, które na czarnym
  tle dają jaskrawe, nierówne plamy.
- Jedyny autorski element, losowy glif w logo, na części systemów wyświetla się
  jako pusty prostokąt.

Co jest naprawdę dobre i na czym budować: kinowe hero, ciemny motyw, Geist z poprawnymi
polskimi znakami, jawny cennik, `/design-system` jako dojrzałe narzędzie.

## 2. Ograniczenia (Twój gust)

Odrzucone w sierpniu jako „kompletnie mi się nie podoba”: display-groteski (Bricolage,
Archivo), chłodny „interfejsowy” minimalizm, ciepły papier z szeryfem (Fraunces).
Kod tych wariantów jest w tagu `warianty-strony-glownej-2026-08`.

**Zostaje:** ciemny motyw, Geist, kinowy film w hero.

## 3. Propozycja: „Studio nocą”

Język wyrasta z Twojego najmocniejszego materiału: **światła, kadru i montażu**.

1. **Praca jako bohater.** Trzy case studies z filmem w hero i jednym zdaniem efektu.
   Na głównej, pod H1, linia w Geist Mono: `Hilton · 4F · ORLEN Paczka · VINCI Facilities`.
   Typografia zamiast ściany logo wygląda drożej.
2. **Jeden kolor marki z materiału, nie z palety.** Ciepły „tungsten” z lampy studyjnej
   widocznej w hero (np. `oklch(0.80 0.13 70)` w ciemnym motywie, przyciemniony do
   kontrastu ≥ 4,5:1 w jasnym). Oszczędnie, w pięciu miejscach: pierścień fokusu,
   kropka dostępności (zamiast `green-500`), podkreślenie linków, aktywna pozycja menu
   i spisu treści, `::selection`. Tło o włos cieplejsze niż neutralna czerń
   (`oklch(0.15 0.006 70)`) — ciemna sala kinowa, nie papier. Jasny motyw jako
   „ekran projekcyjny”: złamana biel `oklch(0.985 0.004 80)`.
3. **Drugi głos typograficzny: Geist Mono** (już jest w serwisie) dla wszystkiego, co jest
   danymi — daty, czasy czytania, ceny, numeracja 01/02/03, metryczki realizacji. Daje
   techniczno-filmowy charakter (napisy końcowe, timecode) bez display-groteski.
   H1 waga 500, `tracking -0.02em`; wpisy 18 px, 66 znaków w wierszu.
4. **Polska typografia jako podpis rzemiosła:** twarde spacje po jednoliterowych
   spójnikach, „cudzysłowy”, półpauzy w zakresach (2016–2026), zapis zdaniowy
   zamiast „Title Case”. Większość stron w Polsce tego nie ma — ludzie z branży to widzą.
5. **Sygnatura ruchu „cięcie montażowe”:** View Transitions między kaflem a case study
   (kadr rośnie do hero następnej strony). Na kaflach wideo nakładka z timecode `00:12:04`
   w Geist Mono i przyciskiem ▶/❚❚ — **to jednocześnie rozwiązuje WCAG 2.2.2** (pauza
   zapętlonego wideo) jako element stylu, a nie doklejony dodatek.
6. **Własny znak SVG** zamiast losowego Unicode (np. monogram z kadrem 16:9 albo
   znacznikami cięcia), rysowany raz przy wejściu. Losowe glify mogą zostać jako
   easter egg po najechaniu.
7. **Dowód w liczbach, na stałe, w mono:** `[15] lat · 30+ klientów · 10 lat wykładów ·
   Nagroda Rektora (99,28%)` — autorytet, który dziś leży na dole `/o-mnie`.
8. **Żywe detale zamiast zielonej kropki:** `Warszawa 14:32 · wolne terminy od [stycznia 2027]`
   i e-mail kopiowany jednym kliknięciem.
9. **Menu mobilne jako plansza tytułowa:** pozycje 36–40 px, pod nimi e-mail, CTA, EN/PL
   i przełącznik ruchu. Dziś 70% ekranu jest puste.
10. **Blog jako produkt:** kolumna 66 znaków wyśrodkowana, spis treści z postępem (także
    na telefonie), nawigacja serii, bloki kodu z nazwą pliku, „następny wpis” z dużym kadrem.
11. **Jedno „wow”** pokazujące warsztat 3D i motion — np. krótka pętla z Blendera
    na 404 albo w stopce, z przyciskiem pauzy.

**Czego nie robić:** smooth-scrolla przejmującego przewijanie, animowania każdego
akapitu, zmiany kroju na display-grotesk, ciepłego papieru.

## 4. Dług wizualny (z katalogu `/design-system`, zweryfikowany 2.11.2026)

| # | Pozycja | Gdzie | Dotyka głównej |
| --- | --- | --- | :-: |
| 1 | Zapętlone wideo bez pauzy (hero, 8 kafli, 15 na `/portfolio`) — WCAG 2.2.2 | `PortfolioCard.tsx`, `Hero.tsx` | tak |
| 2 | **Pięć** rozmiarów CTA (48, 40, 36, 32 px i `lg`+`p-6`) | Hero, ContactForm, About, Services, Portfolio, PostCta, 404, BlogPreview | tak |
| 3 | `md:font-semi-bold` — klasa, która nic nie robi | `Skills.tsx`, `Gallery.tsx`, `Contact.tsx` | tak |
| 4 | Surowe `bg-green-500` / `text-green-*` zamiast tokenu | Hero, AboutView, ContactForm, CodeBlock | tak |
| 5 | `top-22` i `top-24` przemieszane — powinna być jedna zmienna `--header-h` (nagłówek z paskiem ma 68 px) | home/*, ContactView, PostView | tak |
| 6 | „Karta bez karty” w sekcji kontaktu (`Card` z wyzerowanym stylem) | `home/Contact.tsx` | tak |
| 7 | Paleta shadcn „neutral” bez koloru marki; tokeny `chart-*` nieużywane | `globals.css` | tak |
| 8 | Trzy systemy nagłówków i trzy skale odstępów sekcji | — | tak |
| 9 | Polski „Title Case” („Zarezerwuj Bezpłatną Konsultację”, „Blog Technologiczny”) | `home.ts`, `pages.ts`, tytuły wpisów | częściowo |
| 10 | Wiszące spójniki na końcach wierszy | wszędzie | tak |
| 11 | Kafle portfolio: podpis tylko po najechaniu, `cursor-pointer` bez akcji, przesunięcie układu po załadowaniu wideo (`-my-6` jako łatka) | `PortfolioCard.tsx` | tak |

Naprawione w tej rundzie (bez zmian wyglądu głównej): pierścień fokusu ≥ 3:1, wydruk,
etykiety kategorii, zagnieżdżone nagłówki w akordeonie, jedna karta wpisu na podstronach,
martwe klasy we wpisie, spis treści bez komponentu `Sidebar`.

## 5. Kolejność

1. **Specimen w `/design-system`:** tokeny `--brand`, `--focus`, `--available`,
   Geist Mono w metadanych, znak SVG, kafel portfolio z timecode i pauzą. Oglądasz
   na prawdziwych komponentach, w obu motywach.
2. **Podstrony** (bez zgody na główną): wpis, `/portfolio`, `/uslugi`, `/o-mnie`, 404.
3. **Strona główna — za Twoją zgodą**, z porównaniem zrzutów przed/po:
   lista klientów, liczby w mono, pauza wideo, CTA, zapis zdaniowy, twarde spacje.

Wybór kroju (gdyby kiedyś) zawsze przez specimen: prawdziwy polski nagłówek wyrenderowany
na zrzucie, nie z pamięci.
