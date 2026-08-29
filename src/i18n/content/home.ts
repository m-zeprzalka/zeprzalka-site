/**
 * Treść strony głównej. Polskie napisy są przeniesione z komponentów
 * `src/components/home/*` co do znaku — układ i wygląd strony nie zmieniają
 * się ani o piksel, zmienia się tylko miejsce, z którego bierze się tekst.
 */
import type { Locale, Localized } from "@/i18n/config"

const pl = {
  hero: {
    status: "Gotowy do współpracy",
    title: "Przekształcam ambitne projekty w produkty cyfrowe.",
    /** Zdanie złożone z trzech części — środkowa jest wyróżniona krojem. */
    subtitleRole: "Digital Solutions Architect",
    subtitleHighlight: " - ponad 12+ lat ",
    subtitleRest:
      "doświadczenia w tworzeniu innowacyjnych rozwiązań webowych i multimedialnych",
    cta: "Zarezerwuj Bezpłatną Konsultację",
    videoLabel: "Prezentacja realizacji Michała Zeprzałki",
  },
  skills: {
    title: "Kompetencje",
    lead: "Umiejętności, które pomogą w sukcesie Twojego projektu",
  },
  portfolio: {
    title: "Portfolio",
    lead: "Wszechstronne, kompleksowe i innowacyjne realizacje",
  },
  blog: {
    title: "Blog",
    lead: "Moje projekty i przemyślenia z pogranicza technologii i AI",
    cta: "Wszystkie artykuły",
  },
  contact: {
    title: "Kontakt",
    lead: "Wyślij niezobowiązującą wiadomość, aby otrzymać wycenę",
    cardTitle: "Opowiedz o swoim projekcie",
    cardDescription:
      "Wypełnij formularz, im bardziej szczegółowy opis, tym bardziej precyzyjną wycenę otrzymasz.",
  },
  /** Etykieta sekcji „Start" w wariantach z nawigacją po sekcjach. */
  sectionStart: "Start",
}

const en: typeof pl = {
  hero: {
    status: "Available for new projects",
    title: "I turn ambitious projects into digital products.",
    subtitleRole: "Digital Solutions Architect",
    subtitleHighlight: " - over 12 years ",
    subtitleRest:
      "of experience building innovative web and multimedia solutions",
    cta: "Book a Free Consultation",
    videoLabel: "Showreel of work by Michał Zeprzałka",
  },
  skills: {
    title: "Capabilities",
    lead: "The skills that will carry your project to a result",
  },
  portfolio: {
    title: "Portfolio",
    lead: "Versatile, end-to-end and inventive work",
  },
  blog: {
    title: "Blog",
    lead: "My projects and thoughts from where technology meets AI",
    cta: "All articles",
  },
  contact: {
    title: "Contact",
    lead: "Send a no-obligation message and get a quote",
    cardTitle: "Tell me about your project",
    cardDescription:
      "Fill in the form — the more detailed the description, the more precise the quote you will get.",
  },
  sectionStart: "Start",
}

export const home = { pl, en } as const

export function getHome(locale: Locale) {
  return home[locale]
}

/**
 * Trzy kompetencje z akordeonu. `id` i `number` są niezależne od języka —
 * `id` trafia do atrybutów Radiksa, więc musi zostać dokładnie taki, jaki był.
 */
export interface HomeSkill {
  id: string
  /** Klucz semantyczny — używany przez warianty strony głównej. */
  key: string
  number: string
  title: Localized<string>
  description: Localized<string>
  tools: Localized<readonly string[]>
}

export const homeSkills: readonly HomeSkill[] = [
  {
    id: "item-1",
    key: "projektowanie",
    number: "01",
    title: { pl: "Projektowanie Produktu", en: "Product Design" },
    description: {
      pl: "Od analizy rynku i potrzeb użytkowników, przez architekturę informacji (UX), po tworzenie interaktywnych prototypów (UI). Projektuję produkty multimedialne, które użytkownicy kochają, a biznes docenia.",
      en: "From market and user research, through information architecture (UX), to interactive prototypes (UI). I design multimedia products that users love and the business values.",
    },
    tools: {
      pl: [
        "User Experience (UX)",
        "User Interface (UI)",
        "Human-Centered Design",
        "AI Solutions",
      ],
      en: [
        "User Experience (UX)",
        "User Interface (UI)",
        "Human-Centered Design",
        "AI Solutions",
      ],
    },
  },
  {
    id: "item-2",
    key: "development",
    number: "02",
    title: { pl: "Development i Technologia", en: "Development & Technology" },
    description: {
      pl: "Wdrażam responsywne, wydajne i skalowalne serwisy internetowe. Specjalizuję się w nowoczesnym frontendzie i integracji rozwiązań AI, które automatyzują procesy i dostarczają realną wartość.",
      en: "I ship responsive, fast and scalable websites. I specialise in modern frontend work and in AI integrations that automate processes and deliver measurable value.",
    },
    tools: {
      pl: [
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
      en: [
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
  },
  {
    id: "item-3",
    key: "komunikacja",
    number: "03",
    title: { pl: "Komunikacja Wizualna", en: "Visual Communication" },
    description: {
      pl: "Tworzę spójną i angażującą komunikację – od brandingu i identyfikacji wizualnej, przez zaawansowaną grafikę cyfrową, aż po dynamiczne animacje. Dbam o to, by Twoja marka opowiadała historię i wyróżniała się na rynku.",
      en: "I create consistent, engaging communication – from branding and visual identity, through advanced digital graphics, to dynamic motion design. I make sure your brand tells a story and stands out on its market.",
    },
    tools: {
      pl: [
        "Adobe Photoshop",
        "After Effects",
        "Premiere Pro",
        "Blender",
        "Figma",
      ],
      en: [
        "Adobe Photoshop",
        "After Effects",
        "Premiere Pro",
        "Blender",
        "Figma",
      ],
    },
  },
]
