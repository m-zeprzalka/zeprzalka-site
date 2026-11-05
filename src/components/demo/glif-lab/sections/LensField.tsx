"use client"

import { useEffect, useRef } from "react"
import { follow, useSurface } from "../engine/useSurface"

/**
 * Soczewka kodu (E): koło animowanego kodu w polu obok tekstu CTA, na
 * sprężynie za kursorem; na dotyku skacze do palca, bez interakcji sama
 * dryfuje po krzywej Lissajous. Brzeg koła rozproszony ditheringiem, poza nim
 * kod ledwie widoczny. Najechanie — koło tylko pod kursorem; klik — rozkwita.
 * Dekoracja (`aria-hidden`).
 */
export function LensField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, variant, reduced, auto } = useSurface("lens", "cta", wrapRef, canvasRef)
  const state = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    k: 0,
    idle: 0,
    last: 0,
    bloom: 0,
    inside: false,
    init: false,
  })

  useEffect(() => {
    const wrap = wrapRef.current
    const panel = wrap
    if (!surface || !wrap || !panel) return
    const s = state.current
    surface.setSource({ type: "none" })
    surface.configure({ animate: auto })
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const trigger = variant.trigger === "hover" && coarse ? "continuous" : variant.trigger

    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      const { width, height, dpr } = surface.size
      if (!s.init) {
        s.x = s.tx = width * 0.5
        s.y = s.ty = height * 0.5
        s.init = true
      }
      let smooth = false
      // Bez ruchu użytkownika przez 1,8 s soczewka sama płynie po ósemce.
      if (!reduced && auto && now - s.idle > 1800 && !s.inside) {
        const t = surface.time
        s.tx = width * (0.5 + 0.28 * Math.sin(t * 0.31))
        s.ty = height * (0.5 + 0.26 * Math.sin(t * 0.47 + 1.2))
      }
      s.x = follow(s.x, s.tx, dt, 120)
      s.y = follow(s.y, s.ty, dt, 120)
      const goal = reduced ? 1 : trigger === "hover" ? (s.inside ? 1 : 0) : 1
      s.k = follow(s.k, goal, dt, goal > s.k ? 140 : 260)
      s.bloom = follow(s.bloom, 0, dt, 420)
      // Za kursorem — płynnie (60/s); samoczynny dryf wystarcza w tempie glifów (lżej dla baterii).
      const following = now - s.idle < 1800 || s.inside
      if (
        (following && Math.hypot(s.x - s.tx, s.y - s.ty) > 0.4) ||
        Math.abs(s.k - goal) > 0.004 ||
        s.bloom > 0.01
      )
        smooth = true
      const base = Math.min(width, height) * 0.4
      const radius = Math.max(88, Math.min(coarse ? 140 : 200, base)) * (1 + s.bloom * 0.5)
      dyn.lens = [s.x * dpr, s.y * dpr, radius * dpr, s.k]
      return smooth
    })

    const point = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      return [event.clientX - rect.left, event.clientY - rect.top] as const
    }
    const onMove = (event: PointerEvent) => {
      const [x, y] = point(event)
      s.tx = x
      s.ty = y
      s.idle = performance.now()
      if (event.pointerType === "mouse") s.inside = true
      surface.invalidate()
    }
    const onLeave = () => {
      s.inside = false
      s.idle = performance.now() - 1200
      surface.invalidate()
    }
    const onDown = (event: PointerEvent) => {
      onMove(event)
      if (trigger === "click" || event.pointerType !== "mouse") s.bloom = 1
      surface.invalidate()
    }
    panel.addEventListener("pointermove", onMove)
    panel.addEventListener("pointerdown", onDown)
    panel.addEventListener("pointerleave", onLeave)
    surface.invalidate()
    return () => {
      panel.removeEventListener("pointermove", onMove)
      panel.removeEventListener("pointerdown", onDown)
      panel.removeEventListener("pointerleave", onLeave)
      surface.setFrame(null)
    }
  }, [surface, variant.trigger, reduced, auto])

  return (
    <div ref={wrapRef} aria-hidden="true" className="gll-lens">
      <canvas ref={canvasRef} className="gll-lens__canvas" />
    </div>
  )
}
