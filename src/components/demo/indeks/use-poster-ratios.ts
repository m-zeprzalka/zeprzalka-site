"use client"

import { useEffect, useState } from "react"
import type { Work } from "./types"

/**
 * Proporcje plakatów (szerokość / wysokość), mierzone w przeglądarce.
 * Realizacje mają różne kadry — strony 16:9 i 3:2, filmy pionowe 0,85 —
 * więc karta i panel dopasowują się do materiału zamiast go przycinać.
 * Pomiar rusza, gdy lista zbliża się do kadru; to te same pliki, które
 * potem wyświetlamy, więc przeglądarka pobiera je raz (z pamięci podręcznej).
 */
export function usePosterRatios(works: readonly Work[], enabled: boolean) {
  const [ratios, setRatios] = useState<Readonly<Record<string, number>>>({})

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false
    for (const work of works) {
      const image = new Image()
      image.decoding = "async"
      image.onload = () => {
        if (cancelled || !image.naturalHeight) return
        setRatios((prev) => ({ ...prev, [work.slug]: image.naturalWidth / image.naturalHeight }))
      }
      image.src = work.poster
    }
    return () => {
      cancelled = true
    }
  }, [works, enabled])

  return ratios
}

/** Kadr, zanim plakat się wczyta. */
export const FALLBACK_RATIO = 16 / 10
