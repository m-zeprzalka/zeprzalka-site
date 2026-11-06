"use client"

import {
  createContext,
  use,
  useCallback,
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
const SHOW_DELAY_MS = 80
/** Krótka zwłoka przy zjechaniu: przejście między sąsiednimi frazami płynie, zamiast migać. */
const HIDE_DELAY_MS = 120
/** Wiersz, który wjechał pod nieruchomy kursor podczas przewijania, nie otwiera karty. */
const SCROLL_GUARD_MS = 180

interface PeekState {
  id: string | null
  anchor: HTMLElement | null
  pinned: boolean
}

interface PeekApi {
  peeks: Readonly<Record<string, Peek>>
  /** Desktop z myszą od 1280 px: karta stoi w prawym torze. Poza nim — popover. */
  stage: boolean
  state: PeekState
  /** Najechanie i fokus. `pointer` sprawdza, czy kursor nie „wjechał” razem z przewijaniem. */
  show: (id: string, anchor: HTMLElement, source: "pointer" | "focus") => void
  hide: (id: string) => void
  /** Kliknięcie przypina kartę (ten sam wygląd co na najechanie); drugie kliknięcie zamyka. */
  toggle: (id: string, anchor: HTMLElement) => void
}

const PeekContext = createContext<PeekApi | null>(null)

const CLOSED: PeekState = { id: null, anchor: null, pinned: false }

export function PeekProvider({
  peeks,
  children,
}: {
  peeks: Readonly<Record<string, Peek>>
  children: ReactNode
}) {
  const stage = useMediaQuery(STAGE_QUERY)
  const [state, setState] = useState<PeekState>(CLOSED)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastScroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      lastScroll.current = performance.now()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Przypiętą kartę zamyka Escape i kliknięcie poza frazą i kartą.
  useEffect(() => {
    if (!state.pinned) return
    const close = () => setState(CLOSED)
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && close()
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target?.closest("[data-peek-trigger], [data-peek-stage]")) close()
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [state.pinned])

  const show = useCallback<PeekApi["show"]>((id, anchor, source) => {
    clearTimeout(timer.current)
    if (source === "pointer" && performance.now() - lastScroll.current < SCROLL_GUARD_MS) return
    timer.current = setTimeout(
      () =>
        setState((current) =>
          current.pinned || (current.id === id && current.anchor === anchor)
            ? current
            : { id, anchor, pinned: false }
        ),
      source === "pointer" ? SHOW_DELAY_MS : 0
    )
  }, [])

  const hide = useCallback<PeekApi["hide"]>((id) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(
      () => setState((current) => (current.pinned || current.id !== id ? current : CLOSED)),
      HIDE_DELAY_MS
    )
  }, [])

  const toggle = useCallback<PeekApi["toggle"]>((id, anchor) => {
    clearTimeout(timer.current)
    setState((current) =>
      current.pinned && current.id === id ? CLOSED : { id, anchor, pinned: true }
    )
  }, [])

  const api = useMemo(
    () => ({ peeks, stage, state, show, hide, toggle }),
    [peeks, stage, state, show, hide, toggle]
  )

  return <PeekContext value={api}>{children}</PeekContext>
}

export function usePeek(): PeekApi {
  const api = use(PeekContext)
  if (!api) throw new Error("usePeek: brak PeekProvider wyżej w drzewie")
  return api
}

/**
 * Obsługa podglądu na dowolnym elemencie (wiersz listy, link wpisu) — tylko
 * najechanie i fokus, bez przypinania: kliknięcie zostaje przy swojej
 * funkcji (rozwinięcie, przejście do wpisu). Poza trybem marginesu nic nie robi.
 */
export function usePeekHover(id: string) {
  const { stage, show, hide } = usePeek()
  if (!stage) return {}
  return {
    onPointerEnter: (event: ReactPointerEvent<HTMLElement>) =>
      show(id, event.currentTarget, "pointer"),
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) =>
      show(id, event.currentTarget, "pointer"),
    onPointerLeave: () => hide(id),
    onFocus: (event: ReactFocusEvent<HTMLElement>) => show(id, event.currentTarget, "focus"),
    onBlur: () => hide(id),
  }
}
