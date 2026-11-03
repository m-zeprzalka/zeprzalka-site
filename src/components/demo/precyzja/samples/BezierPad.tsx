"use client"

import { useCallback, useRef, useState } from "react"

type Point = { x: number; y: number }
const W = 400
const H = 250
const P0: Point = { x: 40, y: 205 }
const P3: Point = { x: 360, y: 55 }

/**
 * Próbka „Projektowanie”: krzywa Béziera z dwoma uchwytami, jak narzędzie
 * pióra. Uchwyty przeciąga się myszą, palcem albo strzałkami z klawiatury
 * (Shift = krok 10). Odczyt współrzędnych w mono pod spodem.
 */
export function BezierPad() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [points, setPoints] = useState<[Point, Point]>([
    { x: 120, y: 40 },
    { x: 270, y: 225 },
  ])
  const [touched, setTouched] = useState(false)

  const move = useCallback((index: 0 | 1, next: Point) => {
    const clamp = (value: number, max: number) => Math.round(Math.min(max - 8, Math.max(8, value)))
    setPoints((current) => {
      const copy = [...current] as [Point, Point]
      copy[index] = { x: clamp(next.x, W), y: clamp(next.y, H) }
      return copy
    })
    setTouched(true)
  }, [])

  const toSvg = (event: React.PointerEvent): Point => {
    const svg = svgRef.current!
    const matrix = svg.getScreenCTM()!.inverse()
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix)
    return { x: point.x, y: point.y }
  }

  const handlers = (index: 0 | 1) => ({
    onPointerDown: (event: React.PointerEvent<SVGGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove: (event: React.PointerEvent<SVGGElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) move(index, toSvg(event))
    },
    onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
      const step = event.shiftKey ? 10 : 2
      const delta: Record<string, Point> = {
        ArrowLeft: { x: -step, y: 0 },
        ArrowRight: { x: step, y: 0 },
        ArrowUp: { x: 0, y: -step },
        ArrowDown: { x: 0, y: step },
      }
      const d = delta[event.key]
      if (!d) return
      event.preventDefault()
      move(index, { x: points[index].x + d.x, y: points[index].y + d.y })
    },
  })

  const [a, b] = points
  const path = `M${P0.x},${P0.y} C${a.x},${a.y} ${b.x},${b.y} ${P3.x},${P3.y}`

  return (
    <figure className="pz-sample">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="pz-bezier"
        data-touched={touched || undefined}
        role="group"
        aria-label="Krzywa Béziera z dwoma uchwytami"
      >
        <path
          d={`M${P0.x},${P0.y} L${a.x},${a.y} M${P3.x},${P3.y} L${b.x},${b.y}`}
          className="pz-bezier__arm"
        />
        <path d={path} className="pz-bezier__curve" />
        {[P0, P3].map((p) => (
          <rect
            key={p.x}
            x={p.x - 4}
            y={p.y - 4}
            width="8"
            height="8"
            className="pz-bezier__anchor"
          />
        ))}
        {points.map((p, i) => (
          <g
            key={i}
            tabIndex={0}
            role="slider"
            aria-label={`Uchwyt ${i + 1}`}
            aria-valuetext={`x ${p.x}, y ${p.y}`}
            className="pz-bezier__handle"
            {...handlers(i as 0 | 1)}
          >
            <circle cx={p.x} cy={p.y} r="16" className="pz-bezier__hit" />
            <circle cx={p.x} cy={p.y} r="4.5" className="pz-bezier__dot" />
          </g>
        ))}
      </svg>
      <figcaption className="pz-sample__caption">
        <span>
          P1 ({a.x}, {a.y}) P2 ({b.x}, {b.y})
        </span>
        <span>{touched ? "cubic-bezier" : "przeciągnij uchwyt"}</span>
      </figcaption>
    </figure>
  )
}
