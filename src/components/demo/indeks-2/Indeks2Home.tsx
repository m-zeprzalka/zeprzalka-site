import "./indeks-2.css"
import { About } from "./About"
import { ROOT_ID } from "./anchors"
import { Contact } from "./Contact"
import { getIndeks2Content } from "./content"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { Rail } from "./Rail"
import { Skills } from "./Skills"
import { Stage } from "./Stage"
import { UI } from "./ui-strings"
import { Works } from "./Works"
import { Writing } from "./Writing"

/**
 * „Indeks · II” (iteracja 7): wąski indeks na asymetrycznej siatce
 * redakcyjnej (spis 1–2 · tekst 3–8 · margines 9–12). Margines jest pusty,
 * dopóki czegoś nie wskażesz — wtedy wychodzi tam karta z chipami narzędzi
 * i dedykowanym filmem kategorii. Na starcie margines zajmuje twarz ze
 * znaków, która staje się tym, co wskazujesz. Komponent serwerowy: czyta
 * treść i rozdaje ją wyspom klienckim.
 */
/** Mac/iOS → „⌘”, reszta → „Ctrl”, zanim cokolwiek się namaluje (bez podmiany po hydratacji). */
const PLATFORM_SCRIPT = `document.documentElement.dataset.i2Os=/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent)?"apple":"other"`

export function Indeks2Home() {
  const content = getIndeks2Content()
  const { person, ui } = content

  return (
    <div id={ROOT_ID} className="fm i2">
      <script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-3 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <Header
        surname={person.surname}
        domain={person.domain}
        homeLabel={person.name}
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
      <Rail items={content.sections} label={UI.onPage} searchLabel={UI.search} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero
          hero={content.hero}
          email={person.email}
          ui={ui}
          faceLabel={UI.faceLabel}
          chooserLabel={UI.glyphs}
        />
        <About about={content.about} labels={{ since: UI.since }} />
        <Skills skills={content.skills} proofsLabel={UI.proofs} />
        <Works
          portfolio={content.portfolio}
          labels={{ filter: UI.filter, allWorks: UI.allWorks }}
        />
        <Writing
          blog={content.blog}
          labels={{ newPost: UI.newPost, more: UI.showAll, less: UI.showLess }}
        />
        <Contact
          contact={content.contact}
          cta={content.hero.cta}
          email={person.email}
          copiedLabel={ui.copied}
        />
      </main>

      <Footer footer={content.footer} person={person} nav={content.nav} newTab={ui.newTab} />
      <Stage cards={content.cards} closeLabel={UI.close} />
    </div>
  )
}
