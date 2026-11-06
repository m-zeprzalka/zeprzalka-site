import { useSyncExternalStore } from "react"

/**
 * Zapytanie medialne jako stan Reacta. Na serwerze i przy hydratacji zwraca
 * `serverValue`, więc pierwszy render klienta zgadza się z HTML-em.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}

/** Desktop z myszą od 1280 px — tylko tam karta podglądu stoi na marginesie. */
export const STAGE_QUERY = "(min-width: 80rem) and (hover: hover) and (pointer: fine)"
