"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { cn } from "@/components/demo/forma/cn"
import type { DemoWork } from "@/components/demo/shared/content"
import { portalRoot } from "./ids"
import type { GroupInfo } from "./WorkGallery"

export interface WorkDialogLabels {
  link: { label: string; href: string }
  /** Link do działającego serwisu (własne produkty). */
  openSite: string
  close: string
  previous: string
  next: string
  play: string
  pause: string
  newTab: string
}

/**
 * Podgląd realizacji: duże wideo, opis grupy, przejście do sąsiednich
 * realizacji (przyciski i ← →) i link do pełnego portfolio. Na telefonie
 * arkusz od dołu, od 768 px okno na środku. Podczas morfu kadru (`morph`)
 * Radix nie animuje — ruch prowadzą View Transitions: kadr, tło i okno mają
 * własne nazwy (`re-work`, `re-veil`, `re-sheet`).
 */
export interface WorkDialogProps {
  works: readonly DemoWork[]
  groups: Record<string, GroupInfo>
  index: number
  open: boolean
  onIndex: (index: number) => void
  onClose: () => void
  morph: boolean
  reduced: boolean
  labels: WorkDialogLabels
}

export default function WorkDialog({
  works,
  groups,
  index,
  open,
  onIndex,
  onClose,
  morph,
  reduced,
  labels,
}: WorkDialogProps) {
  const work = works[index]
  const videoRef = useRef<HTMLVideoElement>(null)
  // Podmiana kadru (poprzednia/następna) dostaje krótkie wyostrzenie; pierwsze otwarcie — nie.
  const [swapped, setSwapped] = useState(false)
  const [choice, setChoice] = useState<"play" | "pause" | null>(null)
  const [playing, setPlaying] = useState(false)
  // Każde otwarcie zaczyna od zera: bez wyostrzenia i bez pauzy z poprzedniej wizyty.
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
    if (event.key === "ArrowRight") step(1)
    else if (event.key === "ArrowLeft") step(-1)
  }

  const vt = (name: string) => (morph ? { viewTransitionName: name } : undefined)
  // Pionowy kadr (telefon) stoi obok opisu, poziomy nad nim — okno zawsze mieści się w ekranie.
  const portrait = work.height > work.width
  const playLabel = playing ? labels.pause : labels.play
  const iconButton =
    "grid size-10 fm-press place-items-center rounded-full text-fm-ink-2 shadow-fm-ring fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay
          data-morph={morph || undefined}
          style={vt("re-veil")}
          className="re-veil fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
        />
        <Dialog.Content
          data-morph={morph || undefined}
          style={
            {
              "--re-ar": work.width / work.height,
              ...vt("re-sheet"),
            } as CSSProperties
          }
          onKeyDown={onKeyDown}
          onCloseAutoFocus={(event) => {
            // Fokus wraca na kafel realizacji, którą właśnie oglądano (nie tę, od której zaczęto).
            event.preventDefault()
            document.querySelector<HTMLElement>(`[data-work="${work.slug}"]`)?.focus()
          }}
          className={cn(
            "re-dialog fixed inset-x-0 bottom-0 z-50 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-t-fm-4xl bg-fm-surface p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-fm-float outline-none",
            "md:inset-0 md:m-auto md:h-fit md:max-h-[calc(100dvh-3rem)] md:rounded-fm-4xl md:p-2.5",
            portrait
              ? "md:grid md:w-fit md:max-w-[calc(100vw-4rem)] md:grid-cols-[auto_minmax(0,21rem)]"
              : "md:w-[min(60rem,calc(100vw-4rem),calc((100dvh-14rem)*var(--re-ar)+1.25rem))]"
          )}
        >
          {/* Zamknięcie samotnie w rogu karty: nad kadrem szkło, obok pionowego kadru — zwykły pierścień. */}
          <Dialog.Close
            aria-label={labels.close}
            title={labels.close}
            className={cn(
              "absolute top-4 right-4 z-10 grid size-10 fm-press place-items-center rounded-full fm-focus transition-[background-color,color,scale]",
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
              "re-dialog__media relative overflow-hidden rounded-fm-3xl bg-fm-fill md:rounded-[1.375rem]",
              portrait && "md:h-[min(calc(100dvh-8rem),46rem)]"
            )}
            style={{ aspectRatio: `${work.width} / ${work.height}`, ...vt("re-work") }}
          >
            {work.video ? (
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
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="absolute inset-0 size-full object-cover"
              />
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
            {/* Pauza w kadrze, w tym samym rogu co w hero. */}
            {work.video && (
              <button
                type="button"
                onClick={() => setChoice(playing ? "pause" : "play")}
                aria-label={playLabel}
                title={playLabel}
                className="absolute right-3 bottom-3 grid size-10 fm-press place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/15 fm-focus backdrop-blur-md transition-[background-color,scale] hover:bg-black/60 focus-visible:outline-white md:right-4 md:bottom-4"
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
              <p className="text-sm text-fm-ink-3">
                {group?.label}
                <span className="text-fm-ink-3/60"> / </span>
                {work.category}
              </p>
              <Dialog.Title className="mt-1.5 text-[1.625rem] leading-tight font-medium tracking-[-0.025em] text-balance">
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
                <p className="min-w-12 text-center text-sm text-fm-ink-3 tabular-nums">
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
              {work.url ? (
                // Działający produkt — to główna akcja podglądu, więc pełna pigułka.
                <Button asChild className="group">
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
                <Button asChild variant="secondary" className="group">
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
