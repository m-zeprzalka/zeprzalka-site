"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import type { Work } from "./types"

type Intent = "auto" | "play" | "pause"

/** `true`, gdy co najmniej 35% elementu jest w kadrze (na bieżąco, nie jednorazowo). */
function useVisible<T extends Element>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      threshold: 0.35,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, visible] as const
}

/**
 * Wideo realizacji w rozwiniętym wierszu. Najpierw plakat, `<video>` dopiero
 * przy pierwszym otwarciu (`preload="none"`), gra tylko otwarte i widoczne.
 * Przy „ogranicz ruch” nie startuje samo — jest przycisk (WCAG 2.2.2).
 * Kadr ma proporcje materiału; pionowe filmy nie rosną ponad 64% wysokości ekranu.
 */
export function WorkMedia({
  work,
  ratio,
  open,
  reduced,
  labels,
}: {
  work: Work
  ratio: number
  open: boolean
  reduced: boolean
  labels: { play: string; pause: string }
}) {
  const [boxRef, visible] = useVisible<HTMLDivElement>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [intent, setIntent] = useState<Intent>("auto")
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  const shouldPlay = open && visible && (intent === "play" || (intent === "auto" && !reduced))

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (shouldPlay) {
      video.play().catch(() => {
        /* autoodtwarzanie zablokowane — zostaje plakat i przycisk */
      })
    } else {
      video.pause()
    }
  }, [shouldPlay])

  return (
    <div
      ref={boxRef}
      data-media
      style={{ aspectRatio: ratio, width: `min(100%, calc(64svh * ${ratio}))` }}
      className="ix-media-ring ix-skeleton rounded-fm-xl relative overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ten sam plik co w usePosterRatios */}
      <img src={work.poster} alt="" className="absolute inset-0 size-full object-cover" />
      <video
        ref={videoRef}
        src={work.video}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        data-ready={ready || undefined}
        onPlaying={() => {
          setReady(true)
          setPlaying(true)
        }}
        onPause={() => setPlaying(false)}
        className="ix-video absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        onClick={() => setIntent(playing ? "pause" : "play")}
        aria-label={`${playing ? labels.pause : labels.play}: ${work.title}`}
        className="fm-focus fm-press bg-fm-surface/85 text-fm-ink shadow-fm-ring absolute end-3 bottom-3 grid size-9 place-items-center rounded-full backdrop-blur-md after:absolute after:-inset-1 after:content-['']"
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
