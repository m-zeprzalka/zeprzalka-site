"use client"

import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { STAGE_QUERY, useMediaQuery } from "@/app/main-page/_lib/hooks"
import type { Peek } from "@/app/main-page/_lib/types"

/** Najechanie liczy się po chwili spokoju — przelot kursorem nad tekstem nic nie otwiera. */
const SHOW_DELAY_MS = 70
/** Krótka zwłoka przy zjechaniu: przejście między sąsiednimi frazami płynie, zamiast migać. */
const HIDE_DELAY_MS = 120

export interface PeekState {
  id: string | null
  anchor: HTMLElement | null
  /** Fokus z klawiatury: karta stoi przy elemencie, a nie przy kursorze. */
  via: "pointer" | "focus"
}

interface PeekActions {
  /** Desktop z myszą od 1280 px: karta stoi w prawym torze. Poza nim — popover pod frazą. */
  stage: boolean
  peeks: Readonly<Record<string, Peek>>
  show: (id: string, anchor: HTMLElement, via: PeekState["via"]) => void
  /** Bez `id` — od razu, synchronicznie (np. w `flushSync`); z `id` — po krótkiej zwłoce. */
  hide: (id?: string) => void
}

const CLOSED: PeekState = { id: null, anchor: null, via: "pointer" }

/* Dwa konteksty: akcje są stałe, więc wiersze list nie renderują się przy każdej zmianie karty. */
const ActionsContext = createContext<PeekActions | null>(null)
const StateContext = createContext<PeekState>(CLOSED)

export function PeekProvider({
  peeks,
  children,
}: {
  peeks: Readonly<Record<string, Peek>>
  children: ReactNode
}) {
  const stage = useMediaQuery(STAGE_QUERY)
  const [state, setState] = useState<PeekState>(CLOSED)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  /**
   * Czy od ostatniego przewinięcia mysz naprawdę się ruszyła. Po przewinięciu
   * przeglądarka sama zgłasza najechanie na element, który wjechał pod kursor —
   * takie najechanie nie otwiera karty.
   */
  const moved = useRef(true)

  useEffect(() => {
    const onScroll = () => {
      moved.current = false
    }
    const onMove = (event: PointerEvent) => {
      if (event.movementX || event.movementY) moved.current = true
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setState(CLOSED)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const actions = useMemo<PeekActions>(
    () => ({
      stage,
      peeks,
      show(id, anchor, via) {
        clearTimeout(timer.current)
        // Sprawdzane przy odpaleniu: zdarzenia najechania po przewinięciu przychodzą też przed `scroll`.
        timer.current = setTimeout(
          () => {
            if (via === "pointer" && !moved.current) return
            setState((current) =>
              current.id === id && current.anchor === anchor ? current : { id, anchor, via }
            )
          },
          via === "pointer" ? SHOW_DELAY_MS : 0
        )
      },
      hide(id) {
        clearTimeout(timer.current)
        if (!id) return setState(CLOSED)
        timer.current = setTimeout(
          () => setState((current) => (current.id === id ? CLOSED : current)),
          HIDE_DELAY_MS
        )
      },
    }),
    [stage, peeks]
  )

  return (
    <ActionsContext value={actions}>
      <StateContext value={state}>{children}</StateContext>
    </ActionsContext>
  )
}

export function usePeekActions(): PeekActions {
  const actions = use(ActionsContext)
  if (!actions) throw new Error("usePeekActions: brak PeekProvider wyżej w drzewie")
  return actions
}

export function usePeekState(): PeekState {
  return use(StateContext)
}

/**
 * Podgląd na najechaniu i fokusie dowolnego elementu (fraza, wiersz listy,
 * link wpisu). Kliknięcie zostaje przy swojej funkcji. Poza trybem marginesu
 * nic nie robi.
 */
export function usePeekHover(id: string) {
  const { stage, show, hide } = usePeekActions()
  if (!stage) return {}
  const onPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") show(id, event.currentTarget, "pointer")
  }
  return {
    onPointerEnter: onPointer,
    onPointerMove: onPointer,
    onPointerLeave: () => hide(id),
    onFocus: (event: ReactFocusEvent<HTMLElement>) => show(id, event.currentTarget, "focus"),
    onBlur: () => hide(id),
  }
}
