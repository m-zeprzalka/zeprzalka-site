/**
 * Źródło treści nowej strony: teksty z `src/i18n` i dane z `src/lib` w jednym
 * miejscu, przeliczane raz na język (`cache`) — powłoka, strona i wyszukiwarka
 * korzystają z tych samych obiektów.
 */
import "server-only"
import { cache } from "react"
import type { Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getMainPage } from "@/i18n/content/main-page"
import { getPages } from "@/i18n/content/pages"
import { portfolioGroups, portfolioItems, type PortfolioItem } from "@/lib/portfolio"
import { getAllPosts } from "@/lib/posts"
import type { Media, Post, WorkGroup } from "../types"
import { postHref } from "../routes"

/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy buildzie). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

/** Okładki wpisów mają proporcje bliskie 16:9 — kadr rezerwuje miejsce bez mierzenia plików. */
const COVER = { width: 1600, height: 900 } as const

export function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`main-page: brak treści — ${what}`)
  return value
}

export const getSource = cache((locale: Locale) => {
  const about = getPages(locale).about
  const [freelance, teaching] = about.experience
  const [design, development] = homeSkills
  const aiGroup = about.skillGroups.find((group) => /^AI/.test(group.category))
  if (!freelance || !teaching || !design || !development || !aiGroup) {
    throw new Error("main-page: brak doświadczenia albo kompetencji w treści serwisu")
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
  // Wpis: `card` idzie do klienta, reszta pól służy tylko serwerowi (opis w wyszukiwarce,
  // wybór dowodów i okładek po kategorii albo tagu).
  const posts = getAllPosts(locale).map(({ slug, frontmatter }, index) => {
    const [year = "", month = "", day = ""] = frontmatter.date.split("-")
    const card: Post = {
      slug,
      title: frontmatter.title,
      href: postHref(locale, slug),
      year,
      day: `${day}.${month}`,
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
    copy: getMainPage(locale),
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
