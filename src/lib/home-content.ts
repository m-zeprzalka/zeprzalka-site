import { SAME_AS, SITE_URL } from "@/lib/site"

/**
 * Jedno źródło treści dla /main-secondary.
 * Teksty są 1:1 z obecną stroną główną (src/components/home) — zmienia się
 * wyłącznie forma, nie treść ani kolejność sekcji.
 */

export { SITE_URL } from "@/lib/site"

export interface SectionMeta {
  id: string
  index: string
  title: string
  lead: string
}

export const sections = {
  hero: { id: "start", index: "00", title: "Start", lead: "" },
  skills: {
    id: "kompetencje",
    index: "01",
    title: "Kompetencje",
    lead: "Umiejętności, które pomogą w sukcesie Twojego projektu",
  },
  portfolio: {
    id: "portfolio",
    index: "02",
    title: "Portfolio",
    lead: "Wszechstronne, kompleksowe i innowacyjne realizacje",
  },
  blog: {
    id: "blog",
    index: "03",
    title: "Blog",
    lead: "Moje projekty i przemyślenia z pogranicza technologii i AI",
  },
  contact: {
    id: "kontakt",
    index: "04",
    title: "Kontakt",
    lead: "Wyślij niezobowiązującą wiadomość, aby otrzymać wycenę",
  },
} satisfies Record<string, SectionMeta>

export interface TitlePart {
  text: string
  accent?: boolean
}

export const hero = {
  status: "Gotowy do współpracy",
  title: [
    { text: "Przekształcam ambitne projekty w" },
    { text: "produkty cyfrowe.", accent: true },
  ] satisfies TitlePart[],
  /**
   * To samo zdanie, ale z jawnym łamaniem na wiersze — dla wariantów, które
   * traktują nagłówek jak skład typograficzny. Podział wypada tak, aby żaden
   * wiersz nie kończył się jednoliterowym słowem (reguła polskiej typografii).
   */
  titleLines: [
    [{ text: "Przekształcam" }],
    [{ text: "ambitne projekty" }],
    [{ text: "w " }, { text: "produkty cyfrowe.", accent: true }],
  ] satisfies TitlePart[][],
  subtitle: {
    role: "Digital Solutions Architect",
    highlight: "ponad 12+ lat",
    rest: "doświadczenia w tworzeniu innowacyjnych rozwiązań webowych i multimedialnych",
  },
  cta: { label: "Zarezerwuj Bezpłatną Konsultację", href: "/kontakt" },
  video: {
    label: "Prezentacja realizacji Michała Zeprzałki",
    poster: "/hero-poster.webp",
    aspect: "16 / 9",
    sources: [
      { src: "/hero_web.webm", type: "video/webm" },
      { src: "/hero_web.mp4", type: "video/mp4" },
    ],
    fallback: "Twoja przeglądarka nie obsługuje wideo.",
  },
}

export interface Skill {
  id: string
  number: string
  title: string
  description: string
  tools: string[]
}

export const skills: Skill[] = [
  {
    id: "projektowanie",
    number: "01",
    title: "Projektowanie Produktu",
    description:
      "Od analizy rynku i potrzeb użytkowników, przez architekturę informacji (UX), po tworzenie interaktywnych prototypów (UI). Projektuję produkty multimedialne, które użytkownicy kochają, a biznes docenia.",
    tools: [
      "User Experience (UX)",
      "User Interface (UI)",
      "Human-Centered Design",
      "AI Solutions",
    ],
  },
  {
    id: "development",
    number: "02",
    title: "Development i Technologia",
    description:
      "Wdrażam responsywne, wydajne i skalowalne serwisy internetowe. Specjalizuję się w nowoczesnym frontendzie i integracji rozwiązań AI, które automatyzują procesy i dostarczają realną wartość.",
    tools: [
      "Next.js",
      "React",
      "HTML/CSS",
      "Tailwind",
      "JavaScript",
      "TypeScript",
      "WordPress",
      "Vercel",
      "API",
      "AI Models",
    ],
  },
  {
    id: "komunikacja",
    number: "03",
    title: "Komunikacja Wizualna",
    description:
      "Tworzę spójną i angażującą komunikację – od brandingu i identyfikacji wizualnej, przez zaawansowaną grafikę cyfrową, aż po dynamiczne animacje. Dbam o to, by Twoja marka opowiadała historię i wyróżniała się na rynku.",
    tools: [
      "Adobe Photoshop",
      "After Effects",
      "Premiere Pro",
      "Blender",
      "Figma",
    ],
  },
]

export interface PortfolioItem {
  id: string
  title: string
  category: string
  src: string
  poster: string
  /** Natywne proporcje pliku — rezerwują miejsce przed załadowaniem (CLS = 0). */
  aspect: string
}

const poster = (name: string) => `/portfolio/${name}.webp`

export const portfolio: PortfolioItem[] = [
  { id: "orlen-min", title: "Orlen Mistrzowie Podwórek", category: "UX/UI Design", src: "/orlen-min.mp4", poster: poster("orlen-min"), aspect: "771 / 500" },
  { id: "vinci-facilities", title: "Vinci Facilities", category: "Design & Deployment", src: "/vinci-facilities.mp4", poster: poster("vinci-facilities"), aspect: "159 / 125" },
  { id: "spartanie-dzieciom", title: "Spartanie Dzieciom", category: "Design & Deployment", src: "/spartanie-dzieciom.mp4", poster: poster("spartanie-dzieciom"), aspect: "159 / 125" },
  { id: "orlen-paczka", title: "Orlen Paczka", category: "UX/UI Design", src: "/orlen-paczka.mp4", poster: poster("orlen-paczka"), aspect: "106 / 125" },
  { id: "ip", title: "Inteligentna Polska", category: "Design & Deployment", src: "/ip.mp4", poster: poster("ip"), aspect: "106 / 125" },
  { id: "innowator-mazowsza", title: "Innowator Mazowsza", category: "Design & Deployment", src: "/innowator-mazowsza.mp4", poster: poster("innowator-mazowsza"), aspect: "159 / 125" },
  { id: "berbecki-min", title: "Klinika Berbecki", category: "Design & Deployment", src: "/berbecki-min.mp4", poster: poster("berbecki-min"), aspect: "771 / 500" },
  { id: "onelook-min", title: "Onelook", category: "Design & Deployment", src: "/onelook-min.mp4", poster: poster("onelook-min"), aspect: "243 / 137" },
]

export const blog = {
  cta: { label: "Wszystkie artykuły", href: "/blog" },
  postsLimit: 6,
}

export const contact = {
  title: [
    { text: "Opowiedz o swoim" },
    { text: "projekcie", accent: true },
  ] satisfies TitlePart[],
  description:
    "Wypełnij formularz, im bardziej szczegółowy opis, tym bardziej precyzyjną wycenę otrzymasz.",
  form: {
    name: { label: "Imię", placeholder: "Twoje imię" },
    email: { label: "Email", placeholder: "twoj@email.pl" },
    projectType: {
      label: "Rodzaj projektu",
      placeholder: "Strona internetowa / Animacja / Grafika...",
    },
    message: {
      label: "Wiadomość",
      placeholder:
        "Opisz swój projekt lub pytanie. Im więcej szczegółów, tym lepiej...",
    },
    honeypot: "Nie wypełniaj tego pola",
    submit: "Wyślij wiadomość",
    submitting: "Wysyłanie...",
    errorTitle: "Nie udało się wysłać wiadomości",
  },
}

export const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Michał Zeprzałka - Digital Solutions Architect",
    url: SITE_URL,
    inLanguage: "pl-PL",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michał Zeprzałka",
    jobTitle: "Digital Solutions Architect",
    url: SITE_URL,
    image: `${SITE_URL}/avatar.png`,
    sameAs: SAME_AS,
  },
]
