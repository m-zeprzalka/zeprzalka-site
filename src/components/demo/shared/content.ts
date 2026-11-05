/**
 * Wspólny model treści propozycji strony głównej (iteracja 5) — wyłącznie to,
 * co serwis już ma (`src/i18n/content`, `src/lib`), zebrane w jednym miejscu,
 * żeby pięć koncepcji pokazywało tę samą treść i różniło się tylko formą.
 *
 * Moduł serwerowy (importuje moduły treści z `server-only`). Komponenty
 * klienckie dostają z niego gotowe dane przez propsy. Piaskownica jest tylko
 * po polsku (wyjątek z AGENTS.md), więc język jest stały.
 */
import { ROUTES, postPath } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome, homeSkills } from "@/i18n/content/home"
import { getPages } from "@/i18n/content/pages"
import { fill, formatDate, plural } from "@/i18n/format"
import { portfolioGroups, portfolioItems, type PortfolioGroup } from "@/lib/portfolio"
import { formatReadingTime, getAllPosts } from "@/lib/posts"
import { CONTACT_EMAIL, SITE_DOMAIN, SOCIAL_PROFILES } from "@/lib/site"

const LOCALE = "pl"

/** Pierwsze zdanie akapitu (do kropki zakończonej spacją albo końcem tekstu). */
const firstSentence = (text: string) => text.split(/(?<=\.)\s+/)[0] ?? text

/**
 * Wymiary plakatów (px) — znane z góry, więc siatki typu masonry rezerwują
 * miejsce bez skoku układu i bez mierzenia w przeglądarce. Czytanie plików
 * przez `fs` odpada: śledzenie plików Turbopacka wciągnęłoby całe `public/`.
 * Nowy plakat bez wpisu tutaj = błąd przy renderze (lepszy niż zła proporcja).
 */
const POSTER_SIZE: Record<string, readonly [number, number]> = {
  "/portfolio/aifeed.webp": [1200, 750],
  "/portfolio/prfct.webp": [1200, 750],
  "/portfolio/brandmaker.webp": [1200, 750],
  "/portfolio/fizjorank.webp": [1200, 750],
  "/portfolio/orlen-min.webp": [720, 466],
  "/portfolio/vinci-facilities.webp": [720, 566],
  "/portfolio/spartanie-dzieciom.webp": [720, 566],
  "/portfolio/orlen-paczka.webp": [720, 850],
  "/portfolio/ip.webp": [720, 850],
  "/portfolio/innowator-mazowsza.webp": [720, 566],
  "/portfolio/berbecki-min.webp": [720, 466],
  "/portfolio/onelook-min.webp": [720, 406],
  "/portfolio/Polish-Ukrainian-Israeli-Tech-Summit.webp": [720, 850],
  "/portfolio/White-Paintings-Black-Paintings.webp": [720, 850],
  "/portfolio/cellove.webp": [720, 850],
  "/portfolio/banana-socks-min.webp": [720, 850],
  "/portfolio/Realizacje-motoryzacyjne.webp": [720, 850],
  "/portfolio/content-sport.webp": [720, 850],
  "/portfolio/rolki-lifestyle.webp": [720, 850],
}

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Demo: brak treści — ${what}`)
  return value
}

export interface DemoWork {
  slug: string
  title: string
  /** Węższa etykieta, np. „Projekt UX/UI”, „Wideo wizerunkowe”. */
  category: string
  group: PortfolioGroup
  groupLabel: string
  /** Zapętlony klip bez dźwięku; brak = produkt pokazany samym zrzutem. */
  video?: string
  poster: string
  width: number
  height: number
  /** Jedno zdanie — na razie tylko przy własnych produktach. */
  description?: string
  /** Działający serwis (własne produkty). */
  url?: string
  /** W zajawce na obecnej stronie głównej. */
  featured: boolean
}

export interface DemoPost {
  slug: string
  title: string
  description: string
  href: string
  /** ISO `2026-11-02` — do `<time dateTime>`. */
  date: string
  /** „2 listopada 2026”. */
  dateLabel: string
  year: string
  categories: readonly string[]
  tags: readonly string[]
  /** Okładka 16:9 (zwykle 1280×720) w `public/blog/`. */
  image: string
  readingTime: string
}

export function getDemoHomeContent() {
  const common = getCommon(LOCALE)
  const home = getHome(LOCALE)
  const pages = getPages(LOCALE)
  const about = pages.about
  const [freelance, teaching] = about.experience
  if (!freelance || !teaching) throw new Error("Demo: brak doświadczenia w pages.about")

  const groupOf = (id: PortfolioGroup) =>
    need(
      portfolioGroups.find((group) => group.id === id),
      `grupa ${id}`
    )

  const works: DemoWork[] = portfolioItems.map((item) => {
    const [width, height] = need(POSTER_SIZE[item.poster], `wymiary plakatu ${item.poster}`)
    return {
      slug: item.slug,
      title: item.title[LOCALE],
      category: item.category[LOCALE],
      group: item.group,
      groupLabel: groupOf(item.group).label[LOCALE],
      video: item.video,
      poster: item.poster,
      width,
      height,
      description: item.description?.[LOCALE],
      url: item.url,
      featured: item.featured ?? false,
    }
  })

  const posts: DemoPost[] = getAllPosts(LOCALE).map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    href: postPath(LOCALE, post.slug),
    date: post.frontmatter.date,
    dateLabel: formatDate(post.frontmatter.date, LOCALE),
    year: post.frontmatter.date.slice(0, 4),
    categories: post.frontmatter.categories,
    tags: post.frontmatter.tags,
    image: post.frontmatter.image,
    readingTime: formatReadingTime(post.readingMinutes, LOCALE),
  }))

  /* Liczby wyjęte z tekstów „O mnie” — zmiana treści w serwisie zmienia je też tutaj. */
  const years = need(about.bioLeadStrong.match(/^(\d+)/)?.[1], "lata doświadczenia")
  const clients = need(freelance.description.match(/(\d+)\s+klient/)?.[1], "liczba klientów")
  const lectures = need(teaching.period.match(/(\d{4})\D+(\d{4})/), "okres wykładów")
  /** Okres wykładów do wyświetlenia: trwają nadal (zob. fakty niżej). */
  const teachingPeriod = `${lectures[1]}–obecnie`
  const score = need(about.bioSecondSuffix.match(/(\d+,\d+)%/)?.[1], "wynik ankiet")
  const aiGroup = need(
    about.skillGroups.find((group) => group.category.startsWith("AI")),
    "grupa umiejętności AI"
  )

  return {
    person: {
      name: about.name,
      role: about.role,
      location: about.location,
      locality: about.addressLocality,
      domain: SITE_DOMAIN,
      email: CONTACT_EMAIL,
      /** X pierwszy (prośba właściciela, 5.11) — w serwisie go jeszcze nie ma. */
      socials: [{ label: "X", url: "https://x.com/zeprzalka_com" }, ...SOCIAL_PROFILES],
      /** Portret w stylu ASCII (300×300 PNG) i miniatura 160×160 WebP. */
      avatar: "/avatar.png",
      avatarSmall: "/avatar-160.webp",
      cv: "/cv-michal-zeprzalka.pdf",
    },

    /** Podstrony serwisu (prawdziwe adresy) — do nagłówka, menu i stopki. */
    nav: (["services", "portfolio", "blog", "about", "contact"] as const).map((key) => ({
      key,
      label: common.nav[key],
      href: ROUTES[key][LOCALE],
    })),

    hero: {
      status: home.hero.status,
      title: home.hero.title,
      /** Podtytuł w trzech częściach — środkowa („— 15 lat ”) jest wyróżniona. */
      subtitle: {
        role: home.hero.subtitleRole,
        highlight: home.hero.subtitleHighlight,
        rest: home.hero.subtitleRest,
      },
      cta: home.hero.cta,
      /** Wideo z obecnego hero: 16:9, 1080×606 plakat, WebM + MP4. */
      video: {
        webm: "/hero_web.webm",
        mp4: "/hero_web.mp4",
        poster: "/hero-poster.webp",
        width: 1080,
        height: 606,
      },
    },

    /** Dłuższy biogram z „O mnie” (dwa akapity z wyróżnieniami) i liczby do pokazania. */
    about: {
      heading: about.aboutHeading,
      bio: [
        {
          prefix: about.bioLeadPrefix,
          strong: about.bioLeadStrong,
          suffix: about.bioLeadSuffix.trim(),
        },
        {
          prefix: about.bioSecondPrefix,
          strong: about.bioSecondStrong,
          suffix: about.bioSecondSuffix,
        },
      ],
      facts: [
        { value: Number(years), suffix: "+", label: "lat doświadczenia" },
        { value: Number(clients), suffix: "+", label: "klientów" },
        /* Wykłady trwają (od semestru 2026/27 na kolejnej uczelni) — zakres „2016–2026”
           z serwisu sugerowałby koniec. Liczba = rok początku, `since` = „od … do dziś”. */
        { value: Number(lectures[1]), since: true, label: teaching.role },
        { value: `${score}%`, label: "Nagroda Rektora — ankiety studentów" },
      ],
      experience: about.experience.map((entry) => ({
        role: entry.role,
        company: entry.company,
        period: entry === teaching ? teachingPeriod : entry.period,
        /* Przy wykładach tylko pierwsze zdanie: kolejne wymieniają uczelnie, a przy
           „2016–obecnie” czytałyby się jak obecne miejsca pracy (prośba właściciela, 5.11). */
        description: entry === teaching ? firstSentence(entry.description) : entry.description,
      })),
    },

    skills: {
      title: home.skills.title,
      lead: home.skills.lead,
      items: homeSkills.map((skill) => ({
        id: skill.id,
        number: skill.number,
        title: skill.title[LOCALE],
        description: skill.description[LOCALE],
        tools: skill.tools[LOCALE],
      })),
      /** Czwarta kompetencja, gdy koncepcja chce pokazać AI osobno (z „O mnie”). */
      ai: { title: aiGroup.category, tools: aiGroup.items },
    },

    portfolio: {
      title: home.portfolio.title,
      lead: home.portfolio.lead,
      count: plural(works.length, LOCALE, common.plurals.projects),
      groups: portfolioGroups.map((group) => ({
        id: group.id,
        label: group.label[LOCALE],
        description: group.description[LOCALE],
      })),
      /** Wszystkie 19 realizacji; `featured` = 8 z obecnej strony głównej. */
      works,
      link: { label: pages.services.quotePortfolio, href: ROUTES.portfolio[LOCALE] },
    },

    blog: {
      title: home.blog.title,
      lead: home.blog.lead,
      count: plural(posts.length, LOCALE, common.plurals.articles),
      /** Wszystkie wpisy od najnowszego; obecna strona główna pokazuje 6. */
      posts,
      link: { label: home.blog.cta, href: ROUTES.blog[LOCALE] },
    },

    contact: {
      title: home.contact.title,
      lead: home.contact.lead,
      cardTitle: home.contact.cardTitle,
      cardDescription: home.contact.cardDescription,
      response: { label: pages.contact.responseLabel, value: pages.contact.responseValue },
      form: common.form,
      errors: common.contactAction,
      privacyHref: ROUTES.privacy[LOCALE],
    },

    footer: {
      tagline: common.footer.tagline,
      description: common.footer.description,
      navigationLabel: common.footer.navigation,
      socialLabel: common.footer.social,
      copyright: fill(common.footer.copyright, { year: new Date().getFullYear() }),
    },

    ui: {
      themeToggle: common.ui.themeToggle,
      skipToContent: common.ui.skipToContent,
      videoFallback: common.ui.videoFallback,
      copied: common.ui.copied,
      newTab: common.ui.newTab,
      openMenu: common.nav.openMenu,
      closeMenu: common.nav.closeMenu,
    },
  }
}

export type DemoHomeContent = ReturnType<typeof getDemoHomeContent>
