import { GlyphText } from "@/app/main-page/_components/motion/glyph-text"
import { PeekTrigger } from "@/app/main-page/_components/peek/peek-trigger"
import { countSegments, Segments } from "@/app/main-page/_components/peek/segments"
import { SECTION } from "@/app/main-page/_lib/anchors"
import type { Fact, Segment } from "@/app/main-page/_lib/types"
import { SectionHeading } from "./section-heading"

/**
 * „O mnie”: dalszy ciąg biogramu wypełniany przewijaniem — fala koloru idzie
 * słowo po słowie, gdy akapit przejeżdża przez okno (`scroll-fill`) — i cztery
 * liczby, które odczytują się ze znaków (na telefonie jedna pod drugą). Podpis liczby pokazuje kartę z jej
 * kontekstem; aktywność widać po odcieniu, bez tła.
 */
export function About({
  heading,
  bio,
  facts,
}: {
  heading: string
  bio: readonly Segment[]
  facts: readonly Fact[]
}) {
  return (
    <section
      id={SECTION.about}
      aria-labelledby="o-mnie-title"
      data-peek-column=""
      className="column mt-28 md:mt-36"
    >
      <SectionHeading id="o-mnie-title" title={heading} />
      <p
        style={{ "--n": countSegments(bio) }}
        className="mt-6 scroll-fill text-2xl leading-snug font-medium tracking-tight text-pretty md:text-[1.75rem]"
      >
        <Segments segments={bio} split="inline" />
      </p>
      <dl className="mt-16 grid gap-x-6 gap-y-8 sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.id} className="grid reveal content-start gap-2">
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
    </section>
  )
}
