"use client"

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import { flushSync } from "react-dom"
import { useReducedMotion } from "../forma/use-in-view"
import type { DemoWork } from "../shared/content"
import type { PreviewLabels, PreviewProps } from "./Preview"

/**
 * Okno podglądu (Radix Dialog) pobiera się przy pierwszym zamiarze (najechanie,
 * fokus, dotyk karty). Zwykły import do stanu zamiast `next/dynamic`: morf wymaga,
 * żeby okno istniało w DOM synchronicznie, wewnątrz `startViewTransition`.
 */
const loadPreview = () => import("./Preview").then((module) => module.Preview)

/** Nazwa przejścia widoku kadru (karta ↔ okno). */
export const MORPH = "bo-work"

interface WorksContextValue {
  /** Otwiera podgląd; `trigger` — karta, z której kadr „wskakuje” do okna. */
  open: (slug: string, scope: readonly string[], trigger?: HTMLElement | null) => void
  /** Pobiera okno zawczasu (najechanie, fokus). */
  prefetch: () => void
  /** Okno jest otwarte — pętle w tle (slider) stoją, kadr nie ucieka spod morfu. */
  covered: boolean
}

const WorksContext = createContext<WorksContextValue | null>(null)

export function useWorks(): WorksContextValue {
  const value = use(WorksContext)
  if (!value) throw new Error("useWorks: brak <WorksProvider>")
  return value
}

/** Dekodowanie obrazu z limitem czasu — morf nie czeka dłużej niż `limit` ms. */
function decodeImage(src: string, limit = 350): Promise<void> {
  const image = new Image()
  image.src = src
  return Promise.race([
    image.decode().catch(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, limit)),
  ])
}

/** Kadr w całości w oknie przeglądarki — tylko wtedy morf ma skąd i dokąd lecieć. */
function inViewport(node: Element | null): node is HTMLElement {
  if (!node) return false
  const box = node.getBoundingClientRect()
  return (
    box.width > 0 &&
    box.top >= 0 &&
    box.left >= -1 &&
    box.bottom <= innerHeight &&
    box.right <= innerWidth + 1
  )
}

/** Kadr realizacji widoczny na ekranie — oryginał karty albo jedna z kopii toru slidera. */
function visibleMedia(slug: string, preferred: HTMLElement | null): HTMLElement | null {
  if (preferred?.dataset.workMedia === slug && inViewport(preferred)) return preferred
  const all = document.querySelectorAll<HTMLElement>(`[data-work-media="${CSS.escape(slug)}"]`)
  for (const node of all) if (inViewport(node)) return node
  return null
}

/**
 * Stan podglądu realizacji dla całej strony: slider, masonry i paleta ⌘K
 * otwierają to samo okno. Otwarcie i zamknięcie to morf kadru (View
 * Transitions): miniatura „wskakuje” do okna i wraca na swoje miejsce. Bez
 * wsparcia przeglądarki, przy „ogranicz ruch” albo gdy kadr nie jest cały
 * w kadrze — zwykła animacja okna.
 */
export function WorksProvider({
  works,
  groups,
  labels,
  children,
}: {
  works: readonly DemoWork[]
  groups: Record<string, { label: string; description: string }>
  labels: PreviewLabels
  children: ReactNode
}) {
  const reduced = useReducedMotion()
  const [view, setView] = useState<{
    scope: readonly string[]
    index: number
    /** Obraz, który karta już pokazuje (zdekodowany) — okno startuje od niego. */
    still?: { slug: string; src: string }
  } | null>(null)
  const [isOpen, setOpen] = useState(false)
  const [morph, setMorph] = useState(false)
  const [Preview, setPreview] = useState<ComponentType<PreviewProps> | null>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const busy = useRef(false)

  const ensure = useCallback(async () => {
    const component = await loadPreview()
    setPreview(() => component)
    return component
  }, [])

  const prefetch = useCallback(() => void loadPreview(), [])

  const canMorph = useCallback(
    () => !reduced && typeof document.startViewTransition === "function",
    [reduced]
  )

  const open = useCallback(
    async (slug: string, scope: readonly string[], from?: HTMLElement | null) => {
      if (busy.current) return
      const index = Math.max(0, scope.indexOf(slug))
      busy.current = true
      const poster = works.find((work) => work.slug === slug)?.poster
      // Okno pokazuje plakat w pełnej rozdzielczości — musi być zdekodowany, zanim przejście
      // zrobi migawkę „po”, inaczej kadr leciałby pusty (najwyżej 350 ms czekania).
      const [component] = await Promise.all([ensure(), poster ? decodeImage(poster) : null])
      const media = from?.querySelector<HTMLElement>("[data-work-media]") ?? null
      const shown = media?.querySelector("img")?.currentSrc
      const still = shown ? { slug, src: shown } : undefined
      trigger.current = from ?? null
      if (!canMorph() || !inViewport(media)) {
        setPreview(() => component)
        setView({ scope, index, still })
        setOpen(true)
        busy.current = false
        return
      }
      media.style.viewTransitionName = MORPH
      const transition = document.startViewTransition(() => {
        media.style.viewTransitionName = ""
        flushSync(() => {
          setMorph(true)
          setView({ scope, index, still })
          setOpen(true)
        })
      })
      void transition.finished.finally(() => {
        setMorph(false)
        busy.current = false
      })
    },
    [canMorph, ensure, works]
  )

  const close = useCallback(() => {
    if (!view || busy.current) return
    const slug = view.scope[view.index] ?? ""
    const media = canMorph()
      ? visibleMedia(slug, trigger.current?.querySelector("[data-work-media]") ?? null)
      : null
    if (!media) {
      setOpen(false)
      return
    }
    busy.current = true
    flushSync(() => setMorph(true))
    const transition = document.startViewTransition(() => {
      flushSync(() => setOpen(false))
      media.style.viewTransitionName = MORPH
    })
    void transition.finished.finally(() => {
      media.style.viewTransitionName = ""
      setMorph(false)
      busy.current = false
    })
  }, [view, canMorph])

  /** Fokus wraca na kartę oglądanej realizacji (nie tę, od której zaczęto). */
  const returnFocus = useCallback(() => {
    if (!view) return
    const slug = view.scope[view.index] ?? ""
    const original = trigger.current
    if (original?.dataset.workCard === slug && original.tabIndex >= 0 && original.isConnected) {
      original.focus({ preventScroll: true })
      return
    }
    document
      .querySelector<HTMLElement>(`[data-work-card="${CSS.escape(slug)}"]:not([tabindex="-1"])`)
      ?.focus({ preventScroll: true })
  }, [view])

  const value = useMemo<WorksContextValue>(
    () => ({ open: (...args) => void open(...args), prefetch, covered: isOpen }),
    [open, prefetch, isOpen]
  )

  const scoped = view
    ? view.scope.flatMap((slug) => works.filter((work) => work.slug === slug))
    : []

  return (
    <WorksContext value={value}>
      {children}
      {Preview && view && (
        <Preview
          works={scoped}
          groups={groups}
          index={view.index}
          still={view.still}
          open={isOpen}
          morph={morph}
          reduced={reduced}
          labels={labels}
          onIndex={(index) => setView((current) => (current ? { ...current, index } : current))}
          onClose={close}
          onReturnFocus={returnFocus}
        />
      )}
    </WorksContext>
  )
}
