/**
 * Oferta i widełki cenowe.
 *
 * Wartości pochodzą z rekomendacji w docs/MONETYZACJA.md („cena orientacyjna").
 * Trzymane w jednym miejscu, bo to dane biznesowe, nie treść strony —
 * korekta stawki ma być zmianą jednej liczby, nie przeglądaniem JSX-a.
 *
 * Kwoty i identyfikatory są wspólne dla obu wersji językowych; opisy
 * to pary `{ pl, en }`, więc pakiet nie może istnieć tylko po polsku.
 */
import type { Locale, Localized } from "@/i18n/config"

export interface ServicePackage {
  id: string
  name: Localized<string>
  scope: Localized<string>
  /** Kwota w złotych, prezentowana zawsze jako „od". */
  from: number
  /** Jednostka rozliczenia, jeśli inna niż projekt. */
  unit?: Localized<string>
  items: Localized<readonly string[]>
  /** Wyróżniony pakiet — powtarzalny przychód. */
  highlight?: boolean
}

export const packages: ServicePackage[] = [
  {
    id: "landing",
    name: { pl: "Landing page", en: "Landing page" },
    scope: {
      pl: "Jedna strona, która ma sprzedawać",
      en: "One page whose job is to sell",
    },
    from: 2500,
    items: {
      pl: [
        "Projekt graficzny dopasowany do marki",
        "Wdrożenie na Next.js, gotowe na urządzenia mobilne",
        "Podstawowe SEO i formularz kontaktowy",
        "Publikacja i konfiguracja domeny",
      ],
      en: [
        "Visual design matched to your brand",
        "Built on Next.js, mobile-ready from day one",
        "Baseline SEO and a contact form",
        "Launch and domain configuration",
      ],
    },
  },
  {
    id: "firmowa",
    name: { pl: "Strona firmowa", en: "Company website" },
    scope: {
      pl: "4–8 podstron z blogiem i analityką",
      en: "4–8 pages with a blog and analytics",
    },
    from: 5000,
    items: {
      pl: [
        "Architektura informacji i projekt wszystkich podstron",
        "System treści (CMS lub blog w plikach)",
        "Analityka i mapa strony pod wyszukiwarki",
        "Szkolenie z samodzielnej edycji treści",
      ],
      en: [
        "Information architecture and design of every page",
        "Content system (a CMS or a file-based blog)",
        "Analytics and a sitemap built for search engines",
        "Training so you can edit the content yourself",
      ],
    },
  },
  {
    id: "ai",
    name: { pl: "Strona z AI", en: "Website with AI" },
    scope: {
      pl: "Strona firmowa plus automatyzacja",
      en: "The company website plus automation",
    },
    from: 8000,
    items: {
      pl: [
        "Wszystko z pakietu Strona firmowa",
        "Integracja modelu językowego (chat, wyszukiwarka, generowanie treści)",
        "Automatyzacja powtarzalnego procesu w firmie",
        "Dokumentacja wdrożenia",
      ],
      en: [
        "Everything in the Company website package",
        "Language-model integration (chat, search, content generation)",
        "Automation of one repetitive process in your company",
        "Deployment documentation",
      ],
    },
  },
  {
    id: "grafika",
    name: { pl: "Grafika, wideo, animacja", en: "Graphics, video, motion" },
    scope: {
      pl: "Materiały do kampanii i social mediów",
      en: "Assets for campaigns and social media",
    },
    from: 1500,
    items: {
      pl: [
        "Identyfikacja wizualna i materiały graficzne",
        "Montaż wideo i animacje",
        "Zestawy pod social media",
      ],
      en: [
        "Visual identity and graphic assets",
        "Video editing and motion design",
        "Asset sets sized for social media",
      ],
    },
  },
  {
    id: "opieka",
    name: { pl: "Opieka miesięczna", en: "Monthly care" },
    scope: { pl: "Strona pod stałą ręką", en: "Your site in steady hands" },
    from: 300,
    unit: { pl: "miesiąc", en: "month" },
    highlight: true,
    items: {
      pl: [
        "Hosting, aktualizacje i kopie zapasowe",
        "Monitoring dostępności i wydajności",
        "Drobne zmiany w treści bez osobnej wyceny",
        "Priorytet przy zgłoszeniach",
      ],
      en: [
        "Hosting, updates and backups",
        "Uptime and performance monitoring",
        "Small content changes without a separate quote",
        "Priority on support requests",
      ],
    },
  },
]

/** Kroki współpracy — te same, które opisuje strona kontaktu. */
export const process: {
  title: Localized<string>
  detail: Localized<string>
}[] = [
  {
    title: {
      pl: "Piszesz, czego potrzebujesz",
      en: "You write what you need",
    },
    detail: {
      pl: "Formularz albo e-mail. Im więcej szczegółów, tym precyzyjniejsza wycena. Odpowiadam do 24 godzin w dni robocze.",
      en: "The form or an email. The more detail, the more precise the quote. I reply within 24 hours on working days.",
    },
  },
  {
    title: {
      pl: "Rozmawiamy bez zobowiązań",
      en: "We talk, with nothing to sign",
    },
    detail: {
      pl: "Krótka rozmowa o celu, zakresie i terminie. Podpowiadam, co warto zrobić inaczej — także gdy to oznacza mniejszy zakres.",
      en: "A short conversation about the goal, the scope and the deadline. I say what is worth doing differently — including when that means a smaller scope.",
    },
  },
  {
    title: { pl: "Dostajesz ofertę z ceną", en: "You get an offer with a price" },
    detail: {
      pl: "Konkretny zakres, termin i kwota. Bez ukrytych kosztów i bez abonamentów, których nie zamawiałeś.",
      en: "A definite scope, date and figure. No hidden costs and no subscriptions you never ordered.",
    },
  },
]

/**
 * Kwota z separatorem tysięcy właściwym dla języka: `2 500` po polsku,
 * `2,500` po angielsku.
 */
export const formatPrice = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "pl" ? "pl-PL" : "en-GB").format(value)
