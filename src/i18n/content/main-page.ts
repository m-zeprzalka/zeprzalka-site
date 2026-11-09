/**
 * Treść nowej strony głównej (`src/app/main-page`) — tylko to, czego nie ma
 * w pozostałych modułach: napisy interfejsu, frazy otwierające karty podglądu
 * i cztery liczby. Biogram, kompetencje, portfolio i blog zostają tam, gdzie
 * są (`pages.ts`, `home.ts`, `src/lib`); ten moduł je tylko wskazuje.
 *
 * Frazy muszą stać w tekście dokładnie tak jak tutaj — brak frazy zatrzymuje
 * build (`segment()` w `src/app/main-page/_lib/text.ts`).
 */
import "server-only"
import type { Locale } from "@/i18n/config"

const pl = {
  ui: {
    search: "Szukaj",
    searchTitle: "Wyszukiwarka",
    searchDescription: "Podstrony serwisu, realizacje i wpisy.",
    searchPlaceholder: "Szukaj podstron, realizacji i wpisów…",
    searchEmpty: "Nic nie znaleziono.",
    searchGroups: {
      works: "Portfolio",
      posts: "Blog",
      pages: "Podstrony",
      actions: "Akcje",
    },
    searchHints: { select: "wybierz", open: "otwórz", close: "zamknij" },
    /** Liczba wyników ⌘K dla czytnika — formy dla `plural()`. */
    searchResults: { one: "wynik", few: "wyniki", many: "wyników", other: "wyniku" },
    copyEmail: "Kopiuj adres e-mail",
    language: "Język",
    allWorks: "Wszystkie realizacje",
    inPortfolio: "Zobacz w portfolio",
    visitSite: "Odwiedź serwis",
    showAll: "Pokaż wszystkie",
    showLess: "Zwiń",
    newPost: "Nowy",
    playVideo: "Odtwórz wideo",
    pauseVideo: "Zatrzymaj wideo",
    responseTimeLabel: "Czas odpowiedzi:",
    responseTime: "do 24 godzin w dni robocze",
    localTime: "Czas lokalny",
    /** Koniec okresu, który trwa („2016–obecnie”). */
    present: "obecnie",
  },
  hero: {
    /** Frazy z pierwszego zdania biogramu, które otwierają kartę podglądu. */
    chips: {
      experience: "15 lat doświadczenia",
      web: "webowych",
      motion: "multimedialnych",
    },
  },
  about: {
    /** Frazy z dalszej części biogramu, które otwierają kartę podglądu. */
    chips: {
      systems: "design systemów",
      ai: "integracjach AI",
      motion: "materiałów wideo",
      award: "Nagrodę Rektora",
    },
    /** Liczby z „O mnie” — te same co w biogramie i doświadczeniu (`pages.ts`). */
    facts: {
      experience: { value: "15+", label: "lat doświadczenia" },
      clients: { value: "30+", label: "klientów" },
      lectures: { value: "od 2016", label: "wykładowca akademicki" },
      award: { value: "99,28%", label: "Nagroda Rektora — ankiety studentów" },
    },
  },
  contact: {
    projectTypes: ["Strona internetowa", "Animacja", "Grafika"],
  },
}

const en: typeof pl = {
  ui: {
    search: "Search",
    searchTitle: "Search",
    searchDescription: "Pages of the site, work and articles.",
    searchPlaceholder: "Search pages, work and articles…",
    searchEmpty: "No results.",
    searchGroups: {
      works: "Portfolio",
      posts: "Blog",
      pages: "Pages",
      actions: "Actions",
    },
    searchHints: { select: "select", open: "open", close: "close" },
    searchResults: { one: "result", few: "results", many: "results", other: "results" },
    copyEmail: "Copy email address",
    language: "Language",
    allWorks: "All work",
    inPortfolio: "See in portfolio",
    visitSite: "Visit website",
    showAll: "Show all",
    showLess: "Show less",
    newPost: "New",
    playVideo: "Play video",
    pauseVideo: "Pause video",
    responseTimeLabel: "Response time:",
    responseTime: "within 24 hours on working days",
    localTime: "Local time",
    present: "present",
  },
  hero: {
    chips: {
      experience: "15 years of experience",
      web: "web",
      motion: "multimedia",
    },
  },
  about: {
    chips: {
      systems: "design systems",
      ai: "AI integrations",
      motion: "video production",
      award: "Rector's Award",
    },
    facts: {
      experience: { value: "15+", label: "years of experience" },
      clients: { value: "30+", label: "clients" },
      lectures: { value: "since 2016", label: "university lecturer" },
      award: { value: "99.28%", label: "Rector's Award — student surveys" },
    },
  },
  contact: {
    projectTypes: ["Website", "Animation", "Graphics"],
  },
}

const mainPage = { pl, en } as const

export function getMainPage(locale: Locale) {
  return mainPage[locale]
}
