import "./reedycja.css"
import { getDemoHomeContent } from "@/components/demo/shared/content"
import { Blog } from "./Blog"
import { Contact } from "./Contact"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { ROOT_ID } from "./ids"
import { Skills } from "./Skills"
import { Statement } from "./Statement"
import { Works } from "./Works"

/**
 * Koncepcja „Reedycja” (iteracja 5): obecna strona główna w drugim wydaniu.
 * Ta sama kolejność i treść — hero, kompetencje, portfolio, blog, kontakt —
 * i ten sam szkielet sekcji (lepka szyna z tytułem, treść obok), ale na
 * tokenach Formy, z jednym rytmem, dopracowanym pismem i spłaconym długiem
 * z `docs/KIERUNEK-WIZUALNY.md` §5. Komponent serwerowy: czyta treść
 * i rozdaje ją wyspom klienckim przez propsy.
 */
export function ReedycjaHome() {
  const content = getDemoHomeContent()
  const about = content.nav.find((link) => link.key === "about")

  return (
    <div id={ROOT_ID} className="fm re">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fm-ink px-4 py-2 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {content.ui.skipToContent}
      </a>

      <Header content={content} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero
          hero={content.hero}
          worksLabel={content.portfolio.link.label}
          videoFallback={content.ui.videoFallback}
        />
        <Statement
          about={content.about}
          person={content.person}
          aboutLink={about ?? { label: content.about.heading, href: "/o-mnie" }}
        />
        <Skills skills={content.skills} />
        <Works portfolio={content.portfolio} ui={content.ui} />
        <Blog blog={content.blog} />
        <Contact
          contact={content.contact}
          email={content.person.email}
          copiedLabel={content.ui.copied}
        />
      </main>

      <Footer content={content} />
    </div>
  )
}
