"use client"

import { useRef, useState } from "react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { typo } from "@/components/demo/forma/typo"
import type { PortfolioGroup } from "@/lib/portfolio"
import { DeckCard } from "./DeckCard"
import { FINE_POINTER, useMedia } from "./hooks"
import { Segmented, type SegmentOption } from "./Segmented"
import { useTalia } from "./TaliaProvider"
import type { Project, ProjectGroup } from "./types"

type Filter = "all" | PortfolioGroup

export interface WorksLabels {
  title: string
  all: string
  allDescription: string
}

/** Tasowanie: sprężyna ok. 400 ms, karty ruszają po kolei co 20 ms. */
const SHUFFLE = { type: "spring", visualDuration: 0.42, bounce: 0.14 } as const

/**
 * Cała talia rozłożona na stole. Filtr nie chowa kart, tylko je tasuje:
 * znikające zjeżdżają z rozmyciem, pozostałe fizycznie przesuwają się na
 * nowe miejsca (Motion `layout`). Desktop: siatka 3–4 kolumn, pętla gra
 * pod kursorem. Telefon: natywna taśma ze `scroll-snap`, następna karta
 * wystaje zza krawędzi; tu same plakaty — film gra w karcie otwartej
 * w dialogu, a budżet wideo zostaje dla stosu w hero.
 */
export function Works({
  projects,
  groups,
  labels,
}: {
  projects: readonly Project[]
  groups: readonly ProjectGroup[]
  labels: WorksLabels
}) {
  const [filter, setFilter] = useState<Filter>("all")
  const [active, setActive] = useState<string | null>(null)
  const fine = useMedia(FINE_POINTER)
  const reduced = useReducedMotion()
  const track = useRef<HTMLUListElement>(null)

  const shown = filter === "all" ? projects : projects.filter((item) => item.group === filter)
  const description =
    filter === "all"
      ? labels.allDescription
      : (groups.find((group) => group.id === filter)?.description ?? "")

  const options: SegmentOption<Filter>[] = [
    { id: "all", label: labels.all, count: projects.length },
    ...groups.map((group) => ({
      id: group.id,
      label: group.label,
      count: projects.filter((item) => item.group === group.id).length,
    })),
  ]

  function choose(next: Filter) {
    setFilter(next)
    track.current?.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" })
  }

  const blur = reduced ? {} : { filter: "blur(4px)" }

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h2 id="realizacje-tytul" className="text-fm-h2 font-semibold">
            {labels.title}
          </h2>
          <div className="mt-3 grid">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.p
                key={filter}
                className="text-fm-lead text-fm-ink-2 col-start-1 row-start-1 text-pretty"
                initial={{ opacity: 0, y: 6, ...blur }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.32 } }}
                exit={{ opacity: 0, y: -4, ...blur, transition: { duration: 0.16 } }}
              >
                {typo(description)}
              </m.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="talia-scroller -mx-(--fm-gutter) overflow-x-auto px-(--fm-gutter) md:mx-0 md:overflow-visible md:px-0">
          <Segmented
            options={options}
            value={filter}
            onChange={choose}
            labelledBy="realizacje-tytul"
          />
        </div>
      </div>

      <m.ul
        ref={track}
        layoutScroll
        className="talia-scroller -mx-(--fm-gutter) mt-8 flex snap-x snap-mandatory scroll-px-(--fm-gutter) gap-3 overflow-x-auto px-(--fm-gutter) pb-2 md:mx-0 md:mt-10 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-5"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, index) => (
            <m.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.92, ...blur }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, ...blur, transition: { duration: 0.2 } }}
              transition={{
                layout: { ...SHUFFLE, delay: index * 0.02 },
                default: { duration: 0.3, delay: 0.08 + index * 0.02 },
              }}
              className="w-[80vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <WorkCard
                project={project}
                active={project.slug === active}
                onHover={(on) => fine && setActive(on ? project.slug : null)}
              />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </div>
  )
}

function WorkCard({
  project,
  active,
  onHover,
}: {
  project: Project
  active: boolean
  onHover: (on: boolean) => void
}) {
  const { openProject } = useTalia()
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onClick={(event) => openProject(project.slug, "works", event.currentTarget)}
      className="group fm-focus fm-press-soft rounded-fm-3xl block w-full cursor-pointer"
    >
      <DeckCard
        project={project}
        origin="works"
        active={active}
        zoom
        sizes="(min-width: 1024px) 18rem, (min-width: 768px) 30vw, 80vw"
        className="group-hover:shadow-fm-pop transition-shadow duration-300"
      />
    </button>
  )
}
