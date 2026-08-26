import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SmartVideo } from "@/components/media/SmartVideo"
import { cn } from "@/lib/utils"
import { hero, sections } from "@/lib/home-content"

const enter = (i: number) => ({ "--i": i }) as CSSProperties

/**
 * Hero w całości renderowany na serwerze. Wejście to keyframes CSS
 * (nie czeka na hydrację), a nagłówek dzieli się na dwa bloki — każdy
 * z własną maską „kurtyny”. Kontrast buduje oś szerokości Archivo:
 * pierwszy blok wąski i lekki, drugi szeroki i ciężki.
 */
export function Hero() {
  return (
    <section
      id={sections.hero.id}
      aria-labelledby="hero-title"
      className="scroll-mt-16"
    >
      <div className="container mx-auto grid gap-x-6 gap-y-12 px-4 pt-10 pb-16 md:px-6 md:pt-16 md:pb-24 lg:grid-cols-12">
        <div className="flex flex-col gap-8 md:gap-10 lg:col-span-12">
          <Badge
            variant="outline"
            className="m3-enter m3-label gap-2 rounded-none border-border/70 px-3 py-1.5"
            style={enter(0)}
          >
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-70 motion-reduce:hidden" />
              <span className="relative size-1.5 rounded-full bg-green-500" />
            </span>
            {hero.status}
          </Badge>

          <h1 id="hero-title" className="m3-h1">
            {hero.title.map((part, i) => (
              <span key={i} className="m3-curtain" style={enter(i + 1)}>
                <span className={cn("m3-curtain-in", part.accent && "m3-strong")}>
                  {part.text}
                  {i < hero.title.length - 1 ? " " : null}
                </span>
              </span>
            ))}
          </h1>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p
              className="m3-enter m3-subtitle lg:col-span-7"
              style={enter(3)}
            >
              {hero.subtitle.role}
              <span className="text-foreground">
                {" "}
                — {hero.subtitle.highlight}{" "}
              </span>
              {hero.subtitle.rest}
            </p>
            <div className="m3-enter lg:col-span-5" style={enter(4)}>
              <Button
                asChild
                size="lg"
                className="group h-13 w-full rounded-none px-6 text-base sm:w-fit"
              >
                <Link href={hero.cta.href}>
                  {hero.cta.label}
                  <ArrowRight
                    data-icon="inline-end"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <figure className="m3-enter lg:col-span-10 lg:col-start-3" style={enter(5)}>
          <SmartVideo
            eager
            sources={hero.video.sources}
            poster={hero.video.poster}
            aspect={hero.video.aspect}
            label={hero.video.label}
            fallback={hero.video.fallback}
            sizes="(min-width: 1280px) 1050px, 100vw"
            className="m3-band"
          />
        </figure>
      </div>
    </section>
  )
}
