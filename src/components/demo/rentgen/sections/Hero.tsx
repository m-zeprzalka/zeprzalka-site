import { Fragment, type CSSProperties } from "react"
import { buttonVariants } from "../../forma/Button"
import { typo } from "../../forma/typo"
import type { DemoHomeContent } from "../../shared/content"
import { MediaTwin } from "../ascii/MediaTwin"
import { Listing } from "../code/Listing"
import { Code, Face, Inspect, Outline, Tag, Twin } from "../code/Twin"
import { quote } from "../code/highlight"
import { UI } from "../ui"
import { HeroVideo } from "./HeroVideo"

const vars = (values: Record<string, string | number>) => values as CSSProperties

const CTA = buttonVariants({ size: "lg" })

/** Reguła klasy nagłówka — ta sama co w `rentgen.css` (pokazana w kliszy obok nagłówka). */
const DISPLAY_CSS = `.rg-display {
  font-size: var(--rg-display-fs);
  /* clamp(3rem, 1.2rem + 5vw, 5.75rem) */
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 560;
}`
const SECONDARY = buttonVariants({ size: "lg", variant: "secondary" })

/**
 * Hero: status, nagłówek z rozmycia (słowa po kolei, CSS — nic nie czeka na
 * JS), podtytuł z wyróżnieniem, dwie akcje i podpowiedź soczewki; pod spodem
 * wideo, którego kadr otwiera się przy przewijaniu. Klisza: ten sam układ
 * jako JSX — klasy przycisków są prawdziwe (`buttonVariants`), wideo z cyfr.
 */
export function Hero({ content }: { content: DemoHomeContent }) {
  const { hero, portfolio, ui } = content
  const words = typo(hero.title).split(" ")

  return (
    <section
      id="start"
      data-rg-host="hero"
      data-rg-name="section#start"
      aria-labelledby="rg-hero-title"
      className="relative pt-28 sm:pt-36 lg:pt-40"
    >
      <div className="fm-container">
        <p
          data-rg-key="hero-status"
          data-rg-name="Status"
          className="rg-rise inline-flex h-8 items-center gap-2 rounded-full bg-fm-surface ps-2.5 pe-3.5 text-[0.8125rem] font-medium text-fm-ink-2 shadow-fm-ring"
          style={vars({ "--rg-d": "60ms" })}
        >
          <span aria-hidden="true" className="rg-live" />
          {hero.status}
        </p>

        <h1
          id="rg-hero-title"
          data-rg-key="hero-title"
          data-rg-name="h1.rg-display"
          className="rg-display mt-6 max-w-[15ch] text-balance sm:mt-8"
        >
          <span className="sr-only">{hero.title}</span>
          <span aria-hidden="true">
            {words.map((word, index) => (
              <Fragment key={index}>
                <span className="rg-word" style={vars({ "--w": index })}>
                  {word}
                </span>
                {index < words.length - 1 && " "}
              </Fragment>
            ))}
          </span>
        </h1>

        <p
          data-rg-key="hero-lead"
          data-rg-name="p.text-fm-lead"
          className="rg-rise mt-6 max-w-[38rem] text-fm-lead text-pretty text-fm-ink-2 sm:mt-7"
          style={vars({ "--rg-d": "420ms" })}
        >
          {hero.subtitle.role}
          <strong className="font-medium text-fm-ink">{typo(hero.subtitle.highlight)}</strong>
          {typo(hero.subtitle.rest)}
        </p>

        <div
          className="rg-rise mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          style={vars({ "--rg-d": "520ms" })}
        >
          <a
            href="#kontakt"
            data-rg-key="hero-cta"
            data-rg-name="Button"
            data-rg-magnet=""
            className={CTA}
          >
            {hero.cta}
          </a>
          <a
            href="#realizacje"
            data-rg-key="hero-works"
            data-rg-name="Button"
            data-rg-magnet=""
            className={SECONDARY}
          >
            {portfolio.link.label}
          </a>
        </div>

        <p
          data-rg-key="hero-hint"
          className="rg-rise mt-8 flex items-center gap-2.5 text-fm-small text-fm-ink-3 sm:mt-10"
          style={vars({ "--rg-d": "640ms" })}
        >
          <span aria-hidden="true" className="rg-hint-lens" />
          <span className="rg-hint--pointer">{UI.lens.hintPointer}</span>
          <span className="rg-hint--touch">{UI.lens.hintTouch}</span>
        </p>
      </div>

      <div className="mt-14 pb-4 sm:mt-20">
        <HeroVideo video={hero.video} labels={{ ...UI.video, fallback: ui.videoFallback }} />
      </div>

      <Face>
        <Listing file="Hero.tsx" />

        <Inspect
          for="hero-status"
          name="Status"
          className="rounded-full"
          src={`<Status live>${hero.status}</Status>`}
        />
        <Outline
          for="hero-title"
          tag="h1"
          classes="rg-display text-balance"
          text={hero.title}
          css={DISPLAY_CSS}
        />
        <Twin for="hero-lead" kind="text">
          <Code
            className="rg-code--lead"
            src={`<p className="text-fm-lead text-fm-ink-2">\n  ${hero.subtitle.role}\n  <strong>${hero.subtitle.highlight.trim()}</strong>\n  ${hero.subtitle.rest}\n</p>`}
          />
        </Twin>
        <Inspect
          for="hero-cta"
          name="a.Button"
          className="rounded-full"
          src={`<Button href="#kontakt" size="lg">`}
        />
        <Twin for="hero-cta" kind="text" className="rg-twin--classes">
          <Code src={`className=${quote(CTA)}`} />
        </Twin>
        <Inspect
          for="hero-works"
          name="a.Button"
          className="rounded-full"
          src={`<Button variant="secondary">`}
        />
        <Twin for="hero-video" kind="media" className="rg-reel">
          <MediaTwin source="hero-video" cell={7} />
          <Tag name="video.rg-reel" className="rg-tag--inside" />
          <div className="rg-media-code fm-container">
            <Code
              src={`<video src="${hero.video.webm}" poster="${hero.video.poster}"\n  muted loop playsInline preload="none" />`}
            />
          </div>
        </Twin>
      </Face>
    </section>
  )
}
