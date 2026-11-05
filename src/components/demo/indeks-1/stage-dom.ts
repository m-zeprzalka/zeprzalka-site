/**
 * Pomocniki DOM karty na marginesie — osobno od `Stage.tsx`, żeby lista realizacji
 * (morf karta → panel) nie wciągała do głównej paczki kodu karty i dekodera,
 * które ładują się leniwie i tylko na desktopie z myszą.
 */

/** Bieżąca sekunda wideo karty — panel w kolumnie gra dalej od tego miejsca. */
export function cardVideoTime(): number | undefined {
  const video = document.querySelector<HTMLVideoElement>(
    "[data-i1-card] [data-active] video[data-ready]"
  )
  return video ? video.currentTime : undefined
}

/** Element karty (do nazwy przejścia widoku przy morfie) — jeśli jest widoczna. */
export function visibleCard(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-i1-card][data-visible]")
}
