import "./rentgen.css"
import { getDemoHomeContent, type DemoWork } from "../shared/content"
import { Lens } from "./lens/Lens"
import { Reveal } from "./Reveal"
import { About } from "./sections/About"
import { Blog } from "./sections/Blog"
import { Contact } from "./sections/Contact"
import { Footer } from "./sections/Footer"
import { Header } from "./sections/Header"
import { Hero } from "./sections/Hero"
import { Skills } from "./sections/Skills"
import { Videos } from "./sections/Videos"
import { Works } from "./sections/Works"
import { UI } from "./ui"

/** Realizacje, które w „Kompetencjach” są dowodem — w pokazie już się nie powtarzają. */
const PROOFS = ["prfct", "brandmaker"] as const

/**
 * Koncepcja „Rentgen” (iteracja 6, inwencja studia): strona ma dwie warstwy
 * jak jej autor — zaprojektowaną i zaprogramowaną. Kursor (na telefonie
 * soczewka przeciągana kciukiem) odsłania pod sobą prawdziwy kod każdego
 * elementu w tym samym miejscu; przełącznik w nagłówku pokazuje całą stronę
 * w kodzie, a biogram „kompiluje się” przy przewijaniu. Komponent serwerowy:
 * składa treść i rozdaje ją wyspom.
 */
export function RentgenHome() {
  const content = getDemoHomeContent()
  const { portfolio, blog } = content
  const works = portfolio.works
  const find = (slug: string) => works.find((work) => work.slug === slug)
  const proofs = PROOFS.map(find).filter((work): work is DemoWork => !!work)
  const [designProof, brandProof] = proofs
  const slides = works.filter(
    (work) => work.group !== "wideo" && !PROOFS.some((slug) => slug === work.slug)
  )
  const videos = works.filter((work) => work.group === "wideo")
  const videoGroup = portfolio.groups.find((group) => group.id === "wideo")

  return (
    <div data-rg-root="" data-mode="design" className="fm rg">
      <a href="#main" className="rg-skip fm-focus">
        {content.ui.skipToContent}
      </a>
      <Header content={content} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero content={content} />
        <About about={content.about} name={content.person.name} />
        {designProof && brandProof && (
          <Skills
            skills={content.skills}
            works={[designProof, brandProof]}
            counts={{ works: portfolio.count, posts: blog.count }}
            domain={content.person.domain}
          />
        )}
        <Works portfolio={portfolio} works={slides} newTab={content.ui.newTab} />
        {videoGroup && <Videos group={videoGroup} works={videos} />}
        <Blog blog={blog} />
        <Contact
          contact={content.contact}
          email={content.person.email}
          copied={content.ui.copied}
        />
      </main>
      <Footer content={content} />
      <Lens labels={UI.lens} />
      <Reveal />
    </div>
  )
}
