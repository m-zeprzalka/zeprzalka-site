/**
 * Jedyne NOWE napisy koncepcji — drobne etykiety interfejsu, których treść
 * serwisu nie ma. Cała reszta pochodzi z `shared/content.ts`. Piaskownica
 * jest po polsku; przy wdrożeniu napisy przejdą do pary pl/en.
 */
export const UI = {
  start: "Start",
  search: "Szukaj",
  searchPlaceholder: "Szukaj sekcji, realizacji i wpisów…",
  noResults: "Brak wyników dla",
  clear: "Wyczyść",
  results: { one: "wynik", few: "wyniki", many: "wyników", other: "wyniku" },
  hintNavigate: "wybierz",
  hintOpen: "otwórz",
  hintClose: "zamknij",
  sections: "Sekcje",
  pages: "Podstrony",
  actions: "Akcje",
  copyEmail: "Kopiuj e-mail",
  toggleTheme: "Zmień motyw",
  copied: "Skopiowano",
  newPost: "Nowy",
  showAll: "Pokaż wszystkie",
  showLess: "Zwiń",
  play: "Odtwórz",
  pause: "Wstrzymaj",
  onPage: "Na tej stronie",
  visit: "Otwórz serwis",
  /** Przed rokiem początku wykładów („od 2016”) — trwają do dziś. */
  since: "od ",
  allWorks: "Wszystkie realizacje",
  inPortfolio: "Zobacz w portfolio",
  close: "Zamknij",
} as const
