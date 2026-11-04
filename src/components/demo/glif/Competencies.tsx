import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { Emblem, type EmblemKind } from "./Emblem"
import { SectionHead } from "./SectionHead"

const KINDS: readonly EmblemKind[] = ["design", "code", "motion"]

/**
 * Trzy kompetencje z obecnej strony głównej — wszystkie rozwinięte (cała treść
 * jest w HTML). Zamiast numeracji każda ma własny, żywy znak z glifów.
 */
export function Competencies({ skills }: { skills: DemoHomeContent["skills"] }) {
  return (
    <section id="kompetencje" aria-labelledby="kompetencje-title" className="gl-section">
      <div className="fm-container">
        <SectionHead id="kompetencje" title={skills.title} lead={skills.lead} />
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:mt-20 lg:grid-cols-3">
          {skills.items.map((skill, index) => (
            <article key={skill.id} className="flex flex-col border-t border-fm-edge-strong pt-8">
              <Emblem kind={KINDS[index] ?? "design"} />
              <h3 className="mt-8 text-[1.375rem] leading-[1.2] font-medium tracking-[-0.025em]">
                {skill.title}
              </h3>
              <p className="mt-3 max-w-[60ch] text-fm-body text-pretty text-fm-ink-2">
                {typo(skill.description)}
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-fm-small text-fm-ink-3">
                {skill.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
