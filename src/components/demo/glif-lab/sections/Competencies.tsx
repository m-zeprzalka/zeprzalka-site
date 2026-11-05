import { typo } from "@/components/demo/forma/typo"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { EmblemSurface } from "./EmblemSurface"
import { SectionHead } from "./SectionHead"

/** Bryła każdej kompetencji: kostka (produkt), torus (kod — ukłon w stronę donut.c), kropla (forma). */
const SHAPES = [
  { shape: 0, label: "Obracająca się kostka z glifów" },
  { shape: 1, label: "Obracający się torus z glifów" },
  { shape: 2, label: "Falująca kropla z glifów" },
] as const

/**
 * Kompetencje (C): trzy kompetencje z obecnej strony głównej, wszystkie
 * rozwinięte (cała treść w HTML); każda ma bryłę 3D złożoną z glifów.
 */
export function Competencies({ skills }: { skills: DemoHomeContent["skills"] }) {
  return (
    <section
      id="kompetencje"
      data-gll-section="skills"
      aria-labelledby="kompetencje-title"
      className="gll-section"
    >
      <div className="fm-container">
        <SectionHead id="kompetencje" section="skills" title={skills.title} lead={skills.lead} />
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:mt-16 lg:grid-cols-3">
          {skills.items.map((skill, index) => {
            const emblem = SHAPES[index] ?? SHAPES[0]
            return (
              <article
                key={skill.id}
                className="flex flex-col sm:grid sm:grid-cols-12 sm:items-center sm:gap-x-8 lg:flex lg:items-stretch"
              >
                <div className="sm:col-span-5">
                  <EmblemSurface shape={emblem.shape} label={emblem.label} />
                </div>
                <div className="sm:col-span-7">
                  <h3 className="mt-7 text-[1.375rem] leading-[1.2] font-medium tracking-[-0.025em] sm:mt-0 lg:mt-7">
                    {skill.title}
                  </h3>
                  <p className="mt-3 max-w-[60ch] text-fm-body text-pretty text-fm-ink-2">
                    {typo(skill.description)}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-fm-small text-fm-ink-3">
                    {skill.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
