"use client"

import { useSyncExternalStore } from "react"

/**
 * Wspólny stan karty. Wyzwalacze (chipy, liczby, wiersze, kafle) są rozsiane po
 * całej kolumnie, a karta jest jedna — moduł z subskrypcją zamiast kontekstu,
 * więc wskazanie wiersza nie renderuje list.
 *
 * Klucz: id karty z `cards` (`web`, `work:<slug>`, `post:<slug>`…).
 */
export interface CardState {
  key: string | null
  /** Mysz (karta płynie za kursorem), fokus (staje przy elemencie) albo dotyk (arkusz u dołu). */
  via: "pointer" | "focus" | "tap"
  /** Element, przy którym karta staje (mierzony na bieżąco — strona może się przewijać). */
  anchor?: HTMLElement
}

let state: CardState = { key: null, via: "pointer" }
const listeners = new Set<() => void>()
let hideTimer: ReturnType<typeof setTimeout> | undefined

function emit(next: CardState) {
  state = next
  listeners.forEach((listener) => listener())
}

export function showCard(key: string, via: CardState["via"], anchor?: HTMLElement) {
  clearTimeout(hideTimer)
  if (state.key === key && state.via === via && state.anchor === anchor) return
  emit({ key, via, anchor })
}

/**
 * Chowa kartę z opóźnieniem — przejście kursora z wiersza na sąsiedni nie gasi
 * karty (sąsiad zdąży ją przejąć), a wyjście w pustkę już tak.
 */
export function hideCard(key?: string, delay = 90) {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (key && state.key !== key) return
    if (state.key !== null) emit({ ...state, key: null })
  }, delay)
}

export function getCard(): CardState {
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const serverState: CardState = { key: null, via: "pointer" }

export function useCardState(): CardState {
  return useSyncExternalStore(subscribe, getCard, () => serverState)
}

/** Czy ta karta jest teraz pokazana (do `data-active` na wyzwalaczu). */
export function useCardActive(key: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => state.key === key,
    () => false
  )
}

/**
 * Wyzwalacz: mysz — wskazanie (podgląd); klawiatura — fokus (karta staje przy
 * elemencie); klik albo dotyk — karta przypięta jako okno (`tap: false` dla
 * linków, które mają po prostu prowadzić dalej).
 */
export function cardHandlers(key: string, { tap = true }: { tap?: boolean } = {}) {
  return {
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && window.matchMedia("(min-width: 64rem)").matches)
        showCard(key, "pointer", event.currentTarget)
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") hideCard(key)
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.matches(":focus-visible")) return
      if (!window.matchMedia("(min-width: 64rem)").matches) return
      showCard(key, "focus", event.currentTarget)
    },
    onBlur: () => {
      if (state.via !== "tap") hideCard(key, 0)
    },
    // Klik przypina kartę (na marginesie albo u dołu ekranu) — wtedy jej linki są klikalne.
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (!tap) return
      event.preventDefault()
      showCard(key, "tap", event.currentTarget)
    },
  }
}
