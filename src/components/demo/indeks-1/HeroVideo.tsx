"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { usePageVisible, useVisible } from "./hooks"

/** Źródło wideo dochodzi dopiero po „harmonijce” wejścia — nie konkuruje z tekstem o wątek. */
const ARM_AFTER = 1400

/**
 * Duże wideo startu bez silnika glifów: od pierwszego malowania stoi szkielet
 * z CSS (kropki na czerni — ten sam materiał co szkielety mediów), plakat
 * wyłania się z niego miękką falą od góry (maska, kompozytor; bez czekania na
 * hydratację), a wideo dostaje źródło dopiero po wejściu. Przycisk pauzy
 * pojawia się razem ze źródłem. Gra tylko w kadrze i przy widocznej karcie;
 * widoczna pauza (WCAG 2.2.2). „Ogranicz ruch” — plakat i przycisk odtwarzania.
 */
export function HeroVideo({
  poster,
  webm,
  mp4,
  width,
  height,
  labels,
  revealAt = 0,
  className,
}: {
  /** Pora fali odsłaniającej plakat (ms od pierwszego malowania — „harmonijka”). */
  revealAt?: number
  poster: string
  webm: string
  mp4: string
  width: number
  height: number
  labels: { play: string; pause: string }
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const visible = useVisible(wrapRef, 0.2)
  const pageVisible = usePageVisible()
  const [armed, setArmed] = useState(false)
  const [ready, setReady] = useState(false)
  const [choice, setChoice] = useState<"play" | "pause" | null>(null)
  const wantsPlay = choice === "play" || (choice === null && !reduced)
  const playing = armed && visible && pageVisible && wantsPlay

  useEffect(() => {
    if (!wantsPlay) return undefined
    const timer = setTimeout(() => setArmed(true), choice === "play" ? 0 : ARM_AFTER)
    return () => clearTimeout(timer)
  }, [wantsPlay, choice])

  // `play()` po zatwierdzeniu źródeł (wzór: LazyVideo serwisu).
  useEffect(() => {
    const video = videoRef.current
    if (!video || !armed) return
    if (playing) video.play().catch(() => setChoice("pause"))
    else video.pause()
  }, [armed, playing])

  return (
    <div
      ref={wrapRef}
      style={{ aspectRatio: `${width} / ${height}` }}
      className={cn("i1-media group/hv relative overflow-hidden", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        width={width}
        height={height}
        alt=""
        fetchPriority="high"
        decoding="async"
        style={{ "--d": `${revealAt}ms` } as CSSProperties}
        className="i1-reveal absolute inset-0 size-full object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        data-ready={ready || undefined}
        onPlaying={() => setReady(true)}
        className="i1-video absolute inset-0 size-full object-cover"
      >
        {armed && (
          <>
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </>
        )}
      </video>
      <button
        type="button"
        onClick={() => setChoice(playing ? "pause" : "play")}
        aria-label={playing ? labels.pause : labels.play}
        title={playing ? labels.pause : labels.play}
        data-hidden={!(armed || reduced || choice) || undefined}
        className="absolute end-3 bottom-3 z-[3] grid size-11 fm-press place-items-center rounded-full bg-fm-surface/90 text-fm-ink shadow-fm-ring fm-focus transition-[background-color,scale,opacity] duration-200 hover:bg-fm-surface data-hidden:pointer-events-none data-hidden:opacity-0 sm:size-10"
      >
        {playing ? (
          <Pause aria-hidden="true" className="size-3.5" fill="currentColor" strokeWidth={0} />
        ) : (
          <Play
            aria-hidden="true"
            className="size-3.5 translate-x-px"
            fill="currentColor"
            strokeWidth={0}
          />
        )}
      </button>
    </div>
  )
}
