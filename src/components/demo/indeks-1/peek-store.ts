"use client"

import { useSyncExternalStore } from "react"

/**
 * Wspólny stan podglądu na marginesie. Wyzwalacze (wiersze, chipy, fakty)
 * są rozsiane po całej kolumnie, a karta jest jedna — zwykły moduł ze
 * subskrypcją zamiast kontekstu, więc wskazanie wiersza nie renderuje list.
 *
 * Klucz: `work:<slug>`, `post:<slug>` albo `peek:<id>` (podgląd z treści).
 */
export interface PeekState {
  key: string | null
  /** Skąd przyszło wskazanie: kursor (karta płynie za nim) albo fokus (karta staje przy elemencie). */
  via: "pointer" | "focus"
  /** Element z fokusem — karta staje na jego wysokości (mierzona na bieżąco, bo strona może się przewijać). */
  anchor?: HTMLElement
  /** Klucz, którego karta nie pokazuje (np. realizacja już rozwinięta w kolumnie). */
  muted: string | null
}

let state: PeekState = { key: null, via: "pointer", muted: null }
const listeners = new Set<() => void>()
let hideTimer: ReturnType<typeof setTimeout> | undefined

function emit(next: PeekState) {
  state = next
  listeners.forEach((listener) => listener())
}

export function showPeek(key: string, via: PeekState["via"] = "pointer", anchor?: HTMLElement) {
  clearTimeout(hideTimer)
  if (state.key === key && state.via === via && state.anchor === anchor) return
  emit({ ...state, key, via, anchor })
}

/**
 * Chowa podgląd z opóźnieniem — przejście kursora z wiersza na sąsiedni nie
 * gasi karty (sąsiad zdąży ją przejąć), a wyjście w pustkę już tak.
 */
export function hidePeek(key?: string, delay = 90) {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (key && state.key !== key) return
    if (state.key !== null) emit({ ...state, key: null })
  }, delay)
}

export function mutePeek(key: string | null) {
  if (state.muted !== key) emit({ ...state, muted: key })
}

export function getPeek(): PeekState {
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const serverState: PeekState = { key: null, via: "pointer", muted: null }

export function usePeekState(): PeekState {
  return useSyncExternalStore(subscribe, getPeek, () => serverState)
}
