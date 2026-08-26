"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface VideoSource {
  src: string
  type: string
}

interface SmartVideoProps {
  sources: VideoSource[]
  poster: string
  /** Proporcje np. "16 / 9" — rezerwują miejsce zanim cokolwiek się załaduje. */
  aspect: string
  /** Opis dla technologii asystujących. */
  label: string
  /** Hero: montuj od razu. Domyślnie leniwie, ~320px przed viewportem. */
  eager?: boolean
  /** Tekst dla przeglądarek bez <video>. */
  fallback?: string
  /** `sizes` posteru (next/image) — dopasuj do szerokości kafelka. */
  sizes?: string
  /** Klasa dla samego <video> / posteru (np. efekt hover). */
  mediaClassName?: string
  className?: string
}

type Intent = "auto" | "play" | "pause"

/** requestIdleCallback z fallbackiem — nie każda przeglądarka go ma (Safari < 17). */
function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(callback, 300)
  return () => window.clearTimeout(id)
}

/**
 * Wideo w tle, które szanuje użytkownika i budżet:
 * - montuje <video> dopiero blisko viewportu (wcześniej: lekki poster),
 * - `preload="metadata"` + start dopiero po `load` i w bezczynności: bajty wideo
 *   nie konkurują z fontami i CSS w oknie LCP,
 * - gra tylko gdy jest widoczne, pauzuje poza ekranem,
 * - nie startuje przy `prefers-reduced-motion`,
 * - ma widoczny przycisk pauzy (WCAG 2.2.2), z zapamiętaną decyzją użytkownika.
 */
export function SmartVideo({
  sources,
  poster,
  aspect,
  label,
  eager = false,
  fallback,
  sizes = "100vw",
  mediaClassName,
  className,
}: SmartVideoProps) {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [intent, setIntent] = useState<Intent>("auto")
  const [playing, setPlaying] = useState(false)
  const [idle, setIdle] = useState(false)

  const { ref: nearRef, inView: near } = useInView({
    triggerOnce: true,
    rootMargin: "320px 0px",
  })
  const { ref: visibleRef, inView: visible } = useInView({ threshold: 0.2 })
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      nearRef(node)
      visibleRef(node)
    },
    [nearRef, visibleRef]
  )

  // Autoodtwarzanie czeka na koniec ładowania strony — inaczej strumień wideo
  // rywalizuje o pasmo z zasobami krytycznymi (LCP).
  useEffect(() => {
    let cancelIdle: (() => void) | undefined
    const start = () => {
      cancelIdle = whenIdle(() => setIdle(true))
    }
    if (document.readyState === "complete") {
      start()
    } else {
      window.addEventListener("load", start, { once: true })
    }
    return () => {
      window.removeEventListener("load", start)
      cancelIdle?.()
    }
  }, [])

  const mounted = eager || near
  const wantsPlay =
    mounted &&
    visible &&
    (intent === "play" || (intent === "auto" && idle && !reducedMotion))

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (wantsPlay) {
      video.play().catch(() => {
        /* autoplay zablokowany przez przeglądarkę — zostaje poster i przycisk */
      })
    } else {
      video.pause()
    }
  }, [wantsPlay])

  const toggle = () => setIntent(playing ? "pause" : "play")

  return (
    <div
      ref={setRefs}
      className={cn("group/video relative overflow-hidden bg-muted", className)}
      style={{ aspectRatio: aspect }}
      data-playing={playing || undefined}
    >
      {mounted ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="metadata"
          poster={poster}
          aria-label={label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={cn(
            "absolute inset-0 size-full object-cover",
            mediaClassName
          )}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          {fallback}
        </video>
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          sizes={sizes}
          className={cn("object-cover", mediaClassName)}
        />
      )}

      {mounted && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={toggle}
          aria-label={playing ? `Wstrzymaj: ${label}` : `Odtwórz: ${label}`}
          aria-pressed={playing}
          className={cn(
            "absolute right-3 bottom-3 rounded-full transition-opacity duration-300",
            "group-hover/video:opacity-100 focus-visible:opacity-100",
            playing && "[@media(hover:hover)]:opacity-0"
          )}
        >
          {playing ? <Pause /> : <Play />}
        </Button>
      )}
    </div>
  )
}
