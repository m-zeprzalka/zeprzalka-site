# /main-third — alternatywna strona główna (paradygmat: karta katalogowa)

Trzeci wariant strony głównej o **identycznej treści i architekturze**
(Hero → Kompetencje → Portfolio → Blog → Kontakt). Nie dotyka
`src/components/home/*`, `src/app/page.tsx`, `/main-secondary`, layoutu
ani `globals.css`.

Jeśli `/main-secondary` jest „magazynem" (asymetria, serifowy akcent, powietrze),
to `/main-third` jest **kartą katalogową**: widoczna siatka 12 kolumn, linie
włosowe, przyklejone etykiety sekcji w rynnie, dane w monospace i jeden krój
zmienny, w którym akcent robi oś szerokości — nie druga rodzina.

## Struktura

| Plik | Rola |
| --- | --- |
| `fonts.ts` | Archivo (osie `wght` + `wdth`) — jedyny krój display tego wariantu |
| `Frame.tsx` | Rama sekcji: linia włosowa, sticky etykieta w rynnie, siatka 12 kolumn |
| `Rise.tsx` | Wejście przy scrollu **bez JS** (`animation-timeline: view()`), Server Component |
| `Hero.tsx` | Nagłówek w dwóch blokach z maską „kurtyny", pasmo wideo od kolumny 3 |
| `Skills.tsx` | Akordeon `type="multiple"` jako karta katalogowa; narzędzia jako tabela |
| `PortfolioStrip.tsx` | Poziomy pas ze scroll-snap: licznik, pasek postępu, sterowanie |
| `Blog.tsx` | Gęsty indeks wpisów (data / czas czytania / tytuł / lead / kategorie) |
| `Contact.tsx` + `ContactForm.tsx` | Odwrócony blok tokenów, pola z linią zamiast ramki |
| `src/app/main-third/main-third.css` | Typografia, klatki, ruch scroll-driven, paleta odwrócona |

Współdzielone (poza tym folderem): `src/lib/home-content.ts` (treść, metadane
sekcji, JSON-LD), `src/components/media/SmartVideo.tsx`,
`src/hooks/use-reduced-motion.ts`, `public/portfolio/*`.

## Decyzje

- **Ruch bez JavaScriptu.** Wejścia sekcji sterowane są osią przewijania
  (`animation-timeline: view()`), a nie obserwatorem w JS. Klatki startowe
  **nie ukrywają treści** (samo przesunięcie, żadnego `opacity: 0`): oś `view()`
  bywa nieaktywna — przy druku, w zrzucie całej strony, w dokumencie bez
  przewijania — a wtedy animacja zostaje na klatce startowej. Przy przesunięciu
  to różnica niewidoczna, przy wygaszeniu byłaby to pusta strona.
- **Kurtyna nagłówka trwa 0,7 s.** Dopóki wiersz stoi za maską, przeglądarka nie
  liczy go jako namalowanej treści — każda dziesiąta sekundy to gorszy LCP.
- **Jeden krój, dwie osie.** Akcent w H1 i w tytule formularza to ta sama
  rodzina w innym miejscu na osiach (`font-stretch` 78% → 96%, `wght` 500 → 800).
  Jeden plik fontu zamiast dwóch rodzin.
- **Pas realizacji zamiast kafelków.** Materiały mają różne proporcje (16:9, 4:5,
  panorama); przy jednej wysokości różnica szerokości staje się rytmem, zamiast
  dziurą w siatce. Kontener jest fokusowalnym regionem (strzałki klawiatury),
  przyciski dają alternatywę dla gestu, licznik informuje o pozycji, a kółko
  myszy nie jest przechwytywane.
- **Odwrócony blok kontaktu** przełącza zmienne motywu na przeciwne, więc
  komponenty shadcn działają bez nadpisywania kolorów — w obu motywach.
- **Formularz**: zmieniona jest wyłącznie geometria pól (promień, krawędzie,
  wysokość). Kolory, kontrast i pierścień fokusu zostają domyślne z shadcn.
- **SEO**: jeden `h1`, sekcje `aria-labelledby`, `figure/figcaption`,
  `time[datetime]`, JSON-LD WebSite + Person, `canonical → /` (wariant testowy
  nie konkuruje w indeksie ze stroną główną).

## Znane ograniczenia

- `animation-timeline` działa w Chrome/Edge i Safari 26+; w Firefoksie treść
  po prostu nie animuje się przy scrollu (jest od razu na miejscu).
- Miniatury bloga pobierają pełnowymiarowe pliki — to skutek globalnego
  `images.unoptimized: true` (limit planu Vercel Hobby, opisany w docs/ROADMAP.md),
  nie samego wariantu. Są ładowane leniwie, poniżej pierwszego ekranu.
