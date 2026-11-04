"use client"

import { useEffect, useState, type ReactNode } from "react"
import type { Enter } from "./store"

interface Layer {
  id: string
  enter: Enter
  leaving: boolean
  /** Kierunek wyjścia (strzałki w scenie) — stara warstwa ustępuje w przeciwną stronę. */
  dir?: Enter
}

/** Stara warstwa żyje tyle, ile trwa jej wyjście (160 ms) + zapas. */
const LEAVE_MS = 220

/**
 * Przenikanie warstw w stałej ramie: nowa warstwa wchodzi (`@starting-style`),
 * stara wychodzi w tym samym czasie i znika z drzewa po 220 ms. Obie leżą
 * absolutnie w tym samym pudełku, więc nic wokół się nie przesuwa. Szybkie
 * zmiany (przewijanie przez kilka sekcji naraz) zostawiają kilka wychodzących
 * warstw — każda dokańcza swoje wyjście od miejsca, w którym była.
 */
export function Swap({
  id,
  enter,
  render,
}: {
  id: string
  enter: Enter
  render: (id: string) => ReactNode
}) {
  const [layers, setLayers] = useState<Layer[]>([{ id, enter: "instant", leaving: false }])
  const [shown, setShown] = useState(id)

  if (id !== shown) {
    setShown(id)
    setLayers([
      ...layers
        .filter((layer) => layer.id !== id)
        .map((layer) => ({ ...layer, leaving: true, dir: layer.leaving ? layer.dir : enter })),
      { id, enter, leaving: false },
    ])
  }

  useEffect(() => {
    if (!layers.some((layer) => layer.leaving)) return
    const timer = setTimeout(
      () => setLayers((current) => current.filter((layer) => !layer.leaving)),
      LEAVE_MS
    )
    return () => clearTimeout(timer)
  }, [layers])

  return layers.map((layer) => (
    <div
      key={layer.id}
      data-enter={layer.enter}
      data-leaving={layer.leaving || undefined}
      data-dir={layer.dir}
      inert={layer.leaving}
      className="tk-layer absolute inset-0"
    >
      {render(layer.id)}
    </div>
  ))
}
