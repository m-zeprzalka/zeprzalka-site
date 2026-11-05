"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "../../forma/use-in-view"

/**
 * Wideo hero: kadr na pełną szerokość okna, na starcie przycięty do szerokości
 * kontenera — przewijanie „otwiera okno” (`clip-path` na osi przewijania, CSS).
 * Plakat od razu, plik dopiero blisko kadru, gra tylko w kadrze, widoczna
 * pauza (WCAG 2.2.2); przy „ogranicz ruch” stoi na plakacie. To samo wideo
 * jest źródłem obrazu z cyfr pod soczewką.
 */
export function HeroVideo({
  video,
  labels,
}: {
  video: { webm: string; mp4: string; poster: string; width: number; height: number }
  labels: { play: string; pause: string; fallback: string }
}) {
  preload(video.poster, { as: "image", fetchPriority: "high" })
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [stopped, setStopped] = useState<boolean | null>(null)
  const paused = stopped ?? reduced

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setNear(true)
        nearby.disconnect()
      },
      { rootMargin: "300px 0px" }
    )
    const inView = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting))
    nearby.observe(frame)
    inView.observe(frame)
    return () => {
      nearby.disconnect()
      inView.disconnect()
    }
  }, [])

  // `play()` dopiero po zatwierdzeniu źródła (wzór: LazyVideo serwisu).
  useEffect(() => {
    const element = videoRef.current
    if (!element || !near) return
    if (visible && !paused) element.play().catch(() => {})
    else element.pause()
  }, [near, visible, paused])

  return (
    <div
      ref={frameRef}
      data-rg-key="hero-video"
      data-rg-name="video.rg-reel"
      className="rg-reel relative overflow-hidden bg-fm-fill"
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
    >
      <video
        ref={videoRef}
        poster={video.poster}
        preload="none"
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {near && <source src={video.webm} type="video/webm" />}
        {near && <source src={video.mp4} type="video/mp4" />}
        {labels.fallback}
      </video>
      <button
        type="button"
        onClick={() => setStopped(!paused)}
        aria-label={paused ? labels.play : labels.pause}
        data-rg-quiet=""
        className="rg-reel__control fm-press fm-focus"
      >
        {paused ? (
          <Play aria-hidden="true" className="size-4 fill-current" />
        ) : (
          <Pause aria-hidden="true" className="size-4 fill-current" />
        )}
      </button>
    </div>
  )
}
