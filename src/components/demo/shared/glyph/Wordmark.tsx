"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "@/components/demo/forma/cn"
import { easeOut, follow } from "./engine/timing"
import { glyphFontVariables } from "./fonts"
import type { GlyphSettings } from "./settings"
import { localPoint, useSettings, useSurface } from "./useSurface"

/** Maska tekstu (biały na przezroczystym) dopasowana do szerokości — źródło glifów. */
function textMask(text: string, font: string, weight: string, width: number, height: number) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(64, Math.round(width))
  canvas.height = Math.max(16, Math.round(height))
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas
  ctx.font = `${weight} 100px ${font}`
  const metrics = ctx.measureText(text)
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  const size =
    Math.min((canvas.width * 0.985) / textWidth, (canvas.height * 0.96) / textHeight) * 100
  ctx.font = `${weight} ${size.toFixed(1)}px ${font}`
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

const ASSEMBLE_MS = 1500

/**
 * Wielki napis (np. „Zeprzałka” na 100vw w stopce) złożony ze znaków. Wchodzi
 * raz, gdy pojawi się w kadrze: składa się z rozsypanych glifów i rozmycia
 * (14 px → 0) w 1,5 s. Potem stoi i lekko żyje; mysz i palec rozsypują znaki
 * pod sobą w nieregularnym, morfującym obszarze, dotknięcie puszcza falę.
 * Bez JS i do startu silnika — zwykły napis w tym samym kroju (bez skoku).
 * Proporcja pola: `className` (domyślnie 4,6 : 1).
 */
export function GlyphWordmark({
  text,
  className,
  style,
  settings: patch,
}: {
  text: string
  /** Proporcja, marginesy, krój — pole trafienia to wyłącznie to pudełko. */
  className?: string
  style?: CSSProperties
  settings?: Partial<GlyphSettings>
}) {
  const settings = useSettings({ mode: "dissolve", ...patch })
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { surface, reduced, auto } = useSurface("mark", settings, wrapRef, canvasRef, {
    margin: "200px 0px",
  })
  const [ready, setReady] = useState(false)
  const state = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    hx: 0,
    hy: 0,
    k: 0,
    target: 0,
    last: 0,
    start: -1,
    blur: -1,
    ripple: -1,
    rx: 0,
    ry: 0,
    coarse: false,
    moved: 0,
  })

  useEffect(() => {
    const wrap = wrapRef.current
    const label = wrap?.firstElementChild as HTMLElement | null
    if (!surface || !wrap || !label) return
    let alive = true
    const build = () => {
      const rect = wrap.getBoundingClientRect()
      const style = getComputedStyle(label)
      surface.setSource({
        type: "text",
        canvas: textMask(
          text,
          style.fontFamily,
          style.fontWeight,
          rect.width * 1.5,
          rect.height * 1.5
        ),
      })
      // Litery muszą mieć z czego się złożyć: co najmniej ~14 rzędów glifów (telefon).
      surface.configure({ minRows: 14 })
      surface.whenRendered(() => alive && setReady(true))
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
    surface.configure({ animate: auto, flicker: auto ? 0.02 : 0 })
    const view = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.intersectionRatio < 0.35 || s.start >= 0) return
        s.start = performance.now()
        view.disconnect()
        surface.invalidate()
      },
      { threshold: [0, 0.35] }
    )
    if (reduced) s.start = 0
    else view.observe(wrap)

    surface.setFrame((now, dyn) => {
      const dt = s.last ? Math.min(64, now - s.last) : 16
      s.last = now
      const { dpr } = surface.size
      let smooth = false
      // Wejście w czasie (przewijanie tylko je uruchamia); przed nim — rozsypane.
      const raw = s.start < 0 ? 0 : reduced ? 1 : Math.min(1, (now - s.start) / ASSEMBLE_MS)
      const p = easeOut(raw)
      if (s.start >= 0 && raw < 1) smooth = true
      dyn.progress = p
      dyn.loop = -1
      const blur = reduced ? 0 : Math.round((1 - p) * 14 * 2) / 2
      if (blur !== s.blur) {
        s.blur = blur
        canvas.style.filter = blur > 0 ? `blur(${blur}px)` : ""
      }
      s.x = follow(s.x, s.tx, dt, 80)
      s.y = follow(s.y, s.ty, dt, 80)
      s.hx = follow(s.hx, s.x, dt, 260)
      s.hy = follow(s.hy, s.y, dt, 260)
      s.k = follow(s.k, reduced ? 0 : s.target, dt, s.target > s.k ? 120 : 320)
      // Płynnie tylko w ruchu kursora/palca i w trakcie narastania/gaśnięcia plamy.
      if (Math.abs(s.k - s.target) > 0.004 || (s.k > 0.01 && now - s.moved < 180)) smooth = true
      dyn.lens = [s.x * dpr, s.y * dpr, (s.coarse ? 90 : 120) * dpr, s.k < 0.004 ? 0 : s.k]
      dyn.tail = [s.hx * dpr, s.hy * dpr]
      if (s.ripple >= 0 && !reduced) {
        const age = now - s.ripple
        const strength = 1 - age / 1200
        if (strength <= 0) s.ripple = -1
        else {
          dyn.ripple = [s.rx * dpr, s.ry * dpr, age * 0.8 * dpr, strength]
          smooth = true
        }
      }
      if (s.ripple < 0) dyn.ripple = [0, 0, 0, 0]
      return smooth
    })

    const point = (event: PointerEvent) => localPoint(wrap, event.clientX, event.clientY)
    const onMove = (event: PointerEvent) => {
      const [x, y] = point(event)
      s.tx = x
      s.ty = y
      s.moved = performance.now()
      if (s.k < 0.05) {
        s.x = s.hx = x
        s.y = s.hy = y
      }
      if (event.pointerType === "mouse" || event.buttons) s.target = 1
      surface.invalidate()
    }
    const onDown = (event: PointerEvent) => {
      s.coarse = event.pointerType !== "mouse"
      const [x, y] = point(event)
      s.ripple = performance.now()
      s.rx = x
      s.ry = y
      onMove(event)
      s.target = 1
    }
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") s.target = 0
      surface.invalidate()
    }
    const onLeave = () => {
      s.target = 0
      surface.invalidate()
    }
    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerdown", onDown)
    wrap.addEventListener("pointerup", onUp)
    wrap.addEventListener("pointercancel", onLeave)
    wrap.addEventListener("pointerleave", onLeave)
    surface.invalidate()
    return () => {
      view.disconnect()
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerdown", onDown)
      wrap.removeEventListener("pointerup", onUp)
      wrap.removeEventListener("pointercancel", onLeave)
      wrap.removeEventListener("pointerleave", onLeave)
      surface.setFrame(null)
    }
  }, [surface, reduced, auto])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      data-ready={ready || undefined}
      className={cn(
        glyphFontVariables,
        "group/gxw [container-type:inline-size] relative isolate aspect-[4.6/1] w-full touch-pan-y overflow-hidden font-semibold select-none",
        className
      )}
      style={style}
    >
      <span className="pointer-events-none absolute inset-0 grid place-items-center text-[20.5cqw] leading-none tracking-[-0.05em] transition-opacity duration-400 group-data-[ready]/gxw:opacity-0">
        {text}
      </span>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  )
}
