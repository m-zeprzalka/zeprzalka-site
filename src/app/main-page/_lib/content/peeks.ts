/**
 * Karty podglądu: co pokazuje fraza w tekście, liczba, kompetencja, realizacja
 * i wpis. Powiązania z realizacjami są wpisane jawnie (`PEEK_WORKS`), żeby
 * łatwo je zmienić bez szukania warunków w kodzie.
 */
import "server-only"
import type { Link, Media, Peek } from "../types"
import { SECTION } from "../anchors"
import { sentences } from "../text"
import { need, type Source } from "./source"

/**
 * Realizacje w kartach. Frazy „webowych” i „multimedialnych” pokazują jeden film
 * (do podmiany na dedykowane klipy), kompetencje — kilka kadrów z portfolio.
 */
export const PEEK_WORKS = {
  web: "orlen-min",
  motion: "white-paintings-black-paintings",
  systems: "prfct",
  ai: ["aifeed", "brandmaker"],
  design: ["orlen-min", "orlen-paczka"],
  development: ["vinci-facilities", "spartanie-dzieciom", "ip"],
} as const

/** Okres wykładów: trwają, więc bez daty końca, a opis bez nazw uczelni (prośba właściciela, 5.11). */
export function lecturesOf(source: Source) {
  const since = need(source.teaching.period.match(/^\d{4}/)?.[0], "początek wykładów")
  return {
    period: `${since}–${source.copy.ui.present}`,
    summary: sentences(source.teaching.description)[0] ?? "",
  }
}

export function buildPeeks(source: Source): Record<string, Peek> {
  const { about, copy, freelance, skills, work, media, posts, groups } = source
  const lectures = lecturesOf(source)
  const workPeek = (slug: string, link?: Link): Peek => {
    const item = work(slug)
    return {
      title: item.title[source.locale],
      meta: item.category[source.locale],
      body: item.description?.[source.locale],
      media: [media(item)],
      link,
    }
  }
  const mosaic = (title: string, items: readonly Media[]): Peek => ({
    title,
    media: items.slice(0, 3),
  })
  const covers = (match: (post: Source["posts"][number]) => boolean) =>
    posts
      .filter(match)
      .slice(0, 3)
      .map((post) => post.card.cover)
  const allWorks: Link = { label: copy.ui.allWorks, href: `#${SECTION.work}` }
  const prfct = work(PEEK_WORKS.systems)

  return {
    experience: {
      title: about.bioLeadStrong,
      timeline: [
        { period: freelance.period, role: freelance.role, company: freelance.company },
        { period: lectures.period, role: source.teaching.role, company: source.teaching.company },
      ],
      media: [],
    },
    clients: {
      title: freelance.company,
      meta: freelance.period,
      body: sentences(freelance.description).slice(0, 2).join(" "),
      media: [],
    },
    lectures: {
      title: source.teaching.role,
      meta: lectures.period,
      body: lectures.summary,
      media: [],
    },
    award: {
      title: copy.about.facts.award.label,
      body: sentences(`${about.bioSecondPrefix}${about.bioSecondStrong}${about.bioSecondSuffix}`).at(
        -1
      ),
      media: [],
    },
    web: workPeek(PEEK_WORKS.web, allWorks),
    motion: workPeek(PEEK_WORKS.motion, allWorks),
    systems: workPeek(PEEK_WORKS.systems, {
      label: copy.ui.visitSite,
      href: need(prfct.url, "adres prfct"),
      external: true,
    }),
    ai: mosaic(
      skills.ai.category,
      PEEK_WORKS.ai.map((slug) => media(work(slug)))
    ),
    "skill-design": mosaic(
      skills.design.title[source.locale],
      PEEK_WORKS.design.map((slug) => media(work(slug)))
    ),
    "skill-development": mosaic(
      skills.development.title[source.locale],
      PEEK_WORKS.development.map((slug) => media(work(slug)))
    ),
    "skill-ai": mosaic(
      skills.ai.category,
      covers((post) => post.categories.includes("AI"))
    ),
    "skill-teaching": mosaic(
      source.teaching.role,
      covers((post) => post.tags.includes("Kurs"))
    ),
    ...Object.fromEntries(
      groups.flatMap((group) =>
        group.works.map((entry) => [
          `work-${entry.slug}`,
          { title: entry.title, meta: entry.category, media: [entry.media] } satisfies Peek,
        ])
      )
    ),
    ...Object.fromEntries(
      posts.map(({ card }) => [`post-${card.slug}`, { title: card.title, media: [card.cover] } satisfies Peek])
    ),
  }
}
