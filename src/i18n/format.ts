/**
 * Formatowanie zależne od języka — jedno miejsce dla interpolacji, liczebników,
 * dat, liczb i czasu lektury. Region bierze się zawsze z `INTL_LOCALE`
 * (copy angielskie jest pisane po brytyjsku, więc `en-GB`).
 */
import { INTL_LOCALE, type Locale, type Localized } from "@/i18n/config"

/** Podstawia `{klucz}` wartościami — jedyny mechanizm interpolacji w treściach. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}

/**
 * Formy rzeczownika według kategorii CLDR. Polski potrzebuje czterech
 * („1 artykuł”, „3 artykuły”, „15 artykułów”, „1,5 artykułu”), angielski dwóch.
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

const pluralRules = new Map<Locale, Intl.PluralRules>()

/** „15 artykułów”, „3 projects” — liczba z poprawną formą rzeczownika. */
export function plural(count: number, locale: Locale, forms: PluralForms): string {
  let rules = pluralRules.get(locale)
  if (!rules) {
    rules = new Intl.PluralRules(INTL_LOCALE[locale])
    pluralRules.set(locale, rules)
  }
  return `${count} ${forms[rules.select(count)] ?? forms.other}`
}

/**
 * Data publikacji. Polska notacja `21.10.2025`; angielska świadomie nie jest
 * `21/10/2025`, bo ten zapis czyta się inaczej po obu stronach Atlantyku.
 * Daty z frontmattera to północ UTC — bez `timeZone` wynik zależałby od strefy
 * maszyny, na której trwa build.
 */
export function formatDate(value: string | Date, locale: Locale): string {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString(
    INTL_LOCALE[locale],
    locale === "pl"
      ? { timeZone: "UTC" }
      : { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }
  )
}

/** Kwota z separatorem tysięcy właściwym dla języka: `2 500`, `2,500`. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value)
}

/**
 * Wzorzec czasu lektury jako para `Localized` — moduł jest używany także po
 * stronie klienta, więc nie sięga do (serwerowych) modułów treści.
 */
const READING_TIME: Localized<string> = { pl: "{minutes} min czytania", en: "{minutes} min read" }

/** „5 min czytania” / „5 min read”. */
export function formatReadingTime(minutes: number, locale: Locale): string {
  return fill(READING_TIME[locale], { minutes })
}
