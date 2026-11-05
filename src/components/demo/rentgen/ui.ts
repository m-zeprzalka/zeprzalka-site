/**
 * Krótkie napisy interfejsu „Rentgenu” (piaskownica jest tylko po polsku).
 * Treść strony pochodzi wyłącznie z `shared/content.ts`; tu są tylko etykiety
 * kontrolek i podpowiedzi — wypisane w raporcie iteracji.
 */
export const UI = {
  mode: { group: "Warstwa strony", design: "Projekt", code: "Kod" },
  lens: {
    hintPointer: "Przesuń kursor — pod soczewką jest kod tej strony",
    hintTouch: "Soczewka czeka w rogu ekranu — albo przełącz na Kod",
    drag: "Przeciągnij",
    summon: "Pokaż soczewkę",
    dismiss: "Schowaj soczewkę",
  },
  scan: "kompilacja",
  menu: "Menu",
  slider: { region: "Pokaz realizacji", pause: "Zatrzymaj pokaz", play: "Wznów pokaz" },
  video: { play: "Odtwórz wideo", pause: "Zatrzymaj wideo" },
  build: { replay: "Odtwórz ponownie" },
  top: "Na górę",
} as const
