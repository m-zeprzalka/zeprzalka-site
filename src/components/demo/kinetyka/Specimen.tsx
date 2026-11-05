"use client"

import { useEffect, useRef, useState } from "react"
import { kinetic, motionAllowed, scrubFor } from "./gsap"

interface Metrics {
  cap: number
  x: number
  base: number
}

const MIN = 100
const MAX = 900
const START = 600

/**
 * Projektowanie: specimen kroju, którym złożona jest ta strona. Linie
 * wersalików, wysokości x i linia pisma są mierzone z prawdziwego kroju
 * (canvas `measureText`), grubość jest osią zmienną Geist — przewijanie
 * „pogrubia” litery od 100 do 600, a suwak oddaje decyzję użytkownikowi
 * (od pierwszego dotknięcia przewijanie już nie steruje). Odczyt grubości
 * zawsze zgadza się z literami, więc żaden stan pośredni nie jest fałszywy.
 */
export function Specimen({
  labels,
}: {
  labels: { weight: string; cap: string; x: string; base: string }
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const glyphRef = useRef<HTMLSpanElement>(null)
  const baseRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const touched = useRef(false)
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  const apply = (weight: number) => {
    const rounded = Math.round(weight / 10) * 10
    glyphRef.current?.style.setProperty("font-weight", String(rounded))
    if (readoutRef.current) readoutRef.current.textContent = String(rounded)
    if (inputRef.current) {
      inputRef.current.value = String(rounded)
      inputRef.current.style.setProperty("--kn-fill", `${((rounded - MIN) / (MAX - MIN)) * 100}%`)
    }
  }

  // Pomiar linii z kroju (po wczytaniu fontów i przy zmianie szerokości).
  useEffect(() => {
    const panel = panelRef.current
    const glyph = glyphRef.current
    const base = baseRef.current
    if (!panel || !glyph || !base) return
    const canvas = document.createElement("canvas").getContext("2d")
    const measure = () => {
      if (!canvas) return
      const style = getComputedStyle(glyph)
      const size = parseFloat(style.fontSize)
      canvas.font = `600 ${size}px ${style.fontFamily}`
      const cap = canvas.measureText("H").actualBoundingBoxAscent
      const x = canvas.measureText("x").actualBoundingBoxAscent
      const top = base.getBoundingClientRect().top - panel.getBoundingClientRect().top
      setMetrics({ cap: top - cap, x: top - x, base: top })
    }
    document.fonts?.ready.then(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  // Przewijanie pogrubia litery, dopóki użytkownik nie dotknie suwaka (odczyt zawsze zgodny z literami).
  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !motionAllowed()) return
    const { gsap, ScrollTrigger } = kinetic()
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top 88%",
        end: "center 45%",
        scrub: scrubFor(),
        onUpdate: (self) => {
          if (!touched.current)
            apply(MIN + (START - MIN) * gsap.parseEase("power2.out")(self.progress))
        },
      })
    }, panel)
    return () => ctx.revert()
  }, [])

  const guides: [keyof Metrics, string][] = [
    ["cap", labels.cap],
    ["x", labels.x],
    ["base", labels.base],
  ]

  return (
    <div
      ref={panelRef}
      className="kn-panel relative flex min-h-80 flex-col overflow-hidden rounded-fm-3xl bg-fm-fill p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between text-fm-small">
        <span className="font-medium">Geist</span>
        <span ref={readoutRef} className="text-fm-ink-3 tabular-nums">
          {START}
        </span>
      </div>
      {metrics &&
        guides.map(([key, label]) => (
          <span
            key={key}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 border-t border-fm-edge-strong"
            style={{ top: metrics[key] }}
          >
            {/* Podpis nad linią; „wysokość x” pod swoją — linie wersalików i x leżą blisko siebie. */}
            <span
              className={
                key === "x"
                  ? "absolute end-5 top-1 text-fm-micro text-fm-ink-3 sm:end-6"
                  : "absolute end-5 bottom-1 text-fm-micro text-fm-ink-3 sm:end-6"
              }
            >
              {label}
            </span>
          </span>
        ))}
      <p aria-hidden="true" className="flex flex-1 items-center py-6">
        <span
          ref={glyphRef}
          className="text-[clamp(6rem,4rem+8vw,10rem)] leading-none tracking-[-0.05em]"
          style={{ fontWeight: START }}
        >
          Aa
          <span ref={baseRef} className="inline-block h-0 w-0 align-baseline" />
        </span>
      </p>
      <label className="flex items-center gap-4 text-fm-small font-medium">
        {labels.weight}
        <input
          ref={inputRef}
          type="range"
          min={MIN}
          max={MAX}
          step={10}
          defaultValue={START}
          onInput={(event) => {
            touched.current = true
            apply(Number(event.currentTarget.value))
          }}
          className="kn-range flex-1"
          style={{ "--kn-fill": `${((START - MIN) / (MAX - MIN)) * 100}%` } as React.CSSProperties}
        />
      </label>
    </div>
  )
}
