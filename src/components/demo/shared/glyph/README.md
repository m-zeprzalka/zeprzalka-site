# Wspólny silnik glifów (`gx`)

Jeden, docelowy silnik efektów ze znaków dla wersji z iteracji 7 (Indeks · I, Indeks · II,
The Best Of · II i wersji bonusowej) — ten sam, który pójdzie do produkcji. Przeniesiony
z „Glif · laboratorium” (`glif-lab/engine`, `glif-lab/sections`), odpięty od laboratorium,
z wyborem właściciela wpisanym w wartości domyślne.

**Stan: M4 gotowy (5.11.2026)** — API z M1 bez zmian (tylko rozszerzenia, niżej „Zmiany M2–M4”),
efekty dostrojone po porównaniu z „Glif · laboratorium” obok siebie. Nazwy eksportów są stałe.

```tsx
import {
  GlyphPortrait, PortraitPlayground, GlyphMedia, GlyphText, GlyphNumber,
  GlyphWordmark, GlyphLens, GlyphFigure, GlyphMark, useThemeTransition,
  setGlyphsPaused, useGlyphsPaused, GLYPH_DEFAULTS, type GlyphSettings,
  glyphFontVariables, FONT_FAMILIES, LOGO_GLYPHS, TEXT_GLYPHS, deferGlyphEngine,
} from "@/components/demo/shared/glyph"
```

Wszystko to komponenty klienckie (wyspy) — wołaj je z komponentów serwerowych z gotowymi
danymi. Każdy nakłada na swój korzeń zmienne krojów (`glyphFontVariables`) — nic nie trzeba
dodawać w układzie strony.

## Ustawienia (`settings.ts`) — tu się stroi wygląd

| Pole | Domyślnie | Możliwe | Uwagi właściciela |
| --- | --- | --- | --- |
| `charset` | `"sygnet"` | `sygnet`, `ascii`, `binary`, `braille`, `blocks`, `dots` | „ASCII ze starego sygnetu” = znaki obecnego logo; bez katakany/Matrixa |
| `mode` | `"flow"` | `flow` (przepływ), `wave` (fala), `scramble` (szum), `rain` (deszcz), `dissolve` (rozpad) | skaner odpadł |
| `fps` | `12` | `6`, `8`, `12`, `24` | 60 odpadło |
| `cell` | `8` | `6`, `8`, `10` (px CSS; wysokość ×1,6) | 14 px za duże |
| `render` | `"tone"` | `tone`, `contour` | tonalny najlepszy |
| `decode` | `1100` | ms (min. ~700) | tekst nie może być za szybki |
| `tone`, `cursor` | `"ink"`, `"noise"` | jedyne | atrament; kursor = szum w nieregularnym, morfującym obszarze |

Każdy komponent przyjmuje `settings?: Partial<GlyphSettings>` (nadpisuje tylko podane pola).
Komponenty mają własne domyślne tryby: media i tekst — `wave`, media i bryły — zestaw `dots`
(pochwalony wydruk z The Best Of; spokojniej niż znaki logo), napis w stopce — `dissolve`,
soczewka — `rain` + `binary`.
Gotowe zestawienia: `PRESETS` (Sygnet, ASCII, Binarny, Braille, Spokój).

## Komponenty

### `<GlyphPortrait className? settings? interactive? label? />`
Twarz (sama głowa: włosy, twarz, uszy — bez szyi i ubrania) z glifów, tonalna. Domyślna
proporcja 346 : 461 (≈ 3 : 4, `aspect-[346/461]`) — zmień klasą, obraz zawsze `contain`.
W spoczynku oddycha (`flow`/`rain`) albo co ~6 s przechodzi przez nią przebieg animacji.
Mysz: nieregularny, morfujący obszar szumu (głowa + ogon, który wyciąga kształt w ruchu);
dotyk: obszar idzie za palcem, dotknięcie puszcza falę, która tylko miesza znaki (bez dziur
i czarnych pól). Przed startem silnika, bez JS i bez WebGL2 — statyczna klatka ze znaków
w identycznym kadrze (`face-glyphs-*.webp`, maska w kolorze tekstu). **Zdjęcie nigdy nie
trafia do przeglądarki** — ton twarzy to dane (`face-tones.ts`: siatka 240 × 320, 4 bity na
punkt, rysy wpieczone), ładowane leniwie razem z silnikiem; żaden plik graficzny twarzy poza
klatkami ze znaków nie jest pobierany.

```tsx
<GlyphPortrait className="w-full max-w-sm" />
<GlyphPortrait settings={{ charset: "ascii", mode: "wave", fps: 8 }} className="aspect-square" />
```

### `<PortraitPlayground className? portraitClassName? label? defaults? controls? />`
Twarz + panel „pobaw się”: trzy rzędy obłych pigułek (Znaki, Animacja, Tempo) — natywne radia
(Tab między grupami, strzałki w grupie). `controls={["charset", "mode"]}` ogranicza rzędy.

### `<GlyphMedia poster src? webm? width height alt? sizes? trigger? decoded? skeleton? loading? preload? settings? controls? className? />`
Obraz albo wideo, które zaczyna jako szkielet ze znaków (białe i szare kropki/koła na czerni)
i wyłania się falą od kursora. Szkielet widać od pierwszego malowania (siatka kropek z CSS,
potem wydruk) — **żadnych pustych prostokątów**. Wideo dostaje `src` dopiero przy odkodowaniu
(oszczędność transferu), gra najwyżej jedno naraz — przy myszy wyłącznie najechane (z zamiarem:
~120 ms; samo przewijanie pod nieruchomym kursorem nic nie uruchamia), na dotyku najbliższe środka
ekranu — poza kadrem stoi. `src` — MP4, `webm` — ten sam klip w WebM (wybierany, gdy przeglądarka go odtworzy).
`trigger`: `hover` (domyślny; na dotyku — raz po wejściu w kadr), `view` (raz po wejściu w kadr:
połowa kadru albo — dla kadrów wyższych niż okno — 40% wysokości okna; nad zgięciem rusza od
razu), `manual` (steruje `decoded`). Rozmiar płótna liczony z `offsetWidth` — opakowanie może
się skalować transformem (wejście z mniejszego kadru) bez przeliczania siatki. Host najechania: najbliższy przodek z `data-gx-host`
(cała karta), inaczej sam kadr. `skeleton`: `dark` (domyślny, w obu motywach — jak klatka
wideo) albo `theme`. Media nad zgięciem: `loading="eager"` (i ewentualnie `preload`).
`controls={{ pause, play }}` — przycisk pauzy (WCAG 2.2.2). Bez JS — zwykły obraz.

```tsx
<a href={url} data-gx-host="" className="block rounded-3xl">
  <GlyphMedia poster={work.poster} src={work.video} width={720} height={850}
    sizes="(min-width: 1024px) 360px, 90vw" className="rounded-3xl"
    controls={{ pause: "Zatrzymaj wideo", play: "Odtwórz wideo" }} />
</a>
```

### `<GlyphText text as? trigger? duration? delay? host? id? className? settings? />`
Napis dekodowany ze znaków (DOM). Tekst docelowy w HTML z serwera, czytnik ekranu dostaje
zdanie raz, szerokość nie drga. `trigger`: `view` (raz po wejściu w kadr, potem najechanie
puszcza krótki przebieg), `mount` (od razu — tekst nad zgięciem), `hover` (zawsze czytelny,
przebieg przy najechaniu/fokusie/dotknięciu). `duration` — mnożnik czasu, `delay` — ms.

```tsx
<GlyphText as="h2" text="O mnie" className="text-fm-h2 font-semibold" />
```

### `<GlyphNumber value suffix? since? sinceLabel? as? trigger? duration? delay? className? settings? />`
Liczba składana ze znaków („dekonstrukcja” czterech liczb). Cyfry tabelaryczne. `since`
— rok początku czegoś, co trwa („od 2016”; fakt z `shared/content.ts` ma `since: true`).

```tsx
{about.facts.map((fact) => (
  <GlyphNumber key={fact.label} value={fact.value}
    suffix={"suffix" in fact ? fact.suffix : undefined} since={"since" in fact}
    className="text-fm-h2 font-semibold" />
))}
```

### `<GlyphWordmark text className? style? settings? />`
Wielki napis (np. „Zeprzałka” na 100vw) ze znaków. Wchodzi raz przy wejściu w kadr: składa się
z rozsypanych glifów i rozmycia 14 → 0 px w 1,5 s (przewijanie tylko uruchamia). Mysz i palec
rozsypują znaki pod sobą, dotknięcie puszcza falę. Bez JS — zwykły napis w tym samym kroju.
Proporcja: 4,6 : 1 (zmień klasą). Krój napisu dziedziczy po rodzicu. Pole trafienia i rozmycie
są wyłącznie w pudełku komponentu (`overflow-hidden`) — nie zasłania linków nad sobą; marginesy
od krawędzi ekranu daj opakowaniu albo `className` (np. `mx-(--i1-m) w-auto`).

### `<GlyphLens className? settings?>{children}</GlyphLens>`
Obszar CTA: organiczna plama animowanego kodu binarnego (metaballe: głowa za kursorem, ogon,
który wyciąga ją w kierunku ruchu, i trzy satelity, które stale zmieniają płaty; brzeg faluje
szumem po kącie) — gładki, wygładzony brzeg liczony na pikselach, wnętrze w 100% czarne,
poza plamą pusto (tło sekcji zostaje). Promień zależy od rozmiaru strefy, a środek plamy jest
trzymany w strefie z marginesem — plama mieści się w całości także w niskim oknie (350 × 192).
Na dotyku idzie za palcem, po puszczeniu powoli odpływa;
bez wskaźnika dryfuje po ósemce (≈30 kl./s — lżej dla słabej grafiki). `children` leżą nad płótnem — tekst
nad plamą: daj mu własne tło albo `mix-blend-difference text-white` (działa w obu motywach).
Domyślnie znaki binarne w deszczu („Matrix” bez katakany); inny zestaw: `settings={{ charset: "sygnet" }}`.

### `<GlyphFigure shape label spin? className? settings? />`
Bryły kompetencji (`cube`, `torus`, `drop`, `octahedron`) ze znaków (domyślnie kropki i koła). `spin="auto"` — powolny obrót, najechanie
rozpędza, kursor przechyla, klik daje impuls; `spin="scroll"` — obrót z przewijania (towarzysz
w rogu; każde położenie to stan kompletny). Host najechania: `[data-gx-host]` albo sam kadr.

### `<GlyphMark className? />`
Sygnet logo jak `src/components/layout/LogoGlyph.tsx`: pełny zestaw znaków obecnego logo (165),
co sekundę, start stały (`⨝` — jak w serwisie, zgodna hydracja). Własny podzbiór kroju i stałe pudełko 1,2 em — bez „tofu” i bez
skoku wysokości wiersza. Najechanie na link (najbliższy `a` / `[data-gx-host]`) — krótki szum.

```tsx
<Link href="/" className="flex items-center gap-2 text-xl"><GlyphMark />zeprzalka.com</Link>
```

### `useThemeTransition(style?: "tiles" | "simple", options?: { from?: "field" | "origin" })` → `(next, origin?) => void`
Zmiana motywu (`next-themes`). `tiles` (domyślny): View Transitions robi zdjęcie starej strony,
które znika kaflami. Domyślnie (`from: "field"`) — rozpad po całym ekranie sterowany polem
szumu: miękki, nieregularny front schodzi ukośnie od góry, **niezależnie od przycisku** (nie
„koło z przycisku” i nie twarda linia skanera). `from: "origin"` — fala od `origin` (środek
przycisku) o organicznym brzegu. W obu: wąskie pasmo poszarpanych kafli
(≈ 2 komórki glifów), w którym świeżo odsłonięty kafel przez chwilę niesie glif z logo w kolorze
atramentu; za frontem pełny nowy motyw, przed nim pełny stary — 600 ms. `simple`: przenikanie 220 ms. Bez View Transitions i przy
„ogranicz ruch” — natychmiast.

```tsx
const toggle = useThemeTransition()
<button onClick={(e) => { const r = e.currentTarget.getBoundingClientRect()
  toggle(resolvedTheme === "dark" ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 }) }} />
```

### Pauza — `setGlyphsPaused(boolean)`, `useGlyphsPaused()`
Wspólna pauza ruchu ciągłego (WCAG 2.2.2) — podepnij pod własny przycisk.

## Jak to działa

- **Jeden kontekst WebGL2** na stronę (`engine/engine.ts`, ogl): każda powierzchnia to zwykły
  `<canvas>` 2D w przepływie strony, klatkę liczy wspólny kontekst i kopiuje `drawImage`. Jedna
  pętla rysuje tylko widoczne powierzchnie, które czegoś chcą, i zasypia, gdy wszystko stoi.
  Pauza poza kadrem i przy ukrytej karcie, DPR ≤ 2 (≤ 1,5 na dotyku), sprzątanie przy odmontowaniu.
- **Leniwe ładowanie i start w krokach**: rdzeń (ogl + shadery + atlasy) to osobny fragment JS
  (`engine/load.ts`), pobierany najwcześniej 1,2 s po wejściu (za animacją wejścia; zmiana:
  `deferGlyphEngine(ms)` przed pierwszym użyciem), potem w bezczynności. GPU rozgrzewa się
  krokami (kontekst, każdy z trzech programów osobno, pierwszy rysunek każdego), powierzchnie
  powstają po jednej na krok bezczynności, a pętla rysuje najwyżej jedną pierwszą klatkę na
  klatkę ekranu. Powierzchnie powstają dopiero, gdy kadr zbliża się do ekranu (900 px), i są
  niszczone daleko poza nim (2600 px; media zostają — pamiętają odkodowanie).
- **Klatki tylko przy zmianie**: krok animacji, ruch kursora, nowa klatka wideo w trakcie
  odkodowania; „płynne” najwyżej ~30/s; odkodowany kafel śpi i pokazuje sam `<video>`/plakat.
  Kopia na płótno powierzchni — `drawImage` (decyzja M4 w „Zmiany M4”).
- Trzy przebiegi shaderów (`engine/shaders.ts`): ton źródła → wybór glifu na komórkę → glify
  z atlasu. Atlas mierzy pokrycie tuszem na pikselach ekranu i układa rampę (`engine/atlas.ts`).
- Kroje: `fonts/` (podzbiory DejaVu i STIX Two Math, licencje w `fonts/LICENSE.md`).
  `glyphFontVariables` — klasa ze zmiennymi krojów (`--gx-font-mono`, `--gx-font-symbols`,
  `--gx-font-math`, `--gx-font-braille`) dla własnych napisów ze znaków; `FONT_FAMILIES` — rodziny
  dla canvasu.
- Gęstość pikseli: DPR ≤ 2; na dotyku i na słabszych komputerach (≤ 4 wątki) ≤ 1,5.
- „Ogranicz ruch”: statyczne klatki, tekst bez dekodowania, motyw bez przejścia.
- **JS (build produkcyjny, gzip)**: warstwa komponentów w paczce strony ≈ 12 KB (wszystkie
  komponenty naraz), rdzeń ładowany leniwie ≈ 15 KB.

## Zmiany M2 (5.11.2026)

Nic nie zostało usunięte ani przemianowane — tylko rozszerzenia i strojenie.

- **Portret:** nowy materiał twarzy (lokalny kontrast rysów, lekka domieszka krawędzi w strefie
  oczu, brwi, nosa i ust; bez wypalonego rozjaśnienia oczodołów) i osobne strojenie motywów —
  na jasnym skóra rysuje średnie glify w lekkim kryciu (nie jest pustą maską), włosy nie są
  czarnym blokiem; na ciemnym oczodoły jaśnieją w shaderze. Braille i bloki drobniej (6 px).
  Szum kursora wyraźniejszy (każda komórka w plamie miga, glify jaśnieją ku środkowi). Klatki
  zastępcze `face-glyphs-*` wygenerowane ponownie.
- **Rampa „sygnet”:** tylko formy geometryczne (koła, kwadraty, romby, ⎈, ⌘, ⊞, ⊛, ⍟, ◈…),
  bez znaków czytających się jak litery. **Pełny zestaw logo** (165 znaków, z „⨝”) dzięki
  nowemu krojowi `gx-math` (STIX Two Math, OFL) — `LOGO_GLYPHS`, `GlyphMark`.
- **Przejście motywu:** czysty front fali (bez rozsianych „dziur”), kafle ≈ 2 komórki, 600 ms.
- **Soczewka CTA:** gładka, organiczna plama z metaballi (zmienia płaty, wyciąga się w ruchu),
  domyślnie kod binarny; po puszczeniu palca powoli odpływa; dryf ≈30 kl./s.
- **Figury:** czwarty kształt `octahedron`; domyślny zestaw `dots`.
- **Napis w stopce:** litery pod kursorem zostają czytelne, wokół „parują” pojedyncze znaki;
  nowy prop `style`; pole trafienia i rozmycie przycięte do pudełka.
- **Media:** nowy prop `webm`; `trigger="view"` działa też dla kadrów wyższych niż okno;
  rozmiar z `offsetWidth` (transform na opakowaniu nie psuje siatki), położenie kursora
  przeliczane przez skalę (`localPoint`).
- **Eksporty:** `glyphFontVariables`, `FONT_FAMILIES`, `LOGO_GLYPHS`, `TEXT_GLYPHS`.
- **Wydajność:** DPR ≤ 1,5 na słabszych komputerach; soczewka w dryfie co drugą klatkę.
  Pomiar (portret + soczewka + 3 media naraz, kursor w ruchu, CPU ×4, Chromium z grafiką
  programową): bez długich zadań; wątek główny ≈ 12% czasu (skrypt ≈ 120 ms/s).

## Zmiany M3 (5.11.2026)

API bez zmian.

- **Przejście motywu:** front fali nie jest już kołem od przycisku (właściciel: „koło z przycisku”
  jest wtórne). Promień w każdym kaflu przesuwa szum przestrzenny niskiej częstotliwości (płaty
  ~8 kafli, płynące w czasie, losowe ziarno przy każdym przełączeniu): ±1,8 kafla przy przycisku,
  rosnąco z promieniem do ±11% promienia — same ±2 kafle na pełnym ekranie wciąż czytały się jak
  koło. Czysty front, kafle i glify bez zmian; czas 600 ms.
- **Soczewka CTA w niskiej strefie** (prośba Indeksu · II): promień liczony z krótszego boku strefy
  (min. `min(84, 0,4 · bok)`, maks. `min(190, 0,32 · bok)`, zawsze ≤ tyle, by plama z płatami —
  zasięg ≈ 1,32 × promień — zmieściła się w strefie); rozkwit przy dotyku ograniczony do granicy
  strefy (średnica ≤ krótszy bok); cel kursora, palca i dryfu trzymany w strefie pomniejszonej
  o zasięg plamy. Sprawdzone na 350 × 192 (telefon) i 1200 × 480 (desktop).

## Zmiany M4 (5.11.2026)

API bez zmian; nowe: `deferGlyphEngine(ms)`, opcja `useThemeTransition(style, { from })`,
typ `ThemeTransitionOptions`.

- **Twarz bez obrazu:** usunięte `face-luma.webp`, `face-luma-soft.webp`, `face-edges.webp`
  (de facto zdjęcie w skali szarości do otwarcia w karcie). Ton twarzy to moduł danych
  `face-tones.ts` (siatka 240 × 320, 15 poziomów + „poza głową”, 4 bity na punkt, rysy
  wpieczone; ≈20 KB gzip, ładowany leniwie). Jedyne pobierane pliki twarzy to klatki ze znaków
  (`face-glyphs-*`). Na jasnym motywie mocniejsze półtony skóry.
- **Wideo w kaflach:** przy myszy gra wyłącznie najechany kafel (z zamiarem: ~120 ms spokoju;
  kafel, który wjechał pod nieruchomy kursor w trakcie przewijania, czeka na prawdziwy ruch
  myszy) — przy każdym wyzwalaczu (`view` też), przy `hover` także odkodowanie; na dotyku
  bez zmian (najbliższy środka). Samo
  przewijanie kółkiem nie pobiera klipów. Bez silnika wideo też gra (kafel staje do „wyborów”).
- **Start:** silnik najwcześniej po 1,2 s i w bezczynności, GPU i powierzchnie w krokach
  (wyżej „Jak to działa”); wspólne płótno bez czyszczenia całości i bez realokacji co klatkę.
- **Przejście motywu:** domyślnie pole szumu (ukośnie od góry, niezależnie od przycisku);
  fala od przycisku jako `from: "origin"`.
- **Wydajność rysowania:** klatki tylko przy zmianie (nad nieruchomym kursorem plama żyje
  w tempie glifów), klatki „płynne” najwyżej ~30/s, odkodowany kafel śpi (bez próbkowania
  wideo), powierzchnie powstają przy zbliżeniu do ekranu i są niszczone daleko poza nim.
  **Sprawdzone i odrzucone:** `OffscreenCanvas` + `transferToImageBitmap` → `bitmaprenderer`
  — bitmapa musi mieć dokładnie W × H, więc przy kilku powierzchniach różnych rozmiarów wspólny
  bufor realokuje się przy każdej klatce (pomiar na Best Of · II: render 3,2 s zamiast 0,34 s);
  jedno pełnoekranowe płótno z `scissor` odpada przez warstwy DOM (treść nad i pod glifami,
  zaokrąglenia, przesunięcie przy przewijaniu). Zostaje `drawImage` (na akcelerowanym 2D to
  kopia GPU → GPU).
