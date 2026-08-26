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
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.zeprzalka.com"
).replace(/\/$/, "")

export const SITE_NAME = "Michał Zeprzałka"
export const SITE_TITLE = "Michał Zeprzałka - Digital Solutions Architect"
export const SITE_DESCRIPTION =
  "Strony internetowe, aplikacje webowe, design i integracje AI. Ponad 12 lat doświadczenia w tworzeniu rozwiązań webowych i multimedialnych dla biznesu."

/** Bezwzględny adres dla metadanych i danych strukturalnych. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Autor wszystkich treści. Wcześniej powielony w 25 plikach frontmattera,
 * w dodatku pod nazwą domeny zamiast imieniem i nazwiskiem — przez co dane
 * strukturalne mówiły co innego niż widoczna nota pod wpisem.
 */
export const AUTHOR = {
  name: SITE_NAME,
  jobTitle: "Digital Solutions Architect",
  bio: "Tworzę rozwiązania łączące biznes z technologią.",
  avatar: "/avatar.png",
} as const

/**
 * Profile, które potwierdzają tożsamość autora (pole `sameAs` w danych
 * strukturalnych). LinkedIn dochodzi automatycznie po ustawieniu zmiennej
 * NEXT_PUBLIC_LINKEDIN_URL — docs/SEO.md §5 wskazuje go jako najważniejszy
 * brakujący kanał, a dopisanie adresu nie powinno wymagać zmiany w kodzie.
 */
export const SOCIAL_PROFILES: { label: string; url: string }[] = [
  { label: "GitHub", url: "https://github.com/m-zeprzalka" },
  { label: "Facebook", url: "https://www.facebook.com/michalzeprzalka" },
  ...(process.env.NEXT_PUBLIC_LINKEDIN_URL
    ? [{ label: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN_URL }]
    : []),
]

export const SAME_AS = SOCIAL_PROFILES.map((profile) => profile.url)
