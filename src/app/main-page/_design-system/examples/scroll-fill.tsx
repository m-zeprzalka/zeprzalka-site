import { countSegments, Segments } from "@/app/main-page/_components/peek/segments"

/** Spacje między frazą a tekstem stoją w segmentach tekstu — fraza to jeden element `--i`. */
const TEXT = [
  { text: "Kolor idzie słowo po słowie, gdy akapit przejeżdża przez okno, a " },
  { text: "fraza z kartą", peek: "systems" },
  { text: " razem z nim." },
]

export function ScrollFillExample() {
  return (
    <p
      style={{ "--n": countSegments(TEXT) }}
      className="scroll-fill text-2xl leading-snug font-medium tracking-tight"
    >
      <Segments segments={TEXT} split="inline" />
    </p>
  )
}
