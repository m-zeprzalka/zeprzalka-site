"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import {
  AnimatePresence,
  animate,
  useIsPresent,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react"
import * as m from "motion/react-m"
import NumberFlow from "@number-flow/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "@/lib/utils"
import { DeckCard } from "./DeckCard"
import { PauseToggle } from "./PauseToggle"
import { useTalia } from "./TaliaProvider"
import type { Project } from "./types"

/** Trzy karty widać, czwarta czeka pod spodem, żeby wejść bez mignięcia. */
const WINDOW = 4
/** Lekki, nierówny skos kart pod spodem — talia z ręki, nie z drukarki. */
const TILT = [0, -1.6, 1.4, 0]
/** Próg rzutu: przesunięcie albo prędkość palca. */
const THROW_OFFSET = 90
const THROW_VELOCITY = 450
const THROW_DISTANCE = 520
const SPRING = { type: "spring", visualDuration: 0.42, bounce: 0 } as const

interface Thrown {
  slug: string
  dir: 1 | -1
}

export interface StackLabels {
  region: string
  previous: string
  next: string
  pause: string
}

const pad = (value: number) => String(value).padStart(2, "0")

/**
 * Stos realizacji na telefonie. Wierzchnią kartę odrzuca się palcem
 * z prędkością (Motion: oś zablokowana, pionowe przewijanie strony działa),
 * a odrzucona wraca na spód talii. Pod spodem karty reagują na gest od
 * pierwszego piksela — jedna zmienna CSS (`--pull`) podsuwa całą talię.
 * Alternatywa bez gestu: przyciski, strzałki na klawiaturze, licznik
 * ogłaszany czytnikom ekranu.
 */
export function HeroStack({
  projects,
  labels,
}: {
  projects: readonly Project[]
  labels: StackLabels
}) {
  const total = projects.length
  const [index, setIndex] = useState(0)
  const [thrown, setThrown] = useState<Thrown | null>(null)
  const [entering, setEntering] = useState<string | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const refocus = useRef(false)
  const reduced = useReducedMotion()

  const at = (offset: number) => projects[(index + offset + total) % total]
  const current = at(0)

  function setPull(value: number) {
    stackRef.current?.style.setProperty("--pull", value.toFixed(3))
  }

  function next(dir: 1 | -1 = -1) {
    if (!current) return
    setPull(0)
    setThrown({ slug: current.slug, dir })
    setEntering(null)
    setIndex((value) => (value + 1) % total)
  }

  function previous() {
    const incoming = at(-1)
    if (!incoming) return
    setThrown(null)
    setEntering(incoming.slug)
    setIndex((value) => (value - 1 + total) % total)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    refocus.current = true
    if (event.key === "ArrowRight") next()
    else previous()
  }

  // Strzałki działają na karcie, która właśnie odlatuje — fokus przechodzi
  // na nową wierzchnią, zamiast przepaść razem z odrzuconą.
  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    stackRef.current
      ?.querySelector<HTMLButtonElement>("[data-top] button")
      ?.focus({ preventScroll: true })
  }, [index])

  const cards = Array.from({ length: Math.min(WINDOW, total) }, (_, k) => at(k)).filter(
    (project): project is Project => project !== undefined
  )

  return (
    <div>
      <div
        ref={stackRef}
        role="group"
        aria-label={labels.region}
        className="talia-stack"
        onKeyDown={onKeyDown}
      >
        <AnimatePresence initial={false} custom={thrown}>
          {cards.map((project, k) => (
            <StackSlot
              key={project.slug}
              project={project}
              k={k}
              first={index === 0 && k === 0 && thrown === null && entering === null}
              entering={entering === project.slug}
              draggable={k === 0 && !reduced}
              onPull={setPull}
              onThrow={next}
              dragging={(on) => {
                if (on) stackRef.current?.setAttribute("data-dragging", "")
                else stackRef.current?.removeAttribute("data-dragging")
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-7 flex items-center justify-center gap-3">
        <StackButton label={labels.previous} onClick={previous}>
          <ChevronLeft />
        </StackButton>
        <span
          aria-hidden="true"
          className="bg-fm-fill inline-flex h-9 min-w-[5.75rem] items-center justify-center gap-1 rounded-full px-3.5 text-sm font-medium tabular-nums"
        >
          <NumberFlow value={index + 1} format={{ minimumIntegerDigits: 2 }} />
          <span className="text-fm-ink-3">/ {pad(total)}</span>
        </span>
        <StackButton label={labels.next} onClick={() => next()}>
          <ChevronRight />
        </StackButton>
        {/* Ujemny margines równy szerokości + odstępowi: trójka ‹ licznik › zostaje na osi. */}
        <PauseToggle
          label={labels.pause}
          className="text-fm-ink-2 hover:bg-fm-fill hover:text-fm-ink -me-14"
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {current ? `${current.title} — ${index + 1} / ${total}` : ""}
      </p>
    </div>
  )
}

function StackSlot({
  project,
  k,
  first,
  entering,
  draggable,
  onPull,
  onThrow,
  dragging,
}: {
  project: Project
  k: number
  first: boolean
  entering: boolean
  draggable: boolean
  onPull: (value: number) => void
  onThrow: (dir: 1 | -1) => void
  dragging: (on: boolean) => void
}) {
  const { openProject } = useTalia()
  const present = useIsPresent()
  const x = useMotionValue(0)
  // Obrót wynika z przesunięcia — karta „wisi” na palcu, nie obraca się sama.
  const rotate = useTransform(x, [-220, 0, 220], [-11, 0, 11])
  const dragged = useRef(false)
  const top = k === 0 && present

  function onDragEnd(_: unknown, info: PanInfo) {
    dragging(false)
    const far = Math.abs(info.offset.x) > THROW_OFFSET
    const fast = Math.abs(info.velocity.x) > THROW_VELOCITY
    if (far || fast) {
      onThrow(info.offset.x < 0 ? -1 : 1)
    } else {
      onPull(0)
      animate(x, 0, { type: "spring", visualDuration: 0.35, bounce: 0.25 })
    }
  }

  return (
    <div
      className="talia-stack__slot"
      data-top={top || undefined}
      inert={!top}
      style={{ "--k": k, "--tilt": TILT[k] ?? 0 } as CSSProperties}
    >
      <m.div
        className="size-full touch-pan-y"
        style={{ x, rotate }}
        initial={entering ? { x: -THROW_DISTANCE, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        transition={SPRING}
        variants={{
          // Odrzucona karta leci dalej z prędkością palca; reszta po prostu znika.
          exit: (gone: Thrown | null) =>
            gone?.slug === project.slug
              ? {
                  x: gone.dir * THROW_DISTANCE,
                  opacity: 0,
                  transition: { x: SPRING, opacity: { duration: 0.25, delay: 0.12 } },
                }
              : { opacity: 0, transition: { duration: 0.15 } },
        }}
        exit="exit"
        drag={draggable ? "x" : false}
        dragDirectionLock
        dragMomentum={false}
        onDragStart={() => {
          dragged.current = true
          dragging(true)
        }}
        onDrag={(_, info) => onPull(Math.min(Math.abs(info.offset.x) / 160, 1))}
        onDragEnd={onDragEnd}
      >
        <span className={cn("block size-full", first && "talia-stack__hint")}>
          <button
            type="button"
            aria-haspopup="dialog"
            tabIndex={top ? 0 : -1}
            className="fm-focus rounded-fm-3xl block size-full cursor-pointer select-none"
            onClick={(event) => {
              // Puszczenie po przeciągnięciu myszą to też „click” — ignorujemy go.
              if (dragged.current) {
                dragged.current = false
                return
              }
              openProject(project.slug, "stack", event.currentTarget)
            }}
          >
            <DeckCard
              project={project}
              origin="stack"
              active={top}
              hero={k < 3}
              sizes="(min-width: 768px) 1px, 20rem"
              className="shadow-fm-pop size-full"
            />
          </button>
        </span>
      </m.div>
    </div>
  )
}

function StackButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="fm-focus fm-press bg-fm-surface text-fm-ink shadow-fm-ring hover:bg-fm-fill grid size-11 place-items-center rounded-full transition-[background-color,scale] [&_svg]:size-[1.125rem]"
    >
      {children}
    </button>
  )
}
