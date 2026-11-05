/**
 * Krótkie napisy interfejsu „Warstw” (piaskownica jest tylko po polsku). Treść strony —
 * wyłącznie z `shared/content.ts`; tu są jedynie etykiety kontrolek i opisy dla czytników.
 */
export const UI = {
  layers: "Warstwy",
  layersTitle: "Warstwy strony",
  layersHint: "przejdź",
  actions: "Szybkie akcje",
  copyEmail: "Kopiuj e-mail",
  allWorks: "Wszystkie realizacje",
  allPosts: "Wszystkie artykuły",
  prevWorks: "Poprzednie realizacje",
  nextWorks: "Następne realizacje",
  pause: "Zatrzymaj wideo",
  play: "Odtwórz wideo",
  face: "Twarz Michała Zeprzałki ułożona ze znaków",
  lens: "Pole animowanego kodu, które idzie za kursorem",
  toTop: "Na górę",
  since: "od",
  readingSeparator: " · ",
} as const

/** Rozdziały strony — kotwice i nazwy warstw w panelu (te same co nagłówki sekcji). */
export const LAYER_IDS = ["start", "o-mnie", "kompetencje", "portfolio", "blog", "kontakt"] as const
export type LayerId = (typeof LAYER_IDS)[number]
