"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { useTheme } from "next-themes"
import { FONT_FAMILIES } from "../fonts"
import type { SectionId } from "../lab/config"
import { useGlyphMotion, useVariant } from "../lab/store"
import { Surface, engineAvailable, setFamilies, type SurfaceKind } from "./engine"
import { palette } from "./palette"

/** Gęstość ekranu: ≤ 2, na dotyku ≤ 1,5 (glify 6 px nie zyskują na trzykrotnym DPR). */
export function surfaceDpr() {
  const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
  return Math.min(cap, window.devicePixelRatio || 1)
}

/**
 * Wspólne opakowanie powierzchni: tworzy ją przy montowaniu, pilnuje rozmiaru,
 * widoczności (tylko w kadrze i przy widocznej karcie), wariantu z
 * laboratorium i palety motywu, sprząta przy odmontowaniu. Zwraca `null`,
 * gdy przeglądarka nie ma WebGL2 — wtedy zostaje treść HTML pod spodem.
 */
export function useSurface(
  kind: SurfaceKind,
  section: SectionId,
  wrapRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  margin = "120px 0px"
) {
  const variant = useVariant(section)
  const motion = useGlyphMotion()
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  const [surface, setSurface] = useState<Surface | null>(null)
  const [visible, setVisible] = useState(false)
  const first = useRef(variant)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || !engineAvailable()) return
    setFamilies(FONT_FAMILIES)
    const created = new Surface(kind, canvas, first.current)
    const measure = () => {
      const rect = wrap.getBoundingClientRect()
      created.resize(Math.round(rect.width), Math.round(rect.height), surfaceDpr())
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(wrap)
    let inView = false
    const update = () => {
      const shown = inView && !document.hidden
      created.setVisible(shown)
      setVisible(shown)
    }
    const view = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting
        update()
      },
      { rootMargin: margin }
    )
    view.observe(wrap)
    document.addEventListener("visibilitychange", update)
    setSurface(created)
    return () => {
      resize.disconnect()
      view.disconnect()
      document.removeEventListener("visibilitychange", update)
      created.destroy()
      setSurface(null)
    }
  }, [kind, wrapRef, canvasRef, margin])

  useEffect(() => {
    surface?.setVariant(variant)
  }, [surface, variant])

  useEffect(() => {
    surface?.setPalette(palette(variant.tone, dark, kind))
  }, [surface, variant.tone, dark, kind])

  // Wyzwalacz „przewijanie”: każda klatka przewinięcia budzi powierzchnię (także przy pauzie).
  useEffect(() => {
    if (!surface || variant.trigger !== "scroll") return
    const onScroll = () => surface.invalidate()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [surface, variant.trigger])

  return { surface, variant, visible, dark, ...motion }
}

/** Sprężyna wykładnicza (krytycznie tłumiona) — położenie soczewki i siła efektów. */
export function follow(current: number, target: number, dt: number, tau: number) {
  return target + (current - target) * Math.exp(-dt / tau)
}
