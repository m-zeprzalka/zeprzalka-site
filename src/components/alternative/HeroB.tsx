import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MousePointerClick } from "lucide-react"
import Link from "next/link"

export function HeroB() {
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
      <h2 className="sm:text-xl md:text-2xl text-muted-foreground max-w-3xl transition-all duration-300 font-normal">
        Digital Solutions Architect
        <span className="text-foreground font-medium"> - ponad 12+ lat </span>
        doświadczenia w tworzeniu innowacyjnych rozwiązań webowych i
        multimedialnych
      </h2>
      <Button asChild size="lg" className="p-6 w-fit">
        <Link href="#contact">
          <MousePointerClick />
          Zarezerwuj Bezpłatną Konsultację
        </Link>
      </Button>
      <video autoPlay muted loop playsInline className="rounded-lg">
        <source src="/hero_web.mp4" type="video/mp4" />
      </video>
    </section>
  )
}
