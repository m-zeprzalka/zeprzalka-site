# Portret — materiał dla efektów z glifów

Źródło: zdjęcie właściciela `public/DSC_0031.jpg` (1000×665, poza repozytorium). Obróbka
(4.11.2026, skrypt w scratchpadzie): wycięcie tła modelem `birefnet-portrait` (rembg), kadr
4:5 na głowę i ramiona, skala 404×505.

| Plik | Co zawiera | Do czego |
| --- | --- | --- |
| `portrait-color.webp` | kolor, tło przezroczyste | prawdziwy portret, odkrywanie spod glifów |
| `portrait-luma.webp` | jasność (L z Lab) + CLAHE + podniesione cienie i lekkie wyostrzenie; maska w alfie | mapowanie tonów na glify — oczy i oczodoły nie zapadają się w czerń |
| `portrait-luma-soft.webp` | jak wyżej, wygładzone filtrem bilateralnym (gładka skóra, ostre rysy) | gęste pola glifów, małe siatki na telefonie |
| `portrait-edges.webp` | krawędzie rysów (Canny) na przezroczystym | warianty konturowe, „rysunek kodem” |

Import statyczny w komponencie (plik trafia do paczki tylko tych tras, które go używają):
`import portrait from "@/components/demo/shared/portrait/portrait-luma-soft.webp"` →
`portrait.src`, `portrait.width`, `portrait.height`. W canvasie próbkuj alfę jako maskę
(tło = brak glifu), nie jako biel.
