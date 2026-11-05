import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "../../forma/Button"
import { cn } from "../../forma/cn"
import { typo } from "../../forma/typo"
import type { DemoHomeContent, DemoWork } from "../../shared/content"
import { MediaTwin } from "../ascii/MediaTwin"
import { Listing } from "../code/Listing"
import { quote } from "../code/highlight"
import { Code, Face, Inspect, Outline, Twin } from "../code/Twin"
import { UI } from "../ui"
import { Slider, type SlideWork } from "./Slider"

const vars = (values: Record<string, string | number>) => values as CSSProperties

/**
 * Realizacje: nagłówek i JEDEN nieskończony rząd kart (strony i produkty —
 * prace cyfrowe; wideo ma własną sekcję). Pod soczewką karta pokazuje swój
 * obiekt danych z `lib/portfolio.ts` i plakat z cyfr.
 */
export function Works({
  portfolio,
  works,
  newTab,
}: {
  portfolio: DemoHomeContent["portfolio"]
  works: readonly DemoWork[]
  newTab: string
}) {
  const slides: SlideWork[] = works.map((work) => ({
    slug: work.slug,
    title: work.title,
    category: work.category,
    poster: work.poster,
    width: work.width,
    height: work.height,
    video: work.video,
    href: work.url ?? portfolio.link.href,
    external: !!work.url,
  }))

  const faces = works.map((work) => (
    <Face key={work.slug} variant="live" guides={false} className="rg-face--card">
      <Twin for="card-media" kind="media" className="rg-card__twin-media">
        <MediaTwin source="card-media" cell={5} tone={0.05} negative />
      </Twin>
      <Code
        className="rg-card__code"
        src={`{ slug: ${quote(work.slug)}, title: ${quote(work.title)},\n  category: ${quote(work.category)}, group: ${quote(work.group)} }`}
      />
    </Face>
  ))

  return (
    <section
      id="realizacje"
      data-rg-host="works"
      data-rg-section="realizacje"
      data-rg-name="section#realizacje"
      aria-labelledby="rg-works-title"
      className="relative pt-(--fm-section) pb-12"
    >
      <div className="fm-container grid gap-x-6 gap-y-5 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h2
            id="rg-works-title"
            data-rg-key="works-title"
            data-rg-name="h2.rg-h2"
            data-rg-in=""
            className="rg-h2"
          >
            {portfolio.title}
          </h2>
          <p
            data-rg-key="works-lead"
            data-rg-in=""
            style={vars({ "--i": 1 })}
            className="mt-4 max-w-[30rem] text-fm-lead text-pretty text-fm-ink-2"
          >
            {typo(portfolio.lead)}
          </p>
        </div>
        <div className="flex items-center gap-4 lg:col-span-5 lg:justify-end">
          <span className="text-fm-small text-fm-ink-3 tabular-nums">{portfolio.count}</span>
          <a
            href={portfolio.link.href}
            data-rg-key="works-link"
            data-rg-name="Button"
            data-rg-magnet=""
            className={cn(buttonVariants({ variant: "secondary" }), "max-sm:h-11")}
          >
            {portfolio.link.label}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <Slider
          works={slides}
          labels={{ ...UI.slider, newTab }}
          faces={faces}
          trackFace={
            <Face guides={false}>
              <div className="rg-track-code fm-container">
                <Code
                  src={`<Slider>\n  {works.map((work) => <Card key={work.slug} {...work} />)}\n</Slider>`}
                />
              </div>
            </Face>
          }
        />
      </div>

      <Face>
        <Listing file="Works.tsx" />
        <Outline for="works-title" tag="h2" classes="rg-h2" text={portfolio.title} />
        <Twin for="works-lead" kind="text">
          <Code
            className="rg-code--lead"
            src={`<p className="text-fm-lead">${portfolio.lead}</p>`}
          />
        </Twin>
        <Inspect
          for="works-link"
          name="a.Button"
          className="rounded-full"
          src={`href="${portfolio.link.href}"`}
        />
        <div className="rg-works-note fm-container">
          <Code src={`<Slider works={works.filter((work) => work.group !== "wideo")} />`} />
        </div>
      </Face>
    </section>
  )
}
