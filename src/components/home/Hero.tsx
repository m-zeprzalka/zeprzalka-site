"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MousePointerClick } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()

  // Zapętlone wideo to ruch ciągły. Przy ustawieniu „ogranicz ruch"
  // zostaje pierwsza klatka zamiast odtwarzania.
  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause()
  }, [reducedMotion])

  return (
    <section className="flex flex-col gap-6 lg:gap-8 xl:gap-10 p-4 py-6 md:py-8 lg:py-12 xl:py-16 min-h-[calc(100vh-4rem)] container mx-auto">
      <Badge
        variant="outline"
        className="flex items-center gap-2 text-sm px-4 py-2"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Gotowy do współpracy</span>
      </Badge>
      <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-medium max-w-5xl transition-all duration-300">
        Przekształcam ambitne projekty w produkty cyfrowe.
      </h1>
      <p className="sm:text-xl md:text-2xl text-muted-foreground max-w-3xl transition-all duration-300 font-normal">
        Digital Solutions Architect
        <span className="text-foreground font-medium"> - ponad 12+ lat </span>
        doświadczenia w tworzeniu innowacyjnych rozwiązań webowych i
        multimedialnych
      </p>
      <Button asChild size="lg" className="p-6 w-fit">
        <Link href="/kontakt">
          <MousePointerClick />
          Zarezerwuj Bezpłatną Konsultację
        </Link>
      </Button>
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted/20">
        {/*
          Poster to pierwsza klatka materiału (28 KB WebP). Maluje się od razu,
          więc największy element strony nie czeka na wideo — a `preload`
          ograniczony do metadanych zdejmuje kilka megabajtów ze ścieżki
          krytycznej. Wcześniej posterem był przezroczysty piksel, przez co
          kadr pozostawał pusty aż do wczytania wideo.
        */}
        <video 
          ref={videoRef}
          autoPlay muted loop playsInline 
          preload="metadata"
          poster="/hero-poster.webp"
          onPlay={(event) => {
            if (reducedMotion) event.currentTarget.pause()
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* WAŻNE: Najpierw lżejszy format WebM */}
          <source src="/hero_web.webm" type="video/webm" />
          {/* WAŻNE: MP4 jako fallback dla starszych przeglądarek (np. Safari) */}
          <source src="/hero_web.mp4" type="video/mp4" />
          {/* Komunikat dla bardzo starych przeglądarek */}
          Twoja przeglądarka nie obsługuje wideo.
        </video>
      </div>
    </section>
  )
}
