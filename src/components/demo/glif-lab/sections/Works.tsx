import { Button } from "@/components/demo/forma/Button"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { UI } from "../ui-strings"
import { SectionHead } from "./SectionHead"
import { WorkTile } from "./WorkTile"

/**
 * Wybór na stronę główną: wszystkie produkty i lżejsze klipy stron i wideo
 * (najcięższe pliki zostają w portfolio — budżet mediów na telefonie).
 */
const PICK = [
  // Kolejność ułożona tak, by kolumny masonry (2 i 3) wychodziły równej wysokości.
  "aifeed",
  "prfct",
  "orlen-paczka",
  "cellove",
  "white-paintings-black-paintings",
  "brandmaker",
  "ip",
  "berbecki-min",
  "fizjorank",
  "innowator-mazowsza",
  "vinci-facilities",
  "banana-socks",
] as const

/**
 * Realizacje (D): masonry (2 kolumny na telefonie, 3 na desktopie), każdy
 * kafel zakodowany w glifach, odkodowany w kolor według wariantu D.
 */
export function Works({ portfolio }: { portfolio: DemoHomeContent["portfolio"] }) {
  const labels = {
    preview: UI.preview,
    close: UI.close,
    openSite: UI.openSite,
    portfolio: portfolio.link,
  }
  const works = PICK.map((slug) => portfolio.works.find((work) => work.slug === slug)).filter(
    (work) => work !== undefined
  )
  const description = (id: string) =>
    portfolio.groups.find((group) => group.id === id)?.description ?? ""

  return (
    <section
      id="portfolio"
      data-gll-section="works"
      aria-labelledby="portfolio-title"
      className="gll-section"
    >
      <div className="fm-container">
        <SectionHead id="portfolio" section="works" title={portfolio.title} lead={portfolio.lead} />
        <div className="mt-12 columns-2 gap-x-3 sm:mt-16 sm:gap-x-6 lg:columns-3 [&>*]:mb-8 [&>*]:break-inside-avoid sm:[&>*]:mb-10">
          {works.map((work, index) => (
            <WorkTile
              key={work.slug}
              work={work}
              index={index}
              description={work.description ?? description(work.group)}
              sizes="(min-width: 1280px) 416px, (min-width: 1024px) 33vw, 50vw"
              labels={labels}
            />
          ))}
        </div>
        <div className="mt-6 sm:mt-8">
          <Button asChild variant="secondary" size="lg">
            <a href={portfolio.link.href}>
              {UI.seeAll}
              <span className="text-fm-ink-3 tabular-nums">{portfolio.count}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
