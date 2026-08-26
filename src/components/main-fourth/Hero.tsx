import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SmartVideo } from "@/components/media/SmartVideo"
import { Lines } from "@/components/main-fourth/Lines"
import { Magnetic } from "@/components/main-fourth/Magnetic"
import { pl } from "@/components/main-fourth/typography"
import { hero, sections } from "@/lib/home-content"

const at = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/**
 * Hero renderuje się w całości na serwerze, a jego wejście to klatki CSS —
 * nie czeka na hydrację. Nagłówek prowadzi kompozycję: dwa wiersze pod maską,
 * druga myśl prawdziwą kursywą.
 */
export function Hero() {
  return (
    <section
      id={sections.hero.id}
      aria-labelledby="hero-title"
      className="m4-hero scroll-mt-20"
    >
      <div className="m4-container">
        <p className="m4-eyebrow m4-in" style={at(80)}>
          <span className="m4-dot" aria-hidden="true" />
          {hero.status}
        </p>

        <h1 id="hero-title" className="m4-h1">
          <Lines lines={hero.titleLines} from={1} immediate />
        </h1>

        <div className="m4-hero-meta">
          <p className="m4-in m4-hero-sub" style={at(430)}>
            {hero.subtitle.role}
            <em className="m4-em m4-hero-accent">
              {" "}
              — {pl(hero.subtitle.highlight)}{" "}
            </em>
            {pl(hero.subtitle.rest)}
          </p>

          <div className="m4-in" style={at(500)}>
            <Magnetic>
              <Button asChild size="lg" className="m4-cta">
                <Link href={hero.cta.href}>
                  {hero.cta.label}
                  <ArrowUpRight data-icon="inline-end" className="m4-cta-icon" />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="m4-container">
        <figure className="m4-in m4-stage" style={at(580)}>
          <SmartVideo
            eager
            sources={hero.video.sources}
            poster={hero.video.poster}
            aspect={hero.video.aspect}
            label={hero.video.label}
            fallback={hero.video.fallback}
            sizes="(min-width: 1600px) 1500px, 100vw"
            className="m4-stage-media"
            mediaClassName="m4-parallax"
          />
        </figure>
      </div>
    </section>
  )
}
