import { BrainCircuit, CodeXml, MousePointer2, PenTool, Presentation } from "lucide-react"
import type { Format } from "@number-flow/react"
import { Chip } from "@/components/demo/forma/Chip"
import { typo } from "@/components/demo/forma/typo"
import { Tally } from "./Tally"

export type SkillKind = "design" | "code" | "ai" | "teaching"

export interface Skill {
  kind: SkillKind
  title: string
  description: string
  tools: readonly string[]
}

export interface Fact {
  value: number
  from?: number
  format?: Format
  prefix?: string
  suffix?: string
  label: string
}

const ICONS = { design: PenTool, code: CodeXml, ai: BrainCircuit, teaching: Presentation }

/**
 * Kompetencje i fakty. Fakty to miękkie pola (wypełnienie, bez ramki)
 * z liczbami Number Flow; kompetencje to cztery karty, w których ikona po
 * najechaniu „wykonuje zawód”: projektowanie dostaje uchwyty zaznaczenia,
 * kod migającą karetkę, AI jeden przebłysk, wykłady kursor studenta.
 * Całość jest komponentem serwerowym — klienckie są tylko liczby.
 */
export function Competencies({
  title,
  lead,
  facts,
  skills,
}: {
  title: string
  lead: string
  facts: readonly Fact[]
  skills: readonly Skill[]
}) {
  return (
    <div>
      <div className="max-w-2xl">
        <h2 id="kompetencje-tytul" className="text-fm-h2 font-semibold text-balance">
          {title}
        </h2>
        <p className="text-fm-lead text-fm-ink-2 mt-3 text-pretty">{typo(lead)}</p>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {facts.map((fact) => (
          <li key={fact.label} className="bg-fm-fill rounded-fm-2xl flex flex-col p-4 md:p-5">
            <Tally
              value={fact.value}
              from={fact.from}
              format={fact.format}
              prefix={fact.prefix}
              suffix={fact.suffix}
              className="text-[clamp(1.625rem,1rem+2.4vw,2.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums"
            />
            <span className="text-fm-small text-fm-ink-2 mt-3 text-pretty md:mt-4">
              {typo(fact.label)}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-3 grid gap-3 md:grid-cols-2 lg:mt-4 lg:gap-4">
        {skills.map((skill) => {
          const Icon = ICONS[skill.kind]
          return (
            <li
              key={skill.kind}
              data-kind={skill.kind}
              className="talia-skill bg-fm-surface shadow-fm-card rounded-fm-3xl flex flex-col p-6 md:p-7"
            >
              <div className="flex items-center gap-3.5">
                <span className="talia-skill__icon bg-fm-fill rounded-fm-lg relative grid size-11 shrink-0 place-items-center">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  {skill.kind === "design" && (
                    <span aria-hidden="true" className="talia-skill__select">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  {skill.kind === "code" && (
                    <span aria-hidden="true" className="talia-skill__caret" />
                  )}
                  {skill.kind === "teaching" && (
                    <MousePointer2 aria-hidden="true" className="talia-skill__cursor" />
                  )}
                </span>
                <h3 className="text-fm-h3 font-semibold">{skill.title}</h3>
              </div>
              <p className="text-fm-small text-fm-ink-2 mt-4 text-pretty">
                {typo(skill.description)}
              </p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {skill.tools.map((tool) => (
                  <li key={tool}>
                    <Chip className="text-[0.75rem]">{tool}</Chip>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
