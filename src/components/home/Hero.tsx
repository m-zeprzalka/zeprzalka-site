"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MousePointerClick } from "lucide-react"
import Link from "next/link"

export function HeroB() {
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsLoaded(true)
    }
  }, [])

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
        <video 
          ref={videoRef}
          autoPlay muted loop playsInline 
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          onLoadedData={() => setIsLoaded(true)}
          className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}
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
