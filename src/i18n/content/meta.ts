/**
 * Metadane stron: tytuły, opisy, karty Open Graph i kanał RSS.
 *
 * Tekst z tego pliku widzi wyszukiwarka i podgląd linku w komunikatorze —
 * nigdy nie trafia do treści strony. Trzymany osobno, bo rządzi się innymi
 * regułami niż copy (limity długości, słowa kluczowe).
 */
import type { Locale } from "@/i18n/config"

const pl = {
  root: {
    /** Domyślny tytuł i szablon dla podstron. */
    titleDefault: "Michał Zeprzałka - Digital Solutions Architect",
    titleTemplate: "%s | Michał Zeprzałka",
    ogDescription:
      "Strony internetowe, aplikacje webowe, design i integracje AI dla biznesu.",
    siteName: "Michał Zeprzałka - Portfolio i Blog",
    feedTitle: "Blog - Michał Zeprzałka",
  },
  services: {
    title: "Usługi i cennik",
    description:
      "Ile kosztuje strona internetowa? Widełki cenowe dla landing page'a, strony firmowej, wdrożeń AI i opieki miesięcznej. Wycena w 24 godziny, bez zobowiązań.",
    ogTitle: "Usługi i cennik | Michał Zeprzałka",
    ogDescription:
      "Widełki cenowe dla stron, aplikacji, wdrożeń AI i opieki miesięcznej. Wycena w 24 godziny.",
  },
  about: {
    title: "O mnie",
    description:
      "Michał Zeprzałka — Digital Solutions Architect z ponad 12 latami doświadczenia. Strony internetowe, aplikacje, design, animacja i integracje AI.",
  },
  contact: {
    title: "Kontakt",
    description:
      "Skontaktuj się z Michałem Zeprzałką. Bezpłatna konsultacja dla nowych projektów webowych, design systemów i rozwiązań AI.",
  },
  portfolio: {
    title: "Portfolio",
    description:
      "Wszystkie realizacje: strony i aplikacje internetowe, projekty UX/UI oraz materiały wideo — relacje z wydarzeń, wideo produktowe i treści na social media.",
    ogTitle: "Portfolio | Michał Zeprzałka",
    ogDescription:
      "Strony, aplikacje i materiały wideo z ponad dekady pracy dla ponad 30 klientów.",
    ogAlt: "Portfolio — Michał Zeprzałka",
  },
  blog: {
    title: "Blog",
    description:
      "Artykuły o AI, Next.js, web developmencie i designie. Praktyczne poradniki i przemyślenia z realnych projektów.",
    ogTitle: "Blog | Michał Zeprzałka",
    feedDescription: "Artykuły o AI, Next.js, web developmencie i designie.",
  },
  categories: {
    title: "Kategorie",
    description: "Przeglądaj artykuły według kategorii",
  },
  /** {name} podstawia nazwę kategorii albo tagu. */
  category: {
    title: "Kategoria: {name}",
    description: "Artykuły w kategorii: {name}",
  },
  tag: {
    title: "#{name}",
    description: "Artykuły o tematyce: {name}",
  },
  og: {
    homeEyebrow: "Digital Solutions Architect",
    homeTitle: "Przekształcam ambitne projekty w produkty cyfrowe",
    homeFooter: "Strony · Aplikacje · Design · AI",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Strony, aplikacje i materiały wideo",
    /** {count} to liczba realizacji. */
    portfolioFooter: "{count} realizacji · ponad 30 klientów",
    blogFallbackEyebrow: "Blog",
  },
}

const en: typeof pl = {
  root: {
    titleDefault: "Michał Zeprzałka - Digital Solutions Architect",
    titleTemplate: "%s | Michał Zeprzałka",
    ogDescription:
      "Websites, web applications, design and AI integrations for business.",
    siteName: "Michał Zeprzałka - Portfolio and Blog",
    feedTitle: "Blog - Michał Zeprzałka",
  },
  services: {
    title: "Services and pricing",
    description:
      "What does a website cost? Price ranges for a landing page, a company website, AI deployments and monthly care. A quote within 24 hours, with nothing to sign.",
    ogTitle: "Services and pricing | Michał Zeprzałka",
    ogDescription:
      "Price ranges for websites, applications, AI deployments and monthly care. A quote within 24 hours.",
  },
  about: {
    title: "About",
    description:
      "Michał Zeprzałka — Digital Solutions Architect with over 12 years of experience. Websites, applications, design, animation and AI integrations.",
  },
  contact: {
    title: "Contact",
    description:
      "Get in touch with Michał Zeprzałka. A free consultation for new web projects, design systems and AI solutions.",
  },
  portfolio: {
    title: "Portfolio",
    description:
      "Every project: websites and web applications, UX/UI work and video — event coverage, product films and social media content.",
    ogTitle: "Portfolio | Michał Zeprzałka",
    ogDescription:
      "Websites, applications and video from over a decade of work for more than 30 clients.",
    ogAlt: "Portfolio — Michał Zeprzałka",
  },
  blog: {
    title: "Blog",
    description:
      "Articles on AI, Next.js, web development and design. Practical guides and thoughts from real projects.",
    ogTitle: "Blog | Michał Zeprzałka",
    feedDescription: "Articles on AI, Next.js, web development and design.",
  },
  categories: {
    title: "Categories",
    description: "Browse articles by category",
  },
  category: {
    title: "Category: {name}",
    description: "Articles in category: {name}",
  },
  tag: {
    title: "#{name}",
    description: "Articles tagged: {name}",
  },
  og: {
    homeEyebrow: "Digital Solutions Architect",
    homeTitle: "I turn ambitious projects into digital products",
    homeFooter: "Websites · Apps · Design · AI",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Websites, applications and video",
    portfolioFooter: "{count} projects · 30+ clients",
    blogFallbackEyebrow: "Blog",
  },
}

export const meta = { pl, en } as const

export function getMeta(locale: Locale) {
  return meta[locale]
}
