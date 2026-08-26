import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SmartVideo } from "@/components/media/SmartVideo"
import { Words } from "@/components/main-secondary/Words"
import { hero, sections } from "@/lib/home-content"

const enter = (i: number) => ({ "--i": i }) as CSSProperties

/**
 * Hero jest w całości renderowany po stronie serwera; wejście to czyste
 * animacje CSS (bez JS na ścieżce krytycznej), więc LCP nie czeka na hydrację.
 */
export function Hero() {
  const wordCount = hero.title.reduce(
    (sum, part) => sum + part.text.split(" ").length,
    0
  )

  return (
    <section
      id={sections.hero.id}
      aria-labelledby="hero-title"
      className="scroll-mt-20"
    >
      <div className="container mx-auto flex flex-col gap-12 px-4 pt-10 pb-16 md:gap-16 md:px-6 md:pt-16 md:pb-24 lg:pt-20">
        <div className="flex flex-col gap-8 md:gap-10">
          <Badge
            variant="outline"
            className="ms-enter gap-2 px-3 py-1.5"
            style={enter(0)}
          >
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-70 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-green-500" />
            </span>
            {hero.status}
          </Badge>

          <h1 id="hero-title" className="ms-h1">
            <Words parts={hero.title} startIndex={1} animate />
          </h1>

          <p
            className="ms-enter max-w-3xl text-xl leading-snug text-muted-foreground md:text-2xl lg:text-3xl"
            style={enter(wordCount + 2)}
          >
            {hero.subtitle.role}{" "}
            <span className="text-foreground">– {hero.subtitle.highlight}</span>{" "}
            {hero.subtitle.rest}
          </p>

          <div className="ms-enter" style={enter(wordCount + 3)}>
            <Button asChild size="lg" className="group h-12 rounded-full px-6 text-base">
              <Link href={hero.cta.href}>
                {hero.cta.label}
                <ArrowUpRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>

        <figure className="ms-media">
          <div className="ms-enter" style={enter(wordCount + 5)}>
            <SmartVideo
              eager
              sources={hero.video.sources}
              poster={hero.video.poster}
              aspect={hero.video.aspect}
              label={hero.video.label}
              fallback={hero.video.fallback}
              sizes="(min-width: 1536px) 1536px, 100vw"
              className="rounded-xl md:rounded-2xl"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}
