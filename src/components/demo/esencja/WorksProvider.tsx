"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { DemoWork } from "../shared/content"
import { Lightbox, type LightboxLabels } from "./Lightbox"

interface WorksApi {
  works: readonly DemoWork[]
  /** Otwiera podgląd; `scope` — realizacje, między którymi przełączają strzałki (zbiór, z którego otwarto). */
  open: (slug: string, scope: readonly string[]) => void
}

const WorksContext = createContext<WorksApi | null>(null)

/** Pokaz i masonry otwierają ten sam podgląd — jedno okno na całą stronę. */
export function useWorks(): WorksApi {
  const api = useContext(WorksContext)
  if (!api) throw new Error("useWorks poza <WorksProvider>")
  return api
}

/**
 * Wspólny stan realizacji: lista i otwarta pozycja. Opakowuje sekcje
 * serwerowe (przekazane jako `children`), więc nie zamienia ich w klienckie.
 */
export function WorksProvider({
  works,
  groups,
  labels,
  children,
}: {
  works: readonly DemoWork[]
  groups: Readonly<Record<string, string>>
  labels: LightboxLabels
  children: ReactNode
}) {
  const [active, setActive] = useState<string | null>(null)
  // Zakres zostaje po zamknięciu — treść okna nie zmienia się w trakcie animacji wyjścia.
  const [scope, setScope] = useState<readonly string[]>([])
  // Karta, z której otwarto podgląd — po zamknięciu fokus wraca dokładnie na nią.
  const trigger = useRef<HTMLElement | null>(null)
  const open = useCallback((slug: string, next: readonly string[]) => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setScope(next)
    setActive(slug)
  }, [])
  const scoped = useMemo(
    () => (scope.length ? works.filter((work) => scope.includes(work.slug)) : works),
    [works, scope]
  )
  const returnFocus = useCallback(() => trigger.current?.focus({ preventScroll: true }), [])
  const api = useMemo(() => ({ works, open }), [works, open])

  return (
    <WorksContext.Provider value={api}>
      {children}
      <Lightbox
        works={scoped}
        groups={groups}
        active={active}
        onChange={setActive}
        onClosed={returnFocus}
        labels={labels}
      />
    </WorksContext.Provider>
  )
}
