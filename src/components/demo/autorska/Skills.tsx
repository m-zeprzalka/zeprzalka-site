import type { DemoHomeContent } from "../shared/content"
import type { FigureShape } from "../shared/glyph"
import { CoverFigure } from "./CoverFigure"
import { SectionHead, Sheet } from "./Sheet"

interface Skill {
  key: string
  title: string
  description: string
  tools: readonly string[]
}

/** Zdania opisu (kropka + spacja); Development dzieli się na „wdrożenia” i „AI”. */
const sentences = (text: string) => text.split(/(?<=\.)\s+/).filter(Boolean)

const SHAPES: readonly FigureShape[] = ["cube", "torus", "octahedron", "drop"]

/** Cztery kompetencje jako cztery warstwy — z treści serwisu (AI z „O mnie”). */
export function skillLayers(skills: DemoHomeContent["skills"]): Skill[] {
  const [design, development, visual] = skills.items
  if (!design || !development || !visual) throw new Error("Warstwy: brak kompetencji")
  const [shipping = development.description, ai = ""] = sentences(development.description)
  return [
    { key: design.id, title: design.title, description: design.description, tools: design.tools },
    {
      key: development.id,
      title: development.title,
      description: shipping,
      tools: development.tools,
    },
    { key: "ai", title: skills.ai.title, description: ai, tools: skills.ai.tools },
    { key: visual.id, title: visual.title, description: visual.description, tools: visual.tools },
  ]
}

export const skillAnchor = (key: string, index: number) =>
  index === 0 ? "kompetencje" : `kompetencje-${key}`

/**
 * Warstwy 3–6 — kompetencje. Każda to osobna karta z bryłą ze znaków (kostka, torus,
 * ośmiościan, kropla); karty nasuwają się jedna na drugą jak kolejne warstwy umiejętności.
 */
export function Skills({ skills, start }: { skills: DemoHomeContent["skills"]; start: number }) {
  return skillLayers(skills).map((skill, index) => {
    const sheet = start + index
    const titleId = `au-skill-${skill.key}`
    return (
      <Sheet
        key={skill.key}
        index={sheet}
        anchor={skillAnchor(skill.key, index)}
        labelledBy={index === 0 ? "kompetencje-title" : titleId}
      >
        {index === 0 ? (
          <SectionHead
            id="kompetencje-title"
            title={skills.title}
            lead={skills.lead}
            className="mb-10 lg:mb-12"
          />
        ) : (
          // Żywa pagina kolejnych warstw: nazwa rozdziału, bez numeru (liczniki odpadły).
          <p aria-hidden="true" className="mb-10 text-fm-lead font-medium text-fm-ink-3 lg:mb-12">
            {skills.title}
          </p>
        )}
        <div className="grid flex-1 items-center gap-x-(--au-gap) gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3
              id={titleId}
              className="text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.038em] text-balance"
            >
              {skill.title}
            </h3>
            {skill.description && (
              <p className="mt-5 max-w-[44ch] text-fm-lead text-pretty text-fm-ink-2">
                {skill.description}
              </p>
            )}
            <ul className="mt-8 flex flex-wrap gap-2">
              {skill.tools.map((tool) => (
                <li
                  key={tool}
                  className="inline-flex h-9 items-center rounded-full bg-fm-fill px-4 text-fm-small text-fm-ink-2"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <CoverFigure
              sheet={sheet}
              shape={SHAPES[index] ?? "cube"}
              label={skill.title}
              className="mx-auto aspect-square w-full max-w-[16rem] sm:max-w-[20rem] lg:max-w-[24rem]"
            />
          </div>
        </div>
      </Sheet>
    )
  })
}
