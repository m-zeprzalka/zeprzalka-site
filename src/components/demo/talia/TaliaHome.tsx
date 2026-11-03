import "./talia.css"
import type { CSSProperties } from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/demo/forma/Button"
import { Reveal } from "@/components/demo/forma/Reveal"
import { typo } from "@/components/demo/forma/typo"
import { ROUTES, postPath } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getPages } from "@/i18n/content/pages"
import { fill, formatDate, formatReadingTime } from "@/i18n/format"
import {
  featuredPortfolioItems,
  portfolioGroups,
  portfolioItems,
  type PortfolioItem,
} from "@/lib/portfolio"
import { getAllPosts } from "@/lib/posts"
import { CONTACT_EMAIL, SITE_NAME, SOCIAL_PROFILES } from "@/lib/site"
import { cn } from "../forma/cn"
import { Competencies, type Fact, type Skill } from "./Competencies"
import { ContactCard } from "./ContactCard"
import { Header } from "./Header"
import { HeroFan } from "./HeroFan"
import { HeroStack } from "./HeroStack"
import { Journal } from "./Journal"
import { OpenContact } from "./OpenContact"
import { TaliaProvider } from "./TaliaProvider"
import { Works } from "./Works"
import type { NavItem, Project, ProjectGroup } from "./types"

/*
 * Nowe napisy interfejsu — tylko drobne etykiety, których treści serwisu
 * nie mają (lista w raporcie koncepcji). Wszystko inne pochodzi
 * z src/i18n/content i src/lib.
 */
const UI = {
  write: "Napisz",
  all: "Wszystko",
  close: "Zamknij",
  copied: "Skopiowano",
  award: "Nagroda Rektora",
  pause: "Wstrzymaj wideo",
}

const locale = "pl"

function need<T>(value: T | undefined | null, what: string): T {
  if (value === undefined || value === null) throw new Error(`Talia: brak treści — ${what}`)
  return value
}

/**
 * Koncepcja „Talia” (iteracja 3): najpierw praca. Realizacje to talia
 * miękkich kart — wachlarz w hero na desktopie, stos do odrzucania palcem
 * na telefonie, cała talia rozłożona na stole w sekcji realizacji. Każdą
 * kartę można wyjąć z talii (przejście widoku do dialogu).
 *
 * Komponent serwerowy: czyta treści i składa sekcje; klienckie są tylko
 * wyspy, które naprawdę reagują (talie, filtr, dialogi, liczby, nagłówek).
 */
export function TaliaHome() {
  const common = getCommon(locale)
  const home = getHome(locale)
  const pages = getPages(locale)
  const about = pages.about

  const toProject = (item: PortfolioItem): Project => ({
    slug: item.slug,
    title: item.title[locale],
    category: item.category[locale],
    group: item.group,
    video: item.video,
    poster: item.poster,
  })
  const projects = portfolioItems.map(toProject)
  const fan = featuredPortfolioItems.slice(0, 5).map(toProject)
  const groups: ProjectGroup[] = portfolioGroups.map((group) => ({
    id: group.id,
    label: group.label[locale],
    description: group.description[locale],
  }))

  // — Fakty: liczby wyjęte z tekstów „O mnie” i hero, żeby nie powielać treści.
  const years = Number(need(home.hero.subtitleHighlight.match(/\d+/)?.[0], "lata doświadczenia"))
  const freelance = need(about.experience[0], "doświadczenie: freelance")
  const teaching = need(about.experience[1], "doświadczenie: wykłady")
  const clients = need(freelance.description.match(/(\d+)\s+(\p{L}+)/u), "liczba klientów")
  const [taughtFrom = 0, taughtTo = 0] = teaching.period.split(/[–-]/).map(Number)
  const score = need(about.bioSecondSuffix.match(/za (.+?):\s*([\d,]+)%/), "wynik ankiet")

  const facts: Fact[] = [
    { value: years, suffix: "+", label: about.bioLeadStrong.replace(/^\d+\s*/, "") },
    { value: Number(clients[1]), suffix: "+", label: need(clients[2], "klienci") },
    {
      value: taughtTo,
      from: taughtFrom,
      prefix: `${taughtFrom}–`,
      format: { useGrouping: false },
      label: teaching.role,
    },
    {
      value: Number(need(score[2], "wynik").replace(",", ".")) / 100,
      format: { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 },
      label: `${UI.award} za ${need(score[1], "opis wyniku")}`,
    },
  ]

  // — Kompetencje: projektowanie, kod, AI, wykłady. Opis „Development” ma dwa
  // zdania (kod, potem AI) — dzielimy je między dwie karty, bez nowych tekstów.
  const [design, development] = homeSkills
  const ai = need(about.skillGroups[3], "umiejętności AI")
  const [codeSentence = "", aiSentence = ""] = need(development, "development").description[
    locale
  ].split(/(?<=\.)\s+/)
  const skills: Skill[] = [
    {
      kind: "design",
      title: need(design, "design").title[locale],
      description: need(design, "design").description[locale],
      tools: need(design, "design").tools[locale],
    },
    {
      kind: "code",
      title: need(development, "development").title[locale],
      description: codeSentence,
      tools: need(development, "development").tools[locale],
    },
    { kind: "ai", title: ai.category, description: aiSentence, tools: ai.items },
    {
      kind: "teaching",
      title: teaching.role,
      description: teaching.description,
      tools: teaching.tags,
    },
  ]

  const posts = getAllPosts(locale)
    .slice(0, 3)
    .map((post) => ({
      href: postPath(locale, post.slug),
      title: post.frontmatter.title,
      category: post.frontmatter.categories[0] ?? "",
      image: post.frontmatter.image,
      date: formatDate(post.frontmatter.date, locale),
      dateTime: post.frontmatter.date,
      reading: formatReadingTime(post.readingMinutes, locale),
    }))

  // Mała talia w kontakcie: realizacja z każdej grupy, na wierzchu pusta karta.
  const nextDeck = groups
    .map((group) => projects.find((project) => project.group === group.id))
    .filter((project): project is Project => project !== undefined)

  const nav: NavItem[] = [
    { href: "#realizacje", label: pages.portfolio.title },
    { href: "#blog", label: common.nav.blog },
    { href: "#kontakt", label: common.nav.contact },
  ]

  // H1 dwutonowy: przedmiot w atramencie, cel w szarości — cięcie przed „w”.
  const title = home.hero.title
  const cut = title.lastIndexOf(" w ")
  const titleParts =
    cut > 0
      ? [
          { text: title.slice(0, cut) },
          // Cel zawsze w osobnym wierszu: przedmiot atramentem, cel szarością.
          { text: title.slice(cut + 1), className: "text-fm-ink-3 block" },
        ]
      : [{ text: title }]

  return (
    <div id="top" className="fm talia">
      <TaliaProvider
        projects={projects}
        groups={groups}
        projectLabels={{
          close: UI.close,
          pause: UI.pause,
          ctaHeading: pages.portfolio.ctaHeading,
          ctaButton: pages.portfolio.ctaPrimary,
        }}
        contactLabels={{
          title: home.contact.cardTitle,
          description: home.contact.cardDescription,
          close: UI.close,
          ...common.form,
          privacyHref: ROUTES.privacy[locale],
        }}
      >
        <a
          href="#tresc"
          className="sr-only z-50 rounded-full bg-fm-ink px-4 py-2.5 text-sm font-medium text-fm-inverse fm-focus focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {common.ui.skipToContent}
        </a>
        <Header
          nav={nav}
          labels={{
            brand: SITE_NAME,
            status: home.hero.status,
            navAria: common.nav.mainAria,
            openMenu: common.nav.openMenu,
            closeMenu: common.nav.closeMenu,
            write: UI.write,
            theme: common.ui.themeToggle,
          }}
        />

        <main id="tresc">
          {/* — Hero: tekst w CSS (bez czekania na JS), pod nim talia. */}
          <section className="pt-28 pb-(--fm-section) md:pt-32">
            <div className="fm-container flex flex-col items-center text-center">
              <Reveal
                as="h1"
                parts={titleParts}
                className="text-[clamp(2.25rem,1rem+3.9vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance"
              />
              <p
                className="mt-5 max-w-[44rem] fm-rise text-fm-lead text-pretty text-fm-ink-2 md:mt-6"
                style={{ "--fm-delay": "180ms" } as CSSProperties}
              >
                <span className="font-medium text-fm-ink">{home.hero.subtitleRole}</span>
                {typo(`${home.hero.subtitleHighlight}${home.hero.subtitleRest}`)}
              </p>
              <div
                className="mt-8 flex w-full fm-rise flex-col items-center gap-3 sm:w-auto sm:flex-row"
                style={{ "--fm-delay": "260ms" } as CSSProperties}
              >
                <OpenContact
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
                >
                  {home.hero.cta}
                </OpenContact>
                <Link
                  href="#realizacje"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    // Na telefonie talia stoi tuż pod spodem — drugi przycisk tylko by ją odsuwał.
                    "hidden text-fm-ink sm:inline-flex"
                  )}
                >
                  {pages.services.quotePortfolio}
                </Link>
              </div>
            </div>

            <div className="fm-container mt-14 md:hidden">
              <HeroStack
                projects={projects}
                labels={{
                  region: home.portfolio.title,
                  previous: pages.blog.previousPage,
                  next: pages.blog.nextPage,
                  pause: UI.pause,
                }}
              />
            </div>
            <div className="fm-container mt-10 hidden md:block lg:mt-12">
              <HeroFan projects={fan} label={home.portfolio.title} />
            </div>
          </section>

          <section
            id="realizacje"
            aria-labelledby="realizacje-tytul"
            className="fm-container pb-(--fm-section)"
          >
            <Works
              projects={projects}
              groups={groups}
              labels={{
                title: pages.portfolio.title,
                all: UI.all,
                allDescription: pages.portfolio.description,
              }}
            />
          </section>

          <section
            id="kompetencje"
            aria-labelledby="kompetencje-tytul"
            className="fm-container pb-(--fm-section)"
          >
            <Competencies
              title={home.skills.title}
              lead={home.skills.lead}
              facts={facts}
              skills={skills}
            />
          </section>

          <section
            id="blog"
            aria-labelledby="blog-tytul"
            className="fm-container pb-(--fm-section)"
          >
            <Journal
              title={home.blog.title}
              lead={home.blog.lead}
              cta={home.blog.cta}
              ctaHref={ROUTES.blog[locale]}
              posts={posts}
            />
          </section>

          <section id="kontakt" aria-labelledby="kontakt-tytul" className="fm-container">
            <ContactCard
              status={home.hero.status}
              city={about.addressLocality}
              title={home.contact.cardTitle}
              lead={home.contact.lead}
              write={UI.write}
              email={CONTACT_EMAIL}
              copied={UI.copied}
              details={[
                { label: pages.contact.responseLabel, value: pages.contact.responseValue },
                { label: pages.contact.locationLabel, value: pages.contact.locationValue },
              ]}
              socialLabel={common.footer.social}
              socials={SOCIAL_PROFILES}
              deck={nextDeck}
              nextLabel={pages.portfolio.ctaHeading}
            />
          </section>
        </main>

        <footer className="fm-container flex flex-col gap-2 py-10 text-fm-small text-fm-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{typo(fill(common.footer.copyright, { year: new Date().getFullYear() }))}</span>
          <span>{common.footer.tagline}</span>
        </footer>
      </TaliaProvider>
    </div>
  )
}
