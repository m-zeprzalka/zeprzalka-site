"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "../forma/cn"
import { useVisible } from "./hooks"

type Intent = "auto" | "play" | "pause"
export type VideoSource = string | { webm: string; mp4: string }

/**
 * Plakat i pętla wideo jednej realizacji (albo reelu). Plakat (next/image)
 * jest zawsze — to on daje pierwszy obraz i stan bez JS. `<video>` montuje się
 * dopiero przy pierwszej aktywacji (`preload="none"`), gra tylko aktywne
 * i widoczne, a `play()` pada w efekcie po zatwierdzeniu `src` (wzór z
 * `LazyVideo.tsx` serwisu). Przy „ogranicz ruch” nie startuje samo; przycisk
 * pauzy jest zawsze widoczny (WCAG 2.2.2). Wideo jest dekoracją — nazwę niesie
 * przycisk albo podpis obok.
 */
export function Media({
  title,
  poster,
  video,
  ratio,
  active,
  sizes,
  eager = false,
  controls = true,
  labels,
  className,
  style,
  imageClassName,
  ...data
}: {
  title: string
  poster: string
  video?: VideoSource
  /** Szerokość / wysokość materiału. */
  ratio: number
  active: boolean
  sizes: string
  /** Nad zgięciem (LCP): bez leniwego ładowania. */
  eager?: boolean
  /** Przycisk pauzy (kafle galerii pokazują go tylko, gdy grają). */
  controls?: boolean
  labels: { play: string; pause: string }
  className?: string
  style?: CSSProperties
  imageClassName?: string
} & { [key: `data-${string}`]: string | boolean | undefined }) {
  const reduced = useReducedMotion()
  const [boxRef, visible] = useVisible<HTMLDivElement>(0.3)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [intent, setIntent] = useState<Intent>("auto")
  const [armed, setArmed] = useState(active)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  // Raz aktywne medium zachowuje swój <video> — powrót nie pobiera pliku od nowa.
  if (active && !armed) setArmed(true)

  const shouldPlay = active && visible && (intent === "play" || (intent === "auto" && !reduced))

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (shouldPlay) {
      element.play().catch(() => {
        /* autoodtwarzanie zablokowane — zostaje plakat i przycisk */
      })
    } else {
      element.pause()
    }
  }, [shouldPlay, armed])

  return (
    <div
      ref={boxRef}
      style={{ "--r": ratio, ...style } as CSSProperties}
      className={cn("tk-ring tk-skeleton relative overflow-hidden", className)}
      {...data}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className={cn("object-cover", imageClassName)}
      />
      {video && armed && (
        <video
          ref={videoRef}
          aria-hidden="true"
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          poster={poster}
          data-ready={ready || undefined}
          onPlaying={() => {
            setReady(true)
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
          className={cn("tk-video absolute inset-0 size-full object-cover", imageClassName)}
        >
          {typeof video === "string" ? (
            <source src={video} type="video/mp4" />
          ) : (
            <>
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </>
          )}
        </video>
      )}
      {video && controls && (
        <button
          type="button"
          onClick={() => setIntent(playing ? "pause" : "play")}
          aria-label={`${playing ? labels.pause : labels.play}: ${title}`}
          className="absolute end-2.5 bottom-2.5 z-10 grid size-11 fm-press place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md after:absolute after:-inset-1 after:content-[''] pointer-fine:size-9"
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
      )}
    </div>
  )
}
