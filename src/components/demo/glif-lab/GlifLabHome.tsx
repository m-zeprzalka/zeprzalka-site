import "./gll.css"
import { getDemoHomeContent } from "@/components/demo/shared/content"
import { cn } from "@/components/demo/forma/cn"
import { fontVariables } from "./fonts"
import { LabPanel } from "./lab/LabPanel"
import { About } from "./sections/About"
import { Competencies } from "./sections/Competencies"
import { Contact } from "./sections/Contact"
import { Cta } from "./sections/Cta"
import { Footer } from "./sections/Footer"
import { Header } from "./sections/Header"
import { Hero } from "./sections/Hero"
import { Works } from "./sections/Works"
import { Writing } from "./sections/Writing"

/**
 * Koncepcja „Glif · laboratorium” (iteracja 6): strona główna jako pole
 * minowe efektu z glifów. Każda sekcja to jeden podpisany wariant (A–H),
 * a pływające laboratorium przestawia go na żywo. Komponent serwerowy:
 * czyta treść i rozdaje ją wyspom klienckim.
 */
export function GlifLabHome() {
  const content = getDemoHomeContent()

  return (
    <div className={cn("fm gll", fontVariables)}>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[80] -translate-y-20 rounded-full bg-fm-ink px-4 py-2 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {content.ui.skipToContent}
      </a>
      <Header person={content.person} nav={content.nav} ui={content.ui} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero hero={content.hero} person={content.person} copied={content.ui.copied} />
        <About about={content.about} />
        <Competencies skills={content.skills} />
        <Works portfolio={content.portfolio} />
        <Cta
          hero={content.hero}
          contact={content.contact}
          email={content.person.email}
          copied={content.ui.copied}
        />
        <Writing blog={content.blog} />
        <Contact
          contact={content.contact}
          email={content.person.email}
          copied={content.ui.copied}
          copyLabel="Kopiuj adres"
        />
      </main>
      <Footer person={content.person} nav={content.nav} footer={content.footer} />
      <LabPanel />
    </div>
  )
}
