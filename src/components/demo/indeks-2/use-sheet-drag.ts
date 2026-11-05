"use client"

import { useRef, type PointerEvent } from "react"

/** Zamknięcie: przeciągnięcie dalej niż 96 px albo szybki ruch w dół (px/ms). */
const DISTANCE = 96
const VELOCITY = 0.5
/** W górę arkusz stawia opór — przesuwa się o ułamek ruchu palca. */
const RESIST = 0.2

/**
 * Przeciąganie arkusza w dół (jak w Vaul): uchwyt idzie za palcem od pierwszego
 * piksela, po puszczeniu albo zamyka arkusz (dystans lub prędkość), albo wraca
 * na miejsce po krzywej szuflady. Zapisy idą prosto do `style` — bez renderów
 * Reacta w trakcie gestu. Działa tylko na telefonie (poniżej 640 px).
 */
export function useSheetDrag<T extends HTMLElement>(onDismiss: () => void) {
  const sheetRef = useRef<T>(null)
  const drag = useRef<{ start: number; time: number; delta: number } | null>(null)

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    const sheet = sheetRef.current
    if (!sheet || window.matchMedia("(min-width: 40rem)").matches) return
    drag.current = { start: event.clientY, time: event.timeStamp, delta: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
    sheet.style.transition = "none"
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const sheet = sheetRef.current
    const state = drag.current
    if (!sheet || !state) return
    const raw = event.clientY - state.start
    state.delta = raw > 0 ? raw : raw * RESIST
    sheet.style.translate = `0 ${state.delta}px`
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    const sheet = sheetRef.current
    const state = drag.current
    drag.current = null
    if (!sheet || !state) return
    const velocity = state.delta / Math.max(1, event.timeStamp - state.time)
    if (state.delta > DISTANCE || velocity > VELOCITY) {
      // Wyjście arkusza (keyframes do 100%) startuje z bieżącej pozycji palca.
      onDismiss()
      return
    }
    sheet.style.transition = "translate 320ms var(--ease-fm-drawer)"
    sheet.style.translate = ""
  }

  return {
    sheetRef,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}
