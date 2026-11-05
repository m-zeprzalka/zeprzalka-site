import "./kinetyka.css"
import { version as nextVersion } from "next/package.json"
import { cn } from "../forma/cn"
import { getDemoHomeContent, type DemoWork } from "../shared/content"
import { About } from "./About"
import { Blog } from "./Blog"
import { Boot } from "./Boot"
import type { LogLine } from "./BuildLog"
import { Contact } from "./Contact"
import { glyphFont } from "./fonts"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { ROOT_ID } from "./ids"
import { Okno } from "./Okno"
import { Products } from "./Products"
import { ProjectionProvider, type ProjectionWork } from "./Projection"
import { Reveal } from "./Reveal"
import { Skills } from "./Skills"
import { SplitChars } from "./split"
import { Strip } from "./Strip"
import { Videos } from "./Videos"

/** Dane kadru dla wysp klienckich — tylko to, czego potrzebują (mniejszy ładunek RSC). */
function frame(work: DemoWork, note: string): ProjectionWork {
  return {
    slug: work.slug,
    title: work.title,
    category: work.category,
    note,
    poster: work.poster,
    width: work.width,
    height: work.height,
    video: work.video,
  }
}

/**
 * Koncepcja „Kinetyka” (iteracja 6): strona główna jako film zmontowany
 * z typografii. Kolejność ujęć: tytuł → okno (reel w literach) → taśma
 * stron → biogram i liczby → kompetencje → produkty → wideo → blog →
 * kontakt → napisy końcowe. Każda realizacja występuje na stronie raz.
 * Komponent serwerowy — składa treść ze wspólnego modułu i rozdaje ją
 * wyspom klienckim przez propsy.
 */
export function KinetykaHome() {
  const content = getDemoHomeContent()
  const { person, hero, ui, portfolio, about, skills, blog } = content
  const group = (id: DemoWork["group"]) => ({
    works: portfolio.works.filter((work) => work.group === id),
    meta: portfolio.groups.find((entry) => entry.id === id),
  })
  const web = group("web")
  const products = group("produkty")
  const videos = group("wideo")
  const webFrames = web.works.map((work) => frame(work, web.meta?.description ?? ""))
  const videoFrames = videos.works.map((work) => frame(work, videos.meta?.description ?? ""))
  const contactItem = content.nav.find((item) => item.key === "contact")

  const log: LogLine[] = [
    { kind: "command", text: "pnpm build" },
    {
      kind: "step",
      text: "next build",
      detail: `Next.js ${nextVersion.split(".").slice(0, 2).join(".")}`,
    },
    { kind: "route", text: "/", detail: "statyczna" },
    { kind: "route", text: "/portfolio", detail: portfolio.count },
    { kind: "route", text: "/blog/[slug]", detail: blog.count },
    { kind: "command", text: "pnpm check" },
    { kind: "step", text: "lint, format, typy", detail: "0 błędów" },
    { kind: "command", text: "vercel deploy --prod" },
    { kind: "done", text: person.domain, detail: "gotowe" },
  ]

  return (
    <div id={ROOT_ID} className={cn("fm kn", glyphFont.variable)}>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] inline-flex h-11 -translate-y-24 items-center rounded-full bg-fm-ink px-4 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <Header
        domain={person.domain}
        nav={content.nav.filter((item) => item.key !== "contact")}
        cta={{ label: contactItem?.label ?? "Kontakt", href: "#kontakt", long: hero.cta }}
        email={person.email}
        labels={{
          theme: ui.themeToggle,
          open: ui.openMenu,
          close: "Zamknij",
          menu: "Menu",
          copied: ui.copied,
          pause: "Zatrzymaj ruch",
          play: "Wznów ruch",
        }}
      />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero
          hero={hero}
          locality={person.locality}
          works={{ label: portfolio.link.label, href: "#portfolio" }}
        />

        <ProjectionProvider
          works={[...webFrames, ...videoFrames]}
          labels={{
            close: "Zamknij",
            prev: "Poprzednia realizacja",
            next: "Następna realizacja",
            of: "z",
          }}
        >
          <Okno
            video={{ webm: hero.video.webm, mp4: hero.video.mp4, poster: hero.video.poster }}
            title={portfolio.title}
            lead={portfolio.lead}
            count={portfolio.count}
            link={portfolio.link}
            labels={{ pause: "Zatrzymaj ruch", play: "Wznów ruch", fallback: ui.videoFallback }}
          />

          <section aria-labelledby="kn-web-title" className="pt-(--kn-section)">
            <div className="kn-wrap grid gap-4 md:grid-cols-12 md:items-end">
              <h2 id="kn-web-title" className="text-fm-h2 font-semibold md:col-span-6">
                {web.meta?.label}
              </h2>
              <p className="max-w-[44ch] text-fm-body text-pretty text-fm-ink-2 md:col-span-5 md:col-start-8">
                {web.meta?.description}
              </p>
            </div>
            <div className="mt-6 sm:mt-10">
              <Strip works={webFrames} label={web.meta?.label ?? ""} />
            </div>
          </section>

          <About about={about} name={person.name} />

          <Skills skills={skills} log={log} word={hero.title.split(" ")[0] ?? ""} />

          <section aria-labelledby="kn-products-title" className="kn-wrap pt-(--kn-section)">
            <div className="grid gap-6 xl:grid-cols-12 xl:items-end">
              <h2 id="kn-products-title" data-kn-in="chars" className="kn-title xl:col-span-8">
                <SplitChars text={products.meta?.label ?? ""} spread={380} />
              </h2>
              <p
                data-kn-in=""
                className="kn-lead max-w-[34ch] text-pretty text-fm-ink-2 xl:col-span-4 xl:pb-3"
              >
                {products.meta?.description}
              </p>
            </div>
            <div className="mt-12 sm:mt-16">
              <Products
                newTab={ui.newTab}
                products={products.works.map((work) => ({
                  slug: work.slug,
                  title: work.title,
                  category: work.category,
                  description: work.description ?? "",
                  url: work.url ?? portfolio.link.href,
                  poster: work.poster,
                  width: work.width,
                  height: work.height,
                }))}
              />
            </div>
          </section>

          <section aria-labelledby="kn-videos-title" className="kn-wrap pt-(--kn-section)">
            <div className="grid gap-6 xl:grid-cols-12 xl:items-end">
              <h2 id="kn-videos-title" data-kn-in="chars" className="kn-title xl:col-span-8">
                <SplitChars text={videos.meta?.label ?? ""} spread={380} />
              </h2>
              <p
                data-kn-in=""
                className="kn-lead max-w-[34ch] text-pretty text-fm-ink-2 xl:col-span-4 xl:pb-3"
              >
                {videos.meta?.description}
              </p>
            </div>
            <div className="mt-12 sm:mt-16">
              <Videos works={videoFrames} play="Wideo" />
            </div>
          </section>
        </ProjectionProvider>

        <Blog blog={blog} />
        <Contact contact={content.contact} email={person.email} copied={ui.copied} />
      </main>

      <Footer content={content} />
      <Boot />
      <Reveal />
    </div>
  )
}
