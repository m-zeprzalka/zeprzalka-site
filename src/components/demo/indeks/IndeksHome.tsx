import "./indeks.css"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { Competencies } from "./Competencies"
import { ContactForm } from "./ContactForm"
import { SECTION } from "./anchors"
import { getIndeksContent } from "./content"
import { Facts } from "./Facts"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { ROOT_ID } from "./hooks"
import { Intro } from "./Intro"
import { Section } from "./Section"
import { SectionIndex } from "./SectionIndex"
import { UI } from "./ui-strings"
import { Works } from "./Works"
import { Writing } from "./Writing"

/**
 * Koncepcja „Indeks” (iteracja 3): jedna precyzyjna kolumna, w której każdy
 * wiersz jest obiektem do dotknięcia. Wrażenie robi dokładność reakcji —
 * chipy w zdaniu, lista realizacji z kartą wideo za kursorem, paleta ⌘K —
 * a nie dekoracja. Komponent serwerowy: czyta treść i rozdaje napisy.
 */
export function IndeksHome() {
  const content = getIndeksContent()
  const { sections } = content

  return (
    <div id={ROOT_ID} className="fm ix">
      <a
        href="#main"
        className="bg-fm-ink text-fm-inverse fixed top-3 left-3 z-[60] -translate-y-20 rounded-full px-4 py-2 text-sm font-medium transition-transform focus-visible:translate-y-0"
      >
        {content.skipLabel}
      </a>

      <Header
        {...content.header}
        email={content.intro.email}
        palette={content.palette}
        paletteLabels={{
          search: UI.search,
          placeholder: UI.searchPlaceholder,
          noResults: UI.noResults,
          results: UI.results,
          hintNavigate: UI.hintNavigate,
          hintOpen: UI.hintOpen,
          hintClose: UI.hintClose,
          copied: UI.copied,
        }}
      />

      <SectionIndex {...content.sectionIndex} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Intro intro={content.intro} copiedLabel={UI.copied} />
        <Facts facts={content.facts} />

        <Section id={SECTION.skills} {...sections.skills}>
          <Competencies items={content.competencies} />
        </Section>

        <Section id={SECTION.works} {...sections.works}>
          <Works
            works={content.works}
            labels={{ play: UI.play, pause: UI.pause, link: content.worksLink }}
          />
        </Section>

        <Section id={SECTION.blog} {...sections.blog}>
          <Writing
            posts={content.posts}
            link={content.blogLink}
            labels={{ newPost: UI.newPost, more: UI.showAll, less: UI.showLess }}
          />
        </Section>

        <Section id={SECTION.contact} {...sections.contact}>
          <div className="text-fm-small mb-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <CopyButton
              value={content.contact.email}
              label={content.contact.email}
              copiedLabel={UI.copied}
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
      </main>

      <Footer footer={content.footer} />
    </div>
  )
}
