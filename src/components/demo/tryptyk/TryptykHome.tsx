import "./tryptyk.css"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { ROOT_ID } from "./anchors"
import { CommandPalette } from "./CommandPalette"
import { Competencies } from "./Competencies"
import { ContactForm } from "./ContactForm"
import { getTryptykContent } from "./content"
import { Footer } from "./Footer"
import { Intro } from "./Intro"
import { Rail } from "./Rail"
import { Section } from "./Section"
import { Stage } from "./Stage"
import { ScrollSpy } from "./store"
import { TopBar } from "./TopBar"
import { UI } from "./ui-strings"
import { Works } from "./Works"
import { Writing } from "./Writing"

/**
 * Koncepcja „Tryptyk” (iteracja 5): Indeks w trzech skrzydłach. Lewe — spis,
 * wyszukiwanie, status (od 1280 px; niżej pasek z menu). Środek — dokument,
 * który nigdy się nie przelewa. Prawe — scena z mediami do tego, co czytasz
 * albo wskazujesz (od 1024 px; niżej media stoją w treści). Komponent
 * serwerowy: czyta treść i rozdaje napisy wyspom klienckim.
 */
export function TryptykHome() {
  const content = getTryptykContent()
  const { person, sections, ui } = content
  const workIndex = Object.fromEntries(
    content.works.map((work) => [work.slug, { title: work.title, category: work.category }])
  )
  const media = { play: UI.play, pause: UI.pause }

  return (
    <div id={ROOT_ID} className="fm tk">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-2 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>
      <ScrollSpy />

      <TopBar
        person={person}
        status={content.status}
        nav={content.nav}
        labels={{
          contact: content.sectionLabel.kontakt,
          cta: content.intro.cta,
          search: UI.search,
          menu: UI.menu,
          close: UI.closeMenu,
          sections: UI.sections,
          copied: ui.copied,
          theme: ui.themeToggle,
        }}
      />

      <div className="tk-frame">
        <Rail
          person={person}
          nav={content.nav}
          labels={{
            sections: UI.sections,
            search: UI.search,
            copied: ui.copied,
            theme: ui.themeToggle,
          }}
        />

        <main
          id="main"
          tabIndex={-1}
          className="min-w-0 outline-none lg:col-start-1 lg:row-start-1 xl:col-start-2"
        >
          <Intro content={content} labels={{ copied: ui.copied, ...media }} />

          <Section id="kompetencje" {...sections.skills}>
            <Competencies items={content.competencies} works={workIndex} />
          </Section>

          <Section id="realizacje" title={sections.works.title} lead={sections.works.lead}>
            <Works
              works={content.works}
              labels={{
                ...media,
                newTab: ui.newTab,
                link: content.worksLink,
                count: sections.works.meta,
                view: { label: UI.view, list: UI.viewList, gallery: UI.viewGallery },
              }}
            />
          </Section>

          <Section id="blog" {...sections.blog}>
            <Writing
              posts={content.posts}
              link={content.blogLink}
              labels={{ newPost: UI.newPost, more: UI.showAll, less: UI.showLess }}
            />
          </Section>

          <Section id="kontakt" {...sections.contact}>
            <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-fm-small">
              <CopyButton
                value={content.contact.email}
                label={content.contact.email}
                copiedLabel={ui.copied}
              />
              <p className="text-fm-ink-3">
                {content.contact.response.label}:{" "}
                <span className="text-fm-ink-2">{content.contact.response.value}</span>
              </p>
            </div>
            <ContactForm
              labels={content.contact.form}
              errors={content.contact.errors}
              privacyHref={content.contact.privacyHref}
            />
          </Section>

          <Footer
            copyright={content.footer.copyright}
            locality={person.locality}
            socials={person.socials}
          />
        </main>

        <Stage
          works={content.works}
          posts={content.posts}
          competencies={content.competencies}
          reel={content.reel}
          portfolio={sections.works}
          cta={content.intro.cta}
          experience={content.experience}
          person={person}
          response={content.contact.response}
          worksLink={content.worksLink}
          sectionLabel={content.sectionLabel}
          labels={{
            stage: UI.stage,
            ...media,
            previous: UI.previous,
            next: UI.next,
            copied: ui.copied,
            newTab: ui.newTab,
          }}
        />
      </div>

      <CommandPalette
        groups={content.palette}
        email={person.email}
        labels={{
          search: UI.search,
          placeholder: UI.searchPlaceholder,
          noResults: UI.noResults,
          results: UI.results,
          hintNavigate: UI.hintNavigate,
          hintOpen: UI.hintOpen,
          hintClose: UI.hintClose,
          copied: ui.copied,
        }}
      />
    </div>
  )
}
