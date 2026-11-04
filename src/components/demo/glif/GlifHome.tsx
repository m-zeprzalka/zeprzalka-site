import "./glif.css"
import { getDemoHomeContent } from "@/components/demo/shared/content"
import { cn } from "@/components/demo/forma/cn"
import { glyphFont } from "./fonts"
import { Header } from "./Header"
import { About } from "./About"
import { Competencies } from "./Competencies"
import { Contact } from "./Contact"
import { Footer } from "./Footer"
import { Hero } from "./Hero"
import { Writing } from "./Writing"
import { Works } from "./Works"

/**
 * Koncepcja „Glif” (iteracja 5): glify z logo są językiem graficznym strony.
 * Strona jest czarno-biała, kolor pojawia się tylko w prawdziwej pracy —
 * realizacje i okładki dekodują się z glifów w kolor. Komponent serwerowy:
 * czyta treść i rozdaje ją wyspom klienckim.
 */
export function GlifHome() {
  const content = getDemoHomeContent()

  return (
    <div className={cn("fm gl", glyphFont.variable)}>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-2 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {content.ui.skipToContent}
      </a>
      <Header person={content.person} nav={content.nav} ui={content.ui} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero hero={content.hero} person={content.person} copied={content.ui.copied} />
        <About about={content.about} />
        <Competencies skills={content.skills} />
        <Works portfolio={content.portfolio} />
        <Writing blog={content.blog} />
        <Contact
          contact={content.contact}
          email={content.person.email}
          copied={content.ui.copied}
        />
      </main>
      <Footer person={content.person} nav={content.nav} footer={content.footer} />
    </div>
  )
}
