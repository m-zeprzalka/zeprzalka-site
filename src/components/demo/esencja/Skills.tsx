import pkg from "../../../../package.json"
import type { DemoHomeContent } from "../shared/content"
import { SectionHeader } from "./SectionHeader"
import { Tile } from "./Tile"
import { ChatTile } from "./tiles/ChatTile"
import { DeployTile, type DeployLine } from "./tiles/DeployTile"
import { DesignTile } from "./tiles/DesignTile"
import { MotionTile } from "./tiles/MotionTile"

/** Zdania akapitu (podział po kropce kończącej zdanie). */
const sentences = (text: string) => text.split(/(?<=\.)\s+/)
/** Etykieta podpowiedzi z tytułu wpisu: część przed „ — ” albo pierwsze trzy słowa. */
function shortTitle(title: string) {
  const [lead = title] = title.split(" — ")
  if (lead !== title) return lead
  const words = title.split(" ")
  return words.length > 3 ? `${words.slice(0, 3).join(" ")}…` : title
}

/** „^16.4.4” → „16.4”. */
const minor = (range: string) => range.replace(/^\D+/, "").split(".").slice(0, 2).join(".")

/**
 * Kompetencje jako cztery żywe kafle (siatka 12 kolumn: 7/5, 5/7). Każda
 * kompetencja udowadnia się działającym mini-interfejsem zbudowanym
 * z prawdziwej treści: karta realizacji w edycji, wdrożenie tego serwisu,
 * rozmowa złożona z tekstów strony, oś czasu animacji słowa z nagłówka.
 */
export function Skills({ content }: { content: DemoHomeContent }) {
  const { skills, portfolio, blog, hero, person } = content
  const [design, development, visual] = skills.items
  const prfct = portfolio.works.find((work) => work.slug === "prfct")
  if (!design || !development || !visual || !prfct) {
    throw new Error("Esencja: brak treści kompetencji")
  }
  // Opis „Development” ma dwa zdania: pierwsze o serwisach, drugie o integracji AI.
  const [devSentence = "", aiSentence = ""] = sentences(development.description)
  const [designFirst = ""] = sentences(design.description)
  // Czat AI odpowiada wpisami z kategorii „AI”: pytanie = tytuł, odpowiedź = opis wpisu.
  const aiPosts = blog.posts.filter((post) => post.categories.includes("AI")).slice(0, 3)

  const deploy: DeployLine[] = [
    { kind: "command", text: "pnpm build" },
    { kind: "info", text: `Next.js ${minor(pkg.dependencies.next)}`, detail: "Turbopack" },
    { kind: "step", text: "Compiled successfully" },
    { kind: "step", text: "Generating static pages" },
    { kind: "route", text: "/", detail: "static" },
    { kind: "route", text: "/portfolio", detail: portfolio.count },
    { kind: "route", text: "/blog/[slug]", detail: blog.count },
    { kind: "done", text: "Deployed to production", detail: "fra1" },
  ]

  return (
    <section
      id="kompetencje"
      data-es-section="kompetencje"
      aria-labelledby="kompetencje-title"
      className="fm-container scroll-mt-24 pt-(--fm-section)"
    >
      <SectionHeader id="kompetencje-title" title={skills.title} lead={skills.lead} />

      <div className="mt-12 grid gap-3 sm:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        <Tile
          index={0}
          className="lg:col-span-7"
          title={design.title}
          description={designFirst}
          tools={design.tools}
        >
          <DesignTile
            work={prfct}
            labels={{
              radius: "Promień",
              padding: "Odstęp",
              shadow: "Cień",
              inner: "Promień zdjęcia",
              innerHint: "promień − odstęp",
              replay: "Powtórz pokaz",
              panel: "Właściwości karty",
            }}
          />
        </Tile>
        <Tile
          index={1}
          className="lg:col-span-5"
          title={development.title}
          description={devSentence}
          tools={development.tools}
        >
          <DeployTile
            lines={deploy}
            preview={{
              domain: person.domain,
              status: hero.status,
              title: hero.title,
              cta: hero.cta,
            }}
            labels={{
              building: "Budowanie",
              ready: "Gotowe",
              replay: "Powtórz wdrożenie",
              branch: "main",
            }}
          />
        </Tile>
        <Tile
          index={0}
          className="lg:col-span-5"
          title={skills.ai.title}
          description={aiSentence}
          tools={skills.ai.tools}
        >
          <ChatTile
            prompts={aiPosts.map((post) => ({
              label: shortTitle(post.title),
              question: post.title,
              answer: post.description,
              tools: [post.dateLabel, post.readingTime],
              href: post.href,
            }))}
            labels={{
              thinking: "Myślę…",
              send: "Następne pytanie",
              note: "Odpowiedzi to opisy wpisów z bloga — demonstracja interfejsu, bez modelu językowego.",
              replay: "Powtórz rozmowę",
              composer: "Zapytaj o AI…",
              source: "Czytaj wpis",
            }}
          />
        </Tile>
        <Tile
          index={1}
          className="lg:col-span-7"
          title={visual.title}
          description={sentences(visual.description)[0] ?? ""}
          tools={visual.tools}
        >
          <MotionTile
            word={hero.title.split(" ")[0] ?? ""}
            labels={{
              tracks: ["Krycie", "Skala", "Rozmycie"],
              play: "Odtwórz",
              pause: "Zatrzymaj",
              replay: "Odtwórz od początku",
              scrub: "Oś czasu animacji",
            }}
          />
        </Tile>
      </div>
    </section>
  )
}
