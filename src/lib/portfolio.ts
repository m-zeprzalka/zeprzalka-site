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
import type { Locale, Localized } from "@/i18n/config"

/** Dwie dyscypliny, które trudno oceniać tą samą miarą — stąd osobne sekcje. */
export type PortfolioGroup = "web" | "wideo"

export interface PortfolioItem {
  /** Klucz listy; równy nazwie pliku, żeby łatwo skojarzyć zasób z wpisem. */
  slug: string
  title: Localized<string>
  /** Etykieta na kaflu — węższa niż grupa, ta sama co na stronie głównej. */
  category: Localized<string>
  group: PortfolioGroup
  video: string
  poster: string
  /** Widoczne w zajawce na stronie głównej. */
  featured?: boolean
}

export const portfolioGroups: {
  id: PortfolioGroup
  label: Localized<string>
  description: Localized<string>
}[] = [
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
const UX_UI: Localized<string> = { pl: "UX/UI Design", en: "UX/UI Design" }
const DESIGN_DEPLOY: Localized<string> = {
  pl: "Design & Deployment",
  en: "Design & Deployment",
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
    title: { pl: "Rolki lifestyle", en: "Rollerblading lifestyle" },
    category: SOCIAL,
    group: "wideo",
    video: "/rolki-lifestyle.mp4",
    poster: "/portfolio/rolki-lifestyle.webp",
  },
]

/** Zajawka na stronie głównej — w kolejności z listy powyżej. */
export const featuredPortfolioItems = portfolioItems.filter(
  (item) => item.featured
)

export function getPortfolioByGroup(group: PortfolioGroup): PortfolioItem[] {
  return portfolioItems.filter((item) => item.group === group)
}

/**
 * Liczebnik przy nazwie sekcji. Polski ma trzy formy, więc `${n} realizacji`
 * byłoby błędem przy dwóch, trzech i czterech pozycjach; angielski ma dwie.
 */
export function countRealizations(count: number, locale: Locale): string {
  if (locale === "en") return count === 1 ? "1 project" : `${count} projects`

  const rest10 = count % 10
  const rest100 = count % 100

  if (count === 1) return "1 realizacja"
  if (rest10 >= 2 && rest10 <= 4 && (rest100 < 12 || rest100 > 14)) {
    return `${count} realizacje`
  }
  return `${count} realizacji`
}
