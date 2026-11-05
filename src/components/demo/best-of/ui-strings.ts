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
  /** Kafel „Projektowanie”. */
  design: {
    radius: "Promień",
    padding: "Odstęp",
    shadow: "Cień",
    inner: "Promień zdjęcia",
    replay: "Powtórz pokaz",
    panel: "Właściwości karty",
  },
  /** Kafel „AI”. */
  ask: {
    thinking: "Myślę…",
    ask: "Następne pytanie",
    replay: "Powtórz rozmowę",
    note: "Odpowiedzi złożone z treści tej strony — demonstracja interfejsu, bez modelu językowego.",
  },
  /** Kafel „Komunikacja wizualna”. */
  motion: {
    tracks: ["Krycie", "Skala", "Rozmycie"],
    play: "Odtwórz",
    pause: "Zatrzymaj",
    replay: "Odtwórz od początku",
    scrub: "Oś czasu animacji",
  },
} as const
