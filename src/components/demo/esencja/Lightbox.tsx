"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react"
import { useReducedMotion } from "../forma/use-in-view"
import { cn } from "../forma/cn"
import type { DemoWork } from "../shared/content"
import { portalRoot } from "./ids"

export interface LightboxLabels {
  close: string
  prev: string
  next: string
  play: string
  pause: string
  newTab: string
}

const iconButton =
  "grid size-11 shrink-0 fm-press place-items-center rounded-full fm-focus transition-[background-color,color,scale] duration-150"

/**
 * Podgląd realizacji: duży kadr (wideo gra od razu, z pauzą) i opis.
 * Desktop — okno na środku; telefon — arkusz od dołu. Strzałki ← → i przyciski
 * przełączają realizacje (kadr przenika się z lekkim rozmyciem), Esc zamyka,
 * fokus wraca na kartę, z której przyszliśmy (Radix Dialog).
 */
export function Lightbox({
  works,
  groups,
  active,
  onChange,
  onClosed,
  labels,
}: {
  works: readonly DemoWork[]
  /** Opisy grup — dopowiedzenie dla realizacji bez własnego opisu. */
  groups: Readonly<Record<string, string>>
  active: string | null
  onChange: (slug: string | null) => void
  /** Zwraca fokus na kartę, z której otwarto podgląd. */
  onClosed: () => void
  labels: LightboxLabels
}) {
  const index = works.findIndex((work) => work.slug === active)
  const current = works[index] ?? null
  // Przy zamykaniu treść zostaje do końca animacji wyjścia.
  const [last, setLast] = useState<DemoWork | null>(null)
  if (current && current !== last) setLast(current)
  const shown = current ?? last
  const position = works.findIndex((work) => work.slug === shown?.slug) + 1

  function go(step: number) {
    if (index < 0) return
    const next = works[(index + step + works.length) % works.length]
    if (next) onChange(next.slug)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") go(1)
    else if (event.key === "ArrowLeft") go(-1)
  }

  return (
    <Dialog.Root open={!!current} onOpenChange={(open) => !open && onChange(null)}>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay className="es-overlay fixed inset-0 z-[80] bg-black/40 backdrop-blur-[6px] dark:bg-black/70" />
        <Dialog.Content
          onKeyDown={onKeyDown}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            onClosed()
          }}
          aria-describedby={undefined}
          className="es-lightbox fixed z-[81] flex flex-col overflow-hidden bg-fm-surface shadow-fm-float outline-none max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[92dvh] max-md:rounded-t-[1.75rem] md:inset-0 md:m-auto md:h-fit md:max-h-[calc(100dvh-3rem)] md:w-[min(68rem,calc(100%-3rem))] md:rounded-[1.75rem]"
        >
          {shown && (
            <div className="es-lb grid min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 md:overflow-hidden">
              <div className="es-lb-head flex items-center justify-between gap-3 ps-3 pe-1 pb-2 md:ps-6 md:pe-4 md:pt-2 md:pb-0">
                <p className="text-fm-small text-fm-ink-3 tabular-nums">
                  {position} / {works.length}
                </p>
                <Dialog.Close
                  aria-label={labels.close}
                  className={cn(iconButton, "text-fm-ink-2 hover:bg-fm-fill hover:text-fm-ink")}
                >
                  <X className="size-5" />
                </Dialog.Close>
              </div>
              <Media key={shown.slug} work={shown} labels={labels} />
              <div className="es-lb-info flex flex-col gap-6 px-4 pt-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:px-6 md:pt-6 md:pb-4">
                <div key={shown.slug} className="es-swap">
                  <p className="text-fm-small text-fm-ink-3">{shown.groupLabel}</p>
                  <Dialog.Title className="mt-2 text-[1.75rem] leading-[1.1] font-[550] tracking-[-0.035em] text-balance">
                    {shown.title}
                  </Dialog.Title>
                  <p className="mt-2 text-fm-body text-fm-ink-2">{shown.category}</p>
                  <p className="mt-4 text-fm-small text-pretty text-fm-ink-2">
                    {shown.description ?? groups[shown.group]}
                  </p>
                  {shown.url && (
                    <a
                      href={shown.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-fm-fill ps-4 pe-3.5 text-sm font-medium fm-focus transition-colors hover:bg-fm-fill-strong"
                    >
                      {new URL(shown.url).hostname.replace(/^www\./, "")}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-fm-ink-3 transition-[translate,color] duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
                      />
                      <span className="sr-only"> ({labels.newTab})</span>
                    </a>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-end gap-2 md:justify-start">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={labels.prev}
                    className={cn(iconButton, "bg-fm-fill text-fm-ink hover:bg-fm-fill-strong")}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={labels.next}
                    className={cn(iconButton, "bg-fm-fill text-fm-ink hover:bg-fm-fill-strong")}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Kadr podglądu: wideo (gra od razu, chyba że „ogranicz ruch”) albo zrzut produktu. */
function Media({ work, labels }: { work: DemoWork; labels: LightboxLabels }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [stopped, setStopped] = useState<boolean | null>(null)
  const paused = stopped ?? reduced

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (paused) video.pause()
    else video.play().catch(() => {})
  }, [paused])

  return (
    <div className="es-swap es-lb-media relative grid min-h-0 place-items-center overflow-hidden rounded-[1.25rem] bg-fm-fill max-md:max-h-[58dvh] md:h-[min(42rem,calc(100dvh-4rem))]">
      {work.video ? (
        <video
          ref={ref}
          src={work.video}
          poster={work.poster}
          muted
          loop
          playsInline
          aria-hidden="true"
          width={work.width}
          height={work.height}
          className="h-full max-h-[inherit] w-full object-contain"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- zrzut w pełnym rozmiarze, bez optymalizacji w demie
        <img
          src={work.poster}
          alt=""
          width={work.width}
          height={work.height}
          className="h-full max-h-[inherit] w-full object-contain"
        />
      )}
      {work.video && (
        <button
          type="button"
          onClick={() => setStopped(!paused)}
          aria-label={paused ? labels.play : labels.pause}
          className={cn(
            iconButton,
            "absolute right-3 bottom-3 bg-black/45 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.14)] backdrop-blur-md hover:bg-black/60"
          )}
        >
          {paused ? (
            <Play className="size-4 fill-current" />
          ) : (
            <Pause className="size-4 fill-current" />
          )}
        </button>
      )}
    </div>
  )
}
