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
  status: "propozycja" | "odrzucony"
  summary: string
}

export const DEMOS: readonly DemoEntry[] = [
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
