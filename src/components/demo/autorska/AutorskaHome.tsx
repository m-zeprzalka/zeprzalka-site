import "./autorska.css"
import { getDemoHomeContent } from "../shared/content"
import { About } from "./About"
import { Footer, Header } from "./Chrome"
import { Hero } from "./Hero"
import type { Layer } from "./Layers"
import { Contact, Portfolio, Writing } from "./Sections"
import { Skills, skillAnchor, skillLayers } from "./Skills"
import { StackProvider } from "./StackProvider"

/**
 * Skrypt przed pierwszym malowaniem: (1) platforma — skrót ⌘/Ctrl bez podmiany po hydratacji;
 * (2) blok startu czeka niewidoczny (najwyżej 900 ms) na Geist — krój zastępczy łamał H1 w pięć
 * linii zamiast trzech i dolnie wyrównany blok skakał przy podmianie (CLS 0,17 na desktopie).
 * `visibility`, nie `opacity` — niewidoczne pudełko nie liczy się do przesunięć układu.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.dataset.auOs=/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent)?"mac":"other";if(!document.fonts||!document.fonts.load)return;d.dataset.auFont="wait";var done=function(){d.dataset.auFont="ok"};document.fonts.load('600 1em Geist').then(done,done);setTimeout(done,900)})()`

/**
 * „Warstwy” (iteracja 7, wersja autorska): strona jak plik warstw projektanta. Każdy rozdział
 * to obła karta przyklejana pod nagłówkiem; następna nasuwa się i cofa poprzednią w głąb.
 * Kod ze znaków (wspólny silnik) jest materiałem warstw: szkielet kadru, twarz, bryły
 * kompetencji, pole kodu w kontakcie, napis w stopce. Treść wyłącznie z `shared/content.ts`.
 */
export function AutorskaHome() {
  const c = getDemoHomeContent()
  const skills = skillLayers(c.skills)

  // Kolejność kart w stosie — indeksy osi widoku (`--au-v0…`) i podświetlenia w panelu warstw.
  const SKILLS_AT = 2
  const PORTFOLIO_AT = SKILLS_AT + skills.length
  const layers: Layer[] = [
    { id: "start", label: "Start", sheet: 0 },
    { id: "o-mnie", label: c.about.heading, sheet: 1 },
    { id: "kompetencje", label: c.skills.title, sheet: SKILLS_AT },
    ...skills.map((skill, index) => ({
      id: skillAnchor(skill.key, index),
      label: skill.title,
      sheet: SKILLS_AT + index,
      child: true,
    })),
    { id: "portfolio", label: c.portfolio.title, sheet: PORTFOLIO_AT },
    { id: "blog", label: c.blog.title, sheet: PORTFOLIO_AT + 1 },
    { id: "kontakt", label: c.contact.title, sheet: PORTFOLIO_AT + 2 },
  ]

  return (
    <div className="fm au min-h-svh text-fm-ink">
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] -translate-y-20 rounded-full bg-fm-ink px-4 py-3 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {c.ui.skipToContent}
      </a>
      <StackProvider>
        <Header
          domain={c.person.domain}
          email={c.person.email}
          layers={layers}
          themeLabel={c.ui.themeToggle}
          copiedLabel={c.ui.copied}
        />
        <main id="main" className="au-main au-stack pt-(--au-t) pb-(--au-m)">
          <Hero hero={c.hero} email={c.person.email} copiedLabel={c.ui.copied} />
          <About about={c.about} index={1} />
          <Skills skills={c.skills} start={SKILLS_AT} />
          <Portfolio portfolio={c.portfolio} index={PORTFOLIO_AT} />
          <Writing blog={c.blog} index={PORTFOLIO_AT + 1} />
          <Contact
            contact={c.contact}
            cta={c.hero.cta}
            email={c.person.email}
            copiedLabel={c.ui.copied}
            index={PORTFOLIO_AT + 2}
          />
        </main>
      </StackProvider>
      <Footer footer={c.footer} person={c.person} nav={c.nav} />
      <div id="au-portal" />
    </div>
  )
}
