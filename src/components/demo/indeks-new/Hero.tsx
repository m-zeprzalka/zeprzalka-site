import { Fragment, type CSSProperties, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { typo } from "@/components/demo/forma/typo"
import { SECTION } from "./anchors"
import { Chip } from "./Chip"
import type { IndeksNewContent } from "./content"
import { GlyphMedia } from "./GlyphMedia"
import { UI } from "./ui-strings"

/** Słowa tytułu co 34 ms, szare zdanie dopływa zaraz za nimi co 22 ms. */
const TITLE_STEP = 34
const LEAD_STEP = 22
const LEAD_START = 200

const at = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/** Numer pierwszego słowa każdego fragmentu (ciągła numeracja przez całe zdanie). */
function wordOffsets(texts: readonly string[]): number[] {
  return texts.map((_, index) =>
    texts.slice(0, index).reduce((sum, text) => sum + text.split(" ").length, 0)
  )
}

/** Tekst pocięty na słowa (spacje zostają tekstem — zdanie łamie się normalnie). */
function words(
  text: string,
  className: string,
  delay: (index: number) => number,
  from = 0
): ReactNode[] {
  return text.split(" ").map((word, index, list) => (
    <Fragment key={index}>
      {word && (
        <span className={className} style={at(delay(from + index))}>
          {word}
        </span>
      )}
      {index < list.length - 1 && " "}
    </Fragment>
  ))
}

/**
 * Start: jedno dwutonowe zdanie w skali prozy (tytuł atramentem, biogram
 * szarością) z trzema chipami, akcje i wideo w kolumnie. Zdanie wyostrza się
 * z rozmycia słowo po słowie (CSS z serwera), a wideo — jedyny obraz na
 * pierwszym ekranie — chwilę później **odkodowuje się z glifów**: tekst ma
 * swój materiał (rozmycie), obraz swój (kod).
 */
export function Hero({
  hero,
  peeks,
  works,
  email,
  ui,
}: {
  hero: IndeksNewContent["hero"]
  peeks: IndeksNewContent["peeks"]
  works: Readonly<Record<string, { title: string; src: string }>>
  email: string
  ui: IndeksNewContent["ui"]
}) {
  const title = typo(hero.title)
  const titleWords = title.split(" ").length
  const leadDelay = (index: number) => LEAD_START + titleWords * TITLE_STEP + index * LEAD_STEP
  const offsets = wordOffsets(hero.lead.map((segment) => segment.text))

  return (
    <section
      id={SECTION.start}
      data-ixn-column
      className="ixn-col scroll-mt-(--ixn-header) pt-12 sm:pt-24"
    >
      <p
        style={at(0)}
        className="ixn-enter inline-flex items-center gap-2.5 text-fm-small text-fm-ink-2"
      >
        <LiveDot />
        {hero.status}
      </p>

      <div className="ixn-hero mt-5 text-pretty sm:mt-6">
        <h1 className="inline text-fm-ink">
          <span className="sr-only">{hero.title}</span>
          <span aria-hidden="true">
            {words(title, "ixn-word", (index) => 60 + index * TITLE_STEP)}
          </span>
        </h1>{" "}
        <p className="inline text-fm-ink-3">
          {hero.lead.map((segment, index) => {
            const from = offsets[index] ?? 0
            if ("peek" in segment) {
              const peek = peeks[segment.peek]
              if (!peek) return segment.text
              return (
                <Chip
                  key={index}
                  text={segment.text}
                  icon={segment.icon}
                  peekId={segment.peek}
                  peek={peek}
                  work={peek.kind === "work" ? works[peek.slug] : undefined}
                  style={at(leadDelay(from))}
                  className="ixn-sharpen"
                />
              )
            }
            return (
              <Fragment key={index}>{words(segment.text, "ixn-sharpen", leadDelay, from)}</Fragment>
            )
          })}
        </p>
      </div>

      <div style={at(560)} className="ixn-enter mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
        <Button asChild size="lg" className="group w-full sm:w-auto">
          <a href={`#${SECTION.contact}`}>
            {hero.cta}
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
            />
          </a>
        </Button>
        <CopyButton
          value={email}
          label={email}
          copiedLabel={ui.copied}
          className="h-12 w-full justify-center ps-5 pe-4 sm:w-auto"
        />
      </div>

      <GlyphMedia
        frame={{ src: hero.video.poster, width: hero.video.width, height: hero.video.height }}
        sources={[
          { src: hero.video.webm, type: "video/webm" },
          { src: hero.video.mp4, type: "video/mp4" },
        ]}
        decode="load"
        wave="hero"
        origin={{ x: 0, y: 0 }}
        from="latent"
        delay={1000}
        priority
        title={hero.title}
        labels={{ play: UI.play, pause: UI.pause }}
        className="mt-10 rounded-fm-2xl sm:mt-14"
      />
    </section>
  )
}
