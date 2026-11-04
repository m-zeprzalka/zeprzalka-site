/**
 * Model treści „Tryptyku” — budowany na serwerze ze wspólnego modułu dem
 * (`shared/content.ts`, czyli z treści serwisu). Komponenty klienckie dostają
 * gotowe napisy przez propsy; nowe są tylko etykiety z `ui-strings.ts`.
 */
import { getCommon } from "@/i18n/content/common"
import { getPages } from "@/i18n/content/pages"
import { plural } from "@/i18n/format"
import { getDemoHomeContent, type DemoWork } from "@/components/demo/shared/content"
import { typo } from "@/components/demo/forma/typo"
import { GLYPH, workAnchor, type SectionId } from "./anchors"
import type {
  Competency,
  Fact,
  FactDetail,
  IconName,
  NavItem,
  PaletteGroup,
  Post,
  Work,
} from "./types"
import { UI } from "./ui-strings"

/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy renderze na serwerze). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Tryptyk: brak treści — ${what}`)
  return value
}

/** Pierwsze zdanie (biogram skleja się z poprzednim fragmentem, więc wiodąca spacja zostaje). */
function firstSentence(text: string): string {
  return need(text.match(/^\s*.+?[.!?](?=\s|$)/)?.[0], "zdanie w opisie")
}

export type ChipId = "experience" | "web" | "motion"
export type LeadSegment = { text: string } | { chip: ChipId; text: string }

/** Zdanie podzielone na tekst i chipy: wskazane słowa stają się chipami. */
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

export function getTryptykContent() {
  const base = getDemoHomeContent()
  const common = getCommon("pl")
  const { person, hero, about, skills, portfolio, blog, contact } = base
  const now = Date.now()
  const projects = (count: number) => plural(count, "pl", common.plurals.projects)

  /* — Realizacje: opis do panelu to zdanie produktu albo opis grupy — */
  const groupDescription = (id: DemoWork["group"]) =>
    need(
      portfolio.groups.find((group) => group.id === id),
      `grupa ${id}`
    ).description
  const works: Work[] = portfolio.works.map((work, index) => ({
    slug: work.slug,
    title: work.title,
    category: work.category,
    group: work.group,
    groupLabel: work.groupLabel,
    caption: typo(work.description ?? groupDescription(work.group)),
    video: work.video,
    poster: work.poster,
    width: work.width,
    height: work.height,
    url: work.url,
    index: index + 1,
    featured: work.featured,
  }))
  const inGroup = (id: DemoWork["group"]) => works.filter((work) => work.group === id)

  const posts: Post[] = blog.posts.map((post, index) => {
    const [, month = "", day = ""] = post.date.split("-")
    return {
      slug: post.slug,
      title: post.title,
      description: typo(post.description),
      href: post.href,
      date: post.date,
      dateLabel: post.dateLabel,
      day: `${day}.${month}`,
      year: post.year,
      image: post.image,
      readingTime: post.readingTime,
      // Tylko najnowszy wpis — wyróżnienie przestaje działać, gdy jest go więcej.
      isNew: index === 0 && now - new Date(post.date).getTime() < NEW_FOR_MS,
    }
  })

  /* — Wstęp: tytuł + pierwsze zdanie biogramu, z chipami w trzech miejscach — */
  const [bio] = about.bio
  const [design, development, visual] = skills.items
  if (!bio || !design || !development || !visual) throw new Error("Tryptyk: brak biogramu")
  const lead: LeadSegment[] = [
    { text: typo(bio.prefix) },
    { chip: "experience", text: bio.strong },
    ...chipify(` ${firstSentence(bio.suffix).trim()}`, {
      web: "webowych",
      motion: "multimedialnych",
    }),
  ]
  const groupLabel = (id: DemoWork["group"]) =>
    need(
      portfolio.groups.find((group) => group.id === id),
      id
    ).label
  const details: Record<ChipId, FactDetail> = {
    experience: {
      kind: "timeline",
      heading: getPages("pl").about.experienceHeading,
      lead: firstSentence(need(about.experience[0], "doświadczenie").description).trim(),
      entries: about.experience.map(({ period, role, company }) => ({ period, role, company })),
    },
    web: {
      kind: "tools",
      heading: development.title,
      tools: development.tools,
      link: {
        label: groupLabel("web"),
        meta: projects(inGroup("web").length),
        href: `#${workAnchor(need(inGroup("web")[0], "web").slug)}`,
      },
    },
    motion: {
      kind: "tools",
      heading: visual.title,
      tools: visual.tools,
      link: {
        label: groupLabel("wideo"),
        meta: projects(inGroup("wideo").length),
        href: `#${workAnchor(need(inGroup("wideo")[0], "wideo").slug)}`,
      },
    },
  }

  /* — Fakty: liczby z „O mnie” (moduł wspólny już je wyciągnął) — */
  const facts: Fact[] = about.facts.map((fact) => {
    if (typeof fact.value === "number") {
      return { kind: "count", value: fact.value, suffix: fact.suffix, label: fact.label }
    }
    const range = fact.value.match(/^(\d{4})\D+(\d{4})$/)
    if (range)
      return { kind: "range", from: Number(range[1]), to: Number(range[2]), label: fact.label }
    const percent = need(fact.value.match(/^(\d+),(\d+)%$/), `fakt ${fact.value}`)
    return {
      kind: "percent",
      value: Number(`${percent[1]}.${percent[2]}`) / 100,
      // Pełny podpis z modułu jest za długi na kolumnę faktu.
      label: UI.rectorAward,
    }
  })

  /* — Kompetencje: trzy z obecnej strony, każda z dowodami z portfolio — */
  const proofs = (id: DemoWork["group"], match?: RegExp) => {
    const list = inGroup(id).filter((work) => !match || match.test(work.category))
    return { label: groupLabel(id), meta: projects(list.length), slugs: list.map((w) => w.slug) }
  }
  const ICON: Record<string, IconName> = {
    "item-1": "design",
    "item-2": "code",
    "item-3": "motion",
  }
  const competencies: Competency[] = skills.items.map((skill, index) => ({
    id: skill.id,
    icon: ICON[skill.id] ?? "design",
    title: skill.title,
    description: typo(skill.description),
    tools: skill.tools,
    proofs:
      [proofs("produkty"), proofs("web", /wdrożenie/), proofs("wideo")][index] ?? proofs("web"),
  }))

  /* — Spis sekcji (szyna, menu, paleta) — */
  const nav: NavItem[] = [
    { id: "start", label: common.nav.home },
    { id: "kompetencje", label: skills.title },
    { id: "realizacje", label: portfolio.title, count: works.length },
    { id: "blog", label: blog.title, count: posts.length },
    { id: "kontakt", label: contact.title },
  ]
  const sectionLabel = Object.fromEntries(nav.map((item) => [item.id, item.label])) as Record<
    SectionId,
    string
  >

  /* — Paleta ⌘K: sekcje, akcje, podstrony, realizacje, wpisy, profile — */
  const palette: PaletteGroup[] = [
    {
      id: "nav",
      heading: UI.sections,
      items: [
        ...nav.map((item) => ({
          id: `s-${item.id}`,
          label: item.label,
          icon: "section" as const,
          glyph: GLYPH[item.id],
          href: `#${item.id}`,
        })),
        ...base.nav
          .filter((item) => item.key !== "contact")
          .map((item) => ({
            id: `r-${item.key}`,
            label: item.label,
            hint: item.href,
            icon: "page" as const,
            href: item.href,
          })),
      ],
    },
    {
      id: "actions",
      heading: UI.actions,
      items: [
        {
          id: "a-mail",
          label: UI.copyEmail,
          hint: person.email,
          icon: "mail",
          action: "copy-email",
        },
        { id: "a-theme", label: UI.toggleTheme, icon: "theme", action: "toggle-theme" },
      ],
    },
    {
      id: "works",
      heading: portfolio.title,
      items: works.map((work) => ({
        id: `w-${work.slug}`,
        label: work.title,
        hint: work.category,
        icon: "web",
        thumb: work.poster,
        href: `#${workAnchor(work.slug)}`,
        keywords: work.groupLabel,
      })),
    },
    {
      id: "posts",
      heading: blog.title,
      items: blog.posts.map((post) => ({
        id: `p-${post.slug}`,
        label: post.title,
        hint: post.dateLabel,
        icon: "post",
        href: post.href,
        keywords: [...post.categories, ...post.tags].join(" "),
      })),
    },
    {
      id: "profiles",
      heading: base.footer.socialLabel,
      items: person.socials.map((profile) => ({
        id: `c-${profile.label.toLowerCase()}`,
        label: profile.label,
        hint: new URL(profile.url).hostname.replace(/^www\./, ""),
        icon: "external" as const,
        href: profile.url,
      })),
    },
  ]

  return {
    person: {
      name: person.name,
      role: person.role,
      email: person.email,
      locality: person.locality,
      avatar: person.avatar,
      socials: person.socials,
    },
    status: hero.status,
    nav,
    sectionLabel,
    ui: base.ui,
    intro: { title: hero.title, lead, details, cta: hero.cta },
    reel: hero.video,
    experience: {
      heading: getPages("pl").about.experienceHeading,
      entries: about.experience.map(({ period, role }) => ({ period, role })),
    },
    facts,
    sections: {
      skills: { title: skills.title, lead: skills.lead },
      works: { title: portfolio.title, lead: typo(portfolio.lead), meta: portfolio.count },
      blog: { title: blog.title, lead: blog.lead, meta: blog.count },
      contact: { title: contact.title, lead: contact.lead },
    },
    competencies,
    works,
    worksLink: portfolio.link,
    posts,
    blogLink: blog.link,
    contact: {
      email: person.email,
      response: contact.response,
      cardTitle: contact.cardTitle,
      form: contact.form,
      errors: contact.errors,
      privacyHref: contact.privacyHref,
    },
    footer: { copyright: base.footer.copyright, tagline: base.footer.tagline },
    palette,
  }
}

export type TryptykContent = ReturnType<typeof getTryptykContent>
