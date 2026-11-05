import "./best-of-2.css"
import { getDemoHomeContent, type DemoHomeContent, type DemoWork } from "../shared/content"
import { Appear } from "./Appear"
import { Blog } from "./Blog"
import { Contact } from "./Contact"
import { Cta } from "./Cta"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { ROOT_ID, SECTIONS } from "./ids"
import { Manifest } from "./Manifest"
import type { PaletteGroup } from "./palette-types"
import { Portfolio } from "./Portfolio"
import { Reel } from "./Reel"
import { Skills } from "./Skills"
import { UI } from "./ui-strings"
import { VideoWorks } from "./VideoWorks"
import { WorksProvider } from "./WorksProvider"

const OS_SCRIPT = `document.documentElement.dataset.b2Os=/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent)?"apple":"other"`

/** Paleta ⌘K: sekcje strony, realizacje (podgląd), wpisy, podstrony i akcje — z treści serwisu. */
function paletteGroups(content: DemoHomeContent): PaletteGroup[] {
  const { portfolio, blog, skills, about, nav, person, ui, contact } = content
  const video = portfolio.groups.find((group) => group.id === "wideo")
  return [
    {
      id: "page",
      heading: UI.onThisPage,
      items: [
        { id: "s-portfolio", label: portfolio.title, href: `#${SECTIONS.portfolio}` },
        { id: "s-about", label: about.heading, href: `#${SECTIONS.about}` },
        { id: "s-skills", label: skills.title, href: `#${SECTIONS.skills}` },
        { id: "s-video", label: video?.label ?? "", href: `#${SECTIONS.video}` },
        { id: "s-blog", label: blog.title, href: `#${SECTIONS.blog}` },
        { id: "s-contact", label: contact.title, href: `#${SECTIONS.contact}` },
      ].map((item) => ({ ...item, icon: "section" as const })),
    },
    {
      id: "works",
      heading: portfolio.title,
      items: portfolio.works.map((work) => ({
        id: `w-${work.slug}`,
        label: work.title,
        hint: work.category,
        icon: "work" as const,
        work: work.slug,
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
        icon: "post" as const,
        href: post.href,
        keywords: [...post.categories, ...post.tags].join(" "),
      })),
    },
    {
      id: "pages",
      heading: content.footer.navigationLabel,
      items: nav.map((item) => ({
        id: `r-${item.key}`,
        label: item.label,
        hint: item.href,
        icon: "page" as const,
        href: item.href,
      })),
    },
    {
      id: "actions",
      heading: UI.actions,
      items: [
        {
          id: "a-mail",
          label: person.email,
          hint: UI.copyEmail,
          icon: "mail",
          action: "copy-email",
        },
        { id: "a-theme", label: ui.themeToggle, icon: "theme", action: "theme" },
        ...person.socials.map((social) => ({
          id: `a-${social.label.toLowerCase()}`,
          label: social.label,
          hint: new URL(social.url).hostname.replace(/^www\./, ""),
          icon: "external" as const,
          href: social.url,
        })),
      ],
    },
  ]
}

/**
 * Koncepcja „The Best Of” (iteracja 6): wszystko, co właściciel pochwalił
 * w iteracjach 3 i 5, w jednej stronie, jednym rytmie i jednym systemie ruchu:
 * „wyostrzenie” dla tego, co wchodzi, „kod” (glify) dla obrazu i zaproszenia.
 * Komponent serwerowy: składa treść z modułu wspólnego i rozdaje ją wyspom
 * klienckim przez propsy (oszczędnie — tylko to, czego wyspa potrzebuje).
 */
export function BestOf2Home() {
  const content = getDemoHomeContent()
  const { person, hero, ui, portfolio, about } = content
  const works = portfolio.works
  const byGroup = (group: DemoWork["group"]) => works.filter((work) => work.group === group)
  // Slider: prace cyfrowe (najpierw własne produkty); masonry: treści wizualne — bez powtórzeń.
  const digital = [...byGroup("produkty"), ...byGroup("web")]
  const contactLabel = content.nav.find((item) => item.key === "contact")?.label ?? ""

  return (
    <div id={ROOT_ID} className="fm b2">
      {/* Platforma przed pierwszym malowaniem: skrót palety (⌘ albo Ctrl) bez podmiany po hydratacji. */}
      <script dangerouslySetInnerHTML={{ __html: OS_SCRIPT }} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[90] inline-flex h-11 -translate-y-24 items-center rounded-full bg-fm-ink px-4 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <WorksProvider
        works={works}
        groups={Object.fromEntries(
          portfolio.groups.map((group) => [
            group.id,
            { label: group.label, description: group.description },
          ])
        )}
        labels={{
          link: portfolio.link,
          openSite: UI.openSite,
          close: UI.previewClose,
          previous: UI.sliderPrevious,
          next: UI.sliderNext,
          play: UI.play,
          pause: UI.pause,
          newTab: ui.newTab,
        }}
      >
        <Header
          domain={person.domain}
          nav={content.nav.filter((item) => item.key !== "contact")}
          cta={{ label: contactLabel, href: `#${SECTIONS.contact}` }}
          email={person.email}
          palette={paletteGroups(content)}
          paletteLabels={{
            search: UI.search,
            placeholder: UI.searchPlaceholder,
            noResults: UI.noResults,
            results: UI.results,
            hintNavigate: UI.hintNavigate,
            hintOpen: UI.hintOpen,
            hintClose: UI.hintClose,
            copied: ui.copied,
          }}
          labels={{
            theme: ui.themeToggle,
            open: ui.openMenu,
            close: ui.closeMenu,
            menu: UI.menu,
            copied: ui.copied,
            mainNav: UI.mainNav,
            mobileNav: UI.mobileNav,
          }}
        />

        <main id="main" tabIndex={-1} className="outline-none">
          <Hero hero={hero} person={person} worksLabel={portfolio.link.label} />
          <Reel
            video={hero.video}
            labels={{ region: UI.reel, pause: UI.pause, play: UI.play, fallback: ui.videoFallback }}
          />
          <Portfolio portfolio={portfolio} works={digital} />
          <Manifest about={about} />
          <Skills content={content} />
          <Cta
            hero={hero}
            contact={content.contact}
            contactLabel={contactLabel}
            email={person.email}
            copied={ui.copied}
            labels={{ lens: UI.lens }}
          />
          <VideoWorks portfolio={portfolio} works={byGroup("wideo")} />
          <Blog blog={content.blog} />
          <Contact contact={content.contact} />
        </main>
      </WorksProvider>
      <Footer content={content} />
      <Appear />
    </div>
  )
}
