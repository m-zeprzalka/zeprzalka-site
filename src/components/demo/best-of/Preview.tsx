"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react"
import { Button } from "../forma/Button"
import { cn } from "../forma/cn"
import type { DemoWork } from "../shared/content"
import { portalRoot } from "./ids"
import { MORPH } from "./WorksProvider"

export interface PreviewLabels {
  /** Pełne portfolio (podstrona serwisu). */
  link: { label: string; href: string }
  openSite: string
  close: string
  previous: string
  next: string
  play: string
  pause: string
  newTab: string
}

export interface PreviewProps {
  works: readonly DemoWork[]
  groups: Record<string, { label: string; description: string }>
  index: number
  /** Zdekodowany obraz z karty — migawka przejścia nie czeka na plik w pełnej rozdzielczości. */
  still?: { slug: string; src: string }
  open: boolean
  morph: boolean
  reduced: boolean
  labels: PreviewLabels
  onIndex: (index: number) => void
  onClose: () => void
  onReturnFocus: () => void
}

/**
 * Podgląd realizacji (wzór: `reedycja/WorkDialog.tsx`): duży kadr (wideo gra
 * samo, z pauzą), grupa i kategoria, opis, sąsiednie realizacje (przyciski
 * i ← →), działający serwis albo pełne portfolio. Telefon — arkusz od dołu,
 * od 768 px okno na środku; pionowy kadr stoi obok opisu, poziomy nad nim.
 * Podczas morfu Radix nie animuje — ruch prowadzą View Transitions.
 */
export function Preview({
  works,
  groups,
  index,
  still,
  open,
  morph,
  reduced,
  labels,
  onIndex,
  onClose,
  onReturnFocus,
}: PreviewProps) {
  const work = works[index]
  const videoRef = useRef<HTMLVideoElement>(null)
  // Podmiana kadru (poprzednia/następna) dostaje krótkie wyostrzenie; pierwsze otwarcie — nie.
  const [swapped, setSwapped] = useState(false)
  const [choice, setChoice] = useState<"play" | "pause" | null>(null)
  const [playing, setPlaying] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setSwapped(false)
      setChoice(null)
    }
  }
  const wantsPlay = open && (choice ? choice === "play" : !reduced)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (wantsPlay) video.play().catch(() => {})
    else video.pause()
  }, [wantsPlay, index])

  if (!work) return null
  const group = groups[work.group]
  const count = works.length

  function step(delta: number) {
    setSwapped(true)
    onIndex((index + delta + count) % count)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (count < 2) return
    if (event.key === "ArrowRight") step(1)
    else if (event.key === "ArrowLeft") step(-1)
  }

  const vt = (name: string) => (morph ? { viewTransitionName: name } : undefined)
  const portrait = work.height > work.width
  const playLabel = playing ? labels.pause : labels.play
  const iconButton =
    "grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 shadow-fm-ring fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay
          data-morph={morph || undefined}
          style={vt("bo-veil")}
          className="bo-veil fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
        />
        <Dialog.Content
          data-morph={morph || undefined}
          style={{ "--bo-ar": work.width / work.height, ...vt("bo-sheet") } as CSSProperties}
          onKeyDown={onKeyDown}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            onReturnFocus()
          }}
          className={cn(
            "bo-preview fixed inset-x-0 bottom-0 z-[81] max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-t-fm-4xl bg-fm-surface p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-fm-float outline-none",
            "md:inset-0 md:m-auto md:h-fit md:max-h-[calc(100dvh-3rem)] md:rounded-fm-4xl md:p-2.5",
            portrait
              ? "md:grid md:w-fit md:max-w-[calc(100vw-4rem)] md:grid-cols-[auto_minmax(0,21rem)]"
              : "md:w-[min(60rem,calc(100vw-4rem),calc((100dvh-15rem)*var(--bo-ar)+1.25rem))]"
          )}
        >
          <Dialog.Close
            aria-label={labels.close}
            title={labels.close}
            className={cn(
              "absolute top-4 right-4 z-10 grid size-11 fm-press place-items-center rounded-full fm-focus transition-[background-color,color,scale]",
              "bg-black/45 text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-black/60 focus-visible:outline-white",
              portrait &&
                "md:bg-transparent md:text-fm-ink-2 md:ring-fm-edge md:backdrop-blur-none md:hover:bg-fm-fill md:hover:text-fm-ink md:focus-visible:outline-fm-ink"
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </Dialog.Close>

          <div
            key={work.slug}
            data-swap={swapped || undefined}
            className={cn(
              "bo-preview__media relative overflow-hidden rounded-fm-3xl bg-fm-fill md:rounded-[1.375rem]",
              portrait && "max-md:max-h-[58dvh] max-md:w-full md:h-[min(calc(100dvh-8rem),46rem)]"
            )}
            style={{ aspectRatio: `${work.width} / ${work.height}`, ...vt(MORPH) }}
          >
            {still?.slug === work.slug && (
              // eslint-disable-next-line @next/next/no-img-element -- obraz, który karta już pokazuje (z pamięci)
              <img
                src={still.src}
                alt=""
                decoding="sync"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element -- plakat w pełnej rozdzielczości, kładzie się na kopię z karty */}
            <img
              src={work.poster}
              alt=""
              width={work.width}
              height={work.height}
              decoding="sync"
              className="absolute inset-0 size-full object-cover"
            />
            {work.video && (
              <video
                ref={videoRef}
                src={work.video}
                poster={work.poster}
                width={work.width}
                height={work.height}
                aria-hidden="true"
                muted
                loop
                playsInline
                preload="none"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {work.video && (
              <button
                type="button"
                onClick={() => setChoice(playing ? "pause" : "play")}
                aria-label={playLabel}
                title={playLabel}
                className="absolute right-3 bottom-3 grid size-11 fm-press place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/15 fm-focus backdrop-blur-md transition-[background-color,scale] hover:bg-black/60 focus-visible:outline-white md:right-4 md:bottom-4"
              >
                {playing ? (
                  <Pause aria-hidden="true" className="size-4 fill-current" />
                ) : (
                  <Play aria-hidden="true" className="size-4 translate-x-px fill-current" />
                )}
              </button>
            )}
          </div>

          <div
            className={cn(
              "grid gap-6 px-3 pt-5 pb-3 md:px-4 md:pb-4",
              portrait
                ? "md:content-between md:gap-10 md:py-5 md:ps-7 md:pe-5 md:pt-16"
                : "md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10 md:pt-6"
            )}
          >
            <div className="min-w-0">
              <p className="text-fm-small text-fm-ink-3">
                {group?.label}
                <span aria-hidden="true" className="px-1.5 text-fm-edge-strong">
                  /
                </span>
                {work.category}
              </p>
              <Dialog.Title className="mt-1.5 text-[1.625rem] leading-tight font-[550] tracking-[-0.03em] text-balance">
                {work.title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-[52ch] text-pretty text-fm-ink-2">
                {work.description ?? group?.description}
              </Dialog.Description>
            </div>

            <div
              className={cn(
                "flex flex-wrap items-center justify-between gap-3",
                portrait ? "md:flex-col-reverse md:items-stretch" : "md:justify-end"
              )}
            >
              {count > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={labels.previous}
                    title={labels.previous}
                    className={iconButton}
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </button>
                  <p className="min-w-12 text-center text-fm-small text-fm-ink-3 tabular-nums">
                    <span className="text-fm-ink">{index + 1}</span> / {count}
                  </p>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={labels.next}
                    title={labels.next}
                    className={iconButton}
                  >
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              )}
              {work.url ? (
                <Button asChild size="lg" className="group">
                  <a href={work.url} target="_blank" rel="noopener noreferrer">
                    {labels.openSite}
                    <span className="sr-only"> ({labels.newTab})</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform duration-200 ease-fm-snap group-hover:translate-x-px group-hover:-translate-y-px"
                    />
                  </a>
                </Button>
              ) : (
                <Button asChild size="lg" variant="secondary" className="group">
                  <a href={labels.link.href}>
                    {labels.link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
                    />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
