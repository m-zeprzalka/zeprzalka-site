"use client"

import { useEffect, useRef, useState } from "react"
import { follow, useSurface } from "../engine/useSurface"
import { passPeriod, ScrollSettle } from "../engine/timing"

/** Maska tekstu (biały na przezroczystym) dopasowana do szerokości — źródło glifów. */
function textMask(text: string, family: string, width: number, height: number) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(64, Math.round(width))
  canvas.height = Math.max(16, Math.round(height))
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas
  ctx.font = `600 100px ${family}`
  const metrics = ctx.measureText(text)
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  const size =
    Math.min((canvas.width * 0.985) / textWidth, (canvas.height * 0.96) / textHeight) * 100
  ctx.font = `600 ${size.toFixed(1)}px ${family}`
  const m = ctx.measureText(text)
  const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
  ctx.fillStyle = "#fff"
  ctx.textBaseline = "alphabetic"
  ctx.fillText(
    text,
    (canvas.width - w) / 2 + m.actualBoundingBoxLeft,
    (canvas.height - h) / 2 + m.actualBoundingBoxAscent
  )
  return canvas
}

/**
 * Znak w stopce (H): nazwisko na 100vw złożone z glifów. Przewijanie składa
 * je z rozmycia i rozsypanych znaków (rozmycie 14 px → 0 na tym samym
 * postępie), ciągły — stoi złożone, co kilka sekund przechodzi przebieg;
 * kursor miesza glify pod sobą. Bez JS — zwykły napis.
 */
export function WordmarkField({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, variant, reduced, auto } = useSurface(
    "mark",
    "footer",
    wrapRef,
    canvasRef,
    "200px 0px"
  )
  const [ready, setReady] = useState(false)
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, k: 0, target: 0, last: 0, p: 0, blur: -1 })

  useEffect(() => {
    const wrap = wrapRef.current
    if (!surface || !wrap) return
    let alive = true
    const build = () => {
      const rect = wrap.getBoundingClientRect()
      const family = getComputedStyle(wrap).fontFamily
      surface.setSource({
        type: "text",
        canvas: textMask(text, family, rect.width * 1.5, rect.height * 1.5),
      })
      // Litery muszą mieć z czego się złożyć: co najmniej ~14 rzędów glifów (telefon).
      surface.configure({ minRows: 14 })
      setReady(true)
    }
    void document.fonts.ready.then(() => alive && build())
    const resize = new ResizeObserver(() => alive && build())
    resize.observe(wrap)
    return () => {
      alive = false
      resize.disconnect()
    }
  }, [surface, text])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!surface || !wrap || !canvas) return
    const s = state.current
    surface.configure({ animate: auto })
    surface.configure({ flicker: auto ? 0.02 : 0 })
    const settle = new ScrollSettle()
    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      const { dpr } = surface.size
      let smooth = false
      let p = 1
      if (!reduced && variant.trigger === "scroll") {
        const rect = wrap.getBoundingClientRect()
        const vh = window.innerHeight
        // Złożony, gdy cały znak jest w kadrze; zatrzymane przewijanie dokańcza składanie.
        p = settle.update((vh - rect.top) / (rect.height + 48), surface.visible, dt, 900)
        if (p !== s.p || settle.pending) smooth = true
      }
      s.p = p
      dyn.progress = p
      dyn.loop =
        !reduced && auto && variant.trigger === "continuous"
          ? (surface.time % passPeriod(variant.decode)) / passPeriod(variant.decode)
          : -1
      // Rozmycie złożenia (lubiane wejście z blura) — tylko w trakcie, potem bez filtra.
      const blur = reduced ? 0 : Math.round((1 - p) * 14 * 2) / 2
      if (blur !== s.blur) {
        s.blur = blur
        canvas.style.filter = blur > 0 ? `blur(${blur}px)` : ""
      }
      s.x = follow(s.x, s.tx, dt, 80)
      s.y = follow(s.y, s.ty, dt, 80)
      s.k = follow(s.k, reduced ? 0 : s.target, dt, s.target > s.k ? 120 : 220)
      if (Math.abs(s.k - s.target) > 0.004 || Math.hypot(s.x - s.tx, s.y - s.ty) > 0.3)
        smooth = true
      dyn.lens = [s.x * dpr, s.y * dpr, 120 * dpr, s.k < 0.004 ? 0 : s.k]
      return smooth
    })
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const rect = wrap.getBoundingClientRect()
      s.tx = event.clientX - rect.left
      s.ty = event.clientY - rect.top
      if (s.target === 0) {
        s.x = s.tx
        s.y = s.ty
      }
      s.target = 1
      surface.invalidate()
    }
    const onLeave = () => {
      s.target = 0
      surface.invalidate()
    }
    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerleave", onLeave)
    surface.invalidate()
    return () => {
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerleave", onLeave)
      surface.setFrame(null)
    }
  }, [surface, variant.trigger, variant.decode, reduced, auto])

  return (
    <div ref={wrapRef} aria-hidden="true" data-ready={ready || undefined} className="gll-wordmark">
      <span className="gll-wordmark__text">{text}</span>
      <canvas ref={canvasRef} className="gll-wordmark__canvas" />
    </div>
  )
}
