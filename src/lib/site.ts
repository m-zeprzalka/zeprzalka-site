/**
 * Jedno miejsce z adresem serwisu.
 *
 * Domeną główną jest `www` — apex odpowiada przekierowaniem 308 właśnie na nią.
 * Adresy kanoniczne, mapa strony, kanał RSS i karty społecznościowe muszą
 * wskazywać dokładnie tę wersję, którą serwer oddaje; wcześniej wskazywały apex,
 * przez co każda podstrona wysyłała wyszukiwarce sprzeczny sygnał.
 *
 * Zmienna środowiskowa nadal ma pierwszeństwo (przydaje się w podglądach
 * i środowiskach testowych), ale wartość domyślna jest już poprawna.
 */
import type { Localized } from "@/i18n/config"

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.zeprzalka.com").replace(
  /\/$/,
  ""
)

/** Host kanoniczny (`www.zeprzalka.com`) i nazwa domeny w znaku serwisu (`zeprzalka.com`). */
export const SITE_HOST = new URL(SITE_URL).host
export const SITE_DOMAIN = SITE_HOST.replace(/^www\./, "")

export const SITE_NAME = "Michał Zeprzałka"
/** Bezwzględny adres dla metadanych i danych strukturalnych. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/** CV do pobrania z „O mnie” — PDF z tej samej strony (`pnpm cv`), osobno dla każdego języka. */
export const CV_PDF: Localized<string> = {
  pl: "/cv-michal-zeprzalka.pdf",
  en: "/cv-michal-zeprzalka-en.pdf",
}

/** Adres, na który przychodzą wiadomości i który widnieje na stronach. */
export const CONTACT_EMAIL = "m@zeprzalka.com"

/**
 * Autor wszystkich treści. Wcześniej powielony w 25 plikach frontmattera,
 * w dodatku pod nazwą domeny zamiast imieniem i nazwiskiem — przez co dane
 * strukturalne mówiły co innego niż widoczna nota pod wpisem.
 */
export const AUTHOR = {
  name: SITE_NAME,
  jobTitle: {
    pl: "Projektant i programista produktów cyfrowych",
    en: "Digital Product Designer & Developer",
  } satisfies Localized<string>,
  bio: {
    pl: "Tworzę rozwiązania łączące biznes z technologią.",
    en: "I build solutions that connect business with technology.",
  } satisfies Localized<string>,
  /** Pełny portret — dane strukturalne i karty. */
  avatar: "/avatar.png",
  /** Ten sam portret w 160 px (2× slotu 80 px pod wpisem): 4 KB zamiast 68 KB. */
  avatarSmall: "/avatar-160.webp",
} as const

/**
 * Profile, które potwierdzają tożsamość autora (pole `sameAs` w danych
 * strukturalnych). LinkedIn dochodzi automatycznie po ustawieniu zmiennej
 * NEXT_PUBLIC_LINKEDIN_URL — to najważniejszy brakujący kanał, a dopisanie
 * adresu nie powinno wymagać zmiany w kodzie.
 */
export const SOCIAL_PROFILES: readonly { label: string; url: string }[] = [
  { label: "GitHub", url: "https://github.com/m-zeprzalka" },
  { label: "Facebook", url: "https://www.facebook.com/michalzeprzalka" },
  ...(process.env.NEXT_PUBLIC_LINKEDIN_URL
    ? [{ label: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN_URL }]
    : []),
]

export const SAME_AS = SOCIAL_PROFILES.map((profile) => profile.url)

/**
 * Adres bezwzględny obrazu z frontmattera albo danych. Podgląd linku
 * w komunikatorze i dane strukturalne nie znają kontekstu strony, więc
 * ścieżka względna byłaby dla nich bezużyteczna.
 */
export function absoluteImage(src: string | undefined, fallback = AUTHOR.avatar): string {
  const value = src || fallback
  return value.startsWith("http") ? value : absoluteUrl(value)
}
