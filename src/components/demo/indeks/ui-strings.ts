/**
 * Jedyne NOWE napisy koncepcji „Indeks” — drobne etykiety interfejsu, których
 * treści serwisu (`src/i18n/content/*`) nie mają. Cała reszta pochodzi z treści.
 * Demo jest jednojęzyczne (piaskownica ma `lang="pl"`), ale napisy trzymamy
 * w jednym miejscu, żeby przy wdrożeniu przeniosły się do pary pl/en.
 */
export const UI = {
  search: "Szukaj",
  searchPlaceholder: "Szukaj sekcji, realizacji i wpisów…",
  noResults: "Brak wyników",
  results: { one: "wynik", few: "wyniki", many: "wyników", other: "wyniku" },
  hintNavigate: "wybierz",
  hintOpen: "otwórz",
  hintClose: "zamknij",
  copy: "Kopiuj",
  copied: "Skopiowano",
  newPost: "Nowy",
  showAll: "Pokaż wszystkie",
  showLess: "Zwiń",
  play: "Odtwórz",
  pause: "Wstrzymaj",
  /** Podpis liczby 99,28% — treść ma tylko odmienione formy („Nagrodę Rektora”). */
  rectorAward: "Nagroda Rektora",
} as const
