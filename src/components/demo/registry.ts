import type { Metadata } from "next"

/**
 * Piaskownica kreatywna — rejestr dem dostępnych pod `/demo`.
 *
 * Zasady (pełny opis: `src/components/demo/README.md`):
 * - serwis nigdy nie importuje niczego z `src/components/demo/**`
 *   ani z `src/app/demo/**` — zależność biegnie tylko w jedną stronę;
 * - build produkcyjny nie widzi tras piaskownicy — pliki `*.demo.tsx` są
 *   trasami tylko poza produkcją (`pageExtensions` w `next.config.ts`);
 * - zawsze `noindex`, poza mapą strony, bez analityki.
 */

export interface DemoEntry {
  slug: string
  title: string
  date: string
  status: "rekomendacja" | "propozycja" | "odrzucony"
  summary: string
}

export const DEMOS: readonly DemoEntry[] = [
  {
    slug: "zywy-interfejs",
    title: "Forma · Żywy interfejs",
    date: "2026-11-03",
    status: "rekomendacja",
    summary:
      "Miękki minimalizm Vercel/shadcn. Każda kompetencja udowadnia się działającym mini-interfejsem: inspektor projektu, log builda, odpowiedź AI strumieniem, sala wykładowa.",
  },
  {
    slug: "indeks",
    title: "Forma · Indeks",
    date: "2026-11-03",
    status: "propozycja",
    summary:
      "Jedna precyzyjna kolumna w stylu designerów-inżynierów. Lista realizacji z kartą wideo płynącą za kursorem, chipy w tekście, paleta ⌘K.",
  },
  {
    slug: "talia",
    title: "Forma · Talia",
    date: "2026-11-03",
    status: "propozycja",
    summary:
      "Najpierw praca: realizacje jako talia miękkich kart z wideo — wachlarz na desktopie, stos do przesuwania palcem na telefonie, filtry tasujące karty.",
  },
  {
    slug: "forma",
    title: "Forma · specimen systemu",
    date: "2026-11-03",
    status: "propozycja",
    summary:
      "Wspólny fundament trzech koncepcji: kolory w obu motywach, pismo, promienie, cienie i prymitywy (pigułki, chipy, kopiowanie, przełącznik motywu, liczby).",
  },
  {
    slug: "precyzja",
    title: "Precyzja — kierunek z 3 listopada 2026",
    date: "2026-11-03",
    status: "odrzucony",
    summary:
      "Monochrom, linia włosowa, Geist + Geist Mono. Nagłówek jako zaznaczony obiekt z wymiarami na żywo, tryb „Wymiary”, cztery kompetencje z interaktywnymi próbkami.",
  },
  {
    slug: "precyzja/system",
    title: "Precyzja — specimen systemu",
    date: "2026-11-03",
    status: "odrzucony",
    summary:
      "Tokeny i prymitywy nowego języka na jednej stronie: kolor w obu motywach, skala pisma, odstępy, siatka, ruch, przyciski i pola.",
  },
  {
    slug: "main-secondary",
    title: "Wariant A — Bricolage Grotesque + Instrument Serif",
    date: "2026-08-25",
    status: "odrzucony",
    summary:
      "Display-grotesk z kursywą szeryfową jako akcentem, schodkowe wejście słów, szyna nawigacji sekcji.",
  },
  {
    slug: "main-third",
    title: "Wariant B — Archivo, siatka 12 kolumn",
    date: "2026-08-25",
    status: "odrzucony",
    summary:
      "Widoczna siatka konstrukcyjna, ramy, ruch na animation-timeline: view(), pasek realizacji.",
  },
  {
    slug: "main-fourth",
    title: "Wariant C — Fraunces, papier i tusz",
    date: "2026-08-25",
    status: "odrzucony",
    summary:
      "Ciepła paleta papier/tusz, ziarno SVG, magnetyczne przyciski, polskie spacje nierozdzielające.",
  },
]

export function demoMetadata(slug: string): Metadata {
  const demo = DEMOS.find((entry) => entry.slug === slug)
  return {
    title: demo ? demo.title : slug,
    description: demo?.summary,
  }
}
