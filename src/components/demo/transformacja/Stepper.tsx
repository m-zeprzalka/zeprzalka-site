import { ArrowDown } from "lucide-react"
import type { TransformacjaContent } from "./content"
import { sceneRange } from "./range"

/** Każdy etap zajmuje ćwierć sceny (24% z 96%); ostatnie 4% to trzymanie gotowej ramy. */
const STAGE_SPAN = 24

/**
 * Kompaktowy stepper sceny: cztery etapy z paskiem postępu, link „Pomiń”
 * widoczny dla wszystkich i podpis bieżącej kompetencji (tytuł + narzędzia
 * jednym zdaniem — zawija się, nic nie jest ucinane). Pełne opisy kompetencji
 * są w stałej sekcji pod liczbami. Tylko w trybie przewijanym.
 */
export function Stepper({
  stages,
  competencies,
  skip,
}: {
  stages: TransformacjaContent["stages"]
  competencies: TransformacjaContent["competencies"]
  skip: { label: string; href: string }
}) {
  return (
    <div className="tf-stepper">
      <div className="flex items-center justify-between gap-4">
        <ol aria-hidden="true" className="flex gap-4 sm:gap-6">
          {stages.map((stage, index) => (
            <li
              key={stage.id}
              className="tf-step tf-anim flex items-baseline gap-1.5 text-[0.8125rem] font-medium tracking-[-0.005em] text-fm-ink"
              style={
                index > 0 ? sceneRange(index * STAGE_SPAN, index * STAGE_SPAN + 1.5) : undefined
              }
            >
              <span className="font-mono text-[0.6875rem] text-fm-ink-3 tabular-nums">
                {index + 1}
              </span>
              {stage.label}
            </li>
          ))}
        </ol>
        <a
          href={skip.href}
          className="group -my-2 inline-flex h-9 shrink-0 items-center gap-1 rounded-full px-2 text-[0.8125rem] font-medium text-fm-ink-3 fm-focus transition-colors duration-150 hover:text-fm-ink"
        >
          {skip.label}
          <ArrowDown
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 ease-fm-snap group-hover:translate-y-0.5"
          />
        </a>
      </div>
      <span
        aria-hidden="true"
        className="relative mt-2.5 block h-0.5 overflow-hidden rounded-full bg-fm-edge"
      >
        {/* Pierwszy odcinek raz „oddycha” — podpowiedź, że pasek wypełni przewijanie. */}
        <span className="tf-steps__ghost absolute inset-y-0 left-0 w-1/4 rounded-full bg-fm-ink/35" />
        <span className="tf-steps__fill tf-anim absolute inset-0 rounded-full bg-fm-ink" />
      </span>
      <div aria-hidden="true" className="tf-comps mt-4">
        {competencies.map((competency) => (
          <p key={competency.id} className="tf-comp tf-anim">
            <span className="block text-[1rem] leading-snug font-semibold tracking-[-0.015em] text-fm-ink lg:text-[1.0625rem]">
              {competency.title}
            </span>
            <span className="mt-1 block text-fm-small text-pretty text-fm-ink-3">
              {competency.toolsLine}
            </span>
          </p>
        ))}
      </div>
    </div>
  )
}
