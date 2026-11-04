import "./esencja.css"
import { getDemoHomeContent, type DemoWork } from "../shared/content"
import { Appear } from "./Appear"
import { Blog } from "./Blog"
import { Contact } from "./Contact"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Hero } from "./Hero"
import { ROOT_ID } from "./ids"
import { Manifest } from "./Manifest"
import { Marquee, type MarqueeRow } from "./Marquee"
import { Portfolio } from "./Portfolio"
import { Reel } from "./Reel"
import { Skills } from "./Skills"
import { WorksProvider } from "./WorksProvider"

/** Odstęp między kartami pokazu względem ich wysokości (12/180 ≈ 16/280). */
const GAP_UNITS = 0.06

/** Najwyższa karta pokazu (px) i najszerszy ekran, który tor ma wypełnić bez szwu. */
const CARD_MAX = 280
const SCREEN_MAX = 2560

/**
 * Rząd pokazu: każda realizacja raz (lista dla klawiatury i czytników), a tyle
 * kopii toru, ile trzeba, żeby pętla nie miała szwu na najszerszym ekranie.
 */
function row(works: readonly DemoWork[], reverse = false): MarqueeRow {
  const units = works.reduce((sum, work) => sum + work.width / work.height + GAP_UNITS, 0)
  const copies = Math.max(2, Math.ceil(SCREEN_MAX / (units * CARD_MAX)) + 1)
  return { label: works[0]?.groupLabel ?? "", count: works.length, works, units, copies, reverse }
}

/**
 * Koncepcja „Esencja” (iteracja 5): to, co właściciel lubi najbardziej,
 * w jednym spokojnym systemie — framerowe wyostrzanie liter, kadr, który
 * rośnie przy przewijaniu, nieskończony pokaz realizacji, manifest
 * dopełniany przewijaniem, żywe kafle kompetencji i masonry. Czerń i biel;
 * kolor mają wyłącznie realizacje. Komponent serwerowy: składa treść
 * i rozdaje ją wyspom klienckim przez propsy.
 */
export function EsencjaHome() {
  const content = getDemoHomeContent()
  const { person, hero, ui, portfolio, about } = content
  const works = portfolio.works
  const byGroup = (group: DemoWork["group"]) => works.filter((work) => work.group === group)
  // Slider dla prac cyfrowych (pokaz), masonry dla treści wizualnych (wideo) — bez powtórzeń.
  const rows = [row(byGroup("produkty")), row(byGroup("web"), true)]
  const videos = byGroup("wideo")

  return (
    <div id={ROOT_ID} className="fm es">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-fm-ink px-4 py-2.5 text-sm font-medium text-fm-inverse transition-transform focus-visible:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <Header
        name={person.name}
        nav={content.nav.filter((item) => item.key !== "contact")}
        cta={{
          label: content.nav.find((item) => item.key === "contact")?.label ?? "",
          href: "#kontakt",
        }}
        email={person.email}
        labels={{
          theme: ui.themeToggle,
          open: ui.openMenu,
          close: ui.closeMenu,
          menu: "Menu",
          copied: ui.copied,
        }}
      />

      <main id="main" tabIndex={-1} className="outline-none">
        <WorksProvider
          works={works}
          groups={Object.fromEntries(
            portfolio.groups.map((group) => [group.id, group.description])
          )}
          labels={{
            close: "Zamknij podgląd",
            prev: "Poprzednia realizacja",
            next: "Następna realizacja",
            play: "Odtwórz wideo",
            pause: "Zatrzymaj wideo",
            newTab: ui.newTab,
          }}
        >
          <div id="start" data-es-section="start">
            <Hero
              hero={hero}
              person={person}
              works={{ label: portfolio.link.label, href: "#realizacje" }}
            />
            <Reel
              video={hero.video}
              labels={{
                pause: "Zatrzymaj wideo",
                play: "Odtwórz wideo",
                fallback: ui.videoFallback,
              }}
            />
            <Marquee
              rows={rows}
              labels={{ region: "Pokaz realizacji", pause: "Zatrzymaj pokaz", play: "Wznów pokaz" }}
            />
          </div>

          <Manifest about={about} />
          <Skills content={content} />
          <Portfolio portfolio={portfolio} works={videos} />
        </WorksProvider>
        <Blog blog={content.blog} />
        <Contact contact={content.contact} email={person.email} copied={ui.copied} />
      </main>
      <Footer content={content} />
      <Appear />
    </div>
  )
}
