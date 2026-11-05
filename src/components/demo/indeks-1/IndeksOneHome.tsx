import "./indeks-1.css"
import { About } from "./About"
import { ROOT_ID, SECTION } from "./anchors"
import { Competencies } from "./Competencies"
import { Contact } from "./Contact"
import { getIndeksOneContent } from "./content"
import { Footer } from "./Footer"
import { glyphFont } from "./glyph/fonts"
import { Header } from "./Header"
import { Hero } from "./Hero"
import type { PeekWork } from "./PeekBody"
import { Section } from "./Section"
import { SectionNav } from "./SectionNav"
import { Stage } from "./LazyStage"
import type { StageWork } from "./types"
import { UI } from "./ui-strings"
import { Works } from "./Works"
import { Writing } from "./Writing"

/**
 * Platforma przed pierwszym malowaniem: skrót palety pokazuje od razu ⌘ albo
 * Ctrl (CSS `.i1-os-*`), bez podmiany po hydratacji. Bez JS zostaje ⌘.
 */
const PLATFORM_SCRIPT = `document.documentElement.dataset.i1Os=/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent)?"apple":"other"`

/**
 * „Indeks · I” (iteracja 7): Indeks · nowy doprowadzony do wersji produkcyjnej.
 * Wąziutka kolumna, w której tekst jest indeksem, a obraz jego odczytem —
 * menu i media pojawiają się tylko na żądanie, wszystko w jednej siatce
 * trzech torów (`indeks-1.css`). Komponent serwerowy: czyta treść i rozdaje
 * ją wyspom klienckim.
 */
export function IndeksOneHome() {
  const content = getIndeksOneContent()
  const { person, ui } = content

  const allWorks = content.portfolio.groups.flatMap((group) => group.works)
  const stageWorks: Record<string, StageWork> = Object.fromEntries(
    allWorks.map((work) => [
      work.slug,
      { title: work.title, poster: work.poster, video: work.video },
    ])
  )
  const covers: Record<string, string> = Object.fromEntries(
    content.blog.posts.map((post) => [post.slug, post.image])
  )
  // Frazy z podglądem jednej realizacji (karta pod słowem) dostają tylko jej tytuł, plakat i klip.
  const chipWorks: Record<string, PeekWork> = Object.fromEntries(
    Object.values(content.peeks).flatMap((peek) => {
      if (peek.kind !== "work") return []
      const work = stageWorks[peek.slug]
      return work
        ? [[peek.slug, { title: work.title, src: work.poster.src, video: work.video }]]
        : []
    })
  )

  return (
    <div id={ROOT_ID} className={`fm i1 ${glyphFont.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-3 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <Header
        domain={person.domain}
        themeLabel={ui.themeToggle}
        email={person.email}
        palette={content.palette}
        paletteLabels={{
          search: UI.search,
          placeholder: UI.searchPlaceholder,
          noResults: UI.noResults,
          clear: UI.clear,
          results: UI.results,
          hintNavigate: UI.hintNavigate,
          hintOpen: UI.hintOpen,
          hintClose: UI.hintClose,
          copied: UI.copied,
        }}
      />

      <SectionNav label={UI.onPage} items={content.sections} searchLabel={UI.search} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero
          hero={content.hero}
          peeks={content.peeks}
          works={chipWorks}
          email={person.email}
          ui={ui}
        />
        <About about={content.about} peeks={content.peeks} works={chipWorks} />

        <Section id={SECTION.skills} title={content.skills.title} lead={content.skills.lead}>
          <Competencies items={content.skills.items} />
        </Section>

        <Section id={SECTION.works} title={content.portfolio.title} lead={content.portfolio.lead}>
          <Works
            groups={content.portfolio.groups}
            all={content.portfolio.all}
            labels={{
              play: UI.play,
              pause: UI.pause,
              visit: UI.visit,
              newTab: ui.newTab,
              link: content.portfolio.link,
              inPortfolio: UI.inPortfolio,
            }}
          />
        </Section>

        <Section id={SECTION.blog} title={content.blog.title} lead={content.blog.lead}>
          <Writing
            posts={content.blog.posts}
            link={content.blog.link}
            labels={{
              newPost: UI.newPost,
              more: UI.showAll,
              less: UI.showLess,
              play: UI.play,
              pause: UI.pause,
            }}
          />
        </Section>

        <Contact contact={content.contact} email={person.email} copiedLabel={ui.copied} />
      </main>

      <Footer footer={content.footer} person={person} newTab={ui.newTab} />
      <Stage works={stageWorks} covers={covers} peeks={content.peeks} />
    </div>
  )
}
