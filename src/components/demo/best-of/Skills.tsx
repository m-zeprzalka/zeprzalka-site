import pkg from "../../../../package.json"
import type { DemoHomeContent } from "../shared/content"
import { SECTIONS } from "./ids"
import { SectionHeader } from "./SectionHeader"
import { Tile } from "./Tile"
import { AskTile } from "./tiles/AskTile"
import { BuildTile, type BuildLine } from "./tiles/BuildTile"
import { DesignTile } from "./tiles/DesignTile"
import { MotionTile } from "./tiles/MotionTile"
import { UI } from "./ui-strings"

/** Zdania akapitu (podział po kropce kończącej zdanie). */
const sentences = (text: string) => text.split(/(?<=\.)\s+/).filter(Boolean)

/** „^16.4.4” → „16.4”. */
const minor = (range: string) => range.replace(/^\D+/, "").split(".").slice(0, 2).join(".")

/**
 * Kompetencje jako cztery żywe kafle, które ruszają przy wejściu w kadr
 * (siatka 12 kolumn: 7/5, 5/7). Każda kompetencja udowadnia się działającym
 * mini-interfejsem z prawdziwej treści: karta realizacji w edycji (kursor-duch),
 * prosty log builda tego serwisu, rozmowa złożona z tekstów strony, oś czasu
 * animacji słowa z nagłówka. Żadne zdanie nie powtarza się na stronie dwa razy.
 */
export function Skills({ content }: { content: DemoHomeContent }) {
  const { skills, portfolio, blog, hero, about } = content
  const [design, development, visual] = skills.items
  const prfct = portfolio.works.find((work) => work.slug === "prfct")
  if (!design || !development || !visual || !prfct) {
    throw new Error("Best Of: brak treści kompetencji")
  }
  // Opis „Development” ma dwa zdania: pierwsze o serwisach, drugie o integracji AI.
  const [devSentence = "", aiSentence = ""] = sentences(development.description)
  const [designFirst = "", designSecond = ""] = sentences(design.description)
  const [visualFirst = "", visualSecond = ""] = sentences(visual.description)
  const [specialisation = ""] = sentences(about.bio[1]?.prefix ?? "")

  const build: BuildLine[] = [
    { kind: "command", text: "pnpm build" },
    {
      kind: "step",
      text: `Next.js ${minor(pkg.dependencies.next)}`,
      detail: `React ${minor(pkg.dependencies.react)}`,
    },
    { kind: "step", text: "Compiled successfully" },
    { kind: "step", text: "Checking validity of types", detail: "strict" },
    { kind: "step", text: "Generating static pages" },
    { kind: "route", text: "/", detail: "static" },
    { kind: "route", text: "/portfolio", detail: portfolio.count },
    { kind: "route", text: "/blog/[slug]", detail: blog.count },
    { kind: "done", text: "Deployed to Vercel", detail: "fra1" },
  ]

  return (
    <section
      id={SECTIONS.skills}
      data-bo-section={SECTIONS.skills}
      aria-labelledby="bo-skills-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader id="bo-skills-title" title={skills.title} lead={skills.lead} />

      <div className="mt-12 grid gap-3 sm:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        <Tile
          index={0}
          className="lg:col-span-7"
          title={design.title}
          description={designFirst}
          tools={design.tools}
          toolsLabel={UI.tools}
        >
          <DesignTile work={prfct} labels={UI.design} />
        </Tile>
        <Tile
          index={1}
          className="lg:col-span-5"
          title={development.title}
          description={devSentence}
          tools={development.tools}
          toolsLabel={UI.tools}
        >
          <BuildTile lines={build} replayLabel={UI.replay} />
        </Tile>
        <Tile
          index={0}
          className="lg:col-span-5"
          title={skills.ai.title}
          description={specialisation}
          tools={skills.ai.tools}
          toolsLabel={UI.tools}
        >
          <AskTile
            prompts={[
              { label: skills.ai.title, answer: aiSentence },
              { label: design.title, answer: designSecond },
              { label: visual.title, answer: visualSecond },
            ]}
            labels={UI.ask}
          />
        </Tile>
        <Tile
          index={1}
          className="lg:col-span-7"
          title={visual.title}
          description={visualFirst}
          tools={visual.tools}
          toolsLabel={UI.tools}
        >
          <MotionTile word={hero.title.split(" ")[0] ?? ""} labels={UI.motion} />
        </Tile>
      </div>
    </section>
  )
}
