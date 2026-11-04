"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Pause, Play } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { sceneProgress } from "./progress"

/** Próg sceny, od którego reel gra: początek etapu Produkt. */
const PLAY_FROM = 0.735

type Intent = "auto" | "paused" | "playing"

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true })
  window.addEventListener("resize", onChange)
  return () => {
    window.removeEventListener("scroll", onChange)
    window.removeEventListener("resize", onChange)
  }
}

/** Czy scena doszła do etapu Produkt (bez trybu przewijanego — zawsze tak). */
function sceneReached() {
  const progress = sceneProgress()
  return progress === null || progress >= PLAY_FROM
}

/**
 * Reel z obecnego hero w ramie sceny. Plakat jest w HTML od razu; plik wideo
 * dopiero blisko kadru. W scenie gra od etapu Produkt (produkt „ożywa”), bez
 * sceny — gdy jest w kadrze. Przycisk pauzy jest zawsze dostępny (WCAG 2.2.2)
 * i ma skalę odwrotną do ramy (na ekranie zawsze 44 px); przy „ogranicz ruch”
 * wideo rusza wyłącznie na życzenie.
 */
export function HeroVideo({
  video,
  labels,
}: {
  video: { webm: string; mp4: string; poster: string }
  labels: { pause: string; play: string; fallback: string }
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const reached = useSyncExternalStore(subscribeScroll, sceneReached, () => false)
  const [intent, setIntent] = useState<Intent>("auto")
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true)
      },
      { rootMargin: "300px 0px" }
    )
    const inFrame = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting))
    nearby.observe(node)
    inFrame.observe(node)
    return () => {
      nearby.disconnect()
      inFrame.disconnect()
    }
  }, [])

  const shouldPlay =
    near && visible && (intent === "playing" || (intent === "auto" && reached && !reduced))

  useEffect(() => {
    const node = ref.current
    if (!node || !near) return
    if (shouldPlay) node.play().catch(() => {})
    else node.pause()
  }, [near, shouldPlay])

  return (
    <>
      <video
        ref={ref}
        poster={video.poster}
        preload="none"
        muted
        loop
        playsInline
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      >
        {near && (
          <>
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </>
        )}
        {labels.fallback}
      </video>
      <button
        type="button"
        onClick={() => setIntent(playing ? "paused" : "playing")}
        aria-label={playing ? labels.pause : labels.play}
        className="tf-late tf-anim absolute right-3 bottom-3 grid size-11 origin-bottom-right [scale:calc(1/var(--tf-s,1))] place-items-center rounded-full bg-fm-surface/85 text-fm-ink shadow-fm-ring fm-focus backdrop-blur-md transition-[background-color] duration-150 ease-fm-snap hover:bg-fm-surface"
      >
        {playing ? (
          <Pause aria-hidden="true" className="size-4" />
        ) : (
          <Play aria-hidden="true" className="size-4 translate-x-px" />
        )}
      </button>
    </>
  )
}
