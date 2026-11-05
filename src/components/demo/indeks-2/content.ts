/**
 * Model treści „Indeksu · II” — budowany na serwerze wyłącznie ze wspólnego
 * modułu piaskownicy (`shared/content.ts`). Komponenty klienckie dostają gotowe
 * dane przez propsy; nowe są tylko etykiety z `ui-strings.ts`.
 *
 * Karty (to, co wychodzi na margines albo u dołu ekranu) mają jeden kształt:
 * nagłówek, chipy narzędzi i jeden dedykowany film kategorii albo plakat.
 */
import "server-only"
import { typo } from "@/components/demo/forma/typo"
import { getDemoHomeContent, type DemoPost, type DemoWork } from "@/components/demo/shared/content"
import { SECTION } from "./anchors"
import type {
  Card,
  Fact,
  Frame,
  IconName,
  PaletteGroup,
  PostRow,
  SectionLink,
  Segment,
  Skill,
  Work,
  WorkFilter,
} from "./types"
import { UI } from "./ui-strings"

/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy renderze na serwerze). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

/** Dedykowany film kategorii w kartach (najżywszy klip grupy, ~1 MB). */
const CATEGORY_FILM = { web: "ip", wideo: "cellove" } as const

/** Widok „Wybrane”: po trzy z każdej grupy, w kolejności serwisu. */
const SELECTED_PER_GROUP = 3

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Indeks · II: brak treści — ${what}`)
  return value
}

/** Zdania tekstu (kropka, wykrzyknik albo pytajnik przed spacją lub końcem). */
function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+(?=\s|$)/g)?.map((part) => part.trim()) ?? [text]
}

/** Pierwsza litera mała — lead sekcji staje się dalszym ciągiem nagłówka („Kompetencje — umiejętności…”). */
function continuation(text: string): string {
  return text.charAt(0).toLocaleLowerCase("pl-PL") + text.slice(1)
}

/** Słowa z listy stają się chipami; reszta zostaje tekstem (z polskim składem). */
function chipify(
  text: string,
  chips: readonly { word: string; card: string; icon?: IconName }[]
): Segment[] {
  const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`(${chips.map((chip) => escape(chip.word)).join("|")})`)
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => {
      const chip = chips.find((entry) => entry.word === part)
      return chip ? { text: part, card: chip.card, icon: chip.icon } : { text: typo(part) }
    })
}

const frameOf = (work: DemoWork): Frame => ({
  src: work.poster,
  width: work.width,
  height: work.height,
})

function postRow(post: DemoPost, index: number, now: number): PostRow {
  const [, month = "", day = ""] = post.date.split("-")
  return {
    slug: post.slug,
    title: post.title,
    href: post.href,
    year: post.year,
    day: `${day}.${month}`,
    iso: post.date,
    // Tylko najnowszy wpis — wyróżnienie przestaje działać, gdy jest go więcej.
    isNew: index === 0 && now - new Date(post.date).getTime() < NEW_FOR_MS,
  }
}

export function getIndeks2Content() {
  const c = getDemoHomeContent()
  const now = Date.now()
  const [lead, second] = c.about.bio
  const [freelance, teaching] = c.about.experience
  const [design, development, visual] = c.skills.items
  if (!lead || !second || !freelance || !teaching || !design || !development || !visual) {
    throw new Error("Indeks · II: brak biogramu, doświadczenia albo kompetencji")
  }

  const works = c.portfolio.works
  const posts = c.blog.posts
  const work = (slug: string) =>
    need(
      works.find((entry) => entry.slug === slug),
      `realizacja ${slug}`
    )
  const groupOf = (id: string) =>
    need(
      c.portfolio.groups.find((group) => group.id === id),
      `grupa ${id}`
    )
  const filmOf = (slug: string) => {
    const entry = work(slug)
    return { poster: frameOf(entry), video: entry.video }
  }
  const worksLink = { label: c.portfolio.title, href: `#${SECTION.works}` }

  /* — Karty: słowa w zdaniach, fakty, realizacje i wpisy — */
  const teachingSentences = sentences(teaching.description)
  const timeline = c.about.experience.map(({ period, role, company }) => ({
    period,
    role,
    company,
  }))
  const cards: Record<string, Card> = {
    experience: { heading: lead.strong, entries: timeline },
    web: {
      heading: groupOf("web").label,
      body: typo(groupOf("web").description),
      chips: development.tools,
      media: filmOf(CATEGORY_FILM.web),
      link: worksLink,
    },
    motion: {
      heading: groupOf("wideo").label,
      body: typo(groupOf("wideo").description),
      chips: visual.tools,
      media: filmOf(CATEGORY_FILM.wideo),
      link: worksLink,
    },
    systems: {
      heading: work("prfct").title,
      meta: work("prfct").category,
      body: work("prfct").description,
      chips: design.tools,
      media: filmOf("prfct"),
      link: work("prfct").url
        ? { label: UI.visit, href: need(work("prfct").url, "adres prfct"), external: true }
        : undefined,
    },
    ai: {
      heading: c.skills.ai.title,
      body: work("aifeed").description,
      chips: c.skills.ai.tools,
      media: filmOf("aifeed"),
      link: worksLink,
    },
    // Opis wykładów ma we wspólnej treści jedno zdanie (bez uczelni) — o nagrodzie mówi biogram.
    award: {
      heading: need(c.about.facts[3], "fakt: ankiety").label,
      body: typo(`${second.prefix}${second.strong}${second.suffix}`),
    },
    clients: {
      heading: freelance.company,
      meta: freelance.period,
      body: sentences(freelance.description).slice(0, 2).join(" "),
    },
    lectures: {
      heading: teaching.role,
      meta: teaching.period,
      body: teachingSentences.slice(0, 2).join(" "),
    },
  }
  for (const entry of works) {
    cards[`work:${entry.slug}`] = {
      heading: entry.title,
      meta: entry.category,
      body: entry.description ?? groupOf(entry.group).description,
      chips: [entry.groupLabel],
      media: { poster: frameOf(entry), video: entry.video },
      link: entry.url ? { label: UI.visit, href: entry.url, external: true } : undefined,
    }
  }
  for (const post of posts) {
    cards[`post:${post.slug}`] = {
      heading: post.title,
      meta: post.dateLabel,
      body: post.description,
      chips: post.categories,
      media: { poster: { src: post.image, width: 16, height: 9 } },
    }
  }

  /* — Start: tytuł + pierwsze zdanie biogramu z trzema chipami — */
  const [leadSentence = "", ...leadRest] = sentences(lead.suffix)
  const heroLead: Segment[] = [
    { text: typo(lead.prefix) },
    { text: lead.strong, card: "experience", icon: "history" },
    { text: " " },
    ...chipify(leadSentence, [
      { word: "webowych", card: "web", icon: "web" },
      { word: "multimedialnych", card: "motion", icon: "motion" },
    ]),
  ]

  /* — O mnie: dalszy ciąg biogramu, wypełniany przewijaniem — */
  const fillText = `${leadRest.join(" ")} ${second.prefix}${second.strong}${second.suffix}`
  const fill = chipify(fillText, [
    { word: "design systemów", card: "systems" },
    { word: "integracjach AI", card: "ai" },
    { word: "materiałów wideo", card: "motion" },
    { word: "Nagrodę Rektora", card: "award" },
  ])

  /* — Cztery liczby — */
  const factCards = ["experience", "clients", "lectures", "award"] as const
  const facts: Fact[] = c.about.facts.map((fact, index) => {
    const raw = fact.value
    const percent = typeof raw === "string" && /^\d+,\d+%$/.test(raw)
    return {
      id: `fact-${index}`,
      value: percent ? Number(raw.replace(",", ".").replace("%", "")) : Number(raw),
      suffix: "suffix" in fact ? fact.suffix : undefined,
      since: "since" in fact ? fact.since : undefined,
      percent,
      label: fact.label,
      card: factCards[index] ?? "experience",
    }
  })

  /* — Kompetencje: cztery segmenty z dowodami — */
  const [devSentence = "", aiSentence = ""] = sentences(development.description)
  const workProofs = (match: RegExp) =>
    works
      .filter((entry) => match.test(entry.category))
      .slice(0, 3)
      .map((entry) => ({
        label: entry.title,
        meta: entry.category,
        href: `#${SECTION.works}`,
        card: `work:${entry.slug}`,
      }))
  const postProofs = (list: readonly DemoPost[]) =>
    list.slice(0, 3).map((post) => ({
      label: post.title,
      meta: post.dateLabel,
      href: post.href,
      card: `post:${post.slug}`,
    }))
  const aiPosts = posts.filter((post) => post.categories.includes("AI"))
  const skills: Skill[] = [
    {
      id: "design",
      icon: "design",
      figure: 0,
      title: design.title,
      description: typo(design.description),
      tags: design.tools,
      proofs: workProofs(/UX\/UI/),
    },
    {
      id: "development",
      icon: "code",
      figure: 1,
      title: development.title,
      description: typo(devSentence),
      tags: development.tools,
      proofs: workProofs(/wdrożenie/),
    },
    {
      id: "ai",
      icon: "ai",
      figure: 3,
      title: c.skills.ai.title,
      description: typo(aiSentence),
      tags: c.skills.ai.tools,
      proofs: postProofs(aiPosts),
    },
    {
      id: "visual",
      icon: "visual",
      figure: 2,
      title: visual.title,
      description: typo(visual.description),
      tags: visual.tools,
      proofs: workProofs(/[Ww]ideo|social/),
    },
  ]

  /* — Realizacje: wszystkie, filtr kategorii, widok „Wybrane” — */
  const workList: Work[] = c.portfolio.groups.flatMap((group) =>
    works
      .filter((entry) => entry.group === group.id)
      .map((entry, index) => ({
        slug: entry.slug,
        title: entry.title,
        category: entry.category,
        group: entry.group,
        poster: frameOf(entry),
        video: entry.video,
        url: entry.url,
        selected: index < SELECTED_PER_GROUP,
      }))
  )
  // „Wybrane” przeplatają grupy (produkt, strona, film…) — pierwszy rząd nie jest trzema zrzutami UI.
  const selected = workList.filter((entry) => entry.selected)
  const groupIds = c.portfolio.groups.map((group) => group.id)
  const interleaved = Array.from({ length: SELECTED_PER_GROUP }, (_, round) =>
    groupIds.flatMap((id) => selected.filter((entry) => entry.group === id).slice(round, round + 1))
  ).flat()
  const filters: WorkFilter[] = [
    { id: "selected", label: UI.selected },
    ...c.portfolio.groups.map((group) => ({ id: group.id, label: group.label })),
  ]

  /* — Spis sekcji — */
  const sections: SectionLink[] = [
    { id: SECTION.start, label: UI.start },
    { id: SECTION.about, label: c.about.heading },
    { id: SECTION.skills, label: c.skills.title },
    { id: SECTION.works, label: c.portfolio.title },
    { id: SECTION.blog, label: c.blog.title },
    { id: SECTION.contact, label: c.contact.title },
  ]
  const sectionDetail: Record<string, string> = {
    [SECTION.start]: c.hero.title,
    [SECTION.about]: `${lead.prefix}${lead.strong} ${leadSentence}`,
    [SECTION.skills]: c.skills.lead,
    [SECTION.works]: c.portfolio.lead,
    [SECTION.blog]: c.blog.lead,
    [SECTION.contact]: c.contact.lead,
  }

  /* — Paleta ⌘K: sekcje, realizacje, wpisy, podstrony serwisu, akcje (bez liczników) — */
  const palette: PaletteGroup[] = [
    {
      id: "sections",
      heading: UI.sections,
      items: sections.map((section) => ({
        id: `s-${section.id}`,
        label: section.label,
        icon: "section",
        detail: sectionDetail[section.id],
        href: `#${section.id}`,
      })),
    },
    {
      id: "works",
      heading: c.portfolio.title,
      items: works.map((entry) => ({
        id: `w-${entry.slug}`,
        label: entry.title,
        hint: entry.category,
        icon: "work",
        thumb: entry.poster,
        detail: entry.description ?? groupOf(entry.group).description,
        href: `#${SECTION.works}`,
        card: `work:${entry.slug}`,
        keywords: entry.groupLabel,
      })),
    },
    {
      id: "posts",
      heading: c.blog.title,
      items: posts.map((post) => ({
        id: `p-${post.slug}`,
        label: post.title,
        hint: post.dateLabel,
        icon: "post",
        thumb: post.image,
        detail: post.description,
        href: post.href,
        keywords: [...post.categories, ...post.tags].join(" "),
      })),
    },
    {
      id: "pages",
      heading: UI.pages,
      items: c.nav.map((item) => ({
        id: `r-${item.key}`,
        label: item.label,
        hint: item.href,
        icon: "page",
        href: item.href,
      })),
    },
    {
      id: "actions",
      heading: UI.actions,
      items: [
        {
          id: "a-mail",
          label: UI.copyEmail,
          hint: c.person.email,
          icon: "copy",
          action: "copy-email",
        },
        { id: "a-theme", label: UI.toggleTheme, icon: "theme", action: "toggle-theme" },
        { id: "a-contact", label: c.hero.cta, icon: "mail", href: `#${SECTION.contact}` },
        ...c.person.socials.map((profile) => ({
          id: `a-${profile.label.toLowerCase()}`,
          label: profile.label,
          hint: new URL(profile.url).hostname.replace(/^www\./, ""),
          icon: "external" as const,
          href: profile.url,
        })),
      ],
    },
  ]

  const surname = c.person.name.split(" ").at(-1) ?? c.person.name

  return {
    person: {
      name: c.person.name,
      surname,
      domain: c.person.domain,
      email: c.person.email,
      locality: c.person.locality,
      socials: c.person.socials,
    },
    nav: c.nav,
    ui: c.ui,
    hero: { status: c.hero.status, title: typo(c.hero.title), lead: heroLead, cta: c.hero.cta },
    about: { heading: c.about.heading, fill, facts },
    skills: { title: c.skills.title, lead: continuation(c.skills.lead), items: skills },
    portfolio: {
      title: c.portfolio.title,
      lead: continuation(c.portfolio.lead),
      works: workList,
      selected: interleaved.map((entry) => entry.slug),
      filters,
      link: c.portfolio.link,
    },
    blog: {
      title: c.blog.title,
      lead: continuation(c.blog.lead),
      posts: posts.map((post, index) => postRow(post, index, now)),
      link: c.blog.link,
    },
    contact: { ...c.contact, lead: continuation(c.contact.lead) },
    footer: c.footer,
    sections,
    palette,
    cards,
  }
}

export type Indeks2Content = ReturnType<typeof getIndeks2Content>
