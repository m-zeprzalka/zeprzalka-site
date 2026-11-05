import type { CSSProperties } from "react"
import { ArrowRight } from "lucide-react"
import type { DemoHomeContent } from "../shared/content"
import { GlyphMedia } from "../shared/glyph"
import { CopyEmail } from "./CopyEmail"
import { Sheet } from "./Sheet"
import { UI } from "./ui-strings"

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/**
 * Warstwa 1 — start. Harmonijka w CSS z serwera: status (120 ms) → słowa H1 z rozmycia
 * (od 180 ms co 30 ms) → podtytuł → akcje → kadr, który od pierwszego malowania jest
 * szkieletem z kropek (CSS) i wyłania się w wideo, gdy dojdzie silnik. Nic nie czeka na JS.
 */
export function Hero({
  hero,
  email,
  copiedLabel,
}: {
  hero: DemoHomeContent["hero"]
  email: string
  copiedLabel: string
}) {
  const words = hero.title.split(" ")
  const textEnd = 180 + words.length * 30

  return (
    <Sheet index={0} anchor="start" labelledBy="start-title">
      <p
        className="au-in inline-flex h-8 w-fit items-center gap-2 rounded-full bg-fm-fill ps-3 pe-3.5 text-fm-small text-fm-ink-2"
        style={delay(120)}
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-fm-live" />
        {hero.status}
      </p>

      <div className="au-hold mt-auto grid gap-x-(--au-gap) gap-y-10 pt-12 lg:grid-cols-12 lg:items-end lg:pt-20">
        <div className="lg:col-span-7">
          <h1
            id="start-title"
            className="max-w-[16ch] text-[clamp(2.625rem,6vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            {words.map((word, index) => (
              <span key={index}>
                <span className="au-in inline-block" style={delay(180 + index * 30)}>
                  {word}
                </span>
                {index < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p
            className="au-in mt-6 max-w-[34rem] text-fm-lead text-pretty text-fm-ink-2"
            style={delay(textEnd)}
          >
            {hero.subtitle.role}
            <span className="text-fm-ink">{hero.subtitle.highlight}</span>
            {hero.subtitle.rest}
          </p>
          <div className="au-in mt-8 flex flex-wrap gap-3" style={delay(textEnd + 80)}>
            <a
              href="#kontakt"
              className="group inline-flex h-12 fm-press items-center gap-2 rounded-full bg-fm-ink ps-6 pe-5 text-[0.9375rem] font-medium text-fm-inverse fm-focus transition-[background-color,scale] hover:bg-fm-ink/85"
            >
              {hero.cta}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
              />
            </a>
            <CopyEmail
              email={email}
              label={UI.copyEmail}
              copiedLabel={copiedLabel}
              className="bg-fm-fill text-fm-ink hover:bg-fm-fill-strong"
            />
          </div>
        </div>

        <div className="au-fade lg:col-span-5" style={delay(textEnd + 160)}>
          <GlyphMedia
            poster={hero.video.poster}
            src={hero.video.mp4}
            webm={hero.video.webm}
            width={hero.video.width}
            height={hero.video.height}
            alt=""
            sizes="(min-width: 64rem) 40vw, 100vw"
            trigger="view"
            loading="eager"
            controls={{ pause: UI.pause, play: UI.play }}
            className="rounded-(--au-r-card)"
          />
        </div>
      </div>
    </Sheet>
  )
}
