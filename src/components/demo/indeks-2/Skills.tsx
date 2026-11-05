"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { cardHandlers, useCardActive, useCardState } from "./card-store"
import { GlyphFigure } from "./glyph"
import { COL } from "./grid"
import { ICONS } from "./icons"
import { SectionHead } from "./SectionHead"
import type { Indeks2Content } from "./content"
import type { Skill } from "./types"

const FIGURE_ID = "i2-skill-figure"

/**
 * Kompetencje jako segmenty (układ z Rentgenu, w wąskiej kolumnie): tytuł,
 * opis, narzędzia jako chipy i przykłady. Od 1024 px na marginesie stoi
 * przyklejona figura ze znaków — zmienia się z segmentem w środku ekranu,
 * a wskazany przykład zajmuje jej miejsce (jak twarz na starcie). Bez
 * akordeonu: nic się nie zwija, więc nic nie ucieka z kadru.
 */
export function Skills({
  skills,
  proofsLabel,
}: {
  skills: Indeks2Content["skills"]
  proofsLabel: string
}) {
  const [active, setActive] = useState(skills.items[0]?.id ?? "")
  const listRef = useRef<HTMLOListElement>(null)

  // Aktywny = ostatni segment, którego góra minęła połowę ekranu (przed pierwszym — pierwszy,
  // za ostatnim — ostatni). Liczone przy przewijaniu, więc krańce sekcji też są dobre.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const nodes = Array.from(list.querySelectorAll<HTMLElement>("[data-skill]"))
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.5
      let id = nodes[0]?.dataset.skill ?? ""
      for (const node of nodes)
        if (node.getBoundingClientRect().top <= line) id = node.dataset.skill ?? id
      setActive(id)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  const current = skills.items.find((skill) => skill.id === active) ?? skills.items[0]

  return (
    <section
      id={SECTION.skills}
      aria-labelledby={`${SECTION.skills}-title`}
      className="pt-(--i2-section)"
    >
      <div className="i2-grid">
        <div className={COL.text}>
          <SectionHead id={`${SECTION.skills}-title`} title={skills.title} lead={skills.lead} />
          <ol ref={listRef} className="mt-8 sm:mt-10">
            {skills.items.map((skill) => (
              <Segment
                key={skill.id}
                skill={skill}
                active={skill.id === active}
                proofsLabel={proofsLabel}
              />
            ))}
          </ol>
        </div>
        <div className={cn("hidden lg:block", COL.margin)}>
          {current && <MarginFigure skill={current} />}
        </div>
      </div>
    </section>
  )
}

function Segment({
  skill,
  active,
  proofsLabel,
}: {
  skill: Skill
  active: boolean
  proofsLabel: string
}) {
  const Icon = ICONS[skill.icon]
  return (
    <li
      data-skill={skill.id}
      className="border-t border-fm-edge py-10 first:border-t-0 first:pt-2 sm:py-12"
    >
      <h3 className="flex items-center gap-3.5 text-[1.25rem] leading-tight font-medium tracking-[-0.02em] text-fm-ink sm:text-[1.375rem]">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full bg-fm-fill text-fm-ink-2 transition-colors duration-300",
            active && "lg:bg-fm-ink lg:text-fm-inverse"
          )}
        >
          <Icon className="size-[1.125rem]" strokeWidth={1.75} />
        </span>
        {skill.title}
      </h3>
      <p className="mt-4 text-fm-body text-pretty text-fm-ink-2">{skill.description}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {skill.tags.map((tag) => (
          <li
            key={tag}
            className="inline-flex h-8 items-center rounded-full bg-fm-fill px-3.5 text-fm-small text-fm-ink-2"
          >
            {tag}
          </li>
        ))}
      </ul>
      {skill.proofs.length > 0 && (
        <div className="mt-7">
          <p className="text-fm-micro font-medium text-fm-ink-3">{proofsLabel}</p>
          <ul className="-mx-(--i2-bleed) mt-2">
            {skill.proofs.map((proof) => (
              <ProofRow key={proof.card} proof={proof} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

function ProofRow({ proof }: { proof: Skill["proofs"][number] }) {
  const active = useCardActive(proof.card)
  const leavesPage = proof.href.startsWith("/")
  return (
    <li>
      <a
        href={proof.href}
        data-dock={FIGURE_ID}
        data-active={active || undefined}
        {...cardHandlers(proof.card, { tap: false })}
        className="group flex min-h-11 items-center gap-4 rounded-full px-(--i2-bleed) text-fm-small fm-focus transition-colors duration-150 hover:bg-fm-fill data-active:bg-fm-fill"
      >
        <span className="min-w-0 flex-1 truncate text-fm-ink">{proof.label}</span>
        <span className="shrink-0 truncate text-fm-ink-3 tabular-nums">{proof.meta}</span>
        <ArrowUpRight
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-fm-ink-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            !leavesPage && "rotate-90 group-hover:translate-y-0.5"
          )}
        />
      </a>
    </li>
  )
}

/** Przyklejona figura segmentu; znika, gdy karta przykładu zadokuje w jej miejscu. */
function MarginFigure({ skill }: { skill: Skill }) {
  const { key, via, anchor } = useCardState()
  const docked = !!key && via !== "tap" && anchor?.dataset.dock === FIGURE_ID
  return (
    <div id={FIGURE_ID} className="sticky top-[calc(var(--i2-header)+1.5rem)] pt-14">
      <div
        data-docked={docked || undefined}
        className="transition-[opacity,filter,scale] duration-300 ease-[var(--i2-out)] data-docked:scale-[0.98] data-docked:opacity-0 data-docked:blur-[6px] data-docked:duration-200"
      >
        {/* Nowa figura wchodzi przenikaniem (klucz = segment). */}
        <div key={skill.id} className="i2-fade-in">
          <GlyphFigure shape={skill.figure} label={skill.title} className="w-full" />
        </div>
        <p className="mt-4 text-fm-small text-fm-ink-3">{skill.title}</p>
      </div>
    </div>
  )
}
