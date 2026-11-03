import "./precyzja.css"
import Link from "next/link"
import { ROUTES, postPath } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getPages } from "@/i18n/content/pages"
import { formatDate, plural } from "@/i18n/format"
import { mainNav } from "@/i18n/navigation"
import { featuredPortfolioItems, portfolioGroups, portfolioItems } from "@/lib/portfolio"
import { getAllPosts } from "@/lib/posts"
import { CONTACT_EMAIL, SOCIAL_PROFILES } from "@/lib/site"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { Section } from "./Section"
import { Disciplines } from "./Disciplines"
import { WorksIndex } from "./WorksIndex"
import { Writing } from "./Writing"
import { ContactDemo } from "./ContactDemo"
import { CopyEmail } from "./CopyEmail"
import { Inspector } from "./Inspector"
import { BezierPad } from "./samples/BezierPad"
import { CodeType } from "./samples/CodeType"
import { TokenStream } from "./samples/TokenStream"
import { Gauge } from "./samples/Gauge"
import { typo } from "./typo"

/**
 * Demo „Precyzja” — strona główna w nowym języku wizualnym, zbudowana
 * wyłącznie z treści, które serwis już ma (src/i18n/content, src/lib).
 * Nowe są tylko podpisy próbek i etykiety liczb — to dane, nie copy.
 */
export function PrecyzjaHome() {
  const locale = "pl"
  const common = getCommon(locale)
  const home = getHome(locale)
  const about = getPages(locale).about
  const posts = getAllPosts(locale)

  const [design, development] = homeSkills
  const ai = about.skillGroups[3]
  const teaching = about.experience[1]
  if (!design || !development || !ai || !teaching) throw new Error("Demo: brak treści w src/i18n")
  // Opis „Development” ma dwa zdania: pierwsze mówi o kodzie, drugie o AI —
  // rozdzielamy je między dwa arkusze, bez dopisywania nowych tekstów.
  const [devSentence = "", aiSentence = ""] = development.description[locale].split(/(?<=\.)\s+/)

  const groupLabel = (id: string) =>
    portfolioGroups.find((group) => group.id === id)?.label[locale] ?? ""

  const nav = [
    { href: ROUTES.services[locale], label: common.nav.services },
    { href: "#portfolio", label: common.nav.portfolio },
    { href: ROUTES.blog[locale], label: common.nav.blog },
    { href: ROUTES.about[locale], label: common.nav.about },
    { href: "#kontakt", label: common.nav.contact },
  ]

  return (
    <div className="pz">
      <Header
        nav={nav}
        homeHref="/demo/precyzja"
        languageHref={ROUTES.home.en}
        languageLabel={common.languageSwitch.label}
        email={CONTACT_EMAIL}
        themeLabel={common.ui.themeToggle}
      />
      <Inspector />

      <main id="main">
        <Hero
          status={home.hero.status}
          title={home.hero.title}
          role={home.hero.subtitleRole}
          highlight={home.hero.subtitleHighlight}
          rest={home.hero.subtitleRest}
          cta={{ href: ROUTES.contact[locale], label: home.hero.cta }}
          secondary={{ href: "#portfolio", label: common.nav.portfolio }}
          stats={[
            { value: "12+", label: about.bioLeadStrong.replace(/^\d+\s/, "") },
            { value: "30+", label: "klientów" },
            { value: "2016–2026", label: teaching.role },
            { value: "99,28%", label: "średnia w ankietach studenckich" },
          ]}
        />

        <Section id="kompetencje" title={home.skills.title} lead={typo(home.skills.lead)}>
          <Disciplines
            items={[
              {
                key: "design",
                title: design.title[locale],
                description: design.description[locale],
                tools: design.tools[locale],
                sample: <BezierPad />,
              },
              {
                key: "code",
                title: development.title[locale],
                description: devSentence,
                tools: development.tools[locale],
                sample: <CodeType />,
              },
              {
                key: "ai",
                title: ai.category,
                description: aiSentence,
                tools: ai.items,
                sample: <TokenStream />,
              },
              {
                key: "teaching",
                title: teaching.role,
                description: teaching.description,
                tools: teaching.tags,
                sample: (
                  <Gauge value={99.28} caption="Uniwersytet Civitas" note="Nagroda Rektora" />
                ),
              },
            ]}
          />
        </Section>

        <Section
          id="portfolio"
          title={home.portfolio.title}
          lead={typo(home.portfolio.lead)}
          action={
            <Link href={ROUTES.portfolio[locale]} className="pz-btn pz-btn--line pz-btn--sm w-fit">
              {plural(portfolioItems.length, locale, common.plurals.projects)}
            </Link>
          }
        >
          <WorksIndex
            works={featuredPortfolioItems.map((item) => ({
              slug: item.slug,
              title: item.title[locale],
              category: item.category[locale],
              group: groupLabel(item.group),
              poster: item.poster,
              href: `${ROUTES.portfolio[locale]}#${item.slug}`,
            }))}
          />
        </Section>

        <Section
          id="blog"
          title={home.blog.title}
          lead={typo(home.blog.lead)}
          action={
            <Link href={ROUTES.blog[locale]} className="pz-btn pz-btn--line pz-btn--sm w-fit">
              {home.blog.cta}
            </Link>
          }
        >
          <Writing posts={posts.slice(0, 6)} locale={locale} />
        </Section>

        <section id="kontakt" className="pz-section" aria-labelledby="kontakt-title">
          <div className="pz-container pz-grid gap-y-12">
            <div className="col-span-4 md:col-span-5">
              <h2 id="kontakt-title" className="pz-h2">
                {typo(home.contact.cardTitle)}
              </h2>
              <p className="pz-lead mt-6">{typo(home.contact.cardDescription)}</p>
              <dl className="pz-contact-facts">
                <div>
                  <dt>E-mail</dt>
                  <dd>
                    <CopyEmail email={CONTACT_EMAIL} />
                  </dd>
                </div>
                <div>
                  <dt>{getPages(locale).contact.locationLabel}</dt>
                  <dd>{about.location}</dd>
                </div>
                <div>
                  <dt>{getPages(locale).contact.responseLabel}</dt>
                  <dd>{getPages(locale).contact.responseValue}</dd>
                </div>
              </dl>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <ContactDemo copy={common.form} />
            </div>
          </div>
        </section>
      </main>

      <footer className="pz-footer">
        <div className="pz-container pz-grid gap-y-10">
          <div className="col-span-4 md:col-span-5">
            <p className="pz-footer__name">Michał Zeprzałka</p>
            <p className="mt-2 text-[var(--pz-muted)]">{common.footer.description}</p>
          </div>
          <nav
            aria-label={common.footer.navigation}
            className="col-span-2 md:col-span-3 md:col-start-7"
          >
            <ul className="pz-footer__list">
              {mainNav(locale).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="pz-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="pz-footer__list col-span-2 md:col-span-3">
            {SOCIAL_PROFILES.map((profile) => (
              <li key={profile.url}>
                <a href={profile.url} className="pz-link" target="_blank" rel="noopener noreferrer">
                  {profile.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Stopka podaje fakty o samym serwisie, liczone przy buildzie. */}
          <dl className="pz-footer__facts col-span-4 md:col-span-12">
            <div>
              <dt>Blog</dt>
              <dd className="pz-mono">{plural(posts.length, locale, common.plurals.articles)}</dd>
            </div>
            <div>
              <dt>Portfolio</dt>
              <dd className="pz-mono">
                {plural(portfolioItems.length, locale, common.plurals.projects)}
              </dd>
            </div>
            <div>
              <dt>Ostatni wpis</dt>
              <dd className="pz-mono">
                <Link href={postPath(locale, posts[0]?.slug ?? "")} className="pz-link">
                  {posts[0] ? formatDate(posts[0].frontmatter.date, locale) : "—"}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Silnik</dt>
              <dd className="pz-mono">Next.js 16, strony statyczne</dd>
            </div>
          </dl>
        </div>
      </footer>
    </div>
  )
}
