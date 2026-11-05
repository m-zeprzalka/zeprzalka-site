import type { CSSProperties } from "react"
import Image from "next/image"
import { version as nextVersion } from "next/package.json"
import { typo } from "../../forma/typo"
import type { DemoHomeContent, DemoWork } from "../../shared/content"
import { MediaTwin } from "../ascii/MediaTwin"
import { Listing } from "../code/Listing"
import { quote } from "../code/highlight"
import { Code, Face, Outline, Tag, Twin } from "../code/Twin"
import { UI } from "../ui"
import { Terminal, type BuildLine } from "./Terminal"

const vars = (values: Record<string, string | number>) => values as CSSProperties

type Skill = DemoHomeContent["skills"]["items"][number]

/**
 * Kompetencje: trzy wiersze, każdy z dowodem obok — realizacja, która tę
 * kompetencję pokazuje (design system prfct.dev, branding BrandMaker), a dla
 * developmentu prawdziwy log budowania tego serwisu, który rusza przy
 * przewijaniu. Pod soczewką wiersz to wywołanie komponentu z danymi,
 * a obraz — cyfry 0/1.
 */
export function Skills({
  skills,
  works,
  counts,
  domain,
}: {
  skills: DemoHomeContent["skills"]
  /** Dowody dla 1. i 3. kompetencji (z portfolio — nie powtarzają się w pokazie). */
  works: readonly [DemoWork, DemoWork]
  /** Liczby z treści z odmianą („19 realizacji”, „29 artykułów”). */
  counts: { works: string; posts: string }
  domain: string
}) {
  const lines: BuildLine[] = [
    { kind: "command", text: "pnpm build" },
    { kind: "step", text: `Next.js ${nextVersion}`, detail: "Turbopack" },
    { kind: "step", text: "Compiled successfully" },
    { kind: "route", text: "/", detail: "static" },
    { kind: "route", text: "/portfolio", detail: counts.works },
    { kind: "route", text: "/blog/[slug]", detail: counts.posts },
    { kind: "step", text: "Generating static pages" },
    { kind: "command", text: "git push origin main" },
    { kind: "done", text: "Production", detail: domain },
  ]
  const proofs = [works[0], null, works[1]] as const

  return (
    <section
      id="kompetencje"
      data-rg-host="skills"
      data-rg-section="kompetencje"
      data-rg-name="section#kompetencje"
      aria-labelledby="rg-skills-title"
      className="relative py-(--fm-section)"
    >
      <div className="fm-container">
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-12 lg:items-end">
          <h2
            id="rg-skills-title"
            data-rg-key="skills-title"
            data-rg-name="h2.rg-h2"
            data-rg-in=""
            className="rg-h2 lg:col-span-6"
          >
            {skills.title}
          </h2>
          <p
            data-rg-key="skills-lead"
            data-rg-in=""
            style={vars({ "--i": 1 })}
            className="max-w-[26rem] text-fm-lead text-pretty text-fm-ink-2 lg:col-span-5 lg:col-start-8"
          >
            {typo(skills.lead)}
          </p>
        </div>

        <ol className="mt-14 sm:mt-20">
          {skills.items.map((skill, index) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              index={index}
              proof={proofs[index] ?? null}
              terminal={index === 1 ? lines : null}
            />
          ))}
        </ol>
      </div>

      <Face>
        <Listing file="Skills.tsx" />
        <Outline for="skills-title" tag="h2" classes="rg-h2" text={skills.title} />
        <Twin for="skills-lead" kind="text">
          <Code className="rg-code--lead" src={`<p className="text-fm-lead">${skills.lead}</p>`} />
        </Twin>
        {skills.items.map((skill, index) => (
          <SkillTwins key={skill.id} skill={skill} lines={index === 1 ? lines : null} />
        ))}
      </Face>
    </section>
  )
}

function SkillRow({
  skill,
  index,
  proof,
  terminal,
}: {
  skill: Skill
  index: number
  proof: DemoWork | null
  terminal: BuildLine[] | null
}) {
  return (
    <li
      data-rg-key={`skill-${skill.id}`}
      data-rg-name="Skill"
      className="grid gap-x-6 gap-y-8 border-t border-fm-edge py-10 sm:py-14 lg:grid-cols-12"
    >
      <div className="lg:col-span-5">
        <p className="text-fm-small font-medium text-fm-ink-3 tabular-nums" aria-hidden="true">
          {skill.number}
        </p>
        <h3
          data-rg-key={`skill-title-${skill.id}`}
          data-rg-name="h3"
          data-rg-in=""
          className="mt-3 text-[1.625rem] leading-[1.1] font-[560] tracking-[-0.035em] text-balance sm:text-[2rem]"
        >
          {skill.title}
        </h3>
        <p
          data-rg-key={`skill-desc-${skill.id}`}
          data-rg-name="p"
          data-rg-in=""
          style={vars({ "--i": 1 })}
          className="mt-4 max-w-[34rem] text-fm-body text-pretty text-fm-ink-2"
        >
          {typo(skill.description)}
        </p>
        <ul
          data-rg-key={`skill-tools-${skill.id}`}
          data-rg-name="ul.tools"
          className="mt-6 flex flex-wrap gap-1.5"
          aria-label="Narzędzia"
        >
          {skill.tools.map((tool) => (
            <li
              key={tool}
              className="inline-flex h-8 items-center rounded-full bg-fm-fill px-3 text-[0.8125rem] font-medium text-fm-ink-2"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-7">
        <div
          data-rg-key={`skill-proof-${skill.id}`}
          data-rg-name={terminal ? "Terminal" : "figure"}
          data-rg-in=""
          style={vars({ "--i": index === 1 ? 0 : 1 })}
          className="relative aspect-[16/10] overflow-hidden rounded-fm-3xl bg-fm-fill shadow-fm-ring"
        >
          {terminal ? (
            <Terminal lines={terminal} replayLabel={UI.build.replay} />
          ) : proof ? (
            <Image
              src={proof.poster}
              width={proof.width}
              height={proof.height}
              alt={`${proof.title} — ${proof.category}`}
              sizes="(min-width: 1024px) 44rem, 92vw"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        {proof && (
          <p className="mt-3 flex items-baseline justify-between gap-4 text-fm-small">
            <span className="font-medium text-fm-ink">{proof.title}</span>
            <span className="text-fm-ink-3">{proof.category}</span>
          </p>
        )}
      </div>
    </li>
  )
}

function SkillTwins({ skill, lines }: { skill: Skill; lines: BuildLine[] | null }) {
  return (
    <>
      <Twin for={`skill-${skill.id}`} kind="block">
        <Code
          className="rg-skill__open"
          src={`<Skill id="${skill.id}" number="${skill.number}">`}
        />
      </Twin>
      <Outline
        for={`skill-title-${skill.id}`}
        tag="h3"
        classes="text-[1.625rem] leading-[1.1] font-[560] tracking-[-0.035em] text-balance sm:text-[2rem]"
        label={`<h3>`}
        text={skill.title}
      />
      <Twin for={`skill-desc-${skill.id}`} kind="text">
        <Code className="rg-code--body" src={`description: ${quote(skill.description)},`} />
      </Twin>
      <Twin for={`skill-tools-${skill.id}`} kind="text">
        <Code
          className="rg-code--body"
          src={`tools: [${skill.tools.map((tool) => quote(tool)).join(", ")}],`}
        />
      </Twin>
      <Twin for={`skill-proof-${skill.id}`} kind="media" className="rounded-fm-3xl">
        {lines ? (
          <Code
            className="rg-code--terminal"
            src={`const build: Line[] = [\n${lines
              .map(
                (line) =>
                  `  { kind: "${line.kind}", text: ${quote(line.text)}${
                    line.detail ? `, detail: ${quote(line.detail)}` : ""
                  } },`
              )
              .join("\n")}\n]`}
          />
        ) : (
          <>
            <MediaTwin
              source={`skill-proof-${skill.id}`}

              cell={5}
              tone={0.05}
              negative
            />
            <Tag name="img" />
          </>
        )}
      </Twin>
    </>
  )
}
