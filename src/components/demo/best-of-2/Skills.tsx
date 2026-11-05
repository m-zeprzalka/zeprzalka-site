import type { ReactNode } from "react"
import pkg from "../../../../package.json"
import type { DemoHomeContent } from "../shared/content"
import { SECTIONS } from "./ids"
import { Segment } from "./Segment"
import { SectionHeader } from "./SectionHeader"
import { AskTile } from "./tiles/AskTile"
import { BuildTile, type BuildLine } from "./tiles/BuildTile"
import { FigureTile } from "./tiles/FigureTile"
import { UI } from "./ui-strings"

/** Zdania akapitu (podział po kropce kończącej zdanie). */
const sentences = (text: string) => text.split(/(?<=\.)\s+/).filter(Boolean)

/** „^16.4.4” → „16.4”. */
const minor = (range: string) => range.replace(/^\D+/, "").split(".").slice(0, 2).join(".")

/**
 * Kompetencje jako segmenty (układ pochwalony w Rentgenie): w każdym wierszu
 * po lewej nazwa, zdanie i narzędzia, po prawej działająca scena. Poziom
 * wyznaczają dwie sceny, które właściciel uznał za najlepsze — prosty log
 * komend (Development) i rozmowa (AI). Projektowanie i komunikacja wizualna
 * dostały bryły ze znaków z laboratorium glifów (kostka i kropla), które
 * reagują na kursor i palec. Żadne zdanie nie powtarza się na stronie dwa razy.
 */
export function Skills({ content }: { content: DemoHomeContent }) {
  const { skills, about } = content
  const [design, development, visual] = skills.items
  if (!design || !development || !visual) {
    throw new Error("Best Of · II: brak treści kompetencji")
  }
  // Opis „Development” ma dwa zdania: pierwsze o serwisach, drugie o integracji AI.
  const [devSentence = "", aiSentence = ""] = sentences(development.description)
  const [designFirst = "", designSecond = ""] = sentences(design.description)
  const [visualFirst = "", visualSecond = ""] = sentences(visual.description)
  const [specialisation = ""] = sentences(about.bio[1]?.prefix ?? "")

  // Prawdziwe kroki tego repozytorium (skrypty z package.json, wersje z zależności) — bez liczników.
  const build: BuildLine[] = [
    { kind: "command", text: "pnpm check" },
    { kind: "step", text: "Prettier · ESLint" },
    { kind: "step", text: "Checking validity of types", detail: "strict" },
    { kind: "command", text: "pnpm build" },
    {
      kind: "step",
      text: `Next.js ${minor(pkg.dependencies.next)}`,
      detail: `React ${minor(pkg.dependencies.react)}`,
    },
    { kind: "step", text: "Generating static pages" },
    { kind: "route", text: "/", detail: "static" },
    { kind: "route", text: "/portfolio", detail: "static" },
    { kind: "route", text: "/blog/[slug]", detail: "SSG" },
    { kind: "command", text: "git push origin main" },
    { kind: "done", text: "Deployed to Vercel", detail: "fra1" },
  ]

  const segments: {
    id: string
    title: string
    text: string
    tools: readonly string[]
    scene: ReactNode
  }[] = [
    {
      id: design.id,
      title: design.title,
      text: designFirst,
      tools: design.tools,
      scene: <FigureTile shape="cube" label={UI.figures.design} hint={UI.figures.hint} />,
    },
    {
      id: development.id,
      title: development.title,
      text: devSentence,
      tools: development.tools,
      scene: <BuildTile lines={build} replayLabel={UI.replay} />,
    },
    {
      id: "ai",
      title: skills.ai.title,
      text: specialisation,
      tools: skills.ai.tools,
      scene: (
        <AskTile
          prompts={[
            { label: skills.ai.title, answer: aiSentence },
            { label: design.title, answer: designSecond },
            { label: visual.title, answer: visualSecond },
          ]}
          labels={UI.ask}
        />
      ),
    },
    {
      id: visual.id,
      title: visual.title,
      text: visualFirst,
      tools: visual.tools,
      scene: <FigureTile shape="drop" label={UI.figures.visual} hint={UI.figures.hint} />,
    },
  ]

  return (
    <section
      id={SECTIONS.skills}
      data-b2-section={SECTIONS.skills}
      aria-labelledby="b2-skills-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader id="b2-skills-title" title={skills.title} lead={skills.lead} />
      <div className="mt-12 sm:mt-16">
        {segments.map((segment) => (
          <Segment
            key={segment.id}
            title={segment.title}
            text={segment.text}
            tools={segment.tools}
            toolsLabel={UI.tools}
          >
            {segment.scene}
          </Segment>
        ))}
      </div>
    </section>
  )
}
