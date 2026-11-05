"use client"

import { cn } from "@/components/demo/forma/cn"
import { useCardState } from "./card-store"
import { useEngineGateStarter } from "./engine-gate"
import { useMedia } from "./hooks"
import { GlyphChooser } from "./GlyphChooser"
import { GlyphPortrait } from "./glyph"

/**
 * Twarz ze znaków na marginesie startu. Gdy karta z chipa zadokuje w jej
 * miejscu, twarz rozsypuje się (rozmycie + wygaszenie, 220 ms), a po zjechaniu
 * z chipa składa z powrotem — jeden obiekt, który staje się tym, co wskazujesz.
 */
export function HeroFace({
  id,
  label,
  chooserLabel,
}: {
  id: string
  label: string
  chooserLabel: string
}) {
  // Twarz jest pierwsza na stronie — tu startuje brama silnika (po wejściu strony).
  useEngineGateStarter()
  const { key, via, anchor } = useCardState()
  const docked = !!key && via !== "tap" && anchor?.dataset.dock === id
  // Na telefonie twarz jest węższa — mniejsza komórka trzyma rysy (właściciel: „mniejsze lepsze”).
  const narrow = useMedia("(max-width: 39.99rem)")

  return (
    <figure
      id={id}
      className="i2-fade-in relative m-0"
      style={{ "--d": "520ms" } as React.CSSProperties}
    >
      <div
        data-docked={docked || undefined}
        className={cn(
          "transition-[opacity,filter,scale] duration-300 ease-[var(--i2-out)]",
          "data-docked:scale-[0.98] data-docked:opacity-0 data-docked:blur-[6px] data-docked:duration-200"
        )}
      >
        <GlyphPortrait
          interactive
          label={label}
          settings={narrow ? { cell: 6 } : undefined}
          className="w-full"
        />
        <GlyphChooser label={chooserLabel} className="mt-4" />
      </div>
    </figure>
  )
}
