"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/components/demo/forma/cn"
import { follow } from "./engine/timing"
import { glyphFontVariables } from "./fonts"
import type { GlyphSettings } from "./settings"
import { useSettings, useSurface } from "./useSurface"

export type FigureShape = "cube" | "torus" | "drop" | "octahedron"

const SHAPE: Record<FigureShape, 0 | 1 | 2 | 3> = { cube: 0, torus: 1, drop: 2, octahedron: 3 }
/** Pochylenie bryły: kostka pokazuje trzy ściany, torus — otwór, kropla — prawie z przodu, ośmiościan — wierzchołek. */
const PITCH: Record<FigureShape, number> = { cube: 0.62, torus: 1.05, drop: 0.3, octahedron: 0.45 }

/** Obrót: pochylenie (oś x) i obrót (oś y) jako macierz 3 × 3 (kolumnami). */
function rotation(yaw: number, pitch: number, out: Float32Array) {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  out.set([cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy])
}

/**
 * Bryła ze znaków (figury kompetencji z „Glif · laboratorium”): kostka, torus,
 * kropla albo ośmiościan liczone w shaderze (SDF, światło z lewej góry), oddane rampą
 * zestawu. `spin="auto"` — powolny obrót, najechanie go rozpędza, kursor
 * przechyla bryłę ku sobie, klik daje impuls; `spin="scroll"` — obrót
 * z przewijania strony (towarzysz w rogu: każde położenie jest stanem
 * kompletnym). Proporcja pola: `className` (domyślnie 4 : 3).
 */
export function GlyphFigure({
  shape,
  label,
  spin = "auto",
  className,
  settings: patch,
}: {
  shape: FigureShape
  label: string
  spin?: "auto" | "scroll"
  className?: string
  settings?: Partial<GlyphSettings>
}) {
  // Bryły domyślnie z kropek i kół — spokojniej niż znaki logo (te są dla twarzy i tekstu).
  const settings = useSettings({ mode: "wave", charset: "dots", ...patch })
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, reduced, auto } = useSurface("emblem", settings, wrapRef, canvasRef)
  const state = useRef({
    yaw: 0.6 + SHAPE[shape],
    spin: 0,
    target: 0,
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    last: 0,
    pass: -1,
  })

  useEffect(() => {
    if (!surface) return
    surface.setSource({ type: "sdf", shape: SHAPE[shape] })
    surface.configure({ gamma: 1, ceil: 0.92, dgamma: 1.1, sharp: 0.2, flicker: 0, minCols: 34 })
  }, [surface, shape])

  useEffect(() => {
    const wrap = wrapRef.current
    const host = wrap?.closest<HTMLElement>("[data-gx-host]") ?? wrap
    if (!surface || !wrap || !host) return
    const s = state.current
    surface.configure({ animate: auto })
    const pitch = PITCH[shape]

    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      let smooth = false
      if (reduced) {
        rotation(s.yaw, pitch, dyn.rotation)
        dyn.loop = -1
        return false
      }
      if (spin === "scroll") {
        const yaw = 0.6 + SHAPE[shape] + window.scrollY * 0.0035
        if (Math.abs(yaw - s.yaw) > 0.0005) smooth = true
        s.yaw = yaw
      } else {
        // Spoczynek: 0,45 rad/s; najechanie rozpędza do 1,8; klik — impuls, który gaśnie.
        s.spin = follow(s.spin, s.target, dt, s.target > s.spin ? 260 : 900)
        if (auto) s.yaw += (dt / 1000) * (0.45 + s.spin)
        if (Math.abs(s.spin) > 0.01) smooth = true
      }
      s.x = follow(s.x, s.tx, dt, 160)
      s.y = follow(s.y, s.ty, dt, 160)
      if (Math.abs(s.x - s.tx) + Math.abs(s.y - s.ty) > 0.002) smooth = true
      rotation(s.yaw + s.x * 0.5, pitch + s.y * 0.4, dyn.rotation)

      let loop = -1
      if (s.pass >= 0) {
        const p = Math.max(0, (now - s.pass) / Math.max(900, settings.decode))
        if (p >= 1) s.pass = -1
        else {
          loop = p
          smooth = true
        }
      }
      dyn.loop = loop
      return smooth
    })

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const rect = wrap.getBoundingClientRect()
      s.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      s.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      surface.invalidate()
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      s.target = 1.8
      s.pass = performance.now()
      surface.invalidate()
    }
    const onLeave = () => {
      s.tx = 0
      s.ty = 0
      s.target = 0
      surface.invalidate()
    }
    const onClick = () => {
      s.spin = 7
      s.target = 0
      s.pass = performance.now()
      surface.invalidate()
    }
    const onScroll = () => surface.invalidate()
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerenter", onEnter)
    host.addEventListener("pointerleave", onLeave)
    host.addEventListener("click", onClick)
    if (spin === "scroll") window.addEventListener("scroll", onScroll, { passive: true })
    surface.invalidate()
    return () => {
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerenter", onEnter)
      host.removeEventListener("pointerleave", onLeave)
      host.removeEventListener("click", onClick)
      window.removeEventListener("scroll", onScroll)
      surface.setFrame(null)
    }
  }, [surface, reduced, auto, shape, spin, settings.decode])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={cn(glyphFontVariables, "relative aspect-[4/3]", className)}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
    </div>
  )
}
