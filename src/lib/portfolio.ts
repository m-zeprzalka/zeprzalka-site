/**
 * Jedno miejsce z realizacjami.
 *
 * Lista mieszkała wcześniej w `components/home/Gallery.tsx`. Strona `/portfolio`
 * pokazuje ten sam materiał w komplecie, więc dane musiały wyjść z komponentu —
 * inaczej dwie kopie tej samej listy rozjeżdżają się przy pierwszej zmianie.
 *
 * Sekcja Portfolio na stronie głównej to zajawka: bierze wyłącznie pozycje
 * oznaczone `featured` i zachowuje ich kolejność.
 *
 * Teksty są parami `{ pl, en }` — pola techniczne (plik wideo, poster, grupa)
 * są niezależne od języka, więc występują raz.
 */
import "server-only"
import type { Localized } from "@/i18n/config"

/** Dyscypliny, które trudno oceniać tą samą miarą — stąd osobne sekcje. */
export type PortfolioGroup = "produkty" | "web" | "wideo"

export interface PortfolioItem {
  /** Klucz listy; równy nazwie pliku, żeby łatwo skojarzyć zasób z wpisem. */
  slug: string
  title: Localized<string>
  /** Etykieta na kaflu — węższa niż grupa, ta sama co na stronie głównej. */
  category: Localized<string>
  group: PortfolioGroup
  /** Zapętlony kadr; bez niego kafel pokazuje sam plakat (zrzut serwisu). */
  video?: string
  poster: string
  /** Krótki opis (jedno zdanie) — na razie tylko przy produktach z działającym adresem. */
  description?: Localized<string>
  /** Działający serwis — kafel prowadzi do niego. */
  url?: string
  /** Widoczne w zajawce na stronie głównej. */
  featured?: boolean
}

export const portfolioGroups: {
  id: PortfolioGroup
  label: Localized<string>
  description: Localized<string>
}[] = [
  {
    id: "produkty",
    label: { pl: "Produkty cyfrowe", en: "Digital products" },
    description: {
      pl: "Serwisy i aplikacje, które projektuję i rozwijam — od pomysłu, przez interfejs, po wdrożenie.",
      en: "Websites and applications I design and build — from the idea, through the interface, to production.",
    },
  },
  {
    id: "web",
    label: { pl: "Strony i aplikacje", en: "Websites and applications" },
    description: {
      pl: "Projekt interfejsu i wdrożenie — od pierwszej makiety po działający serwis.",
      en: "Interface design and delivery — from the first wireframe to a site that is live.",
    },
  },
  {
    id: "wideo",
    label: { pl: "Wideo i animacja", en: "Video and motion" },
    description: {
      pl: "Zdjęcia, montaż i postprodukcja: relacje z wydarzeń, materiały produktowe i treści na social media.",
      en: "Shooting, editing and post-production: event coverage, product films and social media content.",
    },
  },
]

/** Etykiety kategorii — powtarzają się na kilku kaflach, stąd stałe. */
const UX_UI: Localized<string> = { pl: "Projekt UX/UI", en: "UX/UI design" }
const DESIGN_DEPLOY: Localized<string> = {
  pl: "Projekt i wdrożenie",
  en: "Design & deployment",
}
const EVENT: Localized<string> = {
  pl: "Relacja z wydarzenia",
  en: "Event coverage",
}
const BRAND_VIDEO: Localized<string> = {
  pl: "Wideo wizerunkowe",
  en: "Brand video",
}
const PRODUCT_VIDEO: Localized<string> = {
  pl: "Wideo produktowe",
  en: "Product video",
}
const SOCIAL: Localized<string> = {
  pl: "Content social media",
  en: "Social media content",
}

export const portfolioItems: PortfolioItem[] = [
  // — Produkty cyfrowe (zrzuty z działających serwisów, 4.11.2026) ———————————————
  {
    slug: "aifeed",
    title: { pl: "aifeed.pl", en: "aifeed.pl" },
    category: { pl: "Produkt AI", en: "AI product" },
    group: "produkty",
    poster: "/portfolio/aifeed.webp",
    url: "https://www.aifeed.pl",
    description: {
      pl: "Serwis, który agreguje, tworzy i udostępnia wiadomości o AI, badaniach i raportach po polsku.",
      en: "A website that aggregates, writes and publishes AI news, research and reports in Polish.",
    },
  },
  {
    slug: "prfct",
    title: { pl: "prfct.dev", en: "prfct.dev" },
    category: { pl: "Design system", en: "Design system" },
    group: "produkty",
    poster: "/portfolio/prfct.webp",
    url: "https://www.prfct.dev",
    description: {
      pl: "Otwarty design system dla Reacta: tokeny z kontrastem liczonym przy buildzie, dostępne komponenty i dokumentacja.",
      en: "An open-source design system for React: build-time contrast-safe tokens, accessible components and documentation.",
    },
  },
  {
    slug: "brandmaker",
    title: { pl: "BrandMaker", en: "BrandMaker" },
    category: { pl: "SaaS z AI", en: "AI SaaS" },
    group: "produkty",
    poster: "/portfolio/brandmaker.webp",
    url: "https://brandmaker-landing.vercel.app",
    description: {
      pl: "Cyfrowa agencja brandingowa oparta na AI: logo, brandbook i identyfikacja wizualna w kilka minut.",
      en: "An AI-powered digital branding agency: a logo, a brand book and a visual identity in minutes.",
    },
  },
  {
    slug: "fizjorank",
    title: { pl: "FizjoRank", en: "FizjoRank" },
    category: { pl: "Serwis rankingowy", en: "Rankings website" },
    group: "produkty",
    poster: "/portfolio/fizjorank.webp",
    url: "https://fizjorank.pl",
    description: {
      pl: "Ranking ośrodków rehabilitacji dziecięcej: porównanie placówek i metod terapii.",
      en: "A ranking of children’s rehabilitation centres: compare facilities and therapy methods.",
    },
  },
  // — Strony i aplikacje ————————————————————————————————————————————————
  {
    slug: "orlen-min",
    title: {
      pl: "Orlen Mistrzowie Podwórek",
      en: "Orlen Mistrzowie Podwórek",
    },
    category: UX_UI,
    group: "web",
    video: "/orlen-min.mp4",
    poster: "/portfolio/orlen-min.webp",
    featured: true,
  },
  {
    slug: "vinci-facilities",
    title: { pl: "Vinci Facilities", en: "Vinci Facilities" },
    category: DESIGN_DEPLOY,
    group: "web",
    video: "/vinci-facilities.mp4",
    poster: "/portfolio/vinci-facilities.webp",
    featured: true,
  },
  {
    slug: "spartanie-dzieciom",
    title: { pl: "Spartanie Dzieciom", en: "Spartanie Dzieciom" },
    category: DESIGN_DEPLOY,
    group: "web",
    video: "/spartanie-dzieciom.mp4",
    poster: "/portfolio/spartanie-dzieciom.webp",
    featured: true,
  },
  {
    slug: "orlen-paczka",
    title: { pl: "Orlen Paczka", en: "Orlen Paczka" },
    category: UX_UI,
    group: "web",
    video: "/orlen-paczka.mp4",
    poster: "/portfolio/orlen-paczka.webp",
    featured: true,
  },
  {
    slug: "ip",
    title: { pl: "Inteligentna Polska", en: "Inteligentna Polska" },
    category: DESIGN_DEPLOY,
    group: "web",
    video: "/ip.mp4",
    poster: "/portfolio/ip.webp",
    featured: true,
  },
  {
    slug: "innowator-mazowsza",
    title: { pl: "Innowator Mazowsza", en: "Innowator Mazowsza" },
    category: DESIGN_DEPLOY,
    group: "web",
    video: "/innowator-mazowsza.mp4",
    poster: "/portfolio/innowator-mazowsza.webp",
    featured: true,
  },
  {
    slug: "berbecki-min",
    title: { pl: "Klinika Berbecki", en: "Berbecki Clinic" },
    category: DESIGN_DEPLOY,
    group: "web",
    video: "/berbecki-min.mp4",
    poster: "/portfolio/berbecki-min.webp",
    featured: true,
  },
  {
    slug: "onelook-min",
    title: { pl: "Onelook", en: "Onelook" },
    category: DESIGN_DEPLOY,
    group: "web",
    video: "/onelook-min.mp4",
    poster: "/portfolio/onelook-min.webp",
    featured: true,
  },

  // — Wideo i animacja ——————————————————————————————————————————————————
  // Materiały leżały w `public/` nieużywane. Tytuły pochodzą z nazw plików,
  // kategorie z obejrzenia materiału — jedno i drugie warto potwierdzić.
  {
    slug: "polish-ukrainian-israeli-tech-summit",
    title: {
      pl: "Polish-Ukrainian-Israeli Tech Summit",
      en: "Polish-Ukrainian-Israeli Tech Summit",
    },
    category: EVENT,
    group: "wideo",
    video: "/Polish-Ukrainian-Israeli-Tech-Summit.mp4",
    poster: "/portfolio/Polish-Ukrainian-Israeli-Tech-Summit.webp",
  },
  {
    slug: "white-paintings-black-paintings",
    title: {
      pl: "White Paintings / Black Paintings",
      en: "White Paintings / Black Paintings",
    },
    category: BRAND_VIDEO,
    group: "wideo",
    video: "/White-Paintings-Black-Paintings.mp4",
    poster: "/portfolio/White-Paintings-Black-Paintings.webp",
  },
  {
    slug: "cellove",
    title: { pl: "Cellove", en: "Cellove" },
    category: BRAND_VIDEO,
    group: "wideo",
    video: "/cellove.mp4",
    poster: "/portfolio/cellove.webp",
  },
  {
    slug: "banana-socks",
    title: { pl: "Banana Socks", en: "Banana Socks" },
    category: PRODUCT_VIDEO,
    group: "wideo",
    video: "/banana-socks-min.mp4",
    poster: "/portfolio/banana-socks-min.webp",
  },
  {
    slug: "realizacje-motoryzacyjne",
    title: { pl: "Realizacje motoryzacyjne", en: "Automotive productions" },
    category: PRODUCT_VIDEO,
    group: "wideo",
    video: "/Realizacje-motoryzacyjne.mp4",
    poster: "/portfolio/Realizacje-motoryzacyjne.webp",
  },
  {
    slug: "content-sport",
    title: { pl: "Content sportowy", en: "Sports content" },
    category: SOCIAL,
    group: "wideo",
    video: "/content-sport.mp4",
    poster: "/portfolio/content-sport.webp",
  },
  {
    slug: "rolki-lifestyle",
    title: { pl: "Rolki lifestyle", en: "Lifestyle reels" },
    category: SOCIAL,
    group: "wideo",
    video: "/rolki-lifestyle.mp4",
    poster: "/portfolio/rolki-lifestyle.webp",
  },
]

/** Zajawka na stronie głównej — w kolejności z listy powyżej. */
export const featuredPortfolioItems = portfolioItems.filter((item) => item.featured)

export function getPortfolioByGroup(group: PortfolioGroup): PortfolioItem[] {
  return portfolioItems.filter((item) => item.group === group)
}
