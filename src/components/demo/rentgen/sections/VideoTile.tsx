"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { cn } from "../../forma/cn"

/**
 * Kafel wideo w masonry. Mysz: najechanie odtwarza (plik dopiero przy
 * pierwszym najechaniu), zjechanie pauzuje — soczewka nad kaflem to też
 * najechanie, więc pod nią gra żywy obraz z cyfr. Dotyk: przycisk odtwarzania
 * (żeby telefon nie ściągał siedmiu klipów). Gra najwyżej jeden kafel naraz.
 */
let current: HTMLVideoElement | null = null

export function VideoTile({
  slug,
  title,
  category,
  poster,
  video,
  width,
  height,
  labels,
}: {
  slug: string
  title: string
  category: string
  poster: string
  video: string
  width: number
  height: number
  labels: { play: string; pause: string }
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [wanted, setWanted] = useState(false)

  useEffect(() => {
    const element = videoRef.current
    if (!element || !armed) return
    if (wanted) {
      if (current && current !== element) current.pause()
      current = element
      void element.play().catch(() => {})
    } else element.pause()
  }, [armed, wanted])

  // Poza kadrem — pauza.
  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) setWanted(false)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const want = (next: boolean) => {
    if (next) setArmed(true)
    setWanted(next)
  }

  return (
    <figure
      data-rg-key={`video-${slug}`}
      data-rg-name="figure.video"
      className="group relative flex h-full flex-col"
      onPointerEnter={(event) => event.pointerType === "mouse" && want(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && want(false)}
    >
      <div
        data-rg-key={`video-media-${slug}`}
        className="relative min-h-0 flex-1 overflow-hidden rounded-fm-2xl bg-fm-fill shadow-fm-ring"
      >
        <Image
          src={poster}
          width={width}
          height={height}
          alt=""
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 50vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={videoRef}
          src={armed ? video : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            playing ? "opacity-100" : "opacity-0"
          )}
        />
        <button
          type="button"
          onClick={() => want(!wanted)}
          aria-label={`${wanted ? labels.pause : labels.play}: ${title}`}
          data-rg-quiet=""
          className={cn(
            "absolute bottom-2.5 left-2.5 grid size-11 fm-press place-items-center rounded-full fm-focus",
            "bg-black/45 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.14)] backdrop-blur-md transition-[background-color,opacity,scale] hover:bg-black/60",
            "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100"
          )}
        >
          {wanted ? (
            <Pause aria-hidden="true" className="size-4 fill-current" />
          ) : (
            <Play aria-hidden="true" className="size-4 fill-current" />
          )}
        </button>
      </div>
      <figcaption className="mt-2.5 grid gap-0.5 px-0.5 text-fm-small sm:flex sm:items-baseline sm:justify-between sm:gap-3">
        <span className="truncate font-medium text-fm-ink">{title}</span>
        <span className="truncate text-fm-ink-3 sm:shrink-0">{category}</span>
      </figcaption>
    </figure>
  )
}
