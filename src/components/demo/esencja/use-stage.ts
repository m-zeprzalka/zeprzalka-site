"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useReducedMotion } from "../forma/use-in-view"

const noop = () => () => {}

/**
 * Scena żywego kafla: `run` rośnie przy pierwszym wejściu w kadr (próg 45%)
 * i przy każdej powtórce. `idle` mówi, że scena czeka na start — dopiero po
 * hydratacji, bo HTML z serwera (i bez JS) pokazuje stan końcowy. Przy
 * „ogranicz ruch” scena sama nie rusza (stoi w stanie końcowym); powtórka
 * na żądanie działa, tylko bez przejść.
 */
export function useStage<T extends Element>(threshold = 0.45) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  )

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setRun((value) => (value === 0 ? 1 : value))
        observer.disconnect()
      },
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, reduced])

  const replay = useCallback(() => setRun((value) => value + 1), [])

  return { ref, run, replay, reduced, idle: hydrated && !reduced && run === 0 }
}

/** Zestaw timerów sceny — kasowany w całości przy powtórce i odmontowaniu. */
export function useTimers() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  const after = useCallback((ms: number, run: () => void) => {
    timers.current.push(setTimeout(run, ms))
  }, [])
  useEffect(() => clear, [clear])
  return { after, clear }
}
