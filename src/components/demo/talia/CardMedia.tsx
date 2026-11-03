"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { cn } from "../forma/cn"
import { usePageReady, useVisible } from "./hooks"
import { useTalia } from "./TaliaProvider"
import type { Still } from "./types"

/**
 * Plakat i pętla wideo jednej realizacji.
 *
 * - Plakat (next/image, leniwy) jest zawsze — to on daje pierwszy obraz i stan
 *   bez JS. `<video>` montuje się dopiero przy pierwszej aktywacji
 *   (`preload="none"`), więc 15 kart nie ściąga 15 filmów.
 * - Gra tylko wtedy, gdy rodzic uzna kartę za aktywną, karta jest w kadrze,
 *   strona skończyła się ładować, nikt nie prosił o mniej ruchu ani nie
 *   wstrzymał wideo. Rodzice pilnują budżetu: aktywna jest najwyżej jedna
 *   karta w talii.
 * - Wideo jest dekoracją (`aria-hidden`) — nazwę niesie przycisk karty.
 */
export function CardMedia({
  poster,
  video,
  active,
  sizes,
  className,
  zoom = false,
  inDialog = false,
  hero = false,
  still,
}: {
  poster: string
  video: string
  active: boolean
  sizes: string
  className?: string
  /** Delikatne przybliżenie przy najechaniu na rodzica z klasą `group`. */
  zoom?: boolean
  /** Dialog gra mimo zasłoniętej strony. */
  inDialog?: boolean
  /**
   * Plakat nad zgięciem (kandydat na LCP). Wysoki priorytet, ale nadal leniwie:
   * talia istnieje w dwóch wariantach (wachlarz / stos) i jeden zawsze jest
   * ukryty — `eager` pobrałby oba (zalecenie z dokumentacji next/image).
   */
  hero?: boolean
  /** Klatka z karty, z której otwarto dialog: obraz startowy i czas wznowienia. */
  still?: Still
}) {
  const { covered, paused } = useTalia()
  const reduced = useReducedMotion()
  const ready = usePageReady()
  const [frame, setFrame] = useState<HTMLSpanElement | null>(null)
  const visible = useVisible(frame, 0.25)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const shouldPlay = active && visible && ready && !reduced && !paused && (inDialog || !covered)
  // Raz zamontowane wideo zostaje — ponowne najechanie nie ładuje go od nowa.
  const [mounted, setMounted] = useState(false)
  if (shouldPlay && !mounted) setMounted(true)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (shouldPlay) {
      element.play().catch(() => {
        /* autoodtwarzanie zablokowane — zostaje plakat */
      })
    } else {
      element.pause()
    }
  }, [shouldPlay, mounted])

  return (
    <span ref={setFrame} className={cn("relative block overflow-hidden bg-fm-fill", className)}>
      <span
        className={cn(
          "absolute inset-0 block",
          zoom && "transition-[scale] duration-700 ease-fm-snap group-hover:scale-[1.035]"
        )}
      >
        <Image
          src={poster}
          alt=""
          fill
          sizes={sizes}
          fetchPriority={hero ? "high" : "auto"}
          draggable={false}
          className="object-cover"
        />
        {still && (
          <span
            aria-hidden="true"
            className="absolute inset-0 block [&>canvas]:size-full [&>canvas]:object-cover"
            ref={(node) => {
              if (node && !node.contains(still.canvas)) node.replaceChildren(still.canvas)
            }}
          />
        )}
        {mounted && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(event) => {
              if (still) event.currentTarget.currentTime = still.time
            }}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-500 ease-fm-snap",
              playing ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
      </span>
      {/* Krawędź kadru nad obrazem: białe ujęcia nie rozpływają się w białej karcie. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--fm-edge)]"
      />
    </span>
  )
}
