"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { useTheme } from "next-themes"
import { loadGlyphFont, readInk } from "./atlas"
import { GlyphField } from "./field"
import { glyphFont } from "./fonts"
import { useGlyphMotion } from "./motion"
import { loadPortrait } from "./portrait"

/**
 * Hero: portret z glifów. Do czasu, aż canvas jest gotowy (i bez JS), widać
 * oryginalny portret ASCII jako obraz — canvas przejmuje go płynnym przejściem.
 * Canvas jest dekoracją (`aria-hidden`), opis niesie `role="img"` na opakowaniu.
 */
export function PortraitField({ src, label }: { src: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<GlyphField | null>(null)
  const [ready, setReady] = useState(false)
  const { auto, reduced } = useGlyphMotion()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const family = glyphFont.style.fontFamily
    const field = new GlyphField(canvas, family)
    fieldRef.current = field
    let alive = true

    const measure = () => {
      const { width, height } = wrap.getBoundingClientRect()
      // Na telefonie gęstość ekranu ograniczona do 1,5 — mniej pikseli do przerysowania.
      const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2
      field.resize(width, height, Math.min(cap, window.devicePixelRatio || 1))
    }
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(wrap)
    const viewObserver = new IntersectionObserver(
      ([entry]) => field.setVisible(!!entry?.isIntersecting && !document.hidden),
      { threshold: 0.05 }
    )
    const onVisibility = () => {
      if (document.hidden) field.setVisible(false)
      else {
        const rect = wrap.getBoundingClientRect()
        field.setVisible(rect.bottom > 0 && rect.top < window.innerHeight)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    void (async () => {
      const [portrait] = await Promise.all([loadPortrait(src), loadGlyphFont(family)])
      if (!alive || !portrait) return
      field.setTheme(readInk(wrap), document.documentElement.classList.contains("dark"))
      measure()
      field.setPortrait(portrait)
      viewObserver.observe(wrap)
      setReady(true)
    })()

    return () => {
      alive = false
      resizeObserver.disconnect()
      viewObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      field.destroy()
      fieldRef.current = null
    }
  }, [src])

  useEffect(() => {
    fieldRef.current?.setMotion(auto, reduced)
  }, [auto, reduced, ready])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !ready) return
    fieldRef.current?.setTheme(readInk(wrap), resolvedTheme === "dark")
  }, [resolvedTheme, ready])

  const point = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top] as const
  }

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      data-ready={ready || undefined}
      className="gl-field"
      onPointerMove={(event) => fieldRef.current?.pointerMove(...point(event))}
      onPointerLeave={() => fieldRef.current?.pointerLeave()}
      onPointerCancel={() => fieldRef.current?.pointerLeave()}
      onPointerDown={(event) => fieldRef.current?.pointerDown(...point(event))}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- zastępczy obraz pod canvasem, bez optymalizacji */}
      <img src={src} alt="" width={300} height={300} className="gl-field__fallback" />
      <canvas ref={canvasRef} aria-hidden="true" className="gl-field__canvas" />
    </div>
  )
}
