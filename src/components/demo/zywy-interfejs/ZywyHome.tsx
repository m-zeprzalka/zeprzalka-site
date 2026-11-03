import "./zywy.css"
import fs from "node:fs"
import path from "node:path"
import Link from "next/link"
import { locales, ROUTES } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getPages } from "@/i18n/content/pages"
import { fill } from "@/i18n/format"
import { getBlogPageCount } from "@/lib/blog-pages"
import { portfolioGroups, portfolioItems } from "@/lib/portfolio"
import { getAllPosts, getTerms } from "@/lib/posts"
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME, SOCIAL_PROFILES } from "@/lib/site"
import { buttonVariants } from "../forma/Button"
import { typo } from "../forma/typo"
import { Count } from "../forma/Count"
import { Contact } from "./Contact"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { webpRatio } from "./media"
import { Section } from "./Section"
import { Tile } from "./Tile"
import { BuildTile, type BuildLine } from "./tiles/BuildTile"
import { AskTile } from "./tiles/AskTile"
import { InspectorTile } from "./tiles/InspectorTile"
import { LectureTile } from "./tiles/LectureTile"
import { Works } from "./Works"
import { Writing } from "./Writing"

/** Pierwsze zdanie akapitu (do pierwszej kropki zamykającej zdanie). */
const firstSentence = (text: string) => text.split(/(?<=\.)\s+/)[0] ?? text

/** Wersja zależności z package.json (bez `^`) — do logu builda w kaflu „Development”. */
function dependencyVersion(name: string) {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
    dependencies: Record<string, string>
  }
  return (pkg.dependencies[name] ?? "").replace(/^\D+/, "").split(".").slice(0, 2).join(".")
}

/**
 * Koncepcja „Żywy interfejs” (system Forma, iteracja 3). Miękki minimalizm
 * Vercel/shadcn: każda z czterech kompetencji udowadnia się działającym
 * mini-interfejsem, a nie opisem. Treść wyłącznie z modułów serwisu —
 * nowe są tylko krótkie etykiety kontrolek.
 */
export function ZywyHome() {
  const locale = "pl"
  const common = getCommon(locale)
  const home = getHome(locale)
  const about = getPages(locale).about
  const contactPage = getPages(locale).contact
  const posts = getAllPosts(locale)

  const [design, development] = homeSkills
  const aiGroup = about.skillGroups[3]
  const frontend = about.skillGroups[0]
  const teaching = about.experience[1]
  const freelance = about.experience[0]
  if (!design || !development || !aiGroup || !frontend || !teaching || !freelance) {
    throw new Error("Demo: brak treści w src/i18n")
  }
  // Opis „Development” ma dwa zdania: pierwsze o kodzie, drugie o AI.
  const [devSentence = "", aiSentence = ""] = development.description[locale].split(/(?<=\.)\s+/)
  const score = Number(/(\d+,\d+)%/.exec(about.bioSecondSuffix)?.[1]?.replace(",", ".") ?? 0)
  const clients = Number(/(\d+)/.exec(freelance.description)?.[1] ?? 0)
  const years = Number(/(\d+)/.exec(about.bioLeadStrong)?.[1] ?? 0)

  // Strony HTML z buildu, liczone z treści: strony stałe, wpisy, kategorie, tagi, archiwum.
  const staticPages = locales.reduce(
    (sum, lang) =>
      sum +
      Object.keys(ROUTES).length +
      getAllPosts(lang).length +
      getTerms(lang, "categories").length +
      getTerms(lang, "tags").length +
      getBlogPageCount(lang) -
      1,
    0
  )
  const postsBoth = locales.reduce((sum, lang) => sum + getAllPosts(lang).length, 0)
  const buildLines: BuildLine[] = [
    { kind: "command", text: "pnpm build" },
    {
      kind: "step",
      text: `Next.js ${dependencyVersion("next")}`,
      detail: `React ${dependencyVersion("react")}`,
    },
    { kind: "step", text: "Compiled successfully" },
    { kind: "step", text: "Checking validity of types", detail: "strict" },
    {
      kind: "step",
      text: "Generating static pages",
      detail: `${staticPages}/${staticPages}`,
    },
    { kind: "route", text: "/  ·  /en", detail: "static" },
    { kind: "route", text: "/blog/[slug]", detail: `${postsBoth} paths` },
    { kind: "route", text: "/portfolio", detail: `${portfolioItems.length} projects` },
    { kind: "done", text: "Deployed to Vercel", detail: "fra1" },
  ]

  const nav = [
    { href: "#kompetencje", label: home.skills.title },
    { href: "#realizacje", label: common.nav.portfolio },
    { href: "#blog", label: common.nav.blog },
    { href: "#kontakt", label: common.nav.contact },
  ]
  const featuredImage = portfolioItems.find((item) => item.slug.startsWith("orlen-min"))

  return (
    <div className="fm">
      <span id="zi-top" className="absolute top-0" aria-hidden="true" />
      <Header
        brand={SITE_DOMAIN}
        status={home.hero.status}
        nav={nav}
        cta={{ href: "#kontakt", label: common.nav.contact }}
        labels={{
          theme: common.ui.themeToggle,
          open: common.nav.openMenu,
          close: common.nav.closeMenu,
          menu: common.nav.menuTitle,
        }}
      />

      <main id="main">
        <Hero
          status={home.hero.status}
          title={home.hero.title}
          role={home.hero.subtitleRole}
          highlight={home.hero.subtitleHighlight}
          rest={home.hero.subtitleRest}
          cta={{ href: "#kontakt", label: home.hero.cta }}
          email={CONTACT_EMAIL}
          copied={common.ui.copied}
          stats={
            <dl className="mx-auto grid max-w-[56rem] grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
              {[
                { value: years, suffix: "+", label: about.bioLeadStrong.replace(/^\d+\s*/, "") },
                { value: clients, suffix: "+", label: "klientów" },
                { value: portfolioItems.length, label: common.plurals.projects.many },
                { value: posts.length, label: common.plurals.articles.many },
              ].map((stat) => (
                // Liczba nad etykietą wizualnie („30+ klientów”), w dokumencie dt przed dd.
                <div key={stat.label} className="flex flex-col-reverse items-center gap-1.5">
                  <dt className="text-fm-small text-fm-ink-3">{stat.label}</dt>
                  <dd className="text-[1.75rem] leading-none font-semibold tracking-[-0.04em] tabular-nums md:text-[2rem]">
                    <Count value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          }
        />

        <Section id="kompetencje" title={home.skills.title} lead={home.skills.lead}>
          <div className="grid gap-4 lg:grid-cols-12">
            <Tile
              className="lg:col-span-7"
              title={design.title[locale]}
              description={firstSentence(design.description[locale])}
            >
              <InspectorTile
                image={featuredImage?.poster ?? "/portfolio/orlen-min.webp"}
                title={featuredImage?.title[locale] ?? ""}
                category={featuredImage?.category[locale] ?? ""}
                labels={{ radius: "Promień", padding: "Odstęp", shadow: "Cień" }}
              />
            </Tile>
            <Tile
              className="lg:col-span-5"
              title={development.title[locale]}
              description={devSentence}
            >
              <BuildTile lines={buildLines} replayLabel="Uruchom ponownie" />
            </Tile>
            <Tile className="lg:col-span-5" title={aiGroup.category} description={aiSentence}>
              <AskTile
                prompts={[
                  { label: aiGroup.category, answer: `${aiSentence} ${aiGroup.items.join(", ")}.` },
                  {
                    label: "Next.js",
                    answer: `${devSentence} ${frontend.items.join(", ")}.`,
                  },
                  { label: "Design Systems", answer: firstSentence(about.bioSecondPrefix) },
                ]}
                labels={{
                  thinking: "Myślę…",
                  ask: "Następne pytanie",
                  note: "Odpowiedzi złożone z treści tej strony — demonstracja interfejsu, bez modelu językowego.",
                }}
              />
            </Tile>
            <Tile
              className="lg:col-span-7"
              title={teaching.role}
              description={firstSentence(teaching.description)}
            >
              <LectureTile
                subjects={teaching.tags.slice(0, 5)}
                role={teaching.role}
                place={teaching.company}
                period={teaching.period}
                score={score}
                labels={{
                  award: "Nagroda Rektora",
                  scoreCaption: "średnia ocen w ankietach studenckich",
                }}
              />
            </Tile>
          </div>
        </Section>

        <Section id="realizacje" title={home.portfolio.title} lead={home.portfolio.lead}>
          <Works
            filters={[
              { id: "all", label: "Wszystkie" },
              ...portfolioGroups.map((group) => ({ id: group.id, label: group.label[locale] })),
            ]}
            works={portfolioItems.map((item) => ({
              slug: item.slug,
              title: item.title[locale],
              category: item.category[locale],
              group: item.group,
              video: item.video,
              poster: item.poster,
              ratio: webpRatio(item.poster),
            }))}
          />
        </Section>

        <Section
          id="blog"
          title={home.blog.title}
          lead={home.blog.lead}
          action={
            <Link href={ROUTES.blog[locale]} className={buttonVariants({ variant: "secondary" })}>
              {home.blog.cta}
            </Link>
          }
        >
          <Writing posts={posts.slice(0, 5)} locale={locale} />
        </Section>

        <section
          id="kontakt"
          aria-labelledby="kontakt-title"
          className="fm-container scroll-mt-24 py-[calc(var(--fm-section)/2)]"
        >
          <div className="grid gap-10 rounded-fm-4xl bg-fm-surface p-6 shadow-fm-card md:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:p-14">
            <div>
              <h2 id="kontakt-title" className="text-fm-h2 font-semibold text-balance">
                {typo(home.contact.cardTitle)}
              </h2>
              <p className="mt-4 max-w-[40ch] text-fm-body text-pretty text-fm-ink-2">
                {home.contact.cardDescription}
              </p>
              <dl className="mt-8 grid gap-4 text-fm-small">
                <div>
                  <dt className="text-fm-ink-3">{contactPage.locationLabel}</dt>
                  <dd className="mt-1 font-medium">{contactPage.locationValue}</dd>
                </div>
                <div>
                  <dt className="text-fm-ink-3">{contactPage.responseLabel}</dt>
                  <dd className="mt-1 font-medium">{contactPage.responseValue}</dd>
                </div>
              </dl>
            </div>
            <Contact copy={common.form} />
          </div>
        </section>
      </main>

      <Footer
        brand={SITE_NAME}
        tagline={common.footer.tagline}
        description={common.footer.description}
        nav={nav}
        social={SOCIAL_PROFILES}
        city={about.location.split(",").at(-1)?.trim() ?? ""}
        status={home.hero.status}
        copyright={fill(common.footer.copyright, { year: new Date().getFullYear() })}
        labels={{
          navigation: common.footer.navigation,
          social: common.footer.social,
          top: "Na górę",
        }}
      />
    </div>
  )
}
