/**
 * Model widoku strony głównej: treść z `src/i18n` i dane z `src/lib`, złożone
 * w kształty z `types.ts`. Moduł serwerowy — komponenty klienckie dostają
 * gotowe dane przez propsy.
 *
 * Powiązania kart podglądu z realizacjami są wpisane jawnie (slugi), żeby
 * łatwo było je zmienić bez szukania warunków w kodzie.
 */
import "server-only"
import { ROUTES, postPath, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getMainPage } from "@/i18n/content/main-page"
import { getPages } from "@/i18n/content/pages"
import { fill } from "@/i18n/format"
import { portfolioGroups, portfolioItems, type PortfolioItem } from "@/lib/portfolio"
import { getAllPosts } from "@/lib/posts"
import { CONTACT_EMAIL, SITE_DOMAIN, SOCIAL_PROFILES } from "@/lib/site"
import type {
  Fact,
  Link,
  Media,
  Peek,
  Post,
  SearchGroup,
  SectionLink,
  Segment,
  Skill,
  WorkGroup,
} from "./types"
import { SECTION, workAnchor } from "./anchors"
import { noOrphans, segment, sentences } from "./text"

/** Adres strony głównej w podglądzie; po przepięciu: `ROUTES.home[locale]`. */
const HOME_HREF = "/main-page"

/** Ile wpisów widać od razu; resztę odsłania „Pokaż wszystkie”. */
const POSTS_VISIBLE = 6
/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy buildzie). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

/** Które realizacje pokazuje karta podglądu danej frazy albo kompetencji. */
const PEEK_WORKS = {
  systems: ["prfct"],
  ai: ["aifeed", "brandmaker"],
  design: ["orlen-min", "orlen-paczka"],
  development: ["vinci-facilities", "spartanie-dzieciom", "ip"],
} as const

/** Profil X jest pierwszy (prośba właściciela); przy przepięciu trafi do `SOCIAL_PROFILES`. */
const PROFILES: readonly Link[] = [
  { label: "X", href: "https://x.com/zeprzalka_com", external: true },
  ...SOCIAL_PROFILES.map((profile) => ({
    label: profile.label,
    href: profile.url,
    external: true,
  })),
]

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`main-page: brak treści — ${what}`)
  return value
}

export function getHomeContent(locale: Locale) {
  const common = getCommon(locale)
  const home = getHome(locale)
  const about = getPages(locale).about
  const copy = getMainPage(locale)
  const [freelance, teaching] = about.experience
  const [design, development] = homeSkills
  const aiGroup = about.skillGroups.find((group) => /^AI/.test(group.category))
  if (!freelance || !teaching || !design || !development || !aiGroup) {
    throw new Error("main-page: brak doświadczenia albo kompetencji w treści serwisu")
  }

  /* — Realizacje — */
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
  const groupLabel = (id: string) =>
    need(
      portfolioGroups.find((group) => group.id === id),
      `grupa ${id}`
    ).label[locale]
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
  const allWorks = groups.flatMap((group) => group.works)

  /* — Wpisy — */
  const now = Date.now()
  const allPosts = getAllPosts(locale)
  const posts: Post[] = allPosts.map((post, index) => {
    const [year = "", month = "", day = ""] = post.frontmatter.date.split("-")
    return {
      slug: post.slug,
      title: post.frontmatter.title,
      href: postPath(locale, post.slug),
      year,
      day: `${day}.${month}`,
      iso: post.frontmatter.date,
      // Tylko najnowszy wpis — wyróżnienie przestaje znaczyć, gdy jest go więcej.
      isNew: index === 0 && now - new Date(post.frontmatter.date).getTime() < NEW_FOR_MS,
    }
  })
  const cover = (post: (typeof allPosts)[number]): Media => ({
    src: post.frontmatter.image,
    alt: post.frontmatter.title,
    width: 1600,
    height: 900,
  })
  const postsWhere = (match: (post: (typeof allPosts)[number]) => boolean) =>
    allPosts.filter(match).slice(0, 3)
  const aiPosts = postsWhere((post) => post.frontmatter.categories.includes("AI"))
  const coursePosts = postsWhere((post) => post.frontmatter.tags.includes("Kurs"))

  /* — Teksty biogramu: pierwsze zdanie w starcie, reszta w „O mnie” — */
  const [leadSentence = "", ...leadRest] = sentences(about.bioLeadSuffix)
  const teachingSince = need(teaching.period.match(/^\d{4}/)?.[0], "początek wykładów")
  // Wykłady trwają: okres bez daty końca i opis bez nazw uczelni (prośba właściciela, 5.11).
  const teachingPeriod = `${teachingSince}–${copy.ui.present}`
  const teachingSummary = sentences(teaching.description)[0] ?? ""
  const awardSentence = sentences(
    `${about.bioSecondPrefix}${about.bioSecondStrong}${about.bioSecondSuffix}`
  ).at(-1)

  /* — Karty podglądu — */
  const mosaic = (title: string, items: readonly Media[], link?: Link): Peek => ({
    title,
    media: items.slice(0, 3),
    link,
  })
  const groupMosaic = (id: string) =>
    mosaic(
      groupLabel(id),
      need(
        groups.find((group) => group.id === id),
        `grupa ${id}`
      ).works.map((entry) => entry.media),
      { label: copy.ui.allWorks, href: `#${SECTION.work}` }
    )
  const peeks: Record<string, Peek> = {
    experience: {
      title: about.bioLeadStrong,
      timeline: [
        { period: freelance.period, role: freelance.role, company: freelance.company },
        { period: teachingPeriod, role: teaching.role, company: teaching.company },
      ],
      media: [],
    },
    clients: {
      title: freelance.company,
      meta: freelance.period,
      body: sentences(freelance.description).slice(0, 2).join(" "),
      media: [],
    },
    lectures: { title: teaching.role, meta: teachingPeriod, body: teachingSummary, media: [] },
    award: { title: copy.about.facts.award.label, body: awardSentence, media: [] },
    web: groupMosaic("web"),
    motion: groupMosaic("wideo"),
    systems: {
      title: work("prfct").title[locale],
      meta: work("prfct").category[locale],
      body: work("prfct").description?.[locale],
      media: [media(work("prfct"))],
      link: {
        label: copy.ui.visitSite,
        href: need(work("prfct").url, "adres prfct"),
        external: true,
      },
    },
    ai: mosaic(
      aiGroup.category,
      PEEK_WORKS.ai.map((slug) => media(work(slug)))
    ),
    "skill-design": mosaic(
      design.title[locale],
      PEEK_WORKS.design.map((slug) => media(work(slug)))
    ),
    "skill-development": mosaic(
      development.title[locale],
      PEEK_WORKS.development.map((slug) => media(work(slug)))
    ),
    "skill-ai": mosaic(aiGroup.category, aiPosts.map(cover)),
    "skill-teaching": mosaic(teaching.role, coursePosts.map(cover)),
    ...Object.fromEntries(
      allWorks.map((entry) => [
        `work-${entry.slug}`,
        { title: entry.title, meta: entry.category, media: [entry.media] } satisfies Peek,
      ])
    ),
    ...Object.fromEntries(
      allPosts.map((post) => [
        `post-${post.slug}`,
        { title: post.frontmatter.title, media: [cover(post)] } satisfies Peek,
      ])
    ),
  }

  /* — Start — */
  const lead: Segment[] = segment(
    noOrphans(`${about.bioLeadPrefix}${about.bioLeadStrong} ${leadSentence}`),
    {
      experience: copy.hero.chips.experience,
      web: copy.hero.chips.web,
      motion: copy.hero.chips.motion,
    }
  )

  /* — O mnie — */
  const bio: Segment[] = segment(
    noOrphans(
      `${leadRest.join(" ")} ${about.bioSecondPrefix}${about.bioSecondStrong}${about.bioSecondSuffix}`
    ),
    {
      systems: copy.about.chips.systems,
      ai: copy.about.chips.ai,
      motion: copy.about.chips.motion,
      award: copy.about.chips.award,
    }
  )
  const facts: Fact[] = (["experience", "clients", "lectures", "award"] as const).map((id) => ({
    id,
    ...copy.about.facts[id],
    peek: id,
  }))

  /* — Kompetencje — */
  const workLinks = (slugs: readonly string[]): Link[] =>
    slugs.map((slug) => ({ label: work(slug).title[locale], href: `#${workAnchor(slug)}` }))
  const postLinks = (list: typeof allPosts): Link[] =>
    list.map((post) => ({ label: post.frontmatter.title, href: postPath(locale, post.slug) }))
  const [developmentSentence = "", aiSentence = ""] = sentences(development.description[locale])
  const skills: Skill[] = [
    {
      id: "design",
      title: design.title[locale],
      description: noOrphans(design.description[locale]),
      tags: design.tools[locale],
      peek: "skill-design",
      proofs: { heading: home.portfolio.title, items: workLinks(PEEK_WORKS.design) },
    },
    {
      id: "development",
      title: development.title[locale],
      description: noOrphans(developmentSentence),
      tags: development.tools[locale],
      peek: "skill-development",
      proofs: { heading: home.portfolio.title, items: workLinks(PEEK_WORKS.development) },
    },
    {
      id: "ai",
      title: aiGroup.category,
      description: noOrphans(aiSentence),
      tags: aiGroup.items,
      peek: "skill-ai",
      proofs: { heading: home.blog.title, items: postLinks(aiPosts) },
    },
    {
      id: "teaching",
      title: teaching.role,
      description: noOrphans(teachingSummary),
      tags: teaching.tags,
      peek: "skill-teaching",
      proofs: { heading: home.blog.title, items: postLinks(coursePosts) },
    },
  ]

  /* — Spis sekcji i wyszukiwarka — */
  const sections: SectionLink[] = [
    { id: SECTION.start, label: copy.ui.start },
    { id: SECTION.about, label: about.aboutHeading },
    { id: SECTION.skills, label: home.skills.title },
    { id: SECTION.work, label: home.portfolio.title },
    { id: SECTION.blog, label: home.blog.title },
    { id: SECTION.contact, label: home.contact.title },
  ]
  const sectionDetail: Record<string, string> = {
    [SECTION.start]: home.hero.title,
    [SECTION.about]: `${about.bioLeadPrefix}${about.bioLeadStrong} ${leadSentence}`,
    [SECTION.skills]: home.skills.lead,
    [SECTION.work]: home.portfolio.lead,
    [SECTION.blog]: home.blog.lead,
    [SECTION.contact]: home.contact.lead,
  }
  const nav = common.nav
  const search: SearchGroup[] = [
    {
      id: "sections",
      heading: copy.ui.searchGroups.sections,
      items: sections.map((section) => ({
        id: `section-${section.id}`,
        label: section.label,
        detail: sectionDetail[section.id],
        href: `#${section.id}`,
      })),
    },
    {
      id: "works",
      heading: copy.ui.searchGroups.works,
      items: groups.flatMap((group) =>
        group.works.map((entry) => ({
          id: `work-${entry.slug}`,
          label: entry.title,
          hint: entry.category,
          thumb: entry.media.src,
          detail: entry.description ?? group.label,
          href: `#${workAnchor(entry.slug)}`,
        }))
      ),
    },
    {
      id: "posts",
      heading: copy.ui.searchGroups.posts,
      items: allPosts.map((post) => ({
        id: `post-${post.slug}`,
        label: post.frontmatter.title,
        hint: post.frontmatter.date.split("-").reverse().slice(0, 2).join("."),
        thumb: post.frontmatter.image,
        detail: post.frontmatter.description,
        href: postPath(locale, post.slug),
      })),
    },
    {
      id: "pages",
      heading: copy.ui.searchGroups.pages,
      items: (["services", "portfolio", "blog", "about", "contact"] as const).map((key) => ({
        id: `page-${key}`,
        label: nav[key],
        hint: ROUTES[key][locale],
        href: ROUTES[key][locale],
      })),
    },
    {
      id: "actions",
      heading: copy.ui.searchGroups.actions,
      items: [
        { id: "action-email", label: copy.ui.copyEmail, hint: CONTACT_EMAIL, action: "copy-email" },
        { id: "action-theme", label: common.ui.themeToggle, action: "toggle-theme" },
      ],
    },
  ]

  return {
    ui: {
      ...copy.ui,
      themeToggle: common.ui.themeToggle,
      skipToContent: common.ui.skipToContent,
      copied: common.ui.copied,
      newTab: common.ui.newTab,
    },
    person: { domain: SITE_DOMAIN, email: CONTACT_EMAIL, homeHref: HOME_HREF },
    peeks,
    sections,
    search,
    hero: { status: home.hero.status, title: home.hero.title, lead, cta: home.hero.cta },
    about: { heading: about.aboutHeading, bio, facts },
    skills: { title: home.skills.title, lead: home.skills.lead, items: skills },
    work: {
      title: home.portfolio.title,
      lead: home.portfolio.lead,
      groups,
      all: { label: copy.ui.allWorks, href: ROUTES.portfolio[locale] },
    },
    blog: {
      title: home.blog.title,
      lead: home.blog.lead,
      posts,
      visible: POSTS_VISIBLE,
      all: { label: home.blog.cta, href: ROUTES.blog[locale] },
    },
    contact: {
      title: home.contact.title,
      lead: home.contact.lead,
      form: common.form,
      projectTypes: copy.contact.projectTypes,
      privacyHref: ROUTES.privacy[locale],
    },
    footer: {
      tagline: common.footer.tagline,
      description: common.footer.description,
      copyright: fill(common.footer.copyright, { year: String(new Date().getFullYear()) }),
      profilesHeading: common.footer.social,
      profiles: PROFILES,
      wordmark: "Zeprzałka",
      city: about.addressLocality,
    },
    language: {
      label: copy.ui.language,
      links: [
        { label: "PL", href: ROUTES.home.pl, current: locale === "pl" },
        { label: "EN", href: ROUTES.home.en, current: locale === "en" },
      ],
    },
  }
}

export type HomeContent = ReturnType<typeof getHomeContent>
