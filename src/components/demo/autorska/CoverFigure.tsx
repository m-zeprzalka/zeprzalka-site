"use client"

import { GlyphFigure, type FigureShape } from "../shared/glyph"
import { useStack } from "./StackProvider"

/**
 * Bryła kompetencji, która żyje tylko na odkrytej karcie. Przyklejona karta pod spodem stoi
 * w oknie, więc silnik liczyłby ją dalej — po przykryciu bryła się odmontowuje, a na jej
 * miejscu zostaje puste pole tej samej wielkości (nic nie skacze).
 */
export function CoverFigure({
  sheet,
  shape,
  label,
  className,
}: {
  sheet: number
  shape: FigureShape
  label: string
  className?: string
}) {
  const { coveredUpTo } = useStack()
  if (sheet <= coveredUpTo) return <div aria-hidden="true" className={className} />
  return <GlyphFigure shape={shape} label={label} spin="auto" className={className} />
}
