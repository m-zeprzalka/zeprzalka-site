/**
 * Metadane stron: tytuły, opisy, karty Open Graph i kanał RSS.
 *
 * Tekst z tego pliku widzi wyszukiwarka i podgląd linku w komunikatorze —
 * nigdy nie trafia do treści strony. Trzymany osobno, bo rządzi się innymi
 * regułami niż copy (limity długości, słowa kluczowe).
 */
import "server-only"
import type { Locale } from "@/i18n/config"

const pl = {
  root: {
    /** Domyślny tytuł i szablon dla podstron. */
    titleDefault: "Michał Zeprzałka — projektant i programista produktów cyfrowych",
    titleTemplate: "%s | Michał Zeprzałka",
    /** Opis serwisu: metadane układu głównego i manifest aplikacji. */
    description:
      "Strony internetowe, aplikacje webowe, design i integracje AI. 15 lat doświadczenia w tworzeniu rozwiązań webowych i multimedialnych dla biznesu.",
    ogDescription: "Strony internetowe, aplikacje webowe, design i integracje AI dla biznesu.",
    siteName: "Michał Zeprzałka",
    feedTitle: "Blog — Michał Zeprzałka",
  },
  services: {
    title: "Usługi i cennik",
    description:
      "Cennik: wdrożenia AI, produkty cyfrowe (MVP), strony firmowe, landing page w 10 dni, warsztaty AI i opieka techniczna. Ceny netto, wycena w 24 godziny.",
    ogDescription:
      "Ceny wdrożeń AI, aplikacji, stron i opieki technicznej — od sprintu diagnostycznego po abonament.",
  },
  about: {
    title: "O mnie",
    description:
      "Michał Zeprzałka — projektant i programista produktów cyfrowych z 15-letnim doświadczeniem. Strony internetowe, aplikacje, design, animacja i integracje AI.",
  },
  contact: {
    title: "Kontakt",
    description:
      "Skontaktuj się z Michałem Zeprzałką. Bezpłatna konsultacja dla nowych projektów webowych, design systemów i rozwiązań AI.",
  },
  privacy: {
    title: "Polityka prywatności",
    description:
      "Jakie dane trafiają do mnie przez formularz i serwis zeprzalka.com, w jakim celu, jak długo je przechowuję i jakie masz prawa. Bez plików cookie, bez śledzenia.",
  },
  portfolio: {
    title: "Portfolio",
    description:
      "Wszystkie realizacje: produkty cyfrowe, strony i aplikacje, projekty UX/UI oraz wideo — relacje z wydarzeń, wideo produktowe i treści na social media.",
    ogDescription:
      "Produkty cyfrowe, strony, aplikacje i wideo z 15 lat pracy dla ponad 30 klientów.",
  },
  blog: {
    title: "Blog",
    description:
      "Artykuły o AI, Next.js, web developmencie i designie. Praktyczne poradniki, lekcje kursu i przemyślenia z realnych projektów.",
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
    /**
     * Karty Open Graph: nadtytuł, tytuł, stopka. Tytuł jest też tekstem
     * alternatywnym obrazka. `{count}` i `{name}` podstawia `src/lib/og.tsx`.
     */
    cards: {
      home: {
        eyebrow: "Projektant i programista produktów cyfrowych",
        title: "Przekształcam ambitne projekty w produkty cyfrowe",
        footer: "Strony · Aplikacje · Design · AI",
      },
      portfolio: {
        eyebrow: "Portfolio",
        title: "Strony, aplikacje i materiały wideo",
        footer: "{count} · ponad 30 klientów",
      },
      services: {
        eyebrow: "Usługi i cennik",
        title: "Strony, aplikacje i wdrożenia AI — cennik",
        footer: "Wycena w 24 godziny",
      },
      about: {
        eyebrow: "O mnie",
        title: "Michał Zeprzałka",
        footer: "Projektant i programista · Warszawa",
      },
      contact: {
        eyebrow: "Kontakt",
        title: "Porozmawiajmy o Twoim projekcie",
        footer: "Odpowiedź w 24 godziny w dni robocze",
      },
      blog: {
        eyebrow: "Blog",
        title: "AI, Next.js, web development i design",
        footer: "{count}",
      },
      categories: {
        eyebrow: "Blog · Kategorie",
        title: "Artykuły według tematów",
        footer: "{count}",
      },
      category: {
        eyebrow: "Blog · Kategoria",
        title: "{name}",
        footer: "{count}",
      },
      privacy: {
        eyebrow: "Polityka prywatności",
        title: "Jak traktuję Twoje dane",
        footer: "Bez plików cookie i bez śledzenia",
      },
    },
  },
}

const en: typeof pl = {
  root: {
    titleDefault: "Michał Zeprzałka — Digital Product Designer & Developer",
    titleTemplate: "%s | Michał Zeprzałka",
    description:
      "Websites, web applications, design and AI integrations. 15 years of building web and multimedia solutions for businesses.",
    ogDescription: "Websites, web applications, design and AI integrations for business.",
    siteName: "Michał Zeprzałka",
    feedTitle: "Blog — Michał Zeprzałka",
  },
  services: {
    title: "Services and pricing",
    description:
      "Pricing: AI implementation, digital products (MVP), company websites, a landing page in 10 days, AI workshops and technical care. Net prices, quote in 24 hours.",
    ogDescription:
      "Prices for AI implementation, applications, websites and technical care — from a discovery sprint to a subscription.",
  },
  about: {
    title: "About",
    description:
      "Michał Zeprzałka — digital product designer and developer with 15 years of experience. Websites, applications, design, animation and AI integrations.",
  },
  contact: {
    title: "Contact",
    description:
      "Get in touch with Michał Zeprzałka. A free, no-obligation consultation for new web projects, design systems and AI solutions.",
  },
  privacy: {
    title: "Privacy policy",
    description:
      "What data reaches me through the contact form and zeprzalka.com, why, how long I keep it and what your rights are. No cookies and no tracking.",
  },
  portfolio: {
    title: "Portfolio",
    description:
      "Every project: digital products, websites and web applications, UX/UI work and video — event coverage, product films and social media content.",
    ogDescription:
      "Digital products, websites, applications and video from 15 years of work for more than 30 clients.",
  },
  blog: {
    title: "Blog",
    description:
      "Articles on AI, Next.js, web development and design. Practical guides, course lessons and notes from real client projects.",
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
    cards: {
      home: {
        eyebrow: "Digital Product Designer & Developer",
        title: "I turn ambitious projects into digital products",
        footer: "Websites · Apps · Design · AI",
      },
      portfolio: {
        eyebrow: "Portfolio",
        title: "Websites, applications and video",
        footer: "{count} projects · 30+ clients",
      },
      services: {
        eyebrow: "Services and pricing",
        title: "Websites, applications and AI implementation — pricing",
        footer: "A quote within 24 hours",
      },
      about: {
        eyebrow: "About",
        title: "Michał Zeprzałka",
        footer: "Product designer & developer · Warsaw",
      },
      contact: {
        eyebrow: "Contact",
        title: "Let's talk about your project",
        footer: "A reply within 24 hours on working days",
      },
      blog: {
        eyebrow: "Blog",
        title: "AI, Next.js, web development and design",
        footer: "{count}",
      },
      categories: {
        eyebrow: "Blog · Categories",
        title: "Articles by topic",
        footer: "{count}",
      },
      category: {
        eyebrow: "Blog · Category",
        title: "{name}",
        footer: "{count}",
      },
      privacy: {
        eyebrow: "Privacy policy",
        title: "How I handle your data",
        footer: "No cookies and no tracking",
      },
    },
  },
}

const meta = { pl, en } as const

export function getMeta(locale: Locale) {
  return meta[locale]
}
