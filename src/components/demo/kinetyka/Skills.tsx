import type { ReactNode } from "react"
import { typo } from "../forma/typo"
import type { DemoHomeContent } from "../shared/content"
import { BuildLog, type LogLine } from "./BuildLog"
import { MotionTimeline } from "./MotionTimeline"
import { SkillStack } from "./SkillStack"
import { Specimen } from "./Specimen"
import { SplitChars } from "./split"

type Skills = DemoHomeContent["skills"]

/**
 * Kompetencje jako trzy plansze. Na szerokim ekranie (≥ 1024 × 700 px)
 * plansze są `sticky` i najeżdżają na siebie — poprzednia cofa się i gaśnie
 * (SkillStack). Każda kompetencja pokazuje się sama, w typografii:
 * projektowanie — specimen kroju tej strony, development — log komend
 * builda, komunikacja wizualna — oś czasu animacji liter.
 */
export function Skills({ skills, log, word }: { skills: Skills; log: LogLine[]; word: string }) {
  const [design, development, visual] = skills.items
  if (!design || !development || !visual) return null

  const demos: Record<string, ReactNode> = {
    [design.id]: (
      <Specimen
        labels={{ weight: "Grubość", cap: "Wersaliki", x: "Wysokość x", base: "Linia pisma" }}
      />
    ),
    [development.id]: <BuildLog lines={log} replay="Powtórz" />,
    [visual.id]: (
      <MotionTimeline
        word={word}
        labels={{ play: "Odtwórz", pause: "Zatrzymaj", progress: "Postęp animacji" }}
      />
    ),
  }

  return (
    <section id="kompetencje" aria-labelledby="kn-skills-title" className="pt-(--kn-section)">
      <div className="kn-wrap grid gap-6 xl:grid-cols-12 xl:items-end">
        <h2 id="kn-skills-title" data-kn-in="chars" className="kn-title xl:col-span-8">
          <SplitChars text={skills.title} spread={360} />
        </h2>
        <p
          data-kn-in=""
          className="kn-lead max-w-[30ch] text-pretty text-fm-ink-2 xl:col-span-4 xl:pb-3"
        >
          {skills.lead}
        </p>
      </div>

      <SkillStack>
        {skills.items.map((skill) => (
          <article key={skill.id} aria-labelledby={`kn-skill-${skill.id}`} className="kn-skill">
            <div className="kn-skill-inner kn-wrap">
              <h3
                id={`kn-skill-${skill.id}`}
                data-kn-in="chars"
                className="kn-skill-title text-balance"
              >
                <SplitChars text={skill.title} spread={400} />
              </h3>
              <div className="mt-8 grid gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-6">
                <div data-kn-in="" className="lg:col-span-5">
                  <p className="kn-lead max-w-[40ch] text-pretty text-fm-ink-2">
                    {typo(skill.description)}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Narzędzia">
                    {skill.tools.map((tool) => (
                      <li
                        key={tool}
                        className="inline-flex h-8 items-center rounded-full bg-fm-fill px-3.5 text-fm-small font-medium text-fm-ink-2"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">{demos[skill.id]}</div>
              </div>
            </div>
          </article>
        ))}
      </SkillStack>
    </section>
  )
}
