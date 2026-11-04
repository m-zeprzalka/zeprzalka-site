import "./transformacja.css"
import { Contact, Footer } from "./Closing"
import { getTransformacjaContent } from "./content"
import { Header } from "./Header"
import { Scene } from "./Scene"
import { Competencies, Facts, SectionHead, TextLink, Writing } from "./Sections"
import { Tweaks } from "./Tweaks"
import { Works } from "./Works"

/**
 * Koncepcja „Transformacja” (iteracja 5): strona wykonuje swój nagłówek.
 * Przewijanie przeprowadza hero przez szkic, projekt i kod do gotowego
 * produktu; reszta strony to ten produkt. Komponent serwerowy — klienckie
 * są tylko wyspy z interakcją (logo, menu, wideo, portfolio, formularz, tokeny).
 */
export function TransformacjaHome() {
  const content = getTransformacjaContent()
  const { portfolio } = content

  return (
    <div className="fm tf">
      <a
        href="#tf-main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-2 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {content.ui.skipToContent}
      </a>
      <Header content={content} />
      <main id="tf-main" tabIndex={-1} className="outline-none">
        <Scene
          content={content}
          hintLabel="Przewiń — szkic stanie się produktem"
          skip={{ label: "Pomiń", href: "#tf-after" }}
        />
        <Facts facts={content.about.facts} />
        <Competencies
          skills={content.skills}
          competencies={content.competencies}
          stages={content.stages}
          code={content.code.lines}
          poster={content.hero.video.poster}
        />

        <section
          id="realizacje"
          aria-labelledby="tf-works"
          className="tf-container tf-pad scroll-mt-16"
        >
          <SectionHead
            id="tf-works"
            title={portfolio.title}
            lead={portfolio.lead}
            meta={portfolio.count}
            action={<TextLink href={portfolio.link.href}>{portfolio.link.label}</TextLink>}
          />
          <Works
            works={portfolio.works}
            groups={portfolio.groups}
            labels={{
              all: "Wszystkie",
              showAll: "Pokaż wszystkie",
              filter: "Filtruj realizacje",
              open: "Podgląd",
              openSite: "Otwórz serwis",
              close: "Zamknij podgląd",
              pause: "Zatrzymaj wideo",
              play: "Odtwórz wideo",
              allWorks: portfolio.link,
            }}
          />
        </section>

        <Writing blog={content.blog} />
        <Contact
          contact={content.contact}
          email={content.person.email}
          copied={content.ui.copied}
        />
      </main>
      <Footer content={content} />
      <Tweaks />
    </div>
  )
}
