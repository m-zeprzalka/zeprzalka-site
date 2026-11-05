"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/components/demo/forma/cn"
import { follow } from "./engine/timing"
import { glyphFontVariables } from "./fonts"
import type { GlyphSettings } from "./settings"
import { localPoint, useSettings, useSurface } from "./useSurface"

/** Zasięg plamy (płaty satelitów i falowanie brzegu) jako wielokrotność promienia. */
const REACH = 1.32

/**
 * Obszar CTA z soczewką kodu: nieregularna, stale morfująca plama animowanego
 * kodu idzie za kursorem (na sprężynie, z ogonem, który ją wyciąga w ruchu);
 * na dotyku — za palcem; bez wskaźnika sama dryfuje po ósemce. Wnętrze
 * w 100% czarne ze znakami, brzeg pikselowy (komórki odpadają pojedynczo),
 * poza nią pusto — tło sekcji zostaje tłem. Treść (`children`) leży nad
 * płótnem; płótno to dekoracja (`aria-hidden`). Dotknięcie — plama rozkwita.
 */
export function GlyphLens({
  className,
  children,
  settings: patch,
}: {
  className?: string
  children?: ReactNode
  settings?: Partial<GlyphSettings>
}) {
  // Kod binarny w deszczu — klimat, który właściciel „mega kręci” (Matrix bez katakany).
  const settings = useSettings({ mode: "rain", charset: "binary", ...patch })
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, reduced, auto } = useSurface("lens", settings, wrapRef, canvasRef)
  const state = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    hx: 0,
    hy: 0,
    idle: 0,
    last: 0,
    bloom: 0,
    inside: false,
    init: false,
    touching: false,
    flip: false,
  })

  useEffect(() => {
    const wrap = wrapRef.current
    if (!surface || !wrap) return
    const s = state.current
    surface.setSource({ type: "none" })
    surface.configure({ animate: auto })

    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      const { width, height, dpr } = surface.size
      if (!s.init) {
        s.x = s.tx = s.hx = width * 0.62
        s.y = s.ty = s.hy = height * 0.5
        s.init = true
      }
      let smooth = false
      // Bez ruchu użytkownika przez 1,8 s plama sama płynie po ósemce — powoli (po puszczeniu
      // palca odpływa łagodnie z miejsca, w którym była, a nie skacze).
      const following = now - s.idle < 1800 || s.inside || s.touching
      // Promień z rozmiaru strefy: plama (z płatami i falowaniem brzegu ≈ REACH × promień)
      // zawsze mieści się w strefie — także w niskim oknie na telefonie (350 × 192).
      const short = Math.min(width, height)
      const fit = short / (2 * REACH)
      const radius = Math.min(
        fit * 0.92,
        Math.max(Math.min(84, 0.4 * short), Math.min(190, 0.32 * short))
      )
      // Rozkwit przy dotyku tylko do granicy strefy (średnica ≤ krótszy bok).
      const grow = 1 + s.bloom * Math.max(0, Math.min(0.55, fit / radius - 1))
      const margin = Math.min(short / 2, radius * grow * REACH)
      if (!reduced && auto && !following) {
        const t = surface.time
        s.tx = width * (0.5 + 0.3 * Math.sin(t * 0.29))
        s.ty = height * (0.5 + 0.26 * Math.sin(t * 0.43 + 1.2))
      }
      // Środek plamy (cel kursora, palca i dryfu) trzymany w strefie pomniejszonej o zasięg.
      const clampX = (v: number) => Math.min(width - margin, Math.max(margin, v))
      const clampY = (v: number) => Math.min(height - margin, Math.max(margin, v))
      s.tx = width > 2 * margin ? clampX(s.tx) : width / 2
      s.ty = height > 2 * margin ? clampY(s.ty) : height / 2
      const tau = following ? 110 : 1400
      s.x = follow(s.x, s.tx, dt, tau)
      s.y = follow(s.y, s.ty, dt, tau)
      s.hx = follow(s.hx, s.x, dt, 320)
      s.hy = follow(s.hy, s.y, dt, 320)
      s.bloom = follow(s.bloom, 0, dt, 480)
      const moving =
        Math.hypot(s.x - s.tx, s.y - s.ty) > 0.4 ||
        Math.hypot(s.hx - s.x, s.hy - s.y) > 0.6 ||
        s.bloom > 0.01
      // Za kursorem płynnie (60/s); samoczynny dryf co drugą klatkę (≈30/s) — lżej dla słabej grafiki.
      if (moving) {
        if (following) smooth = true
        else smooth = s.flip = !s.flip
      }
      dyn.lens = [s.x * dpr, s.y * dpr, radius * grow * dpr, 1]
      dyn.tail = [s.hx * dpr, s.hy * dpr]
      return smooth
    })

    const point = (event: PointerEvent) => localPoint(wrap, event.clientX, event.clientY)
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
      if (event.pointerType !== "mouse") s.touching = true
      s.bloom = 1
      surface.invalidate()
    }
    const onUp = () => {
      s.touching = false
      s.idle = performance.now()
      surface.invalidate()
    }
    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerdown", onDown)
    wrap.addEventListener("pointerup", onUp)
    wrap.addEventListener("pointercancel", onUp)
    wrap.addEventListener("pointerleave", onLeave)
    surface.invalidate()
    return () => {
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerdown", onDown)
      wrap.removeEventListener("pointerup", onUp)
      wrap.removeEventListener("pointercancel", onUp)
      wrap.removeEventListener("pointerleave", onLeave)
      surface.setFrame(null)
    }
  }, [surface, reduced, auto])

  return (
    <div
      ref={wrapRef}
      className={cn(glyphFontVariables, "relative isolate touch-pan-y", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      />
      {children}
    </div>
  )
}
