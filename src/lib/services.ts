/**
 * Oferta i widełki cenowe.
 *
 * Wartości pochodzą z rekomendacji w docs/MONETYZACJA.md („cena orientacyjna").
 * Trzymane w jednym miejscu, bo to dane biznesowe, nie treść strony —
 * korekta stawki ma być zmianą jednej liczby, nie przeglądaniem JSX-a.
 */
export interface ServicePackage {
  id: string
  name: string
  scope: string
  /** Kwota w złotych, prezentowana zawsze jako „od". */
  from: number
  /** Jednostka rozliczenia, jeśli inna niż projekt. */
  unit?: string
  items: string[]
  /** Wyróżniony pakiet — powtarzalny przychód. */
  highlight?: boolean
}

export const packages: ServicePackage[] = [
  {
    id: "landing",
    name: "Landing page",
    scope: "Jedna strona, która ma sprzedawać",
    from: 2500,
    items: [
      "Projekt graficzny dopasowany do marki",
      "Wdrożenie na Next.js, gotowe na urządzenia mobilne",
      "Podstawowe SEO i formularz kontaktowy",
      "Publikacja i konfiguracja domeny",
    ],
  },
  {
    id: "firmowa",
    name: "Strona firmowa",
    scope: "4–8 podstron z blogiem i analityką",
    from: 5000,
    items: [
      "Architektura informacji i projekt wszystkich podstron",
      "System treści (CMS lub blog w plikach)",
      "Analityka i mapa strony pod wyszukiwarki",
      "Szkolenie z samodzielnej edycji treści",
    ],
  },
  {
    id: "ai",
    name: "Strona z AI",
    scope: "Strona firmowa plus automatyzacja",
    from: 8000,
    items: [
      "Wszystko z pakietu Strona firmowa",
      "Integracja modelu językowego (chat, wyszukiwarka, generowanie treści)",
      "Automatyzacja powtarzalnego procesu w firmie",
      "Dokumentacja wdrożenia",
    ],
  },
  {
    id: "grafika",
    name: "Grafika, wideo, animacja",
    scope: "Materiały do kampanii i social mediów",
    from: 1500,
    items: [
      "Identyfikacja wizualna i materiały graficzne",
      "Montaż wideo i animacje",
      "Zestawy pod social media",
    ],
  },
  {
    id: "opieka",
    name: "Opieka miesięczna",
    scope: "Strona pod stałą ręką",
    from: 300,
    unit: "miesiąc",
    highlight: true,
    items: [
      "Hosting, aktualizacje i kopie zapasowe",
      "Monitoring dostępności i wydajności",
      "Drobne zmiany w treści bez osobnej wyceny",
      "Priorytet przy zgłoszeniach",
    ],
  },
]

/** Kroki współpracy — te same, które opisuje strona kontaktu. */
export const process = [
  {
    title: "Piszesz, czego potrzebujesz",
    detail:
      "Formularz albo e-mail. Im więcej szczegółów, tym precyzyjniejsza wycena. Odpowiadam do 24 godzin w dni robocze.",
  },
  {
    title: "Rozmawiamy bez zobowiązań",
    detail:
      "Krótka rozmowa o celu, zakresie i terminie. Podpowiadam, co warto zrobić inaczej — także gdy to oznacza mniejszy zakres.",
  },
  {
    title: "Dostajesz ofertę z ceną",
    detail:
      "Konkretny zakres, termin i kwota. Bez ukrytych kosztów i bez abonamentów, których nie zamawiałeś.",
  },
]

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pl-PL").format(value)
