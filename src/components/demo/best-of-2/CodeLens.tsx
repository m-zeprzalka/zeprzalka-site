import { GlyphLens } from "../shared/glyph"

/**
 * Pole kodu CTA: nieregularna, morfująca soczewka animowanego kodu ze
 * wspólnego silnika (wnętrze w 100% czarne ze znakami — uwaga do Rentgenu),
 * za kursorem albo palcem; bez interakcji dryfuje. Płótno jest dekoracją,
 * opis dostaje czytnik ekranu.
 */
export function CodeLens({ label, className }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={label} className={className}>
      {/* Pole z oddechem od krawędzi boxu i wtapianym brzegiem — plama nie jest ucinana prostą linią. */}
      <GlyphLens className="b2-lens absolute! inset-x-0 inset-y-(--b2-gap) m-auto max-h-[26rem] max-w-[30rem]" />
    </div>
  )
}
