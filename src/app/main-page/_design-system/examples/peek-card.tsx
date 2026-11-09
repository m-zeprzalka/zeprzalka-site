import { PeekCard } from "@/app/main-page/_components/peek/peek-card"
import { getHomeContent } from "@/app/main-page/_lib/content/home"

/** Karta w ramie toru (jak w `PeekStage`): obrys, tło popover, cień lg, promień 2xl. */
export function PeekCardExample() {
  const { peeks } = getHomeContent("pl")
  const cards = [peeks.systems, peeks.experience].filter((peek) => peek !== undefined)

  return (
    <div className="grid w-full items-start gap-4 sm:grid-cols-2">
      {cards.map((peek) => (
        <div
          key={peek.title}
          className="overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg"
        >
          <PeekCard peek={peek} play={false} />
        </div>
      ))}
    </div>
  )
}
