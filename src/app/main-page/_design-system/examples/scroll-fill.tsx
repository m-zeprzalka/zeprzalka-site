import type { CSSProperties } from "react"
import { countSegments, Segments } from "@/app/main-page/_components/peek/segments"

const TEXT = [{ text: "Fala koloru idzie słowo po słowie, gdy akapit przejeżdża przez okno." }]

export function ScrollFillExample() {
  return (
    <p
      style={{ "--n": countSegments(TEXT) } as CSSProperties}
      className="scroll-fill text-2xl leading-snug font-medium tracking-tight"
    >
      <Segments segments={TEXT} split="inline" />
    </p>
  )
}
