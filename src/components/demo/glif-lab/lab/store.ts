"use client"

import { useSyncExternalStore } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import {
  DEFAULT_STATE,
  PRESETS,
  SECTIONS,
  SECTION_META,
  sameState,
  sanitize,
  type LabState,
  type Param,
  type SectionId,
  type Variant,
} from "./config"

/*
 * Stan laboratorium dla całej strony: warianty sekcji, wybrany cel panelu,
 * pauza ruchu i to, czy panel jest otwarty. Żyje w module (jedna strona =
 * jeden stan); komponenty słuchają przez `useSyncExternalStore`. Pierwszy
 * render klienta = serwer (domyślne warianty), zapis z localStorage dochodzi
 * po hydratacji (`hydrateLab`) — bez rozjazdu HTML.
 */

const KEY = "gll-lab-v1"

export type Target = SectionId | "all"

interface Store {
  state: LabState
  target: Target
  open: boolean
  paused: boolean
}

let store: Store = { state: DEFAULT_STATE, target: "all", open: false, paused: false }
let hydrated = false
const listeners = new Set<() => void>()
let saveTimer: ReturnType<typeof setTimeout> | undefined

function emit(next: Partial<Store>) {
  store = { ...store, ...next }
  listeners.forEach((listener) => listener())
}

function persist() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ state: store.state, paused: store.paused }))
    } catch {
      // tryb prywatny albo zablokowane dane strony — ustawienia żyją do przeładowania
    }
  }, 250)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const serverStore = store
function useStore(): Store {
  return useSyncExternalStore(
    subscribe,
    () => store,
    () => serverStore
  )
}

/** Wczytuje zapisane ustawienia — raz, po pierwszym renderze klienta. */
export function hydrateLab() {
  if (hydrated) return
  hydrated = true
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return
    const saved = JSON.parse(raw) as { state?: unknown; paused?: unknown }
    const state = sanitize(saved.state)
    emit({ state: state ?? store.state, paused: saved.paused === true })
  } catch {
    // uszkodzony zapis — zostają domyślne
  }
}

export function useLab() {
  return useStore()
}

export function useVariant(section: SectionId): Variant {
  return useStore().state[section]
}

/** `auto` — wolno ruszać się samemu; `reduced` — żadnego ruchu (statyczne klatki). */
export function useGlyphMotion() {
  const reduced = useReducedMotion()
  const { paused } = useStore()
  return { reduced, paused, auto: !reduced && !paused }
}

/** Czy sekcja rozumie parametr i wartość (np. tekst nie ma deszczu, CTA nie ma przewijania). */
export function accepts<K extends Param>(id: SectionId, key: K, value: Variant[K]): boolean {
  const meta = SECTION_META[id]
  if (!meta.params.includes(key)) return false
  if (key === "trigger") return meta.triggers.includes(value as Variant["trigger"])
  if (key === "mode" && meta.modes) return meta.modes.includes(value as Variant["mode"])
  return true
}

export function setParam<K extends Param>(target: Target, key: K, value: Variant[K]) {
  const ids = target === "all" ? SECTIONS : [target]
  const state = { ...store.state }
  for (const id of ids) {
    if (accepts(id, key, value)) state[id] = { ...state[id], [key]: value }
  }
  emit({ state })
  persist()
}

export function applyPreset(id: string) {
  const preset = PRESETS.find((item) => item.id === id)
  if (!preset) return
  emit({ state: preset.state })
  persist()
}

export function resetLab() {
  emit({ state: DEFAULT_STATE })
  persist()
}

export function setTarget(target: Target) {
  emit({ target })
}

export function setLabOpen(open: boolean, target?: Target) {
  emit({ open, ...(target ? { target } : {}) })
}

export function setPaused(paused: boolean) {
  emit({ paused })
  persist()
}

/** Preset, któremu odpowiada bieżący stan (albo `null` — ustawienia własne). */
export function currentPreset(state: LabState) {
  return PRESETS.find((preset) => sameState(preset.state, state)) ?? null
}

/** JSON do skopiowania i przesłania: preset, warianty sekcji, data. */
export function exportLab(state: LabState): string {
  const preset = currentPreset(state)
  return JSON.stringify(
    {
      koncepcja: "glif-lab",
      preset: preset?.label ?? "własne",
      zapisano: new Date().toISOString().slice(0, 16).replace("T", " "),
      sekcje: state,
    },
    null,
    2
  )
}
