"use client"

import { useEffect, useRef } from "react"
import { follow, useSurface } from "../engine/useSurface"
import { passPeriod, ScrollSettle } from "../engine/timing"

/** Obrót: pochylenie (oś x) i obrót (oś y) jako macierz 3 × 3 (kolumnami). */
function rotation(yaw: number, pitch: number, out: Float32Array) {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  // R = Rx(pitch) · Ry(yaw)
  out.set([cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy])
}

/**
 * Bryła z glifów (C): kostka, torus albo kropla liczone w shaderze (SDF,
 * światło z lewej góry) i oddane rampą wariantu C. Wyzwalacze: ciągły (obrót),
 * przewijanie (obrót z położenia), najechanie (rozpęd pod kursorem, dotyk —
 * ciągły), klik (impuls). Kursor przechyla bryłę ku sobie.
 */
/** Pochylenie każdej bryły: kostka pokazuje trzy ściany, torus — otwór, kropla — prawie z przodu. */
const PITCH = [0.62, 1.05, 0.3] as const

export function EmblemSurface({ shape, label }: { shape: 0 | 1 | 2; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, variant, reduced, auto } = useSurface("emblem", "skills", wrapRef, canvasRef)
  const state = useRef({
    yaw: 0.6 + shape,
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
    surface.setSource({ type: "sdf", shape })
    surface.configure({ gamma: 1 })
    surface.configure({ ceil: 0.92, dgamma: 1.1 })
    surface.configure({ sharp: 0.2 })
  }, [surface, shape])

  useEffect(() => {
    const wrap = wrapRef.current
    const card = wrap?.closest<HTMLElement>("article") ?? wrap
    if (!surface || !wrap || !card) return
    const s = state.current
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const trigger = variant.trigger === "hover" && coarse ? "continuous" : variant.trigger
    surface.configure({ animate: auto })
    surface.configure({ flicker: 0 })

    const settle = new ScrollSettle()
    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      let smooth = false
      if (reduced) {
        rotation(s.yaw, PITCH[shape], dyn.rotation)
        dyn.loop = -1
        return false
      }
      if (trigger === "continuous") {
        if (auto) s.yaw += (dt / 1000) * 0.55
      } else if (trigger === "scroll") {
        const rect = wrap.getBoundingClientRect()
        const yaw = 0.6 + shape + ((window.innerHeight - rect.top) / window.innerHeight) * 2.4
        if (Math.abs(yaw - s.yaw) > 0.0005) smooth = true
        s.yaw = yaw
      } else {
        // Najechanie: rozpęd do 1,6 rad/s; klik: impuls, który gaśnie.
        s.spin = follow(s.spin, s.target, dt, s.target > s.spin ? 260 : 900)
        s.yaw += (dt / 1000) * s.spin
        if (trigger === "click") s.target = follow(s.target, 0, dt, 500)
        if (Math.abs(s.spin) > 0.01) smooth = true
      }
      s.x = follow(s.x, s.tx, dt, 160)
      s.y = follow(s.y, s.ty, dt, 160)
      if (Math.abs(s.x - s.tx) + Math.abs(s.y - s.ty) > 0.002) smooth = true
      rotation(s.yaw + s.x * 0.5, PITCH[shape] + s.y * 0.4, dyn.rotation)

      let loop = -1
      if (trigger === "continuous" && auto) {
        loop = (surface.time % passPeriod(variant.decode)) / passPeriod(variant.decode)
      } else if (trigger === "scroll") {
        const rect = wrap.getBoundingClientRect()
        const raw = (window.innerHeight * 0.9 - rect.top) / (window.innerHeight * 0.7)
        loop = settle.update(raw, surface.visible, dt)
        if (settle.pending) smooth = true
      } else if (s.pass >= 0) {
        const p = Math.max(0, (now - s.pass) / Math.max(900, variant.decode))
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
      if (trigger === "hover") {
        s.target = 1.6
        s.pass = performance.now()
      }
      surface.invalidate()
    }
    const onLeave = () => {
      s.tx = 0
      s.ty = 0
      if (trigger === "hover") s.target = 0
      surface.invalidate()
    }
    const onClick = () => {
      if (trigger !== "click") return
      s.spin = 7
      s.target = 0
      s.pass = performance.now()
      surface.invalidate()
    }
    card.addEventListener("pointermove", onMove)
    card.addEventListener("pointerenter", onEnter)
    card.addEventListener("pointerleave", onLeave)
    card.addEventListener("click", onClick)
    surface.invalidate()
    return () => {
      card.removeEventListener("pointermove", onMove)
      card.removeEventListener("pointerenter", onEnter)
      card.removeEventListener("pointerleave", onLeave)
      card.removeEventListener("click", onClick)
      surface.setFrame(null)
    }
  }, [surface, variant.trigger, variant.decode, reduced, auto, shape])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      data-tone={variant.tone === "ink" ? undefined : variant.tone}
      className="gll-emblem"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="gll-emblem__canvas" />
    </div>
  )
}
