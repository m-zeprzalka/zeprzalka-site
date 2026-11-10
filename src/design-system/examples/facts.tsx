import { GlyphText } from "@/components/motion/glyph-text"
import { PeekTrigger } from "@/components/peek/peek-trigger"
import { getHomeContent } from "@/lib/content/home"

/** Liczby „O mnie” (`about.tsx`): wartość odczytuje się ze znaków, podpis otwiera kartę. */
export function FactsExample() {
  const { about } = getHomeContent("pl")

  return (
    // Na telefonie jedna pod drugą, od 640 px cztery w rzędzie.
    <dl className="grid w-full gap-x-6 gap-y-8 sm:grid-cols-4">
      {about.facts.map((fact) => (
        <div key={fact.id} className="grid content-start gap-2">
          <dt className="order-2 text-sm text-muted-foreground">
            <PeekTrigger id={fact.peek} variant="quiet">
              {fact.label}
            </PeekTrigger>
          </dt>
          <dd className="order-1 text-3xl font-medium tracking-tight tabular-nums">
            <GlyphText text={fact.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}
