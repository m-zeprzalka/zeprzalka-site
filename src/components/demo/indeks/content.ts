/**
 * Model treści koncepcji „Indeks” — budowany na serwerze wyłącznie z tego, co
 * serwis już ma (src/i18n/content, src/lib). Komponenty klienckie dostają
 * gotowe napisy przez propsy. Nowe są tylko etykiety z `ui-strings.ts`.
 *
 * Kilka podpisów wyciągamy z dłuższych zdań (np. „30 klientów” z opisu
 * doświadczenia) — wyrażenia regularne zamiast przepisywania tekstu, żeby
 * zmiana treści w jednym miejscu od razu była widoczna także tutaj.
 */
import { ROUTES, postPath } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getPages } from "@/i18n/content/pages"
import { fill, formatDate, plural } from "@/i18n/format"
import { portfolioGroups, portfolioItems, type PortfolioGroup } from "@/lib/portfolio"
import { getAllPosts, type Post } from "@/lib/posts"
import { CONTACT_EMAIL, SOCIAL_PROFILES } from "@/lib/site"
import { typo } from "@/components/demo/forma/typo"
import { SECTION, workAnchor } from "./anchors"
import type { Competency, FactDetail, PaletteGroup, PostRow, Proof, Work } from "./types"
import { UI } from "./ui-strings"

const LOCALE = "pl"

/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy renderze na serwerze). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Indeks: brak treści — ${what}`)
  return value
}

/** Pierwsze zdanie razem z wiodącą spacją (biogram skleja się z poprzednim fragmentem). */
function firstSentence(text: string): string {
  return need(text.match(/^\s*.+?[.!?](?=\s|$)/)?.[0], "zdanie w opisie")
}

/** Zdanie podzielone na tekst i chipy: słowa z listy stają się chipami. */
export type LeadSegment = { text: string } | { chip: ChipId; text: string }
export type ChipId = "experience" | "web" | "motion"

function chipify(text: string, chips: Partial<Record<ChipId, string>>): LeadSegment[] {
  const entries = Object.entries(chips) as [ChipId, string][]
  const pattern = new RegExp(`(${entries.map(([, word]) => word).join("|")})`)
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => {
      const chip = entries.find(([, word]) => word === part)
      return chip ? { chip: chip[0], text: part } : { text: typo(part) }
    })
}

function postRow(post: Post, index: number, now: number): PostRow {
  const iso = post.frontmatter.date
  const [year = "", month = "", day = ""] = iso.split("-")
  return {
    slug: post.slug,
    title: post.frontmatter.title,
    href: postPath(LOCALE, post.slug),
    year,
    day: `${day}.${month}`,
    iso,
    // Tylko najnowszy wpis — wyróżnienie przestaje działać, gdy jest go więcej.
    isNew: index === 0 && now - new Date(iso).getTime() < NEW_FOR_MS,
  }
}

export function getIndeksContent() {
  const common = getCommon(LOCALE)
  const home = getHome(LOCALE)
  const pages = getPages(LOCALE)
  const about = pages.about
  const posts = getAllPosts(LOCALE)
  const now = Date.now()

  const [design, development, visual] = homeSkills
  const [freelance, teaching] = about.experience
  const aiGroup = about.skillGroups.find((group) => group.category.startsWith("AI"))
  if (!design || !development || !visual || !freelance || !teaching || !aiGroup) {
    throw new Error("Indeks: brak kompetencji albo doświadczenia w src/i18n/content")
  }

  const groupOf = (id: PortfolioGroup) =>
    need(
      portfolioGroups.find((g) => g.id === id),
      id
    )
  const works: Work[] = portfolioItems.map((item) => ({
    slug: item.slug,
    title: item.title[LOCALE],
    category: item.category[LOCALE],
    group: item.group,
    groupLabel: groupOf(item.group).label[LOCALE],
    groupDescription: groupOf(item.group).description[LOCALE],
    video: item.video,
    poster: item.poster,
  }))
  const countIn = (group: PortfolioGroup) =>
    plural(works.filter((work) => work.group === group).length, LOCALE, common.plurals.projects)

  /* — Wstęp: tytuł + pierwsze zdanie biogramu, z chipami w trzech miejscach — */
  const leadSentence = firstSentence(about.bioLeadSuffix)
  const lead: LeadSegment[] = [
    { text: typo(about.bioLeadPrefix) },
    { chip: "experience", text: about.bioLeadStrong },
    ...chipify(leadSentence, { web: "webowych", motion: "multimedialnych" }),
  ]
  const details: Record<ChipId, FactDetail> = {
    experience: {
      kind: "timeline",
      heading: about.experienceHeading,
      lead: firstSentence(freelance.description),
      entries: about.experience.map(({ period, role, company }) => ({ period, role, company })),
    },
    web: {
      kind: "tools",
      heading: development.title[LOCALE],
      tools: development.tools[LOCALE],
      link: {
        label: groupOf("web").label[LOCALE],
        meta: countIn("web"),
        href: `#${SECTION.works}`,
      },
    },
    motion: {
      kind: "tools",
      heading: visual.title[LOCALE],
      tools: visual.tools[LOCALE],
      link: {
        label: groupOf("wideo").label[LOCALE],
        meta: countIn("wideo"),
        href: `#${SECTION.works}`,
      },
    },
  }

  /* — Fakty: liczby wyjęte z biogramu i doświadczenia — */
  const years = need(about.bioLeadStrong.match(/^(\d+)\s+(.+)$/), "lata doświadczenia")
  const clients = need(freelance.description.match(/(\d+)\s+(\p{L}+)/u), "liczba klientów")
  const period = need(teaching.period.match(/(\d{4})\D+(\d{4})/), "okres wykładów")
  const score = need(about.bioSecondSuffix.match(/(\d+),(\d+)%/), "wynik ankiet")
  const facts = {
    years: { value: Number(years[1]), label: need(years[2], "podpis lat") },
    clients: { value: Number(clients[1]), label: need(clients[2], "podpis klientów") },
    lectures: { from: Number(period[1]), to: Number(period[2]), label: teaching.role },
    score: { value: Number(`${score[1]}.${score[2]}`) / 100, label: UI.rectorAward },
  }

  /* — Kompetencje: cztery wiersze, każdy z dowodami z portfolio albo bloga — */
  const [devSentence = "", aiSentence = ""] = development.description[LOCALE].split(/(?<=\.)\s+/)
  const workProofs = (match: RegExp): Proof[] =>
    works
      .filter((work) => match.test(work.category))
      .slice(0, 3)
      .map((work) => ({
        label: work.title,
        meta: work.category,
        href: `#${workAnchor(work.slug)}`,
      }))
  const postProofs = (match: (post: Post) => boolean): Proof[] =>
    posts
      .filter(match)
      .slice(0, 3)
      .map((post) => ({
        label: post.frontmatter.title,
        meta: formatDate(post.frontmatter.date, LOCALE),
        href: postPath(LOCALE, post.slug),
      }))

  const competencies: Competency[] = [
    {
      id: "design",
      icon: "design",
      title: design.title[LOCALE],
      description: typo(design.description[LOCALE]),
      tags: design.tools[LOCALE],
      proofs: { heading: pages.portfolio.title, items: workProofs(/UX|UI/) },
    },
    {
      id: "development",
      icon: "code",
      title: development.title[LOCALE],
      description: typo(devSentence),
      tags: development.tools[LOCALE],
      proofs: { heading: pages.portfolio.title, items: workProofs(/Deploy/) },
    },
    {
      id: "ai",
      icon: "ai",
      title: aiGroup.category,
      description: typo(aiSentence),
      tags: aiGroup.items,
      proofs: {
        heading: home.blog.title,
        items: postProofs((post) => post.frontmatter.categories.includes("AI")),
      },
    },
    {
      id: "teaching",
      icon: "teaching",
      title: teaching.role,
      description: typo(teaching.description),
      tags: teaching.tags,
      proofs: {
        heading: home.blog.title,
        items: postProofs((post) => post.frontmatter.tags.includes("Kurs")),
      },
    },
  ]

  const postRows = posts.map((post, index) => postRow(post, index, now))

  /* — Paleta ⌘K: sekcje, podstrony serwisu, realizacje, wpisy, kontakt — */
  const palette: PaletteGroup[] = [
    {
      id: "nav",
      heading: common.footer.navigation,
      items: [
        { id: "s-start", label: common.nav.home, icon: "section", href: `#${SECTION.start}` },
        { id: "s-skills", label: home.skills.title, icon: "section", href: `#${SECTION.skills}` },
        { id: "s-works", label: home.portfolio.title, icon: "section", href: `#${SECTION.works}` },
        { id: "s-blog", label: home.blog.title, icon: "section", href: `#${SECTION.blog}` },
        {
          id: "s-contact",
          label: common.nav.contact,
          icon: "section",
          href: `#${SECTION.contact}`,
        },
        ...(["services", "about", "portfolio"] as const).map((key) => ({
          id: `r-${key}`,
          label: common.nav[key],
          hint: ROUTES[key][LOCALE],
          icon: "external" as const,
          href: ROUTES[key][LOCALE],
        })),
      ],
    },
    {
      id: "works",
      heading: pages.portfolio.title,
      items: works.map((work) => ({
        id: `w-${work.slug}`,
        label: work.title,
        hint: work.category,
        icon: "work",
        href: `#${workAnchor(work.slug)}`,
        keywords: work.groupLabel,
      })),
    },
    {
      id: "posts",
      heading: home.blog.title,
      items: posts.map((post) => ({
        id: `p-${post.slug}`,
        label: post.frontmatter.title,
        hint: formatDate(post.frontmatter.date, LOCALE),
        icon: "post",
        href: postPath(LOCALE, post.slug),
        keywords: [...post.frontmatter.categories, ...post.frontmatter.tags].join(" "),
      })),
    },
    {
      id: "contact",
      heading: home.contact.title,
      items: [
        { id: "c-mail", label: CONTACT_EMAIL, hint: UI.copy, icon: "mail", action: "copy-email" },
        ...SOCIAL_PROFILES.map((profile) => ({
          id: `c-${profile.label.toLowerCase()}`,
          label: profile.label,
          hint: new URL(profile.url).hostname.replace(/^www\./, ""),
          icon: "external" as const,
          href: profile.url,
        })),
      ],
    },
  ]

  return {
    header: { name: about.name, role: home.hero.subtitleRole, themeLabel: common.ui.themeToggle },
    skipLabel: common.ui.skipToContent,
    intro: {
      status: home.hero.status,
      title: home.hero.title,
      lead,
      details,
      cta: home.hero.cta,
      email: CONTACT_EMAIL,
    },
    facts,
    sections: {
      skills: { title: home.skills.title, lead: home.skills.lead },
      works: {
        title: home.portfolio.title,
        lead: home.portfolio.lead,
        meta: plural(works.length, LOCALE, common.plurals.projects),
      },
      blog: {
        title: home.blog.title,
        lead: home.blog.lead,
        meta: plural(posts.length, LOCALE, common.plurals.articles),
      },
      contact: { title: home.contact.title, lead: home.contact.lead },
    },
    sectionIndex: {
      label: common.footer.navigation,
      items: [
        { id: SECTION.start, label: common.nav.home },
        { id: SECTION.skills, label: home.skills.title },
        { id: SECTION.works, label: home.portfolio.title },
        { id: SECTION.blog, label: home.blog.title },
        { id: SECTION.contact, label: common.nav.contact },
      ],
    },
    competencies,
    works,
    worksLink: { label: pages.services.quotePortfolio, href: ROUTES.portfolio[LOCALE] },
    posts: postRows,
    blogLink: { label: home.blog.cta, href: ROUTES.blog[LOCALE] },
    contact: {
      email: CONTACT_EMAIL,
      response: { label: pages.contact.responseLabel, value: pages.contact.responseValue },
      form: common.form,
      errors: common.contactAction,
      privacyHref: ROUTES.privacy[LOCALE],
    },
    footer: {
      copyright: fill(common.footer.copyright, { year: new Date(now).getFullYear() }),
      locality: about.addressLocality,
      socials: SOCIAL_PROFILES,
    },
    palette,
  }
}

export type IndeksContent = ReturnType<typeof getIndeksContent>
