/**
 * Model treści „Indeksu · nowego” — budowany na serwerze wyłącznie ze
 * wspólnego modułu piaskownicy (`shared/content.ts`). Komponenty klienckie
 * dostają gotowe dane przez propsy; nowe są tylko etykiety z `ui-strings.ts`.
 *
 * Kilka podpisów wycinamy z dłuższych zdań (pierwsze zdanie biogramu, ostatnie
 * zdanie opisu wykładów) — zmiana tekstu w serwisie od razu zmienia je tutaj.
 */
import "server-only"
import { typo } from "@/components/demo/forma/typo"
import { getDemoHomeContent, type DemoPost, type DemoWork } from "@/components/demo/shared/content"
import { SECTION, workAnchor } from "./anchors"
import type {
  Competency,
  Fact,
  Frame,
  IconName,
  PaletteGroup,
  Peek,
  PostRow,
  SectionLink,
  Segment,
  WorkGroup,
  WorkRow,
} from "./types"
import { UI } from "./ui-strings"

/** Wpis jest „nowy” przez 30 dni od publikacji (liczone przy renderze na serwerze). */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Indeks · I: brak treści — ${what}`)
  return value
}

/**
 * Lead nagłówka sekcji czytany jako dalszy ciąg tytułu („Kompetencje — umiejętności…”):
 * pierwsza litera mała, chyba że to skrót (drugi znak też wielki).
 */
function continued(text: string): string {
  const [first = "", second = ""] = text
  return second && second === second.toLocaleUpperCase("pl")
    ? text
    : first.toLocaleLowerCase("pl") + text.slice(1)
}

/** Zdania tekstu (kropka, wykrzyknik albo pytajnik przed spacją lub końcem). */
function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+(?=\s|$)/g)?.map((part) => part.trim()) ?? [text]
}

/** Słowa z listy stają się chipami; reszta zostaje tekstem (z polskim składem). */
function chipify(
  text: string,
  chips: readonly { word: string; peek: string; icon?: IconName }[]
): Segment[] {
  const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`(${chips.map((chip) => escape(chip.word)).join("|")})`)
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => {
      const chip = chips.find((entry) => entry.word === part)
      return chip ? { text: part, peek: chip.peek, icon: chip.icon } : { text: typo(part) }
    })
}

const frameOf = (work: DemoWork): Frame => ({
  src: work.poster,
  width: work.width,
  height: work.height,
  video: work.video,
})

/** Okładki wpisów są szerokie (16:9 i bliskie) — kadr stały, obraz `cover`. */
const coverOf = (post: DemoPost): Frame => ({ src: post.image, width: 16, height: 9 })

function postRow(post: DemoPost, index: number, now: number): PostRow {
  const [, month = "", day = ""] = post.date.split("-")
  return {
    slug: post.slug,
    title: post.title,
    href: post.href,
    year: post.year,
    day: `${day}.${month}`,
    iso: post.date,
    image: post.image,
    // Tylko najnowszy wpis — wyróżnienie przestaje działać, gdy jest go więcej.
    isNew: index === 0 && now - new Date(post.date).getTime() < NEW_FOR_MS,
  }
}

export function getIndeksOneContent() {
  const c = getDemoHomeContent()
  const now = Date.now()
  const [lead, second] = c.about.bio
  const [freelance, teaching] = c.about.experience
  const [design, development, visual] = c.skills.items
  if (!lead || !second || !freelance || !teaching || !design || !development || !visual) {
    throw new Error("Indeks · I: brak biogramu, doświadczenia albo kompetencji")
  }

  /* — Realizacje w grupach (kolejność grup z serwisu) — */
  const works = c.portfolio.works
  const byGroup = (id: string) => works.filter((work) => work.group === id)
  const groups: WorkGroup[] = c.portfolio.groups.map((group) => ({
    id: group.id,
    label: group.label,
    description: group.description,
    works: byGroup(group.id).map((work): WorkRow => ({
      slug: work.slug,
      title: work.title,
      category: work.category,
      poster: frameOf(work),
      video: work.video,
      url: work.url,
      description: work.description,
    })),
  }))
  const groupOf = (id: string) =>
    need(
      c.portfolio.groups.find((group) => group.id === id),
      id
    )
  const groupLink = (id: string) => ({ label: groupOf(id).label, href: `#${SECTION.works}` })
  const slugs = (list: readonly DemoWork[]) => list.map(frameOf)
  const work = (slug: string) =>
    need(
      works.find((entry) => entry.slug === slug),
      slug
    )

  /* — Wpisy — */
  const posts = c.blog.posts
  const postRows = posts.map((post, index) => postRow(post, index, now))
  const postsWhere = (match: (post: DemoPost) => boolean) => posts.filter(match).slice(0, 3)
  const aiPosts = postsWhere((post) => post.categories.includes("AI"))
  const coursePosts = postsWhere((post) => post.tags.includes("Kurs"))

  /* — Podglądy na marginesie (i w popoverach na dotyku) — */
  const timeline = {
    entries: c.about.experience.map(({ period, role, company }) => ({ period, role, company })),
  }
  const teachingSentences = sentences(teaching.description)
  const peeks: Record<string, Peek> = {
    experience: { kind: "info", heading: lead.strong, ...timeline },
    web: {
      kind: "mosaic",
      label: groupOf("web").label,
      items: slugs(byGroup("web").slice(0, 3)),
      link: groupLink("web"),
    },
    motion: {
      kind: "mosaic",
      label: groupOf("wideo").label,
      items: slugs(byGroup("wideo").slice(0, 3)),
      link: groupLink("wideo"),
    },
    systems: { kind: "work", slug: work("prfct").slug },
    ai: {
      kind: "mosaic",
      label: c.skills.ai.title,
      items: slugs(works.filter((entry) => /AI/.test(entry.category))),
      link: groupLink("produkty"),
    },
    award: {
      kind: "info",
      heading: need(c.about.facts[3], "fakt: ankiety").label,
      // Zdanie o nagrodzie z biogramu — opis wykładów nie wymienia już uczelni (prośba właściciela).
      body: sentences(`${second.prefix}${second.strong}${second.suffix}`).find((s) =>
        /Nagrod/.test(s)
      ),
    },
    clients: {
      kind: "info",
      heading: freelance.company,
      meta: freelance.period,
      body: sentences(freelance.description).slice(0, 2).join(" "),
    },
    lectures: {
      kind: "info",
      heading: teaching.role,
      meta: teaching.period,
      body: teachingSentences.slice(0, 2).join(" "),
    },
    "c-design": {
      kind: "mosaic",
      label: design.title,
      items: slugs(works.filter((w) => /UX\/UI/.test(w.category)).slice(0, 3)),
    },
    "c-dev": {
      kind: "mosaic",
      label: development.title,
      items: slugs(works.filter((w) => /wdrożenie/.test(w.category)).slice(0, 3)),
    },
    "c-ai": { kind: "mosaic", label: c.skills.ai.title, items: aiPosts.map(coverOf) },
    "c-teaching": { kind: "mosaic", label: teaching.role, items: coursePosts.map(coverOf) },
  }

  /* — Start: tytuł + pierwsze zdanie biogramu z trzema chipami — */
  const [leadSentence = "", ...leadRest] = sentences(lead.suffix)
  const heroLead: Segment[] = [
    { text: typo(lead.prefix) },
    { text: lead.strong, peek: "experience", icon: "history" },
    { text: " " },
    ...chipify(leadSentence, [
      { word: "webowych", peek: "web", icon: "web" },
      { word: "multimedialnych", peek: "motion", icon: "motion" },
    ]),
  ]

  /* — O mnie: dalszy ciąg biogramu, wypełniany przewijaniem — */
  const fillText = `${leadRest.join(" ")} ${second.prefix}${second.strong}${second.suffix}`
  const fill = chipify(fillText, [
    { word: "design systemów", peek: "systems" },
    { word: "integracjach AI", peek: "ai" },
    { word: "materiałów wideo", peek: "motion" },
    { word: "Nagrodę Rektora", peek: "award" },
  ])

  /* — Fakty — */
  const factPeeks = ["experience", "clients", "lectures", "award"] as const
  const facts: Fact[] = c.about.facts.map((fact, index) => ({
    id: `fact-${index}`,
    // Liczby piszemy tak, jak stoją w tekście (15+, 30+, od 2016, 99,28%) — dekodują się znak po znaku.
    value: `${"since" in fact ? UI.since : ""}${fact.value}${"suffix" in fact ? fact.suffix : ""}`,
    label: fact.label,
    peek: factPeeks[index] ?? "experience",
  }))

  /* — Kompetencje: cztery wiersze, każdy z dowodami z portfolio albo bloga — */
  const [devSentence = "", aiSentence = ""] = sentences(development.description)
  const workProofs = (match: RegExp) =>
    works
      .filter((entry) => match.test(entry.category))
      .slice(0, 3)
      .map((entry) => ({
        label: entry.title,
        meta: entry.category,
        href: `#${workAnchor(entry.slug)}`,
      }))
  const postProofs = (list: readonly DemoPost[]) =>
    list.map((post) => ({ label: post.title, meta: post.dateLabel, href: post.href }))
  const competencies: Competency[] = [
    {
      id: "design",
      icon: "design",
      title: design.title,
      description: typo(design.description),
      tags: design.tools,
      peek: "c-design",
      proofs: { heading: c.portfolio.title, items: workProofs(/UX\/UI/) },
    },
    {
      id: "development",
      icon: "code",
      title: development.title,
      description: typo(devSentence),
      tags: development.tools,
      peek: "c-dev",
      proofs: { heading: c.portfolio.title, items: workProofs(/wdrożenie/) },
    },
    {
      id: "ai",
      icon: "ai",
      title: c.skills.ai.title,
      description: typo(aiSentence),
      tags: c.skills.ai.tools,
      peek: "c-ai",
      proofs: { heading: c.blog.title, items: postProofs(aiPosts) },
    },
    {
      id: "teaching",
      icon: "teaching",
      title: teaching.role,
      description: typo(teaching.description),
      tags: visual.tools.filter((tool) => /Figma|Photoshop|After Effects/.test(tool)),
      peek: "c-teaching",
      proofs: { heading: c.blog.title, items: postProofs(coursePosts) },
    },
  ]

  /* — Spis sekcji (lewy margines i pigułka na telefonie) — */
  const sections: SectionLink[] = [
    { id: SECTION.start, label: UI.start },
    { id: SECTION.about, label: c.about.heading },
    { id: SECTION.skills, label: c.skills.title },
    { id: SECTION.works, label: c.portfolio.title },
    { id: SECTION.blog, label: c.blog.title },
    { id: SECTION.contact, label: c.contact.title },
  ]
  /** Opis sekcji w podglądzie palety — zdanie, które sekcja ma już na stronie. */
  const sectionDetail: Record<string, string> = {
    [SECTION.start]: c.hero.title,
    [SECTION.about]: `${lead.prefix}${lead.strong} ${leadSentence}`,
    [SECTION.skills]: c.skills.lead,
    [SECTION.works]: c.portfolio.lead,
    [SECTION.blog]: c.blog.lead,
    [SECTION.contact]: c.contact.lead,
  }

  /* — Paleta ⌘K: sekcje, realizacje, wpisy, podstrony serwisu, akcje — */
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
        href: `#${workAnchor(entry.slug)}`,
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
    ui: c.ui,
    hero: {
      status: c.hero.status,
      title: c.hero.title,
      lead: heroLead,
      cta: c.hero.cta,
      video: c.hero.video,
    },
    about: { heading: c.about.heading, fill, facts },
    skills: { title: c.skills.title, lead: continued(c.skills.lead), items: competencies },
    portfolio: {
      title: c.portfolio.title,
      lead: continued(c.portfolio.lead),
      groups,
      link: c.portfolio.link,
      all: { label: UI.allWorks, href: c.portfolio.link.href },
    },
    blog: {
      title: c.blog.title,
      lead: continued(c.blog.lead),
      posts: postRows,
      link: c.blog.link,
    },
    contact: { ...c.contact, lead: continued(c.contact.lead) },
    footer: c.footer,
    sections,
    palette,
    peeks,
  }
}

export type IndeksOneContent = ReturnType<typeof getIndeksOneContent>
