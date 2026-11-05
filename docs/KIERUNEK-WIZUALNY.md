# Kierunek wizualny — system „Forma” i propozycje strony głównej

Stan na 5 listopada 2026 (iteracja 7). Wszystko poniżej żyje w piaskownicy `/demo`. Na czas
prac nad wyglądem jest też na produkcji: **https://www.zeprzalka.com/demo** (zmienna
`DEMO_PUBLIC=1` w Vercelu, `noindex`, poza mapą strony); lokalnie `pnpm dev` → http://localhost:3000/demo.
Oglądaj na telefonie i komputerze, w obu motywach. Historia odrzuconych kierunków: `docs/DZIENNIK.md`, kod: tag `piaskownica-archiwum-2026-11`.

**Zasada:** precyzja to jakość wykonania, nie styl — minimalizm Vercel/shadcn, miękkie
kształty, monochrom, mikrointerakcje krótkie i celowe, mobile first.

## 1. System „Forma”

Specimen: `/demo/forma`. Źródło prawdy: `src/components/demo/forma/theme.css` + prymitywy obok.

| Warstwa | Wartości |
| --- | --- |
| Kolor (jasny / ciemny) | płótno `oklch(0.985)` / `oklch(0.145)`, powierzchnia `1` / `0.18`, wypełnienie `0.967` / `0.215`, atrament `0.205` / `0.975`, drugi ton `0.44` / `0.77`, trzeci `0.53` / `0.66`, krawędź 8% / 9%; jedyny kolor semantyczny — zielona kropka „dostępny” |
| Promienie | 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 px + pigułka, zagnieżdżenia koncentryczne |
| Cienie | pierścień, karta, pop, float; w ciemnym motywie jasny pierścień + światło górnej krawędzi |
| Pismo | Geist: display 40 → 76 px, H2 30 → 48, H3 20, lead 18 → 22, body 16/26, small 14, micro 12; Geist Mono dla kodu i wartości; `tabular-nums`, twarde spacje (`typo()`) |
| Ruch | `cubic-bezier(0.23,1,0.32,1)` wejście/wyjście, `(0.77,0,0.175,1)` po ekranie, `(0.32,0.72,0,1)` szuflada; UI ≤ 300 ms; nacisk `scale(0.97)`; `prefers-reduced-motion` = stan końcowy |
| Układ | kontener 1200 px, marginesy 16 → 32 px, rytm sekcji 80 → 128 px, cele dotyku ≥ 44 px |
| Prymitywy | Button, Chip + LiveDot + Kbd, CopyButton, ThemeSwitch (View Transitions), Count (Number Flow), Reveal |

## 2. Wersje bliskie wyboru (iteracja 7)

Wygrał wąski Indeks. Wszystkie wersje stoją na tej samej treści (`shared/content.ts`) i na
wspólnym silniku znaków (`src/components/demo/shared/glyph/`, ustawienia właściciela w
`settings.ts`), z decyzjami z briefu z 5 listopada: ciemny start, obłości, siatka trzymana
przez nagłówek i paletę, bez liczników, zestaw znaków „Sygnet”, twarz tylko ze znaków.
Każda przeszła trzy rundy: dwie uwag art directora i jedną po niezależnej krytyce.

| | Zadanie z briefu | Idea | Mocne strony | Ryzyka | JS na start* |
| --- | --- | --- | --- | --- | --- |
| [Indeks · I](https://www.zeprzalka.com/demo/indeks-1) | pkt 1 — Indeks · nowy po uwagach | jedna kolumna; spis, karty z wideo i paleta pojawiają się na żądanie | kandydat do produkcji; najlżejszy; siatka trzech torów | stoi na tekście; karta z toru od 1280 px | 229 KB |
| [Indeks · II](https://www.zeprzalka.com/demo/indeks-2) | pkt 2 — wariacja | asymetryczna siatka; twarz ze znaków na marginesie staje się filmem wskazanej kategorii | najmocniejsze pierwsze wrażenie; hybryda chipy + film | najwięcej efektów naraz | 236 KB |
| [The Best Of · II](https://www.zeprzalka.com/demo/best-of-2) | pkt 3 — najlepsze z animacjami | szeroki układ z jednym językiem ruchu: obraz ze znaków, tekst z rozmycia | najlepsza choreografia wejścia; wszystkie pochwalone komponenty | najdalej od kanonu Indeksu | 236 KB |

\* gzip, build produkcyjny; dla porównania obecna strona główna 208 KB, Indeks · nowy 242 KB.
Iteracje 6, 5 i 3 zostają w `/demo` do porównania.

**Ranking niezależnej krytyki** (przed trzecią rundą): Indeks · I (8 / 7,5 / 9), Indeks · II
(8,5 / 6,5 / 7,5), The Best Of · II (8 / 7 / 6,5) — oceny: pierwsze wrażenie / wykonanie /
zgodność z gustem. Trzecia runda usunęła wszystkie zgłoszone blokery.

**Rekomendacja:** Indeks · I jako baza produkcyjna (ewentualnie test A/B z Indeksem · II). Do
rozważenia z pozostałych: twarz ze znaków z wyborem zestawu i dolny arkusz na telefonie
(Indeks · II), log komend i rozmowa AI w kompetencjach, soczewka kodu w CTA i zoom wideo od
mniejszego kadru (The Best Of · II).

**Reguła ruchu na finał:** przewijanie najwyżej uruchamia animację, a stan spoczynkowy jest
zawsze kompletny (bez półrozmytych nagłówków, fałszywych liczb i bełkotu znaków). Wyjątek:
tekst wypełniany przewijaniem — niewypełnione słowa są częścią wzorca.

## 3. Plan (praca na `main`, bez gałęzi i podglądów)

1. **[Ty] Wybór:** jedna z pięciu koncepcji iteracji 6 albo szkielet + zapożyczenia; przy każdej sekcji
   „zostaje / zmień / wyrzuć” + jedno zdanie dlaczego (zrzut z zaznaczeniem jest wart więcej niż opis).
2. **[Kod] System w serwisie:** tokeny „Formy” do `globals.css`, prymitywy przepisane do
   `src/components/ui/` (nie kopiowane z piaskownicy), `/design-system` na nowym systemie.
3. **[Kod] Strona główna i podstrony** w „Formie” — bezpośrednio w serwisie, sekcja po
   sekcji; każdy krok przez `pnpm check`, Lighthouse i axe. Piaskownica po wdrożeniu znika.
4. **[Ty + Kod] Case studies** — szablon `/portfolio/[slug]`, gdy będą teksty.

**Budżet jakości nowego designu** (sprawdzany przy każdym kroku): Lighthouse ≥ 95 na
telefonie, 0 błędów axe, JS strony głównej ≤ obecny + 25 KB br (Motion tylko tam, gdzie
trzeba gestu albo animacji układu), wejścia nad zgięciem w CSS, wideo tylko w kadrze
z plakatem, wszystkie strony nadal statyczne.

## 4. Co od Ciebie

- [ ] Wybór propozycji (pkt 3.1); jeśli potrzeba, 5–10 referencji z jednym konkretnym detalem i 3 antyreferencje.
- [ ] Teksty pod nowy szkielet (szkic: `docs/prywatne/MARKETING.md` §1): cztery kompetencje
      po jednym zdaniu, liczby do pokazania.
- [ ] Materiał: portret i zdjęcia pracy w jednym świetle, zrzuty UI 1×/2×, lista klientów
      ze zgodą na nazwę.
- [ ] Decyzje: krój (rekomendacja: zostaje Geist), akcent kolorystyczny (rekomendacja: żaden),
      przekodowanie wideo (pkt 5, poz. 2).

## 5. Dług wizualny obecnej strony — do rozwiązania razem z „Formą”

| # | Pozycja | Gdzie |
| --- | --- | --- |
| 1 | Zapętlone wideo bez pauzy (hero, kafle) — WCAG 2.2.2, poziom A | `HeroVideo.tsx`, `LazyVideo.tsx` |
| 2 | Klipy 1,4–2,4 Mb/s (cel ~600 kb/s: −2,9 MB na `/`, −10 MB na `/portfolio`), brak lżejszego hero na telefon | `public/*.mp4` |
| 3 | Pięć rozmiarów CTA, surowe `bg-green-500`, różne odstępy sekcji | `home/*`, `StatusBadge.tsx` |
| 4 | Pole wiadomości: inne tło w ciemnym motywie, 14 px → zoom na iOS | `ContactForm.tsx` |
| 5 | Podpisy kafli portfolio tylko po najechaniu (na telefonie nigdy) | `PortfolioCard.tsx` |
| 6 | Zwinięte sekcje akordeonu kompetencji nie istnieją w HTML (−55 słów dla SEO) | `ui/accordion.tsx`, `Skills.tsx` |
| 7 | `/portfolio` bez linku z nagłówka i strony głównej | `navigation.ts`, `home/Portfolio.tsx` |
| 8 | Menu mobilne: 70% ekranu puste, bez e-maila i CTA | `MobileNav*.tsx` |
| 9 | Wpis: wiersz ok. 90 znaków, akapity 16 px obok list 18 px, brak spisu treści na telefonie, podpis zasłania zdjęcie, listy w innym odcieniu szarości | `PostView.tsx`, `prose` |
| 10 | `/uslugi`: brak CTA przy pakiecie i FAQ (VAT, płatności, prawa autorskie) | `ServicesView.tsx` |
| 11 | Glif w logo bywa pustym prostokątem bez czcionek z symbolami i zmienia się co sekundę bez pauzy (WCAG 2.2.2) → własny znak SVG | `Logo*.tsx` |
| 12 | Przyciski-ikony menu mobilnego bez stylu `focus-visible` (reszta nagłówka ma `buttonVariants`) | `MobileNav.tsx`, `MobileNavPanel.tsx` |
| 13 | `<br />` jako odstęp w stopce; `sizes` zdjęć bloga na głównej pobiera za duże pliki przy 1024–1279 px | `Footer.tsx`, `BlogPreview.tsx` |

## 6. Materiał źródłowy

Lokalnie: `docs/prywatne/referencje/design-referencje.md` (20 referencji ze zmierzonymi stylami,
29 mikrointerakcji) i `rzemioslo-ruchu.md` (czasy, krzywe, przepisy). Narzędzia (skille ruchu,
frontend-design, MCP Chrome DevTools i Playwright) są zainstalowane.
