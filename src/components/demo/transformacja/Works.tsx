"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import { flushSync } from "react-dom"
import { Dialog, ToggleGroup } from "radix-ui"
import { ArrowUpRight, Pause, Play, X } from "lucide-react"
import type { DemoWork } from "@/components/demo/shared/content"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"

const FINE = "(hover: hover) and (pointer: fine)"
const subscribeFine = (onChange: () => void) => {
  const media = window.matchMedia(FINE)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
/** `true` przy myszy — tam kafel gra po najechaniu; na dotyku gra, gdy jest w kadrze. */
function useFinePointer() {
  return useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => false
  )
}

/** Na start dziewięć realizacji: po kolei z każdej grupy, żeby kolumny się mieszały. */
const PREVIEW = 9

function highlights(works: readonly DemoWork[]) {
  const byGroup = new Map<string, DemoWork[]>()
  for (const work of works) byGroup.set(work.group, [...(byGroup.get(work.group) ?? []), work])
  const queues = [...byGroup.values()]
  const picked: DemoWork[] = []
  for (let round = 0; picked.length < PREVIEW && queues.some((queue) => queue[round]); round++) {
    for (const queue of queues) {
      const work = queue[round]
      if (work && picked.length < PREVIEW) picked.push(work)
    }
  }
  return picked
}

interface Labels {
  all: string
  showAll: string
  filter: string
  open: string
  openSite: string
  close: string
  pause: string
  play: string
  allWorks: { label: string; href: string }
}

/**
 * Portfolio jako masonry: plakaty w naturalnych proporcjach (wymiary znane
 * z góry — zero skoku układu), wideo dopiero przy kaflu. Filtr grup
 * przestawia kafle przejściem View Transitions (300 ms, krzywa ruchu po
 * ekranie); kafel otwiera podgląd w oknie dialogowym.
 */
export function Works({
  works,
  groups,
  labels,
}: {
  works: readonly DemoWork[]
  groups: readonly { id: string; label: string; description: string }[]
  labels: Labels
}) {
  const [filter, setFilter] = useState("all")
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  const preview = filter === "all" && !expanded
  const shown = preview
    ? highlights(works)
    : filter === "all"
      ? works
      : works.filter((work) => work.group === filter)
  const current = works.find((work) => work.slug === selected) ?? null
  const options = [
    { id: "all", label: labels.all, count: works.length },
    ...groups.map((group) => ({
      id: group.id,
      label: group.label,
      count: works.filter((work) => work.group === group.id).length,
    })),
  ]

  /** Zmiana listy kafli z przejściem View Transitions (bez wsparcia albo przy „ogranicz ruch” — od razu). */
  function relayout(update: () => void) {
    const list = listRef.current
    if (!list || reduced || typeof document.startViewTransition !== "function") return update()
    // Nazwy przejścia tylko na czas zmiany — inaczej przełącznik motywu
    // (też View Transition) fotografowałby każdy kafel osobno.
    list.dataset.vt = ""
    const transition = document.startViewTransition(() => flushSync(update))
    void transition.finished.finally(() => delete list.dataset.vt)
  }

  function choose(next: string) {
    if (next && next !== filter) relayout(() => setFilter(next))
  }

  return (
    <>
      <ToggleGroup.Root
        type="single"
        value={filter}
        onValueChange={choose}
        aria-label={labels.filter}
        className="-mx-(--fm-gutter) mt-8 flex [scrollbar-width:none] gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)] px-(--fm-gutter) pb-1 sm:[mask-image:none] lg:mt-10"
      >
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.id}
            value={option.id}
            className="inline-flex h-10 shrink-0 fm-press items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap text-fm-ink-2 shadow-fm-ring fm-focus transition-[background-color,color,box-shadow,scale] duration-150 ease-fm-snap select-none hover:text-fm-ink data-[state=on]:bg-fm-ink data-[state=on]:text-fm-inverse data-[state=on]:shadow-none"
          >
            {option.label}
            <span className="text-fm-micro tabular-nums opacity-60">{option.count}</span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      <ul ref={listRef} className="tf-works mt-6 lg:mt-8">
        {shown.map((work) => (
          <WorkTile
            key={work.slug}
            work={work}
            fine={fine}
            reduced={reduced}
            openLabel={labels.open}
            onOpen={() => setSelected(work.slug)}
          />
        ))}
      </ul>

      {preview && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => relayout(() => setExpanded(true))}
            className="inline-flex h-11 fm-press items-center gap-2 rounded-full bg-fm-surface px-5 text-sm font-medium text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-fill"
          >
            {labels.showAll}
            <span className="text-fm-micro text-fm-ink-3 tabular-nums">{works.length}</span>
          </button>
        </div>
      )}

      <WorkDialog
        work={current}
        description={
          current?.description ?? groups.find((group) => group.id === current?.group)?.description
        }
        reduced={reduced}
        labels={labels}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

function WorkTile({
  work,
  fine,
  reduced,
  openLabel,
  onOpen,
}: {
  work: DemoWork
  fine: boolean
  reduced: boolean
  openLabel: string
  onOpen: () => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hover, setHover] = useState(false)
  const [inView, setInView] = useState(false)
  // Plik wideo dostaje dopiero kafel, który choć raz był aktywny.
  const [armed, setArmed] = useState(false)
  const active = !reduced && (fine ? hover : inView)

  useEffect(() => {
    const node = ref.current
    if (!node || fine || !work.video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry && entry.intersectionRatio >= 0.6
        setInView(visible)
        if (visible) setArmed(true)
      },
      { threshold: [0, 0.6] }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [fine, work.video])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !armed) return
    if (active) video.play().catch(() => {})
    else video.pause()
  }, [active, armed])

  return (
    <li ref={ref} className="tf-tile" style={{ "--vt": `tf-w-${work.slug}` } as CSSProperties}>
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return
          setHover(true)
          setArmed(true)
        }}
        onPointerLeave={() => setHover(false)}
        aria-haspopup="dialog"
        aria-label={`${openLabel}: ${work.title}`}
        className="group block w-full rounded-fm-2xl text-left fm-focus"
      >
        <span
          className="tf-r-2xl relative block overflow-hidden bg-fm-fill shadow-fm-ring"
          style={{ aspectRatio: `${work.width} / ${work.height}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- plakat 720 px o znanych wymiarach, ten sam plik jest plakatem wideo */}
          <img
            src={work.poster}
            alt=""
            width={work.width}
            height={work.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-fm-snap group-hover:scale-[1.025]"
          />
          {work.video && (
            <video
              ref={videoRef}
              src={armed ? work.video : undefined}
              poster={work.poster}
              preload="none"
              muted
              loop
              playsInline
              aria-hidden="true"
              className={cn(
                "absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 ease-fm-snap group-hover:scale-[1.025]",
                active ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </span>
        <span className="mt-2.5 flex flex-col gap-0.5 px-0.5 sm:mt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="min-w-0 text-[0.875rem] leading-snug font-medium tracking-[-0.01em] text-fm-ink sm:text-[0.9375rem]">
            {work.title}
          </span>
          <span className="shrink-0 text-fm-micro text-fm-ink-3">{work.category}</span>
        </span>
      </button>
    </li>
  )
}

function WorkDialog({
  work,
  description,
  reduced,
  labels,
  onClose,
}: {
  work: DemoWork | null
  description?: string
  reduced: boolean
  labels: Labels
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  return (
    <Dialog.Root
      open={!!work}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          setPaused(false)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        {work && (
          <Dialog.Content
            // Szerokość z proporcji kadru: pionowy klip nie dostaje szarych pasów po bokach.
            style={{
              width: `min(100vw - 1.5rem, 60rem, 68dvh * ${(work.width / work.height).toFixed(3)} + 1.25rem)`,
            }}
            className="fm tf-sheet fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] -translate-1/2 flex-col overflow-hidden rounded-fm-3xl bg-fm-surface p-2 shadow-fm-float outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.96] sm:p-2.5"
          >
            <div
              className="relative min-h-0 overflow-hidden rounded-fm-2xl bg-fm-fill"
              style={{ aspectRatio: `${work.width} / ${work.height}` }}
            >
              {work.video ? (
                <>
                  <video
                    ref={videoRef}
                    src={work.video}
                    poster={work.poster}
                    autoPlay={!reduced}
                    muted
                    loop
                    playsInline
                    onPlay={() => setPaused(false)}
                    onPause={() => setPaused(true)}
                    className="absolute inset-0 size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const video = videoRef.current
                      if (!video) return
                      if (video.paused) video.play().catch(() => {})
                      else video.pause()
                    }}
                    aria-label={paused || reduced ? labels.play : labels.pause}
                    className="absolute right-3 bottom-3 grid size-11 fm-press place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md transition-[background-color,scale] duration-150 hover:bg-fm-surface"
                  >
                    {paused || reduced ? (
                      <Play aria-hidden="true" className="size-4 translate-x-px" />
                    ) : (
                      <Pause aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- ten sam plakat, który kafel już pobrał
                <img
                  src={work.poster}
                  alt=""
                  width={work.width}
                  height={work.height}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-4 px-3 pt-4 pb-3 sm:flex-row sm:items-end sm:justify-between sm:px-4">
              <div className="min-w-0">
                <p className="text-fm-micro font-medium text-fm-ink-3">{work.category}</p>
                <Dialog.Title className="mt-1 text-[1.375rem] leading-tight font-semibold tracking-[-0.025em] text-fm-ink">
                  {work.title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1.5 max-w-[36rem] text-fm-small text-pretty text-fm-ink-2">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <a
                href={work.url ?? labels.allWorks.href}
                {...(work.url ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group inline-flex h-11 shrink-0 fm-press items-center justify-center gap-1.5 rounded-full bg-fm-ink ps-5 pe-4 text-sm font-medium text-fm-inverse fm-focus transition-[background-color,scale] duration-150 ease-fm-snap select-none hover:bg-fm-ink/85"
              >
                {work.url ? labels.openSite : labels.allWorks.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
            <Dialog.Close
              aria-label={labels.close}
              className="absolute top-4 right-4 grid size-10 fm-press place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md transition-[background-color,scale] duration-150 hover:bg-fm-surface sm:top-5 sm:right-5"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  )
}
