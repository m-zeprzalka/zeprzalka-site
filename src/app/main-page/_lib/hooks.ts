import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react"
import { useTheme } from "next-themes"
import { observeReveal, REDUCED_MOTION } from "@/app/main-page/_lib/motion"
import { applyThemeColor } from "@/app/main-page/_lib/theme"

/** Jedna lista zapytań i jedna subskrypcja na zapytanie — stała między renderami. */
const queries = new Map<
  string,
  { list: MediaQueryList; subscribe: (onChange: () => void) => () => void }
>()
function mediaStore(query: string) {
  let store = queries.get(query)
  if (!store) {
    const list = window.matchMedia(query)
    store = {
      list,
      subscribe: (onChange) => {
        list.addEventListener("change", onChange)
        return () => list.removeEventListener("change", onChange)
      },
    }
    queries.set(query, store)
  }
  return store
}

const noSubscription = () => () => {}

/**
 * Zapytanie medialne jako stan Reacta. Na serwerze i przy hydratacji zwraca
 * `serverValue`, więc pierwszy render klienta zgadza się z HTML-em. Subskrypcja
 * i lista zapytania są tworzone raz (bez nowej subskrypcji przy każdym renderze).
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const store = typeof window === "undefined" ? null : mediaStore(query)
  return useSyncExternalStore(
    store?.subscribe ?? noSubscription,
    () => store?.list.matches ?? serverValue,
    () => serverValue
  )
}

/** `true`, gdy system albo przeglądarka prosi o ograniczenie ruchu. */
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION)
}

/** Desktop z myszą od 1280 px — tylko tam karta podglądu stoi na marginesie. */
export const STAGE_QUERY = "(min-width: 80rem) and (hover: hover) and (pointer: fine)"

/**
 * Stan animacji wejścia dla komponentu: `rest` (spoczynek — także bez JS,
 * przy „ogranicz ruch” i gdy element był w kadrze od razu), `armed` (czeka
 * pod zgięciem), `playing` (wjechał w kadr). Zasady — `observeReveal`.
 */
export function useReveal(
  ref: RefObject<Element | null>,
  options?: Parameters<typeof observeReveal>[2]
): "rest" | "armed" | "playing" {
  const [state, setState] = useState<"rest" | "armed" | "playing">("rest")
  const rootMargin = options?.rootMargin
  const threshold = options?.threshold
  useEffect(() => {
    const node = ref.current
    if (!node) return
    return observeReveal(
      node,
      { arm: () => setState("armed"), play: () => setState("playing") },
      { rootMargin, threshold }
    )
  }, [ref, rootMargin, threshold])
  return state
}

/**
 * Flaga na chwilę (np. „Skopiowano”): `trigger()` włącza ją na `duration` ms, a kolejne
 * wywołanie w trakcie odlicza od nowa.
 */
export function useTransientFlag(duration: number): [boolean, () => void] {
  const [on, setOn] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const trigger = useCallback(() => {
    setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), duration)
  }, [duration])
  return [on, trigger]
}

/**
 * Przełączenie jasny / ciemny — przycisk w nagłówku i akcja w ⌘K (razem z kolorem paska).
 * Przejścia są wyłączone tylko na czas samej zmiany klasy: `disableTransitionOnChange`
 * w next-themes robiłby to też przy każdym wczytaniu strony (pełne przeliczenie stylu).
 */
export function useToggleTheme(): () => void {
  const { resolvedTheme, setTheme } = useTheme()
  return () => {
    const next = resolvedTheme === "dark" ? "light" : "dark"
    const freeze = document.createElement("style")
    freeze.textContent = "*,*::before,*::after{transition:none!important}"
    document.head.append(freeze)
    setTheme(next)
    applyThemeColor(next)
    // Klasę motywu next-themes ustawia w efekcie — styl zdejmujemy dwie klatki później.
    requestAnimationFrame(() => requestAnimationFrame(() => freeze.remove()))
  }
}
