import { lowerFirst } from "@/app/main-page/_lib/text"

/**
 * Nagłówek sekcji w jednym wierszu: tytuł i — po pauzie, małą literą — jego
 * rozwinięcie („Kompetencje — umiejętności…”). Jeden wzór dla wszystkich sekcji.
 */
export function SectionHeading({ id, title, lead }: { id: string; title: string; lead: string }) {
  return (
    <h2 id={id} className="text-base font-medium text-pretty">
      {title}
      <span className="font-normal text-muted-foreground">
        {" — "}
        {lowerFirst(lead)}
      </span>
    </h2>
  )
}
