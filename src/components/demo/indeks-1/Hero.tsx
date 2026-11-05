import { Fragment, type CSSProperties, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { typo } from "@/components/demo/forma/typo"
import { SECTION } from "./anchors"
import { Chip } from "./Chip"
import type { IndeksOneContent } from "./content"
import { HeroVideo } from "./HeroVideo"
import type { PeekWork } from "./PeekBody"
import { UI } from "./ui-strings"

/**
 * „Harmonijka” wejścia (ms od pierwszego malowania): nagłówek 40 → status 70
 * → tytuł jako całość od 60 (360 ms — H1 ostry po ~0,4 s) → szare zdanie słowo
 * po słowie od 200 (co 10) → akcje 300 → wideo 420. Wszystko z CSS z serwera,
 * bez czekania na hydratację; silnik glifów rusza dopiero po wejściu.
 */
export const T = {
  status: 70,
  title: 60,
  /** Szare zdanie rusza, gdy tytuł jest już w połowie wyostrzenia. */
  leadGap: 140,
  leadStep: 10,
  cta: 300,
  video: 420,
  /** Co jeszcze mieści się w pierwszym oknie telefonu (nagłówek „O mnie”). */
  after: 600,
}

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
 * szarością) z trzema frazami-pigułkami, akcje i wideo w kolumnie. Zdanie
 * wyostrza się z rozmycia słowo po słowie, a wideo — ostatnie w „harmonijce” —
 * rośnie z mniejszego kadru do szerokości kolumny (`clip-path`) i wyłania się
 * ze szkieletu z CSS — bez silnika glifów, który rusza dopiero po wejściu.
 */
export function Hero({
  hero,
  peeks,
  works,
  email,
  ui,
}: {
  hero: IndeksOneContent["hero"]
  peeks: IndeksOneContent["peeks"]
  works: Readonly<Record<string, PeekWork>>
  email: string
  ui: IndeksOneContent["ui"]
}) {
  const title = typo(hero.title)
  const leadStart = T.title + T.leadGap
  const leadDelay = (index: number) => leadStart + index * T.leadStep
  const offsets = wordOffsets(hero.lead.map((segment) => segment.text))

  return (
    <section id={SECTION.start} className="i1-col scroll-mt-(--i1-header) pt-12 sm:pt-24">
      <p
        style={at(T.status)}
        className="i1-enter inline-flex items-center gap-2.5 text-fm-small text-fm-ink-2"
      >
        <LiveDot />
        {hero.status}
      </p>

      <div className="mt-5 text-[1.4375rem] leading-[1.32] font-medium tracking-[-0.022em] text-pretty sm:mt-6 sm:text-[1.875rem] sm:leading-[1.27] sm:tracking-[-0.026em] min-[90rem]:text-[2.0625rem] min-[90rem]:leading-[1.26] min-[105rem]:text-[2.25rem] min-[105rem]:leading-[1.25]">
        {/* H1 wyostrza się jako całość (jedna warstwa, 360 ms) — ostry po ~0,4 s nawet przy
            zajętym wątku; kaskadę słowo po słowie niesie szare zdanie za nim. */}
        <h1 style={at(T.title)} className="i1-title inline text-fm-ink">
          {title}
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
                  className="i1-sharpen"
                />
              )
            }
            return (
              <Fragment key={index}>{words(segment.text, "i1-sharpen", leadDelay, from)}</Fragment>
            )
          })}
        </p>
      </div>

      <div style={at(T.cta)} className="i1-enter mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
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

      <div style={at(T.video)} className="i1-grow mt-10 sm:mt-14">
        <HeroVideo
          poster={hero.video.poster}
          webm={hero.video.webm}
          mp4={hero.video.mp4}
          width={hero.video.width}
          height={hero.video.height}
          labels={{ pause: UI.pause, play: UI.play }}
          revealAt={T.video + 120}
          className="rounded-fm-2xl"
        />
      </div>
    </section>
  )
}
