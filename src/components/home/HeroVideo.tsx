"use client"

import { useReducedMotionVideo } from "@/hooks/use-reduced-motion"

/**
 * Wideo hero — jedyna kliencka część sekcji. Poster to pierwsza klatka
 * materiału (28 KB WebP): maluje się od razu, więc największy element strony
 * nie czeka na wideo, a `preload="metadata"` zdejmuje megabajty ze ścieżki
 * krytycznej.
 */
export function HeroVideo({ fallback }: { fallback: string }) {
  const { ref, onPlay } = useReducedMotionVideo()

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted/20">
      <video
        ref={ref}
        onPlay={onPlay}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        preload="metadata"
        poster="/hero-poster.webp"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Najpierw lżejszy WebM, MP4 dla Safari. */}
        <source src="/hero_web.webm" type="video/webm" />
        <source src="/hero_web.mp4" type="video/mp4" />
        {fallback}
      </video>
    </div>
  )
}
