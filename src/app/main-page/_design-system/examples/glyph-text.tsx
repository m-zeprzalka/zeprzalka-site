import { GlyphText } from "@/app/main-page/_components/motion/glyph-text"

export function GlyphTextExample() {
  return (
    <>
      {/* decode — napis pod zgięciem czeka jako znaki i odczytuje się po wejściu w kadr. */}
      <p className="text-3xl font-medium tabular-nums">
        <GlyphText text="99,28%" />
      </p>
      {/* wave — fala znaków przy najechaniu na najbliższy link albo przycisk. */}
      <a href="#ruch" className="text-lg font-medium">
        <GlyphText text="zeprzalka.com" mode="wave" />
      </a>
    </>
  )
}
