"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createGlyphReveal, type GlyphReveal } from "@/app/main-page/_lib/glyph-reveal"
import { useReducedMotion } from "@/app/main-page/_lib/hooks"
import { cn } from "@/lib/utils"

type Phase = "cover" | "print" | "done"

/**
 * Silnik wideo startu (`createGlyphReveal`) na plakacie, bez wideo: składanie ze znaków, druk
 * i front. Rusza, gdy kadr jest w połowie widoczny; „ogranicz ruch” — od razu plakat.
 */
export function GlyphRevealExample() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const poster = useRef<HTMLImageElement>(null)
  const [phase, setPhase] = useState<Phase>("cover")
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const surface = canvas.current
    const image = poster.current
    if (!surface || !image || reducedMotion) return
    let reveal: GlyphReveal | null = null
    let cancelled = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        const { width, height } = entry.boundingClientRect
        void image
          .decode()
          .then(() => createGlyphReveal(surface, image, width, height))
          .then((created) => {
            if (cancelled) return created?.stop()
            if (!created) return setPhase("done")
            reveal = created
            // Canvas to już czarny papier — zasłona może zniknąć.
            setPhase("print")
            created.play({ onDone: () => setPhase("done") })
          })
          .catch(() => setPhase("done"))
      },
      { threshold: 0.5 }
    )
    observer.observe(surface)
    return () => {
      cancelled = true
      observer.disconnect()
      reveal?.stop()
    }
  }, [reducedMotion])

  const shown: Phase = reducedMotion ? "done" : phase

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-print">
      <Image
        ref={poster}
        src="/hero-poster.webp"
        alt=""
        width={1080}
        height={606}
        sizes="(min-width: 48rem) 40rem, 100vw"
        className="absolute inset-0 size-full object-cover"
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cn("absolute inset-0 size-full", shown === "done" && "hidden")}
      />
      <div className={cn("absolute inset-0 bg-print", shown !== "cover" && "hidden")} />
    </div>
  )
}
