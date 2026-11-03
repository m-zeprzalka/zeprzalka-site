"use client"

import { useInView } from "react-intersection-observer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { PortfolioItem } from "@/lib/portfolio"
import type { Locale } from "@/i18n/config"

function LazyVideo({
  src,
  poster,
  title,
  category,
}: {
  src: string
  poster: string
  title: string
  category: string
}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "600px" })
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()

  // Osiem zapętlonych kadrów naraz to dużo ruchu — przy ustawieniu
  // „ogranicz ruch" każdy zatrzymuje się na pierwszej klatce.
  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause()
  }, [reducedMotion])

  return (
    <div ref={ref} className="relative -my-6 aspect-video w-full bg-muted/30">
      {inView && (
        <video
          ref={videoRef}
          onPlay={(event) => {
            if (reducedMotion) event.currentTarget.pause()
          }}
          preload="metadata"
          poster={poster}
          className="block h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Category Badge */}
      <div className="pointer-events-none absolute top-3 left-3">
        <Badge
          variant="secondary"
          className="px-3 py-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          {category}
        </Badge>
      </div>

      {/* Title */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
    </div>
  )
}

/**
 * Kafel realizacji — dokładnie ta karta, która była wpisana w `Gallery.tsx`.
 * Przeniesiona bez zmiany klas, żeby zajawka na stronie głównej i strona
 * `/portfolio` korzystały z jednego komponentu zamiast z dwóch kopii.
 */
export function PortfolioCard({ item, locale }: { item: PortfolioItem; locale: Locale }) {
  return (
    <Card className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden transition-all duration-300 hover:shadow-xl">
      <LazyVideo
        src={item.video}
        poster={item.poster}
        title={item.title[locale]}
        category={item.category[locale]}
      />
    </Card>
  )
}
