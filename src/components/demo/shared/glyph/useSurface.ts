"use client"

import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { useTheme } from "next-themes"
import type { Surface, SurfaceKind } from "./engine/engine"
import { loadEngine, nextSlot } from "./engine/load"
import { palette, type SkeletonTone } from "./engine/palette"
import { useGlyphMotion } from "./motion"
import { withDefaults, type GlyphSettings } from "./settings"

/**
 * Gęstość ekranu: ≤ 2, na dotyku i na słabszych komputerach (≤ 4 wątki — zwykle
 * zintegrowana grafika) ≤ 1,5. Glify 6 px nie zyskują na trzykrotnym DPR, a liczba
 * pikseli do policzenia spada o ~44%.
 */
export function surfaceDpr() {
  const weak = (navigator.hardwareConcurrency || 8) <= 4
  const cap = weak || window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
  return Math.min(cap, window.devicePixelRatio || 1)
}

/**
 * Położenie wskaźnika w px układu elementu (jak `offsetWidth`) — poprawne także wtedy,
 * gdy element albo jego przodek jest skalowany transformem.
 */
export function localPoint(element: HTMLElement, clientX: number, clientY: number) {
  const rect = element.getBoundingClientRect()
  const sx = element.offsetWidth / Math.max(1, rect.width)
  const sy = element.offsetHeight / Math.max(1, rect.height)
  return [(clientX - rect.left) * sx, (clientY - rect.top) * sy] as const
}

/** Margines, w którym powierzchnia powstaje (kadr zbliża się do ekranu). */
const NEAR = "900px 0px"
/** Margines, poza którym powierzchnia jest niszczona (histereza względem NEAR). */
const FAR = "2600px 0px"

/** Ciemny motyw (domyślny w piaskownicy — także zanim `next-themes` się odezwie). */
export function useDark() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme !== "light"
}

/** Ustawienia z domyślnymi, stabilne między renderami (zależności efektów). */
export function useSettings(settings?: Partial<GlyphSettings>): GlyphSettings {
  const merged = withDefaults(settings)
  const { charset, mode, fps, cell, render, decode } = merged
  return useMemo(
    () => ({ ...merged, charset, mode, fps, cell, render, decode }),
    // `merged` jest nowym obiektem co render — liczą się pola.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [charset, mode, fps, cell, render, decode]
  )
}

/**
 * Wspólne opakowanie powierzchni: leniwie ładuje silnik, tworzy powierzchnię
 * przy montowaniu, pilnuje rozmiaru, widoczności (tylko w kadrze i przy
 * widocznej karcie), ustawień i palety motywu, sprząta przy odmontowaniu.
 * Zwraca `surface: null`, dopóki silnik się ładuje albo gdy przeglądarka nie
 * ma WebGL2 — wtedy zostaje warstwa zastępcza z HTML.
 */
export function useSurface(
  kind: SurfaceKind,
  settings: GlyphSettings,
  wrapRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  {
    margin = "160px 0px",
    skeleton = "dark",
    retire = true,
  }: {
    margin?: string
    skeleton?: SkeletonTone
    /** Niszcz powierzchnię daleko poza ekranem (media: `false` — stan odkodowania zostaje). */
    retire?: boolean
  } = {}
) {
  const motion = useGlyphMotion()
  const dark = useDark()
  const [surface, setSurface] = useState<Surface | null>(null)
  const [visible, setVisible] = useState(false)
  /** Silnik niedostępny (brak WebGL2 albo błąd ładowania) — zostaje warstwa zastępcza. */
  const [failed, setFailed] = useState(false)
  const first = useRef(settings)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    let created: Surface | null = null
    let creating = false
    let cancelled = false
    let resize: ResizeObserver | null = null
    let view: IntersectionObserver | null = null
    let inView = false
    const update = () => {
      const shown = inView && !document.hidden
      created?.setVisible(shown)
      setVisible(shown)
    }
    const destroy = () => {
      resize?.disconnect()
      view?.disconnect()
      resize = view = null
      document.removeEventListener("visibilitychange", update)
      created?.destroy()
      created = null
      setSurface(null)
    }
    const create = () => {
      if (created || creating) return
      creating = true
      void loadEngine().then(async (engine) => {
        if (engine) await nextSlot()
        creating = false
        if (cancelled || created) return
        if (!engine) {
          setFailed(true)
          return
        }
        const next = new engine.Surface(kind, canvas, first.current)
        created = next
        // Rozmiar z układu (`offsetWidth`), nie z `getBoundingClientRect` — opakowanie może
        // się skalować transformem (wejście z mniejszego kadru), a płótno ma liczyć pełny kadr.
        const measure = () => next.resize(wrap.offsetWidth, wrap.offsetHeight, surfaceDpr())
        measure()
        resize = new ResizeObserver(measure)
        resize.observe(wrap)
        view = new IntersectionObserver(
          ([entry]) => {
            inView = !!entry?.isIntersecting
            update()
          },
          { rootMargin: margin }
        )
        view.observe(wrap)
        document.addEventListener("visibilitychange", update)
        setSurface(next)
      })
    }
    // Powierzchnia powstaje leniwie — gdy kadr zbliża się do ekranu (NEAR), nie przy hydratacji.
    // Daleko poza ekranem (FAR) jest niszczona (pamięć GPU), chyba że `retire: false`.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) create()
      },
      { rootMargin: NEAR }
    )
    const far = new IntersectionObserver(
      ([entry]) => {
        if (retire && entry && !entry.isIntersecting && created) destroy()
      },
      { rootMargin: FAR }
    )
    near.observe(wrap)
    far.observe(wrap)
    return () => {
      cancelled = true
      near.disconnect()
      far.disconnect()
      destroy()
    }
  }, [kind, wrapRef, canvasRef, margin, retire])

  useEffect(() => {
    surface?.setSettings(settings)
  }, [surface, settings])

  useEffect(() => {
    surface?.setPalette(palette(kind, dark, skeleton))
  }, [surface, dark, kind, skeleton])

  return { surface, visible, failed, dark, ...motion }
}
