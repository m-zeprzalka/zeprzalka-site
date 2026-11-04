import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import type { DemoHomeContent } from "@/components/demo/shared/content"
import { SECTION } from "./ids"
import { Section } from "./Section"
import { WorkGallery, type WorkGroup } from "./WorkGallery"

/**
 * Portfolio: wszystkie realizacje w trzech zakładkach — najpierw własne
 * produkty (dziś strona główna pokazuje tylko 8 stron), potem strony
 * i aplikacje, potem wideo — w masonry z podpisami i podglądem. Szyna dostaje
 * link do pełnego portfolio (dziś `/portfolio` nie ma linku ze strony głównej — dług nr 7).
 */
export function Works({
  portfolio,
  ui,
}: {
  portfolio: DemoHomeContent["portfolio"]
  ui: DemoHomeContent["ui"]
}) {
  // Kolejność grup z danych serwisu: produkty cyfrowe, strony i aplikacje, wideo.
  const groups: WorkGroup[] = portfolio.groups.map((group) => ({
    ...group,
    works: portfolio.works.filter((work) => work.group === group.id),
  }))

  return (
    <Section
      id={SECTION.works}
      title={portfolio.title}
      lead={portfolio.lead}
      actions={
        <Button asChild variant="secondary" className="group">
          <a href={portfolio.link.href}>
            {portfolio.link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="text-fm-ink-3 transition-[translate,color] duration-200 ease-fm-snap group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-fm-ink"
            />
          </a>
        </Button>
      }
    >
      <WorkGallery
        groups={groups}
        labels={{
          link: portfolio.link,
          openSite: "Otwórz serwis",
          close: "Zamknij podgląd",
          previous: "Poprzednia realizacja",
          next: "Następna realizacja",
          play: "Odtwórz wideo",
          pause: "Wstrzymaj wideo",
          newTab: ui.newTab,
        }}
      />
    </Section>
  )
}
