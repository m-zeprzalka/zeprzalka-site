"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/** Uchwyty jak w edytorze: cztery narożniki i cztery środki krawędzi. */
const HANDLES = [
  [0, 0],
  [50, 0],
  [100, 0],
  [100, 50],
  [100, 100],
  [50, 100],
  [0, 100],
  [0, 50],
] as const

interface Box {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Zasięg samego tekstu, nie bloku: blok ma szerokość kolumny, a projektant
 * zaznacza to, co widać. Suma prostokątów wierszy z `Range.getClientRects()`.
 */
function measureText(target: HTMLElement): Box {
  const range = document.createRange()
  range.selectNodeContents(target)
  const rects = [...range.getClientRects()].filter((rect) => rect.width > 0)
  const origin = target.getBoundingClientRect()
  if (rects.length === 0) return { x: 0, y: 0, w: origin.width, h: origin.height }
  const left = Math.min(...rects.map((rect) => rect.left))
  const right = Math.max(...rects.map((rect) => rect.right))
  return {
    x: left - origin.left,
    y: 0,
    w: right - left,
    h: origin.height,
  }
}

/**
 * Element pokazany jako zaznaczony w narzędziu projektowym: ramka, uchwyty
 * i etykieta z wymiarami mierzonymi na żywo. Po najechaniu etykieta dopisuje
 * parametry kroju — mrugnięcie do projektantów. Całość jest dekoracją
 * (`aria-hidden`), nagłówek pod spodem pozostaje zwykłym `<h1>`.
 */
export function Selection({ tag, children }: { tag: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<Box | null>(null)
  const [specs, setSpecs] = useState("")

  useEffect(() => {
    const target = ref.current?.firstElementChild as HTMLElement | null
    if (!target) return

    const update = () => setBox(measureText(target))
    const observer = new ResizeObserver(update)
    observer.observe(target)
    document.fonts.ready.then(update)

    const style = getComputedStyle(target)
    const size = parseFloat(style.fontSize)
    const tracking = ((parseFloat(style.letterSpacing) / size) * 100).toFixed(1)
    setSpecs(
      `Geist ${style.fontWeight} · ${Math.round(size)}/${Math.round(parseFloat(style.lineHeight))} · ${tracking.replace(".", ",")}%`
    )

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="pz-selection group/sel">
      {children}
      {box && (
        <span
          className="pz-selection__frame"
          aria-hidden="true"
          style={{ "--x": box.x, "--y": box.y, "--w": box.w, "--h": box.h } as React.CSSProperties}
        >
          <span className="pz-selection__border" />
          {HANDLES.map(([x, y]) => (
            <span
              key={`${x}-${y}`}
              className="pz-selection__handle"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          ))}
          <span className="pz-selection__tag">
            <span>{tag}</span>
            <span>
              {Math.round(box.w)} × {Math.round(box.h)}
            </span>
            {specs && (
              <span className="pz-selection__specs hidden group-hover/sel:inline">{specs}</span>
            )}
          </span>
        </span>
      )}
    </div>
  )
}
