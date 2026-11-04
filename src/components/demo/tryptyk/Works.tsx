"use client"

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react"
import { flushSync } from "react-dom"
import Image, { getImageProps } from "next/image"
import { ToggleGroup } from "radix-ui"
import { ArrowUpRight, LayoutGrid, List } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "../forma/cn"
import { STAGE_ID, STAGE_SIZES, workAnchor, workFromHash } from "./anchors"
import { useHasStage } from "./hooks"
import { Media } from "./Media"
import { point, useStage } from "./store"
import type { Work } from "./types"

interface Labels {
  play: string
  pause: string
  newTab: string
  link: { label: string; href: string }
  view: { label: string; list: string; gallery: string }
  count: string
}

type View = "gallery" | "list"

/** Czas rozwinięcia panelu (CSS `.tk-panel`) + zapas — tyle trwa kotwiczenie przewijania. */
const PANEL_MS = 400
/** Szerokość kafla galerii (dwie kolumny dokumentu) dla next/image. */
const TILE_SIZES = "(min-width: 90rem) 22rem, (min-width: 64rem) 20rem, 50vw"

/**
 * Realizacje w dwóch widokach: Galeria (masonry z podpisami — domyślnie, bo
 * to praca ma być widoczna) i Lista (indeks: miniatura, tytuł, kategoria).
 *
 * Od 1024 px kafel albo wiersz wybiera realizację do sceny: przy kliknięciu
 * myszą kadr ze sceny startuje w miejscu miniatury i rośnie do sceny (View
 * Transition, nowy stan jako źródło — ostry od pierwszej klatki). Kolumna się
 * nie przelewa, więc każde kliknięcie wygląda jak pierwsze. Poniżej 1024 px
 * kafel albo wiersz rozwija się w miejscu (wideo, opis, link); przy
 * przełączaniu dotknięty element zostaje pod palcem.
 */
export function Works({ works, labels }: { works: readonly Work[]; labels: Labels }) {
  const hasStage = useHasStage()
  const reduced = useReducedMotion()
  const selected = useStage((s) => s.work) || works[0]?.slug
  const [view, setView] = useState<View>("gallery")
  const [open, setOpen] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const pointerType = useRef<string>("mouse")
  const anchorFrame = useRef(0)

  const onHash = useEffectEvent(() => {
    const slug = workFromHash(window.location.hash)
    if (!slug || !works.some((work) => work.slug === slug)) return
    if (hasStage) point("realizacje", { work: slug, enter: "fade" })
    else setOpen(slug)
    rowButton(slug)?.focus({ preventScroll: true })
  })

  useEffect(() => {
    // Adres z kotwicą przy wejściu: reagujemy po pierwszym układzie.
    const frame = requestAnimationFrame(() => onHash())
    window.addEventListener("hashchange", onHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", onHash)
    }
  }, [])

  useEffect(() => () => cancelAnimationFrame(anchorFrame.current), [])

  function onActivate(event: MouseEvent<HTMLElement>, slug: string) {
    const item = event.currentTarget.closest<HTMLElement>("li[id]")
    if (!item) return
    if (hasStage) return select(slug, item, event.detail > 0 && pointerType.current !== "touch")
    toggle(slug, item)
  }

  /* — Od 1024 px: wybór do sceny — */
  function select(slug: string, item: HTMLElement, viaPointer: boolean) {
    if (slug === selected && visibleStageKey() === `work:${slug}`) return
    const thumb = item.querySelector<HTMLElement>("[data-thumb]")
    if (!viaPointer || reduced || !thumb || typeof document.startViewTransition !== "function") {
      return point("realizacje", { work: slug, enter: "fade" })
    }
    const oldLayer = document.querySelector<HTMLElement>(
      `#${STAGE_ID} .tk-layer:not([data-leaving])`
    )
    thumb.style.viewTransitionName = "tk-fly"
    if (oldLayer) oldLayer.style.viewTransitionName = "tk-stage-old"
    let media: HTMLElement | null = null

    const transition = document.startViewTransition(() => {
      // Kadr leci osobno jako `tk-fly`; napisy nowego slajdu przenikają (stary gaśnie w 140 ms).
      flushSync(() => point("realizacje", { work: slug, enter: "fly" }))
      thumb.style.viewTransitionName = ""
      // Stary slajd żegna się tylko jako zrzut przejścia — w żywym drzewie znika od razu.
      if (oldLayer) {
        oldLayer.style.viewTransitionName = ""
        oldLayer.style.visibility = "hidden"
      }
      media = document.querySelector<HTMLElement>(`[data-stage-media="work:${slug}"]`)
      if (media) {
        media.style.viewTransitionName = "tk-fly"
        media.dataset.flying = ""
      }
    })
    void transition.finished.finally(() => {
      if (!media) return
      media.style.viewTransitionName = ""
      delete media.dataset.flying
    })
  }

  /* — Poniżej 1024 px: rozwinięcie w miejscu z kotwiczeniem przewijania — */
  function toggle(slug: string, item: HTMLElement) {
    if (open === slug) return setOpen(null)
    const top = item.getBoundingClientRect().top
    const switching = open !== null
    setOpen(slug)
    cancelAnimationFrame(anchorFrame.current)
    let start = 0
    const follow = (time: number) => {
      start ||= time
      // Panel nad elementem się zwija — przewijamy o tyle, o ile element uciekł.
      if (switching) {
        const delta = item.getBoundingClientRect().top - top
        if (Math.abs(delta) > 0.5) window.scrollBy(0, delta)
      }
      if (time - start < PANEL_MS) {
        anchorFrame.current = requestAnimationFrame(follow)
        return
      }
      // Po rozwinięciu medium ma być w kadrze — bez przesuwania elementu pod nagłówek.
      const panel = document.getElementById(`${workAnchor(slug)}-panel`)
      const overflow = panel ? panel.getBoundingClientRect().bottom - window.innerHeight + 16 : 0
      const room = item.getBoundingClientRect().top - 80
      if (overflow > 0 && room > 0) {
        window.scrollBy({ top: Math.min(overflow, room), behavior: reduced ? "auto" : "smooth" })
      }
    }
    anchorFrame.current = requestAnimationFrame(follow)
  }

  const shared = {
    works,
    labels,
    hasStage,
    open,
    selected,
    onActivate,
    onPointerDown: (event: PointerEvent) => (pointerType.current = event.pointerType),
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <p className="text-fm-small text-fm-ink-3 tabular-nums">{labels.count}</p>
        <ToggleGroup.Root
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value as View)}
          aria-label={labels.view.label}
          className="flex rounded-full bg-fm-fill p-1"
        >
          {(["gallery", "list"] as const).map((value) => {
            const Icon = value === "gallery" ? LayoutGrid : List
            return (
              <ToggleGroup.Item
                key={value}
                value={value}
                className="relative inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-medium text-fm-ink-3 fm-focus transition-[background-color,color,box-shadow] duration-150 after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] hover:text-fm-ink data-[state=on]:bg-fm-surface data-[state=on]:text-fm-ink data-[state=on]:shadow-fm-ring"
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {labels.view[value]}
              </ToggleGroup.Item>
            )
          })}
        </ToggleGroup.Root>
      </div>

      {view === "gallery" ? (
        <Gallery {...shared} hovered={hovered} onHover={setHovered} />
      ) : (
        <Rows {...shared} />
      )}
    </div>
  )
}

interface ViewProps {
  works: readonly Work[]
  labels: Labels
  hasStage: boolean
  open: string | null
  selected?: string
  onActivate: (event: MouseEvent<HTMLElement>, slug: string) => void
  onPointerDown: (event: PointerEvent) => void
}

/* ——— Galeria: masonry w dwóch kolumnach z podpisami ——— */

/** Kolejne kafle trafiają do niższej kolumny — wymiary plakatów są znane, więc bez mierzenia. */
function balance(works: readonly Work[]): [Work[], Work[]] {
  const columns: [Work[], Work[]] = [[], []]
  const heights = [0, 0]
  for (const work of works) {
    const target = (heights[0] ?? 0) <= (heights[1] ?? 0) ? 0 : 1
    columns[target].push(work)
    // Wysokość kafla w jednostkach szerokości + stała na podpis.
    heights[target] = (heights[target] ?? 0) + work.height / work.width + 0.32
  }
  return columns
}

function Gallery({
  works,
  labels,
  hasStage,
  open,
  selected,
  onActivate,
  onPointerDown,
  hovered,
  onHover,
}: ViewProps & { hovered: string | null; onHover: (slug: string | null) => void }) {
  const columns = useMemo(() => balance(works), [works])

  return (
    <div className="grid grid-cols-2 items-start gap-x-3 sm:gap-x-4">
      {columns.map((column, index) => (
        <ol key={index} className="flex flex-col gap-6 sm:gap-7">
          {column.map((work) => {
            const isOpen = !hasStage && open === work.slug
            const isCurrent = hasStage && selected === work.slug
            const active = isOpen || (hasStage && hovered === work.slug)
            const panelId = `${workAnchor(work.slug)}-panel`
            return (
              <li
                key={work.slug}
                id={workAnchor(work.slug)}
                data-current={isCurrent || undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return
                  onHover(work.slug)
                  if (hasStage) warm(work)
                }}
                onPointerLeave={() => onHover(null)}
                className="tk-tile relative scroll-mt-24"
              >
                <Media
                  title={work.title}
                  poster={work.poster}
                  video={work.video}
                  ratio={work.width / work.height}
                  active={active}
                  controls={active}
                  sizes={TILE_SIZES}
                  labels={labels}
                  style={{ aspectRatio: work.width / work.height }}
                  className="w-full rounded-fm-xl"
                  data-thumb
                />
                <div className="mt-2.5 flex flex-col gap-0.5 sm:mt-3">
                  <button
                    type="button"
                    data-row-button
                    onPointerDown={onPointerDown}
                    onClick={(event) => onActivate(event, work.slug)}
                    aria-controls={hasStage ? STAGE_ID : panelId}
                    aria-expanded={hasStage ? undefined : isOpen}
                    aria-current={isCurrent || undefined}
                    className="text-left text-[0.9375rem] leading-snug font-medium tracking-[-0.01em] text-fm-ink outline-none after:absolute after:inset-0 after:content-[''] sm:text-base"
                  >
                    {work.title}
                  </button>
                  <span className="text-[0.8125rem] text-fm-ink-2 sm:text-fm-small">
                    {work.category}
                  </span>
                </div>
                {!hasStage && (
                  <div
                    id={panelId}
                    role="region"
                    aria-label={work.title}
                    data-open={isOpen || undefined}
                    inert={!isOpen}
                    className="tk-panel relative z-10"
                  >
                    <div>
                      <div className="tk-panel__inner pt-2">
                        <p className="text-[0.8125rem] text-pretty text-fm-ink-3">{work.caption}</p>
                        <WorkLink work={work} labels={labels} />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      ))}
    </div>
  )
}

/* ——— Lista: indeks z miniaturami ——— */

function Rows({ works, labels, hasStage, open, selected, onActivate, onPointerDown }: ViewProps) {
  const groups = useMemo(() => {
    const byGroup = new Map<string, { label: string; works: Work[] }>()
    for (const work of works) {
      const group = byGroup.get(work.group) ?? { label: work.groupLabel, works: [] }
      group.works.push(work)
      byGroup.set(work.group, group)
    }
    return [...byGroup.entries()]
  }, [works])

  return (
    <ol className="tk-dim flex flex-col gap-7 [overflow-anchor:none] sm:gap-6">
      {groups.map(([id, group]) => (
        <li key={id} className="sm:grid sm:grid-cols-[var(--tk-lane)_1fr]">
          <h3 className="mb-1 text-fm-small text-fm-ink-3 sm:mb-0 sm:pt-[1.3125rem]">
            {group.label}
          </h3>
          <ol>
            {group.works.map((work) => {
              const isOpen = !hasStage && open === work.slug
              const isSelected = hasStage && selected === work.slug
              const panelId = `${workAnchor(work.slug)}-panel`
              return (
                <li key={work.slug} id={workAnchor(work.slug)} className="scroll-mt-24">
                  <button
                    type="button"
                    data-row-button
                    onPointerDown={onPointerDown}
                    onPointerEnter={(event) => {
                      if (hasStage && event.pointerType === "mouse") warm(work)
                    }}
                    onClick={(event) => onActivate(event, work.slug)}
                    aria-controls={hasStage ? STAGE_ID : panelId}
                    aria-expanded={hasStage ? undefined : isOpen}
                    aria-current={isSelected || undefined}
                    className="tk-row tk-bleed flex min-h-16 items-center gap-3.5 rounded-fm-lg py-2 text-left text-fm-ink fm-focus sm:gap-4"
                  >
                    <span
                      data-thumb
                      className="tk-thumb tk-ring relative h-12 w-16 shrink-0 overflow-hidden rounded-fm-md bg-fm-fill"
                    >
                      <Image src={work.poster} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate tracking-[-0.01em] xl:text-[1.0625rem]">
                        {work.title}
                      </span>
                      <span className="tk-row__meta block truncate text-fm-small text-fm-ink-2 transition-colors duration-150 sm:hidden">
                        {work.category}
                      </span>
                    </span>
                    <span className="tk-row__meta hidden shrink-0 text-fm-small text-fm-ink-2 transition-colors duration-150 sm:block">
                      {work.category}
                    </span>
                    {!hasStage && <span aria-hidden="true" className="tk-plus text-fm-ink-3" />}
                  </button>

                  {!hasStage && (
                    <div
                      id={panelId}
                      role="region"
                      aria-label={work.title}
                      data-open={isOpen || undefined}
                      inert={!isOpen}
                      className="tk-panel"
                    >
                      <div>
                        <div className="tk-panel__inner pt-2 pb-6">
                          <Media
                            title={work.title}
                            poster={work.poster}
                            video={work.video}
                            ratio={work.width / work.height}
                            active={isOpen}
                            sizes="(min-width: 40rem) 40rem, 100vw"
                            labels={labels}
                            style={{
                              aspectRatio: work.width / work.height,
                              width: `min(100%, calc(64svh * ${work.width / work.height}))`,
                            }}
                            className="rounded-fm-xl"
                          />
                          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-fm-small">
                            <p className="max-w-[26rem] text-pretty text-fm-ink-3">
                              {work.caption}
                            </p>
                            <WorkLink work={work} labels={labels} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </li>
      ))}
    </ol>
  )
}

function WorkLink({ work, labels }: { work: Work; labels: Labels }) {
  const external = work.url ? new URL(work.url).hostname.replace(/^www\./, "") : null
  return (
    <a
      href={work.url ?? labels.link.href}
      {...(work.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-11 items-center gap-1 rounded-fm-xs text-fm-small font-medium text-fm-ink underline decoration-fm-edge-strong underline-offset-4 fm-focus transition-[text-decoration-color] duration-150 hover:decoration-current"
      )}
    >
      {external ?? labels.link.label}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
      {external && <span className="sr-only"> ({labels.newTab})</span>}
    </a>
  )
}

/** Plakaty już pobrane w rozmiarze sceny. */
const warmed = new Set<string>()

/**
 * Plakat w rozmiarze sceny pobrany przy wskazaniu — kadr, który rośnie do
 * sceny, jest już w pamięci podręcznej, a nie szarym szkieletem. Obraz poza
 * dokumentem zamiast <link rel=preload>: bez ostrzeżeń o nieużytym preloadzie.
 */
function warm(work: Work) {
  const { props } = getImageProps({ src: work.poster, alt: "", fill: true, sizes: STAGE_SIZES })
  if (!props.srcSet || warmed.has(props.src)) return
  warmed.add(props.src)
  const image = new window.Image()
  image.sizes = props.sizes ?? STAGE_SIZES
  image.srcset = props.srcSet
  image.src = props.src
}

function rowButton(slug: string) {
  return (
    document.getElementById(workAnchor(slug))?.querySelector<HTMLElement>("[data-row-button]") ??
    null
  )
}

/** Klucz warstwy, którą scena naprawdę pokazuje (wybór mógł paść w innej sekcji). */
function visibleStageKey(): string | null {
  const media = document.querySelector<HTMLElement>(
    `#${STAGE_ID} .tk-layer:not([data-leaving]) [data-stage-media]`
  )
  return media?.dataset.stageMedia ?? null
}
