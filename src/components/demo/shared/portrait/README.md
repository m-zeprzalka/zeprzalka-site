# Portret — materiał dla efektów z glifów

Źródło: zdjęcie właściciela `public/DSC_0031.jpg` (1000×665, poza repozytorium). Żaden plik
tutaj nie ma metadanych aparatu (EXIF sprawdzony).

## Twarz (iteracja 7) — używaj tych plików

Wymóg właściciela (5.11.2026): **sama głowa** — włosy, twarz, uszy, bez szyi i ubrania (kadr jak
miniatura `public/avatar.png`), i **prawdziwe zdjęcie nigdy nie jest widoczne** — tylko znaki.
Obróbka (5.11.2026, skrypty w scratchpadzie `iter7/engine/`): maska osoby z `birefnet-portrait`
(rembg) ∩ obszar głowy z punktów twarzy MediaPipe Face Landmarker (owal twarzy poszerzony o 5 px,
pas nad linią brwi na włosy, ucho z filtrem koloru skóry — kaptur kurtki odpada), miękka linia
cięcia pod brodą (rozmycie 2,2 px). Kadr 3:4 (346×461) wokół głowy.

| Plik | Co zawiera | Do czego |
| --- | --- | --- |
| `../glyph/face-tones.ts` | **dane tonów, nie obraz** (M4): siatka 240 × 320, 4 bity na punkt (0 = poza głową, 1–15 = ton z luminancji po CLAHE + lokalny kontrast rysów + wpieczone krawędzie, szczególnie w strefie oczu, brwi, nosa i ust); base64 w module TS, ładowany leniwie razem z silnikiem | ton glifów (`GlyphPortrait`) — przeglądarka nie pobiera żadnego obrazu twarzy |
| `face-glyphs-dark.webp`, `face-glyphs-light.webp` | statyczna klatka twarzy ze znaków z silnika (alfa = maska, 560×746), osobno dla motywów | warstwa zastępcza przed startem silnika, bez JS i bez WebGL2 (`PortraitFallback`) |

Dane tonów generuje `scripts/pack.py` (scratchpad `iter7/engine/`, po `scripts/tone2.py`).
Oczodoły rozjaśnia silnik tylko w ciemnym motywie (na jasnym ciemne oko to tusz, nie dziura).

Klatki `face-glyphs-*` generuje skrypt `tools/gx-fallback.mjs` (scratchpad) z działającego silnika
(„ogranicz ruch” = klatka bez animacji) — po zmianie domyślnych ustawień glifów warto je odświeżyć.

## Starszy portret (iteracje 5–6) — głowa i ramiona

Kadr 4:5 na głowę i ramiona, skala 404×505. Zostaje dla wcześniejszych koncepcji; **nowe wersje
go nie używają** (pokazuje szyję i kurtkę, a `portrait-color.webp` to prawdziwe zdjęcie).

| Plik | Co zawiera |
| --- | --- |
| `portrait-color.webp` | kolor, tło przezroczyste |
| `portrait-luma.webp` | jasność + CLAHE + podniesione cienie; maska w alfie |
| `portrait-luma-soft.webp` | jak wyżej, wygładzone |
| `portrait-edges.webp` | krawędzie rysów |

Import statyczny w komponencie (plik trafia do paczki tylko tych tras, które go używają):
`import face from "@/components/demo/shared/portrait/face-luma.webp"` → `face.src`,
`face.width`, `face.height`. W canvasie próbkuj alfę jako maskę (tło = brak glifu), nie jako biel.
