import "./indeks-new.css"
import { About } from "./About"
import { ROOT_ID, SECTION } from "./anchors"
import { Competencies } from "./Competencies"
import { Contact } from "./Contact"
import { getIndeksNewContent } from "./content"
import { Footer } from "./Footer"
import { glyphFont } from "./glyph/fonts"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { Section } from "./Section"
import { SectionNav } from "./SectionNav"
import { Stage, type StageWork } from "./Stage"
import { UI } from "./ui-strings"
import { Works } from "./Works"
import { Writing } from "./Writing"

/**
 * „Indeks · nowy” (iteracja 6): wąziutka kolumna, w której tekst jest
 * indeksem, a obraz jego odczytem. Menu i media istnieją tylko wtedy, gdy są
 * potrzebne: spis po lewej pojawia się za startem, a prawa strona jest pusta,
 * dopóki czegoś nie wskażesz — wtedy obraz **odkodowuje się z glifów**.
 * Tekst wyostrza się z rozmycia; obraz wyłania się z kodu. Komponent
 * serwerowy: czyta treść i rozdaje ją wyspom klienckim.
 */
export function IndeksNewHome() {
  const content = getIndeksNewContent()
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
  // Chipy z podglądem jednej realizacji (popover na dotyku) dostają tylko jej tytuł i plakat.
  const chipWorks: Record<string, { title: string; src: string }> = Object.fromEntries(
    Object.values(content.peeks).flatMap((peek) => {
      if (peek.kind !== "work") return []
      const work = stageWorks[peek.slug]
      return work ? [[peek.slug, { title: work.title, src: work.poster.src }]] : []
    })
  )

  return (
    <div id={ROOT_ID} className={`fm ixn ${glyphFont.variable}`}>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-3 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <Header
        name={person.name}
        role={person.role}
        themeLabel={ui.themeToggle}
        email={person.email}
        palette={content.palette}
        sections={content.sections.map((section) => section.id)}
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

        <Section
          id={SECTION.works}
          title={content.portfolio.title}
          lead={content.portfolio.lead}
          meta={content.portfolio.count}
        >
          <Works
            groups={content.portfolio.groups}
            labels={{
              play: UI.play,
              pause: UI.pause,
              visit: UI.visit,
              newTab: ui.newTab,
              link: content.portfolio.link,
            }}
          />
        </Section>

        <Section
          id={SECTION.blog}
          title={content.blog.title}
          lead={content.blog.lead}
          meta={content.blog.count}
        >
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
