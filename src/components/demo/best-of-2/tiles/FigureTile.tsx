import { GlyphFigure, type FigureShape } from "../../shared/glyph"

/**
 * Scena z bryłą ze znaków (figury z „Glif · laboratorium” — „kompetencje figury
 * super”): kostka dla projektowania produktu, kropla dla komunikacji wizualnej.
 * Bryła powoli się obraca, kursor przechyla ją ku sobie, najechanie rozpędza,
 * klik albo dotknięcie daje impuls. Pod nią krótka podpowiedź interakcji.
 */
export function FigureTile({
  shape,
  label,
  hint,
}: {
  shape: FigureShape
  label: string
  hint: string
}) {
  return (
    // Bryła w kwadracie do 20 rem na środku sceny, nie na całym panelu: płótno silnika ma
    // o ponad połowę mniej pikseli (kopiowanie klatki z WebGL kosztuje proporcjonalnie do pola).
    <div className="relative grid flex-1 place-items-center p-(--b2-inset-ui)">
      <GlyphFigure
        shape={shape}
        label={label}
        className="aspect-square! w-[min(100%,20rem)] max-w-full"
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute start-(--b2-inset-ui) bottom-(--b2-inset-ui) text-fm-micro text-fm-ink-3"
      >
        {hint}
      </p>
    </div>
  )
}
