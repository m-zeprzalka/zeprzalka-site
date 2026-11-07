/** Treść strony głównej: sekcje, karty podglądu i spis sekcji. */
import "server-only"
import type { Locale } from "@/i18n/config"
import { CONTACT_EMAIL } from "@/lib/site"
import type { Fact, Link, Segment, Skill } from "../types"
import { workAnchor } from "../anchors"
import { noOrphans, segment, sentences } from "../text"
import { pageHref } from "../routes"
import { buildPeeks, lecturesOf, PEEK_WORKS } from "./peeks"
import { buildSections } from "./search"
import { getSource, type Source } from "./source"

/** Ile wpisów widać od razu; resztę odsłania „Pokaż wszystkie”. */
const POSTS_VISIBLE = 6

function buildSkills(source: Source): Skill[] {
  const { locale, home, skills, work, posts } = source
  const workLinks = (slugs: readonly string[]): Link[] =>
    slugs.map((slug) => ({ label: work(slug).title[locale], href: `#${workAnchor(slug)}` }))
  const postLinks = (match: (post: Source["posts"][number]) => boolean): Link[] =>
    posts
      .filter(match)
      .slice(0, 3)
      .map(({ card }) => ({ label: card.title, href: card.href }))
  const [developmentSentence = "", aiSentence = ""] = sentences(
    skills.development.description[locale]
  )

  return [
    {
      id: "design",
      title: skills.design.title[locale],
      description: noOrphans(skills.design.description[locale]),
      tags: skills.design.tools[locale],
      peek: "skill-design",
      proofs: { heading: home.portfolio.title, items: workLinks(PEEK_WORKS.design) },
    },
    {
      id: "development",
      title: skills.development.title[locale],
      description: noOrphans(developmentSentence),
      tags: skills.development.tools[locale],
      peek: "skill-development",
      proofs: { heading: home.portfolio.title, items: workLinks(PEEK_WORKS.development) },
    },
    {
      id: "ai",
      title: skills.ai.category,
      description: noOrphans(aiSentence),
      tags: skills.ai.items,
      peek: "skill-ai",
      proofs: {
        heading: home.blog.title,
        items: postLinks((post) => post.categories.includes("AI")),
      },
    },
    {
      id: "teaching",
      title: source.teaching.role,
      description: noOrphans(lecturesOf(source).summary),
      tags: source.teaching.tags,
      peek: "skill-teaching",
      proofs: {
        heading: home.blog.title,
        items: postLinks((post) => post.tags.includes("Kurs")),
      },
    },
  ]
}

export function getHomeContent(locale: Locale) {
  const source = getSource(locale)
  const { common, home, about, copy } = source
  const [leadSentence = "", ...leadRest] = sentences(about.bioLeadSuffix)

  /* Start: tytuł + pierwsze zdanie biogramu z trzema frazami-podglądami. */
  const lead: Segment[] = segment(
    noOrphans(`${about.bioLeadPrefix}${about.bioLeadStrong} ${leadSentence}`),
    copy.hero.chips
  )
  /* O mnie: dalszy ciąg biogramu, wypełniany przewijaniem. */
  const bio: Segment[] = segment(
    noOrphans(
      `${leadRest.join(" ")} ${about.bioSecondPrefix}${about.bioSecondStrong}${about.bioSecondSuffix}`
    ),
    copy.about.chips
  )
  const facts: Fact[] = (["experience", "clients", "lectures", "award"] as const).map((id) => ({
    id,
    ...copy.about.facts[id],
    peek: id,
  }))

  return {
    email: CONTACT_EMAIL,
    ui: {
      copyEmail: copy.ui.copyEmail,
      copied: common.ui.copied,
      newTab: common.ui.newTab,
      onPage: copy.ui.onPage,
      playVideo: copy.ui.playVideo,
      pauseVideo: copy.ui.pauseVideo,
    },
    peeks: buildPeeks(source),
    sections: buildSections(source),
    hero: { status: home.hero.status, title: home.hero.title, lead, cta: home.hero.cta },
    about: { heading: about.aboutHeading, bio, facts },
    skills: { title: home.skills.title, lead: home.skills.lead, items: buildSkills(source) },
    work: {
      title: home.portfolio.title,
      lead: home.portfolio.lead,
      groups: source.groups,
      all: { label: copy.ui.allWorks, href: pageHref("portfolio", locale) },
      labels: {
        visitSite: copy.ui.visitSite,
        inPortfolio: copy.ui.inPortfolio,
        newTab: common.ui.newTab,
        portfolioHref: pageHref("portfolio", locale),
      },
    },
    blog: {
      title: home.blog.title,
      lead: home.blog.lead,
      posts: source.posts.map((post) => post.card),
      visible: POSTS_VISIBLE,
      all: { label: home.blog.cta, href: pageHref("blog", locale) },
      labels: { newPost: copy.ui.newPost, showAll: copy.ui.showAll, showLess: copy.ui.showLess },
    },
    contact: {
      title: home.contact.title,
      lead: home.contact.lead,
      labels: {
        copyEmail: copy.ui.copyEmail,
        copied: common.ui.copied,
        responseTimeLabel: copy.ui.responseTimeLabel,
        responseTime: copy.ui.responseTime,
      },
      form: {
        locale,
        copy: common.form,
        projectTypes: copy.contact.projectTypes,
        privacyHref: pageHref("privacy", locale),
      },
    },
  }
}

export type HomeContent = ReturnType<typeof getHomeContent>
