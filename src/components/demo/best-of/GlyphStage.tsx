"use client"

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "../forma/cn"
import { useReducedMotion } from "../forma/use-in-view"
import portrait from "../shared/portrait/portrait-luma-soft.webp"
import { CODE_GLYPHS, PRINT_GLYPHS } from "./glyphs/alphabet"
import { loadFont, readFamily } from "./glyphs/atlas"
import { glyphFont } from "./glyphs/fonts"
import { GlyphStage as Engine, type PortraitSource, type Rect } from "./glyphs/stage"

/** Portret (404 × 505, szarość + alfa) → tablice jasności i krycia. */
async function loadPortrait(): Promise<PortraitSource | null> {
  const image = new Image()
  image.src = portrait.src
  try {
    await image.decode()
  } catch {
    return null
  }
  const { naturalWidth: width, naturalHeight: height } = image
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(image, 0, 0)
  const data = ctx.getImageData(0, 0, width, height).data
  const luma = new Float32Array(width * height)
  const alpha = new Float32Array(width * height)
  for (let i = 0; i < luma.length; i++) {
    luma[i] = (data[i * 4] ?? 0) / 255
    alpha[i] = (data[i * 4 + 3] ?? 0) / 255
  }
  return { width, height, luma, alpha }
}

const relative = (node: Element, origin: DOMRect): Rect => {
  const box = node.getBoundingClientRect()
  return { x: box.left - origin.left, y: box.top - origin.top, w: box.width, h: box.height }
}

/**
 * Ciemny panel kontaktu jako scena glifów: portret z kropek i koło kodu
 * binarnego, które idzie za kursorem (pomysł właściciela: „cta z okrągłym
 * obszarem animowanego kodu … klimat Matrixa”). Na dotyku koło idzie za palcem,
 * bez wskaźnika dryfuje wolno po twarzy. Treść panelu (nagłówek, opis, e-mail)
 * przychodzi z serwera jako `children`; znaczniki `data-bo-face` (gdzie stoi
 * twarz) i `data-bo-quiet` (pod tekstem glify przygasają) mówią scenie, jak
 * się ułożyć. Canvas to dekoracja; opis niesie `role="img"` na warstwie twarzy.
 * Pauza zatrzymuje dryf, deszcz i migotanie (WCAG 2.2.2); „ogranicz ruch” —
 * statyczna klatka z kołem na wysokości oczu.
 */
export function GlyphStage({
  children,
  labels,
  className,
}: {
  children: ReactNode
  labels: { pause: string; play: string }
  className?: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const panel = panelRef.current
    const canvas = canvasRef.current
    if (!panel || !canvas) return
    const families = { glyph: glyphFont.style.fontFamily, mono: readFamily("--font-geist-mono") }
    const engine = new Engine(canvas, families)
    engineRef.current = engine
    let alive = true

    const measure = () => {
      const origin = panel.getBoundingClientRect()
      const face = panel.querySelector("[data-bo-face]")
      if (!face) return
      const quiet = [...panel.querySelectorAll("[data-bo-quiet]")].map((node) =>
        relative(node, origin)
      )
      const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
      engine.layout(
        origin.width,
        origin.height,
        Math.min(cap, window.devicePixelRatio || 1),
        relative(face, origin),
        quiet
      )
    }
    const resize = new ResizeObserver(() => measure())
    const view = new IntersectionObserver(([entry]) => engine.setVisible(!!entry?.isIntersecting), {
      threshold: 0.08,
    })
    const onVisibility = () => engine.setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)

    void (async () => {
      const [source] = await Promise.all([
        loadPortrait(),
        loadFont(families.glyph, PRINT_GLYPHS),
        loadFont(families.mono, CODE_GLYPHS),
        document.fonts.ready,
      ])
      if (!alive || !source) return
      engine.setPortrait(source)
      measure()
      resize.observe(panel)
      view.observe(panel)
      setReady(true)
    })()

    return () => {
      alive = false
      resize.disconnect()
      view.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setMotion(!paused, reduced)
  }, [paused, reduced, ready])

  const point = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top] as const
  }

  return (
    <div
      ref={panelRef}
      data-ready={ready || undefined}
      className={cn("bo-stage", className)}
      onPointerMove={(event) => {
        // Dotyk: koło idzie za palcem tylko wtedy, gdy palec jest na panelu.
        if (event.pointerType !== "mouse" && event.buttons === 0) return
        engineRef.current?.pointerMove(...point(event))
      }}
      onPointerDown={(event) => engineRef.current?.pointerMove(...point(event))}
      onPointerLeave={() => engineRef.current?.pointerLeave()}
      onPointerUp={(event) => event.pointerType !== "mouse" && engineRef.current?.pointerLeave()}
      onPointerCancel={() => engineRef.current?.pointerLeave()}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="bo-stage__canvas" />
      {children}
      <button
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={labels.pause}
        title={paused ? labels.play : labels.pause}
        className="absolute top-3 right-3 z-[2] grid size-11 fm-press place-items-center rounded-full bg-white/8 text-white/75 shadow-[inset_0_0_0_1px_oklch(1_0_0/0.12)] fm-focus transition-[background-color,color,scale] hover:bg-white/14 hover:text-white focus-visible:outline-white motion-reduce:hidden sm:top-4 sm:right-4"
      >
        {paused ? (
          <Play aria-hidden="true" className="size-3.5 translate-x-px fill-current" />
        ) : (
          <Pause aria-hidden="true" className="size-3.5 fill-current" />
        )}
      </button>
    </div>
  )
}
