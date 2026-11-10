"use client"

import { PeekCard } from "@/app/main-page/_components/peek/peek-card"
import { usePeekActions } from "@/app/main-page/_components/peek/peek-context"

/**
 * Karta w ramie toru (jak w `PeekStage`): obrys, tło popover, cień lg, promień 2xl. Karty
 * i nazwę krzyżyka daje `PeekProvider` tej strony. Wyspa kliencka — `close.onClose` to funkcja,
 * a funkcja nie przejdzie z serwera do klienta.
 */
export function PeekCardExample() {
  const { peeks, closeLabel } = usePeekActions()
  const cards = [peeks.systems, peeks.experience].filter((peek) => peek !== undefined)

  return (
    <div className="grid w-full items-start gap-4 sm:grid-cols-2">
      {cards.map((peek) => (
        <div
          key={peek.title}
          className="overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg"
        >
          {/* Krzyżyk: na kadrze `media`, bez kadru `ghost` obok tytułu. Tu karta stoi na stałe. */}
          <PeekCard peek={peek} play={false} close={{ onClose: () => {}, label: closeLabel }} />
        </div>
      ))}
    </div>
  )
}
