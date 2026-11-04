/**
 * Treść koncepcji „Transformacja” — wyłącznie z modułu wspólnego
 * (`shared/content.ts`), uzupełniona o to, co scena pokazuje „od kuchni”:
 * kod komponentu hero i log builda złożone z prawdziwej treści i prawdziwego
 * stosu (wersja Next.js z `package.json`). Moduł serwerowy.
 */
import { version as nextVersion } from "next/package.json"
import { getDemoHomeContent, type DemoHomeContent } from "@/components/demo/shared/content"
import { typo } from "@/components/demo/forma/typo"
import type { CodeLine, LogLine, Stage } from "./types"

/** Etapy sceny i kompetencja, którą każdy z nich pokazuje (Szkic i Projekt to jedna). */
const STAGES: readonly Omit<Stage, "competency">[] = [
  { id: "szkic", label: "Szkic" },
  { id: "projekt", label: "Projekt" },
  { id: "kod", label: "Kod" },
  { id: "produkt", label: "Produkt" },
]
const STAGE_COMPETENCY = [0, 0, 1, 2] as const

/** Kod hero tak, jak go widać w edytorze: wiersze z tokenami do monochromatycznego podświetlenia. */
function heroCode(content: DemoHomeContent): CodeLine[] {
  const { hero } = content
  const tag = (name: string) => ({ kind: "tag" as const, text: name })
  const p = (text: string) => ({ kind: "punct" as const, text })
  const attr = (name: string, value: string) => [
    { kind: "attr" as const, text: ` ${name}` },
    p("="),
    { kind: "string" as const, text: `"${value}"` },
  ]
  const text = (value: string) => ({ kind: "text" as const, text: value })

  return [
    [{ kind: "keyword", text: "export function " }, { kind: "fn", text: "Hero" }, p("() {")],
    [{ kind: "keyword", text: "  return " }, p("(")],
    [p("    <"), tag("section"), ...attr("className", "hero"), p(">")],
    [
      p("      <"),
      tag("Status"),
      { kind: "attr", text: " live" },
      p(">"),
      text(hero.status),
      p("</"),
      tag("Status"),
      p(">"),
    ],
    [p("      <"), tag("h1"), ...attr("className", "text-display"), p(">")],
    [text(`        ${hero.title}`)],
    [p("      </"), tag("h1"), p(">")],
    [p("      <"), tag("p"), ...attr("className", "text-lead text-ink-2"), p(">")],
    [text(`        ${hero.subtitle.role}${hero.subtitle.highlight}${hero.subtitle.rest}`)],
    [p("      </"), tag("p"), p(">")],
    [
      p("      <"),
      tag("Button"),
      ...attr("href", "#kontakt"),
      p(">"),
      text(hero.cta),
      p("</"),
      tag("Button"),
      p(">"),
    ],
    [
      p("      <"),
      tag("Video"),
      ...attr("src", hero.video.mp4),
      { kind: "attr", text: " loop" },
      p(" />"),
    ],
    [p("    </"), tag("section"), p(">")],
    [p("  )")],
    [p("}")],
  ]
}

/** Log builda: prawdziwe polecenie, prawdziwa wersja Next.js, prawdziwy hosting. */
function buildLog(domain: string): LogLine[] {
  return [
    { kind: "command", text: "pnpm build" },
    { kind: "info", text: `Next.js ${nextVersion}` },
    { kind: "step", text: "Compiled successfully" },
    { kind: "step", text: "Generating static pages" },
    { kind: "route", text: "/", detail: "Static" },
    { kind: "ready", text: "Ready", detail: domain },
  ]
}

export function getTransformacjaContent() {
  const content = getDemoHomeContent()
  const competencies = content.skills.items.map((skill) => ({
    ...skill,
    description: typo(skill.description),
    /** Podpis etapu w scenie: narzędzia jednym zdaniem (zawija się, bez ucinania). */
    toolsLine: skill.tools.join(", "),
  }))

  return {
    ...content,
    hero: { ...content.hero, title: typo(content.hero.title) },
    stages: STAGES.map((stage, index) => ({
      ...stage,
      competency: STAGE_COMPETENCY[index] ?? 0,
    })),
    competencies,
    code: { file: "Hero.tsx", lines: heroCode(content) },
    log: buildLog(content.person.domain),
  }
}

export type TransformacjaContent = ReturnType<typeof getTransformacjaContent>
