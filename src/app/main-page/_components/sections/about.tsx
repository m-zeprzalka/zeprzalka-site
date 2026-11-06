import { PeekTrigger } from "@/app/main-page/_components/peek/peek-trigger"
import { Segments } from "@/app/main-page/_components/peek/segments"
import { SECTION } from "@/app/main-page/_lib/anchors"
import type { Fact, Segment } from "@/app/main-page/_lib/types"

/**
 * „O mnie”: dalszy ciąg biogramu wypełniany przewijaniem (słowo po słowie,
 * `scroll-fill` w globals.css) i cztery liczby. Podpis liczby otwiera kartę
 * z jej kontekstem — aktywność widać po obłym tle pod podpisem, bez karty pod liczbą.
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
      <h2 id="o-mnie-title" className="text-base font-medium">
        {heading}
      </h2>
      <p className="scroll-fill mt-6 text-2xl leading-snug font-medium tracking-tight text-pretty md:text-[1.75rem]">
        <Segments segments={bio} words />
      </p>
      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.id} className="grid content-start gap-2">
            <dt className="order-2 text-sm text-muted-foreground">
              <PeekTrigger id={fact.peek} emphasis={false}>
                {fact.label}
              </PeekTrigger>
            </dt>
            <dd className="order-1 text-3xl font-medium tracking-tight tabular-nums">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
