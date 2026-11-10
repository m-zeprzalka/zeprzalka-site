/**
 * Źródło treści widoku: teksty z `src/i18n` i dane z `src/lib` w jednym
 * miejscu, przeliczane raz na język (`cache`) — powłoka, strona i wyszukiwarka
 * korzystają z tych samych obiektów.
 */
import "server-only"
import { cache } from "react"
import { INTL_LOCALE, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getUi } from "@/i18n/content/ui"
import { getPages } from "@/i18n/content/pages"
import { portfolioGroups, portfolioItems, type PortfolioItem } from "@/lib/portfolio"
import { getAllPosts } from "@/lib/posts"
import type { Media, Post, WorkGroup } from "../types"
import { COVER } from "../media"
import { postHref } from "../routes"

/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy buildzie). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

export function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Treść: brak — ${what}`)
  return value
}

export const getSource = cache((locale: Locale) => {
  const about = getPages(locale).about
  const [freelance, teaching] = about.experience
  const [design, development] = homeSkills
  const aiGroup = about.skillGroups.find((group) => /^AI/.test(group.category))
  if (!freelance || !teaching || !design || !development || !aiGroup) {
    throw new Error("Treść: brak doświadczenia albo kompetencji")
  }

  const media = (item: PortfolioItem): Media => ({
    src: item.poster,
    alt: item.title[locale],
    width: item.posterSize[0],
    height: item.posterSize[1],
    video: item.video,
  })
  const work = (slug: string) =>
    need(
      portfolioItems.find((item) => item.slug === slug),
      `realizacja ${slug}`
    )

  const groups: WorkGroup[] = portfolioGroups.map((group) => ({
    id: group.id,
    label: group.label[locale],
    works: portfolioItems
      .filter((item) => item.group === group.id)
      .map((item) => ({
        slug: item.slug,
        title: item.title[locale],
        category: item.category[locale],
        media: media(item),
        description: item.description?.[locale],
        url: item.url,
      })),
  }))

  const now = Date.now()
  // Dzień i miesiąc w zapisie języka („02.11”, „02/11”) — rok stoi w kolumnie listy.
  // Dzień i miesiąc na listach: „02.11” po polsku, „2 Nov” po angielsku (bez „02/11”).
  const dayMonth = new Intl.DateTimeFormat(
    INTL_LOCALE[locale],
    locale === "pl"
      ? { day: "2-digit", month: "2-digit", timeZone: "UTC" }
      : { day: "numeric", month: "short", timeZone: "UTC" }
  )
  // Wpis: `card` idzie do klienta, reszta pól służy tylko serwerowi (opis w wyszukiwarce,
  // wybór dowodów i okładek po kategorii albo tagu).
  const posts = getAllPosts(locale).map(({ slug, frontmatter }, index) => {
    const [year = ""] = frontmatter.date.split("-")
    const card: Post = {
      slug,
      title: frontmatter.title,
      href: postHref(locale, slug),
      year,
      day: dayMonth.format(new Date(frontmatter.date)),
      iso: frontmatter.date,
      cover: { src: frontmatter.image, alt: frontmatter.title, ...COVER },
      // Tylko najnowszy wpis — wyróżnienie przestaje znaczyć, gdy jest go więcej.
      isNew: index === 0 && now - new Date(frontmatter.date).getTime() < NEW_FOR_MS,
    }
    return {
      card,
      description: frontmatter.description,
      categories: frontmatter.categories,
      tags: frontmatter.tags,
    }
  })

  return {
    locale,
    common: getCommon(locale),
    home: getHome(locale),
    copy: getUi(locale),
    pages: getPages(locale),
    about,
    freelance,
    teaching,
    skills: { design, development, ai: aiGroup },
    groups,
    work,
    media,
    posts,
  }
})

export type Source = ReturnType<typeof getSource>
