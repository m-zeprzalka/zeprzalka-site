import { GlyphText } from "@/app/main-page/_components/motion/glyph-text"
import { lowerFirst, noOrphans } from "@/app/main-page/_lib/text"

/**
 * Nagłówek sekcji w jednym wierszu: tytuł (odczytuje się ze znaków przy wejściu
 * w kadr) i — po pauzie, małą literą — jego rozwinięcie („Kompetencje —
 * umiejętności…”). Jeden wzór dla wszystkich sekcji; bez `lead` sam tytuł.
 */
export function SectionHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return (
    <h2 id={id} className="text-base font-medium text-pretty">
      <GlyphText text={noOrphans(title)} />
      {lead && (
        <span className="font-normal text-muted-foreground">
          {" — "}
          {noOrphans(lowerFirst(lead))}
        </span>
      )}
    </h2>
  )
}
