/**
 * Oferta i ceny — dane biznesowe w jednym miejscu (korekta stawki to zmiana
 * jednej liczby). Kwoty i identyfikatory są wspólne dla obu wersji językowych;
 * opisy to pary `{ pl, en }`, więc pakiet nie może istnieć tylko po polsku.
 *
 * Poziom cen: stawki rynkowe dla niezależnego seniora (listopad 2026) —
 * kolejność od najcenniejszego projektu do opieki, wejście przez sprint
 * diagnostyczny, którego koszt odliczam od projektu.
 */
import "server-only"
import type { Localized } from "@/i18n/config"

export interface ServicePackage {
  id: string
  name: Localized<string>
  scope: Localized<string>
  /** Typowy czas realizacji. */
  duration: Localized<string>
  /** Kwota netto w złotych: „od” albo — przy `fixed` — cena stała. */
  from: number
  /** Cena stała (ryczałt za opisany zakres) zamiast „od”. */
  fixed?: boolean
  /** Jednostka rozliczenia, jeśli inna niż projekt. */
  unit?: Localized<string>
  items: Localized<readonly string[]>
  /** Plakietka: punkt startu współpracy albo usługa w abonamencie. */
  badge?: "start" | "recurring"
}

export const packages: ServicePackage[] = [
  {
    id: "wdrozenie-ai",
    name: { pl: "Wdrożenie AI w firmie", en: "AI implementation" },
    scope: {
      pl: "Model językowy w prawdziwym procesie firmy",
      en: "A language model inside a real business process",
    },
    duration: { pl: "3–8 tygodni", en: "3–8 weeks" },
    from: 15000,
    items: {
      pl: [
        "Audyt procesu i wybór miejsca, w którym AI daje zwrot",
        "Prototyp na Twoich danych, potem wdrożenie produkcyjne",
        "Integracja z systemami firmy (API, automatyzacje)",
        "Szkolenie zespołu i dokumentacja; koszty modeli osobno",
      ],
      en: [
        "Process audit and choosing where AI pays off",
        "A prototype on your data, then a production rollout",
        "Integration with your systems (APIs, automations)",
        "Team training and documentation; model costs billed separately",
      ],
    },
  },
  {
    id: "produkt",
    name: { pl: "Produkt cyfrowy (MVP)", en: "Digital product (MVP)" },
    scope: {
      pl: "Aplikacja od pomysłu do wdrożenia",
      en: "An application from idea to launch",
    },
    duration: { pl: "6–12 tygodni", en: "6–12 weeks" },
    from: 30000,
    items: {
      pl: [
        "Warsztat produktowy, UX i projekt interfejsu",
        "Frontend i backend (Next.js, baza danych, logowanie, płatności)",
        "Wdrożenie z podglądem każdej zmiany od pierwszego tygodnia",
        "Kod i majątkowe prawa autorskie przechodzą na Ciebie",
      ],
      en: [
        "Product workshop, UX and interface design",
        "Frontend and backend (Next.js, database, sign-in, payments)",
        "Deployment with a preview of every change from week one",
        "The code and the economic copyright transfer to you",
      ],
    },
  },
  {
    id: "strona-firmowa",
    name: { pl: "Strona firmowa, która sprzedaje", en: "Company website that sells" },
    scope: {
      pl: "Strategia treści, projekt i wdrożenie z CMS-em",
      en: "Content strategy, design and build with a CMS",
    },
    duration: { pl: "4–6 tygodni", en: "4–6 weeks" },
    from: 12000,
    items: {
      pl: [
        "Architektura informacji i projekt wszystkich podstron",
        "Wdrożenie na Next.js z systemem treści (CMS albo blog w plikach)",
        "SEO techniczne, dane strukturalne i analityka",
        "Lighthouse ≥ 90 na telefonie i szkolenie z edycji treści",
      ],
      en: [
        "Information architecture and design of every page",
        "Built on Next.js with a content system (a CMS or a file-based blog)",
        "Technical SEO, structured data and analytics",
        "Lighthouse ≥ 90 on mobile and training in editing the content",
      ],
    },
  },
  {
    id: "landing",
    name: { pl: "Landing page w 10 dni", en: "Landing page in 10 days" },
    scope: {
      pl: "Jedna strona o stałym zakresie i stałej cenie",
      en: "One page with a fixed scope and a fixed price",
    },
    duration: { pl: "10 dni roboczych", en: "10 working days" },
    from: 6900,
    fixed: true,
    items: {
      pl: [
        "Treść układana razem z Tobą i projekt dopasowany do marki",
        "Wdrożenie na Next.js, Lighthouse ≥ 95",
        "Formularz, analityka i podstawy SEO",
        "Publikacja i konfiguracja domeny",
      ],
      en: [
        "Copy shaped together with you and a design matched to your brand",
        "Built on Next.js, Lighthouse ≥ 95",
        "A form, analytics and SEO basics",
        "Launch and domain configuration",
      ],
    },
  },
  {
    id: "sprint",
    name: { pl: "Sprint diagnostyczny", en: "Discovery sprint" },
    scope: {
      pl: "Dobry początek każdego projektu",
      en: "A good start for any project",
    },
    duration: { pl: "3–5 dni", en: "3–5 days" },
    from: 2900,
    fixed: true,
    badge: "start",
    items: {
      pl: [
        "Warsztat, audyt obecnego rozwiązania i cele",
        "Specyfikacja i makieta kluczowych ekranów",
        "Stała cena projektu zamiast widełek",
        "Koszt odliczam od projektu, jeśli ruszamy dalej",
      ],
      en: [
        "A workshop, an audit of what you have and the goals",
        "A specification and a wireframe of the key screens",
        "A fixed project price instead of a range",
        "The cost is deducted from the project if we go ahead",
      ],
    },
  },
  {
    id: "warsztaty",
    name: { pl: "Warsztaty AI dla zespołów", en: "AI workshops for teams" },
    scope: {
      pl: "Praktyka na Waszych zadaniach, nie pokaz slajdów",
      en: "Practice on your own tasks, not a slide show",
    },
    duration: { pl: "1 dzień, do 12 osób", en: "1 day, up to 12 people" },
    from: 5500,
    unit: { pl: "dzień", en: "day" },
    items: {
      pl: [
        "Program dopasowany do roli zespołu",
        "Ćwiczenia na prawdziwych zadaniach firmy",
        "Materiały i zestaw gotowych promptów",
        "Prowadzi wykładowca z Nagrodą Rektora",
      ],
      en: [
        "A programme matched to the team’s role",
        "Exercises on your company’s real tasks",
        "Materials and a set of ready-made prompts",
        "Led by a lecturer with a Rector’s Award",
      ],
    },
  },
  {
    id: "partner",
    name: { pl: "Partner produktowy", en: "Product partner" },
    scope: {
      pl: "Projektant i programista w abonamencie",
      en: "A designer and developer on a subscription",
    },
    duration: { pl: "24 godziny w miesiącu", en: "24 hours a month" },
    from: 6900,
    unit: { pl: "miesiąc", en: "month" },
    badge: "recurring",
    items: {
      pl: [
        "Rozwój produktu, strony albo automatyzacji",
        "Jedno zadanie naraz, kolejka ustalana co tydzień",
        "Raport z postępów i rekomendacje",
        "Bez długiego wypowiedzenia",
      ],
      en: [
        "Ongoing work on your product, website or automations",
        "One task at a time, with the queue agreed every week",
        "A progress report and recommendations",
        "No long notice period",
      ],
    },
  },
  {
    id: "opieka",
    name: { pl: "Opieka techniczna", en: "Technical care" },
    scope: {
      pl: "Trzy warianty z jasnym limitem godzin",
      en: "Three plans with a clear hour limit",
    },
    duration: { pl: "Umowa miesięczna", en: "Monthly agreement" },
    from: 490,
    unit: { pl: "miesiąc", en: "month" },
    badge: "recurring",
    items: {
      pl: [
        "Start, 490 zł: aktualizacje, kopie, monitoring i 1 h zmian; reakcja w 2 dni robocze",
        "Biznes, 1200 zł: 4 h zmian i miesięczny raport; reakcja w 1 dzień roboczy",
        "Rozwój, od 2900 zł: 12 h na rozwój, testy i treści SEO; reakcja w 4 godziny robocze",
      ],
      en: [
        "Start, PLN 490: updates, backups, monitoring and 1 h of changes; response within 2 working days",
        "Business, PLN 1,200: 4 h of changes and a monthly report; response within 1 working day",
        "Growth, from PLN 2,900: 12 h of development, tests and SEO content; response within 4 working hours",
      ],
    },
  },
]

/** Gwarancje — każdą da się sprawdzić na tej stronie albo w umowie. */
export const guarantees: Localized<readonly string[]> = {
  pl: [
    "Stała cena po sprincie diagnostycznym",
    "Lighthouse ≥ 90 na telefonie i 0 błędów dostępności w kluczowych szablonach — albo poprawiam na własny koszt",
    "30 dni bezpłatnych poprawek błędów po starcie",
    "Kod i majątkowe prawa autorskie przechodzą na Ciebie po zapłacie",
    "Pracujesz ze mną, nie z podwykonawcą",
  ],
  en: [
    "A fixed price after the discovery sprint",
    "Lighthouse ≥ 90 on mobile and zero accessibility errors in key templates — or I fix it at my own cost",
    "30 days of free bug fixes after launch",
    "The code and the economic copyright transfer to you on payment",
    "You work with me, not with a subcontractor",
  ],
}

/** Kroki współpracy. */
export const processSteps: {
  title: Localized<string>
  detail: Localized<string>
}[] = [
  {
    title: { pl: "Rozmowa", en: "A conversation" },
    detail: {
      pl: "20 minut o celu, zakresie i terminie. Mówię wprost, co warto zrobić inaczej — także gdy to oznacza mniejszy zakres.",
      en: "20 minutes about the goal, the scope and the deadline. I say plainly what is worth doing differently — including when that means a smaller scope.",
    },
  },
  {
    title: { pl: "Sprint albo oferta", en: "A sprint or an offer" },
    detail: {
      pl: "Przy większym projekcie sprint diagnostyczny, przy mniejszym oferta z zakresem, terminem i ceną w 2 dni robocze.",
      en: "A discovery sprint for a larger project; for a smaller one, an offer with scope, date and price within 2 working days.",
    },
  },
  {
    title: { pl: "Projekt", en: "Design" },
    detail: {
      pl: "Projekt interfejsu z dwiema rundami uwag. Akceptujesz, zanim zacznę programować.",
      en: "Interface design with two rounds of feedback. You approve it before I start coding.",
    },
  },
  {
    title: { pl: "Wdrożenie", en: "Build" },
    detail: {
      pl: "Podgląd każdej zmiany od pierwszego tygodnia — widzisz postęp, zamiast czekać na finał.",
      en: "A preview of every change from the first week — you see progress instead of waiting for the end result.",
    },
  },
  {
    title: { pl: "Start", en: "Launch" },
    detail: {
      pl: "Testy, analityka, publikacja i szkolenie z obsługi.",
      en: "Testing, analytics, launch and training.",
    },
  },
  {
    title: { pl: "Opieka albo przekazanie", en: "Care or handover" },
    detail: {
      pl: "Abonament opieki albo komplet dostępów, kodu i dokumentacji — wybierasz Ty.",
      en: "A care plan or the full set of access, code and documentation — your choice.",
    },
  },
]
