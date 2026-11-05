/**
 * Jedyne NOWE napisy koncepcji „The Best Of” — krótkie etykiety interfejsu,
 * których treść serwisu (`src/i18n/content/*`) nie ma. Wszystko inne pochodzi
 * z modułu wspólnego (`shared/content.ts`). Piaskownica jest po polsku; napisy
 * w jednym miejscu, żeby przy wdrożeniu przeszły do pary pl/en.
 */
export const UI = {
  menu: "Menu",
  mainNav: "Nawigacja główna",
  mobileNav: "Nawigacja mobilna",
  reel: "Pokaz wideo",
  play: "Odtwórz wideo",
  pause: "Zatrzymaj wideo",
  sliderPrevious: "Poprzednia realizacja",
  sliderNext: "Następna realizacja",
  sliderPause: "Zatrzymaj",
  sliderPlay: "Wznów",
  previewClose: "Zamknij podgląd",
  openSite: "Otwórz serwis",
  /** Przed rokiem początku wykładów („od 2016” — wykłady trwają). */
  since: "od",
  /** Link do pełnego portfolio (bez licznika — prośba właściciela). */
  allWorks: "Wszystkie realizacje",
  /** Pigułka na karcie slidera. */
  preview: "Podgląd",
  search: "Szukaj",
  searchPlaceholder: "Szukaj realizacji, wpisów i sekcji…",
  noResults: "Brak wyników",
  results: { one: "wynik", few: "wyniki", many: "wyników", other: "wyniku" },
  hintNavigate: "wybierz",
  hintOpen: "otwórz",
  hintClose: "zamknij",
  onThisPage: "Na tej stronie",
  actions: "Akcje",
  copyEmail: "Kopiuj",
  tools: "Narzędzia",
  replay: "Powtórz",
  top: "Na górę",
  codePause: "Zatrzymaj animację kodu",
  codePlay: "Wznów animację kodu",
  portrait: "Portret Michała Zeprzałki złożony ze znaków",
  lens: "Pole animowanego kodu z soczewką, która idzie za kursorem",
  /** Bryły ze znaków w segmentach kompetencji. */
  figures: {
    design: "Obracająca się kostka złożona ze znaków",
    visual: "Falująca kropla złożona ze znaków",
    hint: "Najedź albo dotknij, żeby nią obrócić",
  },
  /** Kafel „AI”. */
  ask: {
    thinking: "Myślę…",
    ask: "Następne pytanie",
    replay: "Powtórz rozmowę",
    note: "Przykładowa rozmowa — odpowiedzi z treści tej strony.",
  },
} as const
