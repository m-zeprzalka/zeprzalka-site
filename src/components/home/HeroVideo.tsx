"use client"

import { preload } from "react-dom"
import { useReducedMotionVideo } from "@/hooks/use-reduced-motion"

/**
 * Wideo hero — jedyna kliencka część sekcji. Poster to pierwsza klatka
 * materiału (28 KB WebP): maluje się od razu, więc największy element strony
 * nie czeka na wideo. (`preload` nie ma tu znaczenia — `autoPlay` i tak
 * zaczyna pobieranie; odroczenie wideo to zmiana zachowania do decyzji.)
 */
export function HeroVideo({ fallback }: { fallback: string }) {
  // Poster maluje się jako pierwszy duży element — pobiera się równolegle z
  // dokumentem. Wywołane w komponencie klienckim trafia tylko do <head> HTML-a
  // strony głównej; z komponentu serwerowego szło też do ładunku RSC, więc
  // każdy prefetch strony głównej (logo w nagłówku) ściągał poster na podstronach.
  preload("/hero-poster.webp", { as: "image", fetchPriority: "high" })
  const { ref, onPlay } = useReducedMotionVideo()

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/20">
      <video
        ref={ref}
        onPlay={onPlay}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        poster="/hero-poster.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {/* Najpierw lżejszy WebM, MP4 dla Safari. */}
        <source src="/hero_web.webm" type="video/webm" />
        <source src="/hero_web.mp4" type="video/mp4" />
        {fallback}
      </video>
    </div>
  )
}
