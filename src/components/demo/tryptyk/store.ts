"use client"

import { useEffect, useSyncExternalStore } from "react"
import { SECTIONS, type SectionId } from "./anchors"

/**
 * Jak nowa warstwa sceny wchodzi: przenikanie, bez ruchu, z kierunku (strzałki)
 * albo `fly` — kadr przylatuje jako View Transition, przenikają tylko napisy.
 */
export type Enter = "fade" | "instant" | "prev" | "next" | "fly"

interface State {
  /** Sekcja z przewijania (scroll-spy). */
  section: SectionId
  /** Sekcja ostatniej interakcji (wskazanie, klik) — ważna, dopóki przewijanie nie przeniesie gdzie indziej. */
  override: SectionId | null
  /** Wybrane pozycje; pusty napis = pierwsza z listy. */
  work: string
  post: string
  skill: string
  enter: Enter
}

let state: State = {
  section: "start",
  override: null,
  work: "",
  post: "",
  skill: "",
  enter: "fade",
}
const SERVER = state
const listeners = new Set<() => void>()

function set(patch: Partial<State>) {
  state = { ...state, ...patch }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Odczyt z magazynu sceny. Selektor musi zwracać wartość prostą (napis), nie nowy obiekt. */
export function useStage<T extends string | null>(select: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(SERVER)
  )
}

/** Wskazanie albo wybór w danej sekcji: scena pokazuje go od razu, niezależnie od przewijania. */
export function point(section: SectionId, patch: Partial<Omit<State, "section" | "override">>) {
  set({ enter: "fade", ...patch, override: section })
}

/** Klucz warstwy sceny — z niego scena wie, co pokazać. */
export function stageKey(s: State): string {
  const shown = s.override ?? s.section
  if (shown === "kompetencje") return `skill:${s.skill}`
  if (shown === "realizacje") return `work:${s.work}`
  if (shown === "blog") return `post:${s.post}`
  return shown
}

/** Linia czytania: sekcja, której początek minął 40% wysokości ekranu, jest aktywna. */
const READING_LINE = 0.4

/** Aktywna sekcja z geometrii: ostatnia, której górna krawędź minęła linię czytania. */
function measureSection(): SectionId {
  const root = document.documentElement
  // Na samym dole aktywna jest ostatnia sekcja, nawet jeśli jej początek nie dojdzie do linii.
  if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
    return SECTIONS[SECTIONS.length - 1] ?? "start"
  }
  const line = window.innerHeight * READING_LINE
  let active: SectionId = SECTIONS[0] ?? "start"
  for (const id of SECTIONS) {
    const top = document.getElementById(id)?.getBoundingClientRect().top
    if (top !== undefined && top <= line) active = id
  }
  return active
}

/**
 * Scroll-spy całej strony (montowany raz) — ta sama zasada dla spisu, logo
 * i sceny. Liczony z geometrii sekcji przy każdym przewinięciu (najwyżej raz
 * na klatkę), zmianie rozmiaru okna i zmianie wysokości treści (akordeon,
 * rozwinięta lista), więc zawsze daje dokładnie jedną aktywną sekcję — także
 * po skoku do kotwicy, na samym dole i po powrocie na górę. Zmiana sekcji
 * kasuje wskazanie z poprzedniej.
 */
export function useScrollSpy() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const section = measureSection()
      if (section === state.section) return
      set({ section, override: state.override === section ? section : null, enter: "fade" })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    const resize = new ResizeObserver(schedule)
    resize.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
      resize.disconnect()
    }
  }, [])
}

export function ScrollSpy() {
  useScrollSpy()
  return null
}
