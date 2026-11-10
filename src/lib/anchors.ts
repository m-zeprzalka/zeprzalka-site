/** Kotwice sekcji strony głównej — stałe dla obu języków (serwer i klient). */
export const SECTION = {
  start: "start",
  about: "o-mnie",
  skills: "kompetencje",
  work: "portfolio",
  blog: "blog",
  contact: "kontakt",
} as const

/**
 * Kotwice sekcji podstron (stałe dla obu języków, jak `SECTION`). Usługi i portfolio
 * biorą je z treści (`packagesId`, `ctaId`, grupy realizacji).
 */
export const PAGE_SECTION = {
  featured: "wyroznione",
  posts: "wpisy",
  cooperation: "wspolpraca",
  related: "czytaj-dalej",
  bio: "biogram",
  experience: "doswiadczenie",
  skills: "umiejetnosci",
  education: "edukacja",
} as const

/**
 * Kotwice poprzedniej wersji strony (do 10.11.2026), które mogą stać w udostępnionych
 * linkach: `/#contact` prowadzi do tej samej sekcji co `/#kontakt`.
 */
export const LEGACY_ANCHORS: Readonly<Record<string, string>> = { contact: SECTION.contact }

/** Kotwica realizacji w portfolio — wyszukiwarka i dowody kompetencji otwierają nią wiersz. */
export const WORK_PREFIX = "realizacja-"
export const workAnchor = (slug: string) => `${WORK_PREFIX}${slug}`

/**
 * Wolne miejsce pod przyklejonym nagłówkiem (px) — kotwice, dosuwanie strony
 * i karta na marginesie. Ta sama wartość co `scroll-padding-top` w globals.css.
 */
export const HEADER_OFFSET = 80

/**
 * Kotwica z adresu (`#…`) jako id elementu. Hash bywa zakodowany (`%C5%BC`), a bywa po prostu
 * zepsuty (`#50%`) — wtedy `decodeURIComponent` rzuca wyjątek, który w powłoce wywracał całą
 * stronę na ekran błędu. Zepsuty zostaje taki, jaki jest: żadnego elementu nie wskaże.
 */
export function hashId(hash: string): string {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/** Zdarzenie skoku do kotwicy na tej stronie (`goToAnchor`); `detail` — id elementu. */
export const ANCHOR_EVENT = "site:anchor"

/**
 * Skok do kotwicy na stronie: adres dostaje hash (historia, udostępnianie),
 * a przewija ten, kto kotwicę zna. Lista realizacji przejmuje zdarzenie
 * (`preventDefault`) i sama otwiera wiersz; reszta to zwykłe przewinięcie
 * (płynne albo od razu — jak każe CSS). Działa też dla tego samego hasha,
 * który nie wywołuje `hashchange`. Fokus idzie za skokiem: czytnik czyta cel,
 * a Tab prowadzi dalej od niego (obwódki nie ma — `[tabindex="-1"]` w globals.css).
 */
export function goToAnchor(id: string) {
  history.pushState(null, "", `#${id}`)
  const event = new CustomEvent<string>(ANCHOR_EVENT, { detail: id, cancelable: true })
  const handled = !window.dispatchEvent(event)
  const target = document.getElementById(id)
  if (!target) return
  if (!handled) target.scrollIntoView()
  focusTarget(target)
}

/** Fokus na celu skoku bez przewijania (obwódki nie ma — `[tabindex="-1"]` w globals.css). */
export function focusTarget(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1")
  target.focus({ preventScroll: true })
}
