# Kierunek wizualny — system „Forma” i trzy koncepcje strony głównej

Stan na 4 listopada 2026. Wszystko poniżej żyje w piaskownicy `/demo`, której nie ma na
produkcji. Oglądanie: `pnpm dev` → http://localhost:3000/demo (telefon i komputer, oba
motywy). Historia odrzuconych kierunków: `docs/DZIENNIK.md`, kod: tag `piaskownica-archiwum-2026-11`.

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

## 2. Trzy koncepcje

| | **Żywy interfejs** — rekomendacja | **Indeks** | **Talia** |
| --- | --- | --- | --- |
| Adres | `/demo/zywy-interfejs` | `/demo/indeks` | `/demo/talia` |
| Idea | każda kompetencja udowadnia się działającym mini-interfejsem | jedna precyzyjna kolumna, każdy wiersz to interaktywny obiekt, paleta ⌘K | realizacje jako talia kart: wachlarz (desktop), stos z gestem (telefon) |
| Mocne strony | czytelna dla klienta spoza branży, najbliższa obecnej strukturze | najwięcej rzemiosła, najlżejsza | najmocniejsze pierwsze wrażenie, wzór pod case studies |
| Ryzyka | cztery mini-interfejsy do utrzymania, najwięcej JS (ładowane w kadrze) | może być „za cicha”, wymaga świetnego tekstu | stoi na jakości kadrów |

**Rekomendacja:** „Żywy interfejs” jako szkielet + stos kart z „Talii” w realizacjach na
telefonie + paleta ⌘K z „Indeksu” jako ukryta nagroda.

## 3. Plan (praca na `main`, bez gałęzi i podglądów)

1. **[Ty] Wybór:** szkielet i zapożyczenia; przy każdej sekcji „zostaje / zmień / wyrzuć”
   + jedno zdanie dlaczego (zrzut z zaznaczeniem jest wart więcej niż opis).
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

- [ ] Wybór (pkt 3.1), 5–10 referencji z jednym konkretnym detalem i 3 antyreferencje.
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

## 6. Narzędzia do pracy z Claude Code (instalacja po Twojej stronie, raz)

| Narzędzie | Po co | Instalacja |
| --- | --- | --- |
| skill **frontend-design** | proces „plan → krytyka → budowa” | `/plugin install frontend-design@claude-plugins-official` |
| skille E. Kowalskiego i J. Krehela | rzemiosło ruchu i detalu | `npx skills add emilkowalski/skill`, `npx skills add jakubkrehel/skills` |
| **Chrome DevTools MCP** | ślady wydajności, INP w prawdziwej przeglądarce | `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` |
| **Playwright MCP** | zrzuty i ścieżki interakcji | `claude mcp add playwright npx @playwright/mcp@latest` |

Materiał źródłowy (lokalnie): `docs/prywatne/referencje/design-referencje.md` (20 referencji
ze zmierzonymi stylami, 29 mikrointerakcji) i `rzemioslo-ruchu.md` (czasy, krzywe, przepisy).
