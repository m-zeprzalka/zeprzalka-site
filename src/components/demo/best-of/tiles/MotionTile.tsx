"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"
import { useStage } from "../use-stage"

const DURATION = 2400
/** Klatki kluczowe wejścia na osi czasu (ułamek długości). */
const KEY_START = 0.08
const KEY_END = 0.72
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)"
/** Ścieżka krzywej w polu 100×100 (y w dół) — ten sam bezier co animacja. */
const CURVE_PATH = "M0 100 C23 0 32 0 100 0"

const seconds = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Komunikacja wizualna (wzór: `esencja/tiles/MotionTile.tsx`): mini oś czasu jak w programie do animacji. Słowo
 * z nagłówka wchodzi według trzech ścieżek (krycie, skala, rozmycie), głowica
 * przesuwa się po osi, a kropka jedzie po krzywej przyspieszenia. Wszystko to
 * jedna oś czasu WAAPI: głowicę można chwycić i przewijać (mysz, palec,
 * strzałki), przycisk odtwarza od miejsca zatrzymania. Gra raz po wejściu
 * w kadr — bez pętli.
 */
export function MotionTile({
  word,
  labels,
}: {
  word: string
  labels: {
    tracks: readonly [string, string, string]
    play: string
    pause: string
    replay: string
    scrub: string
  }
}) {
  const { ref, run } = useStage<HTMLDivElement>()
  const previewRef = useRef<HTMLSpanElement>(null)
  const headRef = useRef<HTMLSpanElement>(null)
  const dotXRef = useRef<HTMLSpanElement>(null)
  const dotYRef = useRef<HTMLSpanElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const animations = useRef<Animation[]>([])
  const frame = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(true)
  const [progress, setProgress] = useState(1)

  /** Napis czasu i wartość suwaka dla czytników — odświeżane w klatkach, nie przez React. */
  function sync() {
    const time = Number(animations.current[0]?.currentTime ?? DURATION)
    if (timeRef.current) timeRef.current.textContent = `${seconds.format(time / 1000)} s`
  }

  function loop() {
    sync()
    frame.current = requestAnimationFrame(loop)
  }

  // Oś czasu budujemy raz; potem tylko play / pause / currentTime.
  useEffect(() => {
    const preview = previewRef.current
    const head = headRef.current
    const dotX = dotXRef.current
    const dotY = dotYRef.current
    if (!preview || !head || !dotX || !dotY) return
    const timing = { duration: DURATION, fill: "both" as const }
    const hidden = { opacity: 0, scale: "0.9", filter: "blur(12px)" }
    const shown = { opacity: 1, scale: "1", filter: "blur(0px)" }
    const reach = (KEY_END - KEY_START) * DURATION
    animations.current = [
      preview.animate(
        [
          { ...hidden, offset: 0 },
          { ...hidden, offset: KEY_START, easing: EASE },
          { ...shown, offset: KEY_END },
          { ...shown, offset: 1 },
        ],
        timing
      ),
      head.animate([{ translate: "-100% 0" }, { translate: "0 0" }], {
        ...timing,
        easing: "linear",
      }),
      // Kropka: x liniowo w czasie, y z tym samym bezierem — rysuje krzywą punkt po punkcie.
      dotX.animate([{ translate: "-100% 0" }, { translate: "0 0" }], {
        duration: reach,
        delay: KEY_START * DURATION,
        endDelay: (1 - KEY_END) * DURATION,
        fill: "both",
        easing: "linear",
      }),
      dotY.animate([{ translate: "0 0" }, { translate: "0 -100%" }], {
        duration: reach,
        delay: KEY_START * DURATION,
        endDelay: (1 - KEY_END) * DURATION,
        fill: "both",
        easing: EASE,
      }),
    ]
    for (const animation of animations.current) {
      animation.pause()
      animation.currentTime = DURATION
    }
    const first = animations.current[0]
    if (first) {
      first.onfinish = () => {
        cancelAnimationFrame(frame.current)
        sync()
        setPlaying(false)
        setEnded(true)
        setProgress(1)
      }
    }
    sync()
    return () => {
      cancelAnimationFrame(frame.current)
      animations.current.forEach((animation) => animation.cancel())
    }
  }, [])

  function seek(time: number) {
    for (const animation of animations.current) animation.currentTime = time
    sync()
    setProgress(time / DURATION)
  }

  function play(from?: number) {
    if (from !== undefined) seek(from)
    for (const animation of animations.current) animation.play()
    setPlaying(true)
    setEnded(false)
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(loop)
  }

  function pause() {
    for (const animation of animations.current) animation.pause()
    cancelAnimationFrame(frame.current)
    sync()
    setPlaying(false)
    setProgress(Number(animations.current[0]?.currentTime ?? 0) / DURATION)
  }

  // Wejście w kadr (i każda powtórka): odtworzenie od zera. „Ogranicz ruch” — stan końcowy.
  useEffect(() => {
    if (run === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const start = requestAnimationFrame(() => play(0))
    return () => cancelAnimationFrame(start)
    // `play` operuje na refach; scena zależy tylko od numeru przebiegu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  /* Przewijanie głowicy */
  function timeAt(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    return Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)) * DURATION
  }
  function onScrubStart(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    pause()
    seek(timeAt(event))
    setEnded(false)
  }
  function onScrubMove(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(timeAt(event))
  }
  function onScrubKey(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 400 : 100
    const now = Number(animations.current[0]?.currentTime ?? 0)
    const next =
      event.key === "ArrowRight"
        ? now + step
        : event.key === "ArrowLeft"
          ? now - step
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? DURATION
              : null
    if (next === null) return
    event.preventDefault()
    pause()
    seek(Math.min(DURATION, Math.max(0, next)))
    setEnded(next >= DURATION)
  }

  const action = playing ? labels.pause : ended ? labels.replay : labels.play

  return (
    <div ref={ref} className="relative flex flex-1 flex-col p-2">
      {/* Podgląd */}
      <div className="grid flex-1 place-items-center overflow-hidden px-4 py-8">
        <span
          ref={previewRef}
          className="text-[2.25rem] leading-none font-[550] tracking-[-0.05em] sm:text-[2.75rem]"
        >
          {word}
        </span>
      </div>

      {/* Oś czasu */}
      <div className="rounded-[1.125rem] bg-fm-surface p-3 shadow-fm-ring sm:p-4">
        <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3">
          <ul className="grid gap-2.5 text-fm-micro font-medium text-fm-ink-2">
            {labels.tracks.map((track) => (
              <li key={track} className="flex h-5 items-center">
                {track}
              </li>
            ))}
          </ul>
          <div
            role="slider"
            tabIndex={0}
            aria-label={labels.scrub}
            aria-valuemin={0}
            aria-valuemax={DURATION}
            aria-valuenow={Math.round(progress * DURATION)}
            aria-valuetext={`${seconds.format(progress * (DURATION / 1000))} s`}
            onPointerDown={onScrubStart}
            onPointerMove={onScrubMove}
            onKeyDown={onScrubKey}
            className="relative grid cursor-ew-resize touch-none gap-2.5 rounded-md fm-focus select-none"
          >
            {labels.tracks.map((track) => (
              <span key={track} className="relative flex h-5 items-center">
                <span className="absolute inset-x-0 h-px bg-fm-edge-strong" />
                <span
                  className="absolute h-[3px] rounded-full bg-fm-ink"
                  style={{ left: `${KEY_START * 100}%`, right: `${(1 - KEY_END) * 100}%` }}
                />
                {[KEY_START, KEY_END].map((at) => (
                  <span
                    key={at}
                    className="absolute size-2 -translate-x-1/2 rotate-45 rounded-[1.5px] bg-fm-surface ring-[1.5px] ring-fm-ink"
                    style={{ left: `${at * 100}%` }}
                  />
                ))}
              </span>
            ))}
            {/* Głowica: pasek szerokości osi z linią przy prawej krawędzi, przesuwany o −100% → 0. */}
            <span className="pointer-events-none absolute inset-x-0 -inset-y-1.5 overflow-hidden">
              <span
                ref={headRef}
                className="absolute inset-0 border-r-[1.5px] border-fm-ink"
                style={{ translate: "0 0" }}
              >
                <span className="absolute -top-px -right-[5px] size-2 rounded-full bg-fm-ink" />
              </span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-fm-edge pt-3">
          <button
            type="button"
            onClick={() => (playing ? pause() : play(ended ? 0 : undefined))}
            aria-label={action}
            className="group/play -m-1 grid size-11 shrink-0 place-items-center rounded-full fm-focus"
          >
            <span className="grid size-9 place-items-center rounded-full bg-fm-ink text-fm-inverse transition-[scale] duration-150 ease-fm-snap group-active/play:scale-[0.97]">
              {playing ? (
                <Pause className="size-3.5 fill-current" />
              ) : ended ? (
                <RotateCcw className="size-3.5" />
              ) : (
                <Play className="size-3.5 fill-current" />
              )}
            </span>
          </button>
          <span ref={timeRef} className="w-14 font-mono text-[0.75rem] text-fm-ink tabular-nums" />
          <span className="ms-auto hidden truncate font-mono text-[0.75rem] text-fm-ink-3 sm:block">
            {EASE}
          </span>
          {/* Krzywa przyspieszenia z kropką */}
          <span
            aria-hidden="true"
            className={cn("relative size-11 shrink-0 rounded-md bg-fm-fill p-1.5")}
          >
            <span className="relative block size-full">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                <path
                  d={CURVE_PATH}
                  fill="none"
                  className="stroke-fm-ink-3"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="absolute inset-0 overflow-visible">
                <span ref={dotXRef} className="absolute inset-0">
                  <span ref={dotYRef} className="absolute inset-0">
                    <span className="absolute -right-[3.5px] -bottom-[3.5px] size-[7px] rounded-full bg-fm-ink" />
                  </span>
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
