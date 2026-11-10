/**
 * Klasy pozycji torów siatki — wspólne dla menu (`RailNav`), spisu rozdziałów
 * (`TableOfContents`) i ich obrazu w design systemie. Zwykły moduł, nie `"use client"`:
 * stałe z modułu klienckiego przychodzą do komponentu serwerowego jako referencje, nie napisy.
 */

/**
 * Pozycja menu w torze: wiersz 32 px (`h-8`), tekst przycięty do szerokości toru, pełna
 * nazwa w `title`. Bieżąca (`aria-current`) w kolorze tekstu.
 */
export const RAIL_LINK =
  "relative block h-8 truncate rounded-full ps-4 pe-2 text-sm leading-8 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring aria-[current]:text-foreground"

/** Kropka bieżącej pozycji menu (`aria-current`) — w wierszu, na wysokości środka tekstu. */
export const RAIL_DOT =
  "before:absolute before:top-[calc(1rem-2.5px)] before:left-0 before:size-1.25 before:rounded-full before:bg-foreground before:opacity-0 before:transition-opacity aria-[current]:before:opacity-100"

/**
 * Pozycja spisu rozdziałów: pełny tytuł, łamany w szerokości toru (bez przycinania).
 * Kropka bieżącego rozdziału stoi na środku pierwszego wiersza (`py-1.5` + `leading-5` / 2 = 1rem).
 */
export const TOC_LINK =
  "block rounded-lg py-1.5 ps-4 pe-2 text-sm leading-5 text-pretty text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring aria-[current]:text-foreground"

/**
 * Tor schowany (nad stopką, za treścią wpisu): gaśnie w rozmyciu i odsuwa się ku krawędzi okna
 * (kierunek dokłada tor: `-translate-x-2` po lewej, `translate-x-2` po prawej). Fokus
 * z klawiatury przywraca go w całości.
 */
export const TRACK_HIDDEN =
  "pointer-events-none opacity-0 blur-sm focus-within:pointer-events-auto focus-within:translate-x-0 focus-within:opacity-100 focus-within:blur-none"
