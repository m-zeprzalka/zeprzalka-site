/**
 * Teksty ekranów systemowych: 404 i błąd.
 *
 * Osobny, mały moduł, bo `error.tsx` musi być komponentem klienckim i nie
 * dostaje propsów z serwera — importuje teksty sam. Gdyby leżały w
 * `common.ts`, do przeglądarki trafiałyby całe drzewa wspólnych tekstów
 * w obu językach.
 */
import type { Locale } from "@/i18n/config"

const pl = {
  notFound: {
    title: "Strona nie znaleziona",
    description:
      "Wygląda na to, że strona, której szukasz, zadziałała tylko w wyobraźni. Przejdźmy na stabilny grunt.",
    cta: "Wróć na stronę główną",
  },
  error: {
    title: "Coś poszło nie tak!",
    description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub odśwież stronę.",
    cta: "Spróbuj ponownie",
  },
}

const en: typeof pl = {
  notFound: {
    title: "Page not found",
    description:
      "Looks like the page you are after only ever worked in theory. Let's get back to solid ground.",
    cta: "Back to the home page",
  },
  error: {
    title: "Something went wrong!",
    description: "An unexpected error occurred. Try again or reload the page.",
    cta: "Try again",
  },
}

const system = { pl, en } as const

export function getSystem(locale: Locale) {
  return system[locale]
}
