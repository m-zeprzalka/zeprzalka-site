"use client"

import { useEffect, useRef } from "react"

/**
 * Rozmiar ramy w etykiecie — prawdziwy, naturalny rozmiar makiety
 * (np. „1280 × 800”), jak w narzędziu projektowym. Tekst wstawiany po
 * hydratacji, więc HTML z serwera i pierwszy render klienta się zgadzają.
 */
export function FrameDims() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    const board = document.getElementById("tf-board")
    if (!node || !board) return
    const update = () => {
      node.textContent = `${board.offsetWidth} × ${board.offsetHeight}`
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(board)
    return () => observer.disconnect()
  }, [])

  return <span ref={ref} className="font-mono text-[0.6875rem] tabular-nums" />
}
