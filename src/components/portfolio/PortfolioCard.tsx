"use client"

import { useInView } from "react-intersection-observer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { PortfolioItem } from "@/lib/portfolio"
import { t, type Locale } from "@/i18n/config"

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
    <div ref={ref} className="relative aspect-video w-full bg-muted/30 -my-6">
      {inView && (
        <video
          ref={videoRef}
          onPlay={(event) => {
            if (reducedMotion) event.currentTarget.pause()
          }}
          preload="metadata"
          poster={poster}
          className="w-full h-full object-cover block"
          autoPlay loop muted playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Category Badge */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <Badge
          variant="secondary"
          className="px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {category}
        </Badge>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <h3 className="text-white font-medium text-lg">{title}</h3>
      </div>
    </div>
  )
}

/**
 * Kafel realizacji — dokładnie ta karta, która była wpisana w `Gallery.tsx`.
 * Przeniesiona bez zmiany klas, żeby zajawka na stronie głównej i strona
 * `/portfolio` korzystały z jednego komponentu zamiast z dwóch kopii.
 */
export function PortfolioCard({
  item,
  locale,
}: {
  item: PortfolioItem
  locale: Locale
}) {
  return (
    <Card className="break-inside-avoid mb-4 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl">
      <LazyVideo
        src={item.video}
        poster={item.poster}
        title={t(item.title, locale)}
        category={t(item.category, locale)}
      />
    </Card>
  )
}
