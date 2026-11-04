import { Button } from "@/components/demo/forma/Button"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { cn } from "@/components/demo/forma/cn"
import { SectionHead } from "./SectionHead"
import { UI } from "./ui-strings"
import { WorkTile } from "./WorkTile"

/** Na stronie głównej z każdej grupy cztery pierwsze prace — reszta pod „Zobacz wszystkie”. */
const PER_GROUP = 4

/** Układ i rozmiary obrazów każdej grupy — formaty materiału są różne, więc i siatki. */
const LAYOUT = {
  produkty: {
    grid: "grid gap-x-6 gap-y-10 sm:grid-cols-2",
    sizes: "(min-width: 1280px) 588px, (min-width: 640px) 50vw, 100vw",
  },
  web: {
    grid: "columns-2 gap-x-4 sm:gap-x-6 [&>*]:mb-9 [&>*]:break-inside-avoid sm:[&>*]:mb-10",
    sizes: "(min-width: 1280px) 588px, 50vw",
  },
  wideo: {
    grid: "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4",
    sizes: "(min-width: 1280px) 282px, (min-width: 1024px) 25vw, 50vw",
  },
} as const

/**
 * Portfolio: po cztery prace z trzech grup (formaty są różne: zrzuty produktów,
 * klipy stron, pionowe wideo) i przejście do wszystkich. Każdy kafel czeka
 * zakodowany w glifach i przy pierwszym spojrzeniu odkodowuje się w kolor.
 */
export function Works({ portfolio }: { portfolio: DemoHomeContent["portfolio"] }) {
  const labels = {
    preview: UI.preview,
    close: UI.close,
    openSite: UI.openSite,
    portfolio: portfolio.link,
  }

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="gl-section">
      <div className="fm-container">
        <SectionHead id="portfolio" title={portfolio.title} lead={portfolio.lead} />
        {portfolio.groups.map((group) => {
          const works = portfolio.works
            .filter((work) => work.group === group.id)
            .slice(0, PER_GROUP)
          const layout = LAYOUT[group.id]
          return (
            <div key={group.id} className="mt-16 sm:mt-24">
              <div className="mb-7 grid gap-1.5 sm:mb-9 lg:grid-cols-12 lg:gap-8">
                <h3 className="text-fm-h3 font-medium lg:col-span-6">{group.label}</h3>
                <p className="max-w-[30rem] text-fm-small text-pretty text-fm-ink-3 lg:col-span-6">
                  {group.description}
                </p>
              </div>
              <div className={cn(layout.grid)}>
                {works.map((work) => (
                  <WorkTile
                    key={work.slug}
                    work={work}
                    description={work.description ?? group.description}
                    sizes={layout.sizes}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )
        })}
        <div className="mt-14 sm:mt-16">
          <Button asChild variant="secondary" size="lg">
            <a href={portfolio.link.href}>
              {UI.seeAll} {portfolio.count}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
