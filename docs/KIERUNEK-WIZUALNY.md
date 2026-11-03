# Kierunek wizualny: system „Forma” i trzy koncepcje strony głównej

Stan na 3 listopada 2026 (iteracja 3). Zastępuje kierunek „Precyzja” z iteracji 2.
**Wygląd strony głównej zmienia się wyłącznie za Twoją zgodą** — wszystko poniżej żyje
w piaskownicy `/demo` (na produkcji jej nie ma).

Raporty źródłowe (lokalnie, w `.gitignore`), `docs/prywatne/raporty-2026-11/iteracja-3/`:
`design-referencje.md` (20 zweryfikowanych referencji, zmierzone style, 29 mikrointerakcji,
klisze 2026) i `rzemioslo-ruchu.md` (czasy, krzywe, sprężyny, promienie, 12 przepisów,
dostępność i wydajność ruchu).

---

## 1. Co poszło nie tak z „Precyzją” i jak to przełożyłem

„Chirurgiczną i architektoniczną precyzję” zrozumiałem jako **styl** (rysunek techniczny:
linie włosowe, linijki, wymiary, ostre narożniki). Chodziło Ci o **jakość wykonania**:
pixel-perfect, dopracowane co do detalu, w minimalizmie rodem z Vercel i shadcn —
z mikrointerakcjami i komponentami, które robią wrażenie. Przekład na zasady:

| Twoje słowa | Zasada w „Formie” |
| --- | --- |
| minimalizm Vercel / shadcn | płótno `#fafafa` + białe powierzchnie, krawędź jako cień-pierścień 8% czerni, Geist w dwóch tonach (atrament + szarość), dużo powietrza |
| odchodzimy od kanciastego | skala promieni 6 → 32 px rośnie z elementem, zagnieżdżenia koncentryczne (zewnętrzny = wewnętrzny + odstęp), pigułki dla akcji |
| precyzja = perfect pixel | całe piksele w tokenach, `tabular-nums` w liczbach, polska typografia (twarde spacje), zaprojektowane stany hover/focus/active, oba motywy |
| mikrointerakcje, wow | ruch krótki i celowy (UI ≤ 300 ms, krzywa `0.23, 1, 0.32, 1`), jeden zaaranżowany moment na stronę zamiast efektów wszędzie |
| mobile first, niesamowity desktop | projektowane od 390 px; gesty dotykowe tam, gdzie mają sens; desktop wykorzystuje kursor (podgląd, światło, rozkładanie) |
| czerń, biel, szarość | monochrom; jedyny kolor semantyczny to zielona kropka „dostępny”; kolor należy do realizacji (wideo, plakaty) |

## 2. System „Forma”

Wspólny fundament trzech koncepcji — specimen: **`/demo/forma`**. Źródło prawdy:
`src/components/demo/forma/theme.css` (tokeny) i prymitywy obok.

| Warstwa | Wartości |
| --- | --- |
| Kolor (jasny / ciemny) | płótno `oklch(0.985)` / `oklch(0.145)`, powierzchnia `1` / `0.18`, wypełnienie `0.967` / `0.215`, atrament `0.205` / `0.975`, drugi ton `0.44` / `0.77`, trzeci `0.53` / `0.66`, krawędź 8% / 9% |
| Promienie | 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 px + pigułka |
| Cienie | pierścień, karta (pierścień + 2 warstwy miękkie), pop, float; w ciemnym motywie jasny pierścień + światło górnej krawędzi |
| Pismo | Geist: display 40 → 76 px (−0,045 em, interlinia 1,02), H2 30 → 48 px, H3 20 px, lead 18 → 22 px, body 16/26, small 14, micro 12. Geist Mono tylko dla kodu i wartości |
| Ruch | wejście/wyjście `cubic-bezier(0.23,1,0.32,1)`, ruch po ekranie `(0.77,0,0.175,1)`, szuflada `(0.32,0.72,0,1)`, sprężyna bez odbicia jako `linear()`; nacisk `scale(0.97)` w 160 ms |
| Układ | kontener 1200 px, marginesy 16 → 32 px, rytm sekcji 80 → 128 px |
| Prymitywy | Button (3 warianty × 32/40/48 px), Chip + LiveDot + Kbd, CopyButton (morf ikony, stała szerokość), ThemeSwitch (kołowe odsłonięcie View Transitions), Count (Number Flow, „99,28%”), Reveal (wejście słów w CSS, dostępne dla czytników) |

Dostępność i wydajność są wbudowane w system: `prefers-reduced-motion` (stan końcowy bez
ruchu), fokus 2 px atramentu z odstępem, cele dotyku ≥ 44 px, wejścia nad zgięciem w CSS
(nie czekają na JavaScript), wideo tylko w kadrze i z plakatem, Motion tylko tam, gdzie
trzeba gestu albo animacji układu.

## 3. Trzy koncepcje

Wszystkie na tych samych treściach, które serwis już ma (nowe są tylko krótkie etykiety
kontrolek). Różnią się tym, co mówią pierwsze.

| | **Żywy interfejs** — rekomendacja | **Indeks** | **Talia** |
| --- | --- | --- | --- |
| Adres | `/demo/zywy-interfejs` | `/demo/indeks` | `/demo/talia` |
| Mówi | kompetencjami | rzemiosłem | pracą |
| Idea | każda z czterech kompetencji udowadnia się działającym mini-interfejsem | jedna precyzyjna kolumna, każdy wiersz jest interaktywnym obiektem | realizacje jako talia miękkich kart, którą się rozkłada, przesuwa i filtruje |
| Pierwszy ekran | wyśrodkowany nagłówek, który **czernieje pod kursorem** („przekształcam”), rząd liczb | zdanie-bio z chipami otwierającymi fakty, paleta ⌘K | nagłówek nad **wachlarzem 5 kart z wideo** (desktop) / stosem do przesuwania (telefon) |
| Wow | inspektor promieni koncentrycznych, log builda z prawdziwymi liczbami, odpowiedź AI strumieniem, sala z dryfującymi kursorami | karta wideo płynąca za kursorem obok listy realizacji i „wlatująca” w odtwarzacz (View Transition) | karta wyjęta z talii przechodzi w podgląd; filtry tasują karty |
| Telefon | kafle jeden pod drugim, wideo gra w kadrze | lista z rozwijanym wideo, paleta jako szuflada | stos z gestem (prędkość, rzut), pigułka-menu rośnie w panel |
| Mocne strony | czytelna dla klienta spoza branży, najbliższa obecnej strukturze | najwięcej rzemiosła, najlżejsza i najszybsza | najmocniejsze pierwsze wrażenie, gotowy wzór pod case studies |
| Ryzyka | cztery mini-interfejsy do utrzymania, najwięcej JS (ładowane w kadrze) | może być „za cicha” dla klienta szukającego efektu; wymaga świetnego tekstu | stoi na jakości kadrów; łatwo przesadzić z zabawą |

Spis `/demo` jest napisany jak krótka prezentacja: koncepcje z mocnymi stronami i ryzykami,
specimen systemu i archiwum odrzuconych kierunków (Precyzja, warianty z sierpnia).

## 4. Rekomendacja

**„Żywy interfejs” jako szkielet**, z dwoma zapożyczeniami do rozważenia:

1. **sekcja realizacji z „Talii”** na telefonie (stos z gestem to najlepsze doświadczenie
   mobilne z trzech) i przejście karta → podgląd jako wzór pod przyszłe case studies;
2. **paleta ⌘K z „Indeksu”** jako ukryta nagroda dla ludzi z branży.

Dlaczego: Twoja przewaga to połączenie czterech rzeczy (projektowanie, kod, AI, wykłady).
„Żywy interfejs” jako jedyny pokazuje je wszystkie **działaniem** w pierwszych dwóch
ekranach — klient widzi dowód, projektant widzi rzemiosło. „Indeks” jest piękny, ale
zakłada czytelnika, który doceni ciszę. „Talia” sprzedaje kadry, nie kompetencje.

## 5. Jak oglądać i oceniać

- Lokalnie: `pnpm dev` → http://localhost:3000/demo.
- Online: podgląd gałęzi `audyt-2026-11` na Vercelu (projekt `zeprzalka` → Deployments →
  najnowszy Preview → `/demo`; podglądy są za logowaniem Vercel).
- Oceniaj na telefonie i na komputerze, w obu motywach (przełącznik w nagłówku każdej
  koncepcji). Sprawdź: najechanie na szarą część nagłówka i suwaki w kaflu „Projektowanie”
  (Żywy interfejs), najechanie na wiersz realizacji i ⌘K (Indeks), najechanie na wachlarz
  i przesuwanie stosu na telefonie (Talia).

## 6. Plan prac nad UX/UI

| Etap | Co | Kto |
| --- | --- | --- |
| **A. Wybór** | oglądasz trzy koncepcje; dla każdej sekcji „zostaje / zmień / wyrzuć” + wybór szkieletu i zapożyczeń | Ty |
| **B. System w serwisie** | „Forma” jako druga warstwa tokenów w `globals.css`, prymitywy do `src/components/ui/`, katalog `/design-system` na nowym systemie | Kod |
| **C. Podstrony testowe** | `/demo/podstrony/*`: wpis, `/uslugi`, `/o-mnie`, `/portfolio` w „Formie”, na prawdziwych danych | Kod |
| **D. Wdrożenie podstron** | podstrony do serwisu (strażnik pilnuje, że główna się nie zmienia) | Kod |
| **E. Strona główna** | za Twoją zgodą, razem z nowymi tekstami (rola, 4 kompetencje, liczby) | Ty + kod |
| **F. Case studies** | szablon `/portfolio/[slug]` z przejściem karta → case study | Ty + kod |

## 7. Narzędzia i metoda tej iteracji

- Dwa niezależne researche: referencje (ponad 50 stron sfotografowanych w 1440 i 390 px,
  style mierzone `getComputedStyle`, animacje rejestrowane podczas ładowania, najechania
  i przewijania) oraz rzemiosło ruchu (Vercel Web Interface Guidelines, skille Emila
  Kowalskiego, Jakuba Krehela i `frontend-design`, dokumentacja Motion 14, Number Flow,
  View Transitions w React 19.3 / Next 16.4, wsparcie nowego CSS w przeglądarkach).
- Koncepcje „Indeks” i „Talia” zbudowali równolegle dwaj agenci-projektanci w osobnych
  worktree, na wspólnym briefie i systemie; „Żywy interfejs”, system i spis — ja.
  Każda koncepcja przeszła co najmniej trzy rundy zrzutów (390 / 1440, oba motywy,
  stany interakcji) i poprawek.

**Warto dołożyć do pracy z Claude Code** (instalacja po Twojej stronie, raz):

| Narzędzie | Po co | Instalacja |
| --- | --- | --- |
| skill **frontend-design** | proces „plan → krytyka → budowa”, lista klisz | `/plugin install frontend-design@claude-plugins-official` |
| skille Emila Kowalskiego i Jakuba Krehela | rzemiosło ruchu i detalu interfejsu | `npx skills add emilkowalski/skill`, `npx skills add jakubkrehel/skills` |
| **Chrome DevTools MCP** | ślady wydajności, INP, dostępność w prawdziwej przeglądarce | `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` |
| **Playwright MCP** | zrzuty i ścieżki interakcji bez pisania skryptów | `claude mcp add playwright npx @playwright/mcp@latest` |
| **Figma MCP** | tylko jeśli projektujesz w Figmie (sensowne od planu Dev/Full) | `claude plugin install figma@claude-plugins-official` |

## 8. Co od Ciebie (żeby kolejna iteracja była „laserowa”)

- [ ] **Wybór szkieletu** (Żywy interfejs / Indeks / Talia) i zapożyczeń; przy każdej sekcji
      „zostaje / zmień / wyrzuć” + jedno zdanie dlaczego. Zrzut z zaznaczeniem jest wart więcej niż opis.
- [ ] 5–10 referencji z jednym konkretnym detalem każda i 3 antyreferencje.
- [ ] **Teksty** do nowej strony głównej: rola (jedna), cztery kompetencje (po 1 zdaniu),
      liczby, które chcesz pokazać (dziś „ponad 12+ lat” powtarza „ponad”).
- [ ] Materiał własny: portret i zdjęcia pracy w jednym świetle, do 3 case studies w surowcach
      (zrzuty UI 1×/2×, szkice, jedna liczba efektu), lista klientów ze zgodą na nazwę, 3–5 opinii.
- [ ] Decyzje: krój (zostajemy przy Geist — rekomendacja), kolor akcentu (na razie żaden),
      mobilna wersja wideo hero i przekodowanie klipów portfolio (−2,9 MB na `/`, zmienia klatki).

## 9. Dług wizualny obecnej strony (stan po iteracji 3)

| # | Pozycja | Gdzie | Dotyka głównej |
| --- | --- | --- | :-: |
| 1 | Zapętlone wideo bez pauzy (hero, kafle) — WCAG 2.2.2; poza kadrem kafle już się zatrzymują | `HeroVideo.tsx`, `LazyVideo.tsx` | tak |
| 2 | Bitrate klipów 1,4–2,4 Mb/s (cel ~600 kb/s), brak lżejszej wersji hero na telefon | `public/*.mp4` | tak |
| 3 | Pięć rozmiarów CTA, surowe `bg-green-500`, różne odstępy sekcji | `home/*`, `StatusBadge.tsx` | tak |
| 4 | Pole wiadomości ze starymi stylami (inne tło w ciemnym motywie, 14 px → zoom na iOS) — dziś `Textarea` z jawnymi nadpisaniami | `ContactForm.tsx` | tak |
| 5 | Podpisy kafli portfolio tylko po najechaniu | `PortfolioCard.tsx` | tak |
| 6 | Zwinięte sekcje akordeonu kompetencji nie istnieją w HTML (−55 słów dla SEO); naprawa zmienia animację zamykania | `ui/accordion.tsx` | tak |
| 7 | Polski „Title Case” i wiszące spójniki — w koncepcjach rozwiązane (`typo()`), w serwisie to zmiana tekstów | copy | częściowo |
| 8 | Listy we wpisach w innym (niebieskawym) odcieniu szarości niż akapity | `PostView.tsx` (`prose`) | nie |

Rozwiązane w iteracji 3 bez zmiany wyglądu głównej: `transition-all` w hero, `Card`
z wyłączonym wszystkim w kontakcie (teraz nagłówek h3), `div` w przycisku akordeonu,
kafle portfolio z plakatem w HTML i pauzą poza kadrem, pasek postępu w CSS.
