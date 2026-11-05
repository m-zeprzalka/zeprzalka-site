"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type Ref } from "react"
import Image from "next/image"
import { cn } from "../../forma/cn"
import { useStage, useTimers } from "../use-stage"
import { ReplayButton } from "./ReplayButton"

interface Values {
  radius: number
  padding: number
  shadow: boolean
}

/** Stan surowy (przed sceną) i dopracowany (po niej — i w HTML z serwera). */
const RAW: Values = { radius: 4, padding: 4, shadow: false }
const DONE: Values = { radius: 24, padding: 8, shadow: true }

const LIMITS = { radius: [0, 32], padding: [0, 16] } as const

/** Ruch kursora-ducha: przesunięcie, przeciąganie, klik. */
const MOVE_MS = 520
const DRAG_MS = 900

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Projektowanie produktu (wzór: `esencja/tiles/DesignTile.tsx`): karta realizacji w edycji. Kursor-duch sam
 * dopracowuje ją przy wejściu w kadr — przeciąga promień, odstęp, włącza
 * cień — potem panel należy do odwiedzającego. Promień zdjęcia liczy się
 * z reguły koncentryczności (zewnętrzny − odstęp) i panel to pokazuje.
 * Pierwszy dotyk panelu przerywa scenę.
 */
export function DesignTile({
  work,
  labels,
}: {
  work: { title: string; category: string; poster: string; width: number; height: number }
  labels: {
    radius: string
    padding: string
    shadow: string
    inner: string
    replay: string
    panel: string
  }
}) {
  const { ref, run, replay, idle } = useStage<HTMLDivElement>()
  const { after, clear } = useTimers()
  const [values, setValues] = useState<Values>(DONE)
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false, down: false, drag: false })
  const tween = useRef(0)
  const radiusRef = useRef<HTMLInputElement>(null)
  const paddingRef = useRef<HTMLInputElement>(null)
  const shadowRef = useRef<HTMLButtonElement>(null)
  // Numer przebiegu, który już ruszył — wcześniej (i przed wejściem w kadr) karta jest surowa.
  const [started, setStarted] = useState(0)
  const shown = idle || run > started ? RAW : values
  const shadowId = useId()

  function stop() {
    clear()
    cancelAnimationFrame(tween.current)
    setCursor((c) => ({ ...c, on: false, down: false, drag: false }))
  }

  /** Środek uchwytu suwaka dla wartości — względem sceny. */
  function thumb(
    input: HTMLInputElement | null,
    value: number,
    [min, max]: readonly [number, number]
  ) {
    const stage = ref.current
    if (!input || !stage) return { x: 0, y: 0 }
    const box = input.getBoundingClientRect()
    const origin = stage.getBoundingClientRect()
    const size = 16
    return {
      x: box.left - origin.left + size / 2 + ((value - min) / (max - min)) * (box.width - size),
      y: box.top - origin.top + box.height / 2,
    }
  }

  function drag(
    key: "radius" | "padding",
    from: number,
    to: number,
    input: HTMLInputElement | null
  ) {
    const start = performance.now()
    setCursor((c) => ({ ...c, drag: true }))
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DRAG_MS)
      const value = Math.round(from + (to - from) * easeInOut(t))
      setValues((v) => ({ ...v, [key]: value }))
      const point = thumb(input, value, LIMITS[key])
      setCursor((c) => ({ ...c, ...point }))
      if (t < 1) tween.current = requestAnimationFrame(step)
      else setCursor((c) => ({ ...c, drag: false }))
    }
    tween.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    if (run === 0) return
    const stage = ref.current
    if (!stage) return
    const box = stage.getBoundingClientRect()
    const r0 = thumb(radiusRef.current, RAW.radius, LIMITS.radius)
    const p0 = thumb(paddingRef.current, RAW.padding, LIMITS.padding)
    const toggle = shadowRef.current?.getBoundingClientRect()
    const s0 = toggle
      ? {
          x: toggle.left - box.left + toggle.width / 2,
          y: toggle.top - box.top + toggle.height / 2,
        }
      : p0

    // Kursor wjeżdża z dołu sceny, ustawia trzy wartości i znika.
    after(0, () => {
      setStarted(run)
      setValues(RAW)
      setCursor({ x: box.width * 0.42, y: box.height + 24, on: true, down: false, drag: false })
    })
    let t = 120
    after(t, () => setCursor((c) => ({ ...c, ...r0 })))
    t += MOVE_MS + 80
    after(t, () => setCursor((c) => ({ ...c, down: true })))
    after(t + 120, () => drag("radius", RAW.radius, DONE.radius, radiusRef.current))
    t += 120 + DRAG_MS + 60
    after(t, () => setCursor((c) => ({ ...c, down: false })))
    after(t + 80, () => setCursor((c) => ({ ...c, ...p0 })))
    t += 80 + MOVE_MS + 60
    after(t, () => setCursor((c) => ({ ...c, down: true })))
    after(t + 120, () => drag("padding", RAW.padding, DONE.padding, paddingRef.current))
    t += 120 + DRAG_MS + 60
    after(t, () => setCursor((c) => ({ ...c, down: false })))
    after(t + 80, () => setCursor((c) => ({ ...c, ...s0 })))
    t += 80 + MOVE_MS + 40
    after(t, () => setCursor((c) => ({ ...c, down: true })))
    after(t + 140, () => {
      setValues((v) => ({ ...v, shadow: true }))
      setCursor((c) => ({ ...c, down: false }))
    })
    after(t + 700, () => setCursor((c) => ({ ...c, on: false })))
    return stop
    // `after`/`clear` są stabilne; scena zależy tylko od numeru przebiegu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  const inner = Math.max(0, shown.radius - shown.padding)
  const card = {
    "--bo-r": `${shown.radius}px`,
    "--bo-p": `${shown.padding}px`,
    "--bo-ri": `${inner}px`,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className="relative grid flex-1 grid-rows-[1fr_auto] @lg:grid-cols-[minmax(0,1fr)_13.5rem] @lg:grid-rows-1"
    >
      <ReplayButton label={labels.replay} onClick={replay} className="right-auto left-2" />

      {/* Płótno z kartą w zaznaczeniu */}
      <div className="relative flex flex-col items-center justify-center px-6 pt-12 pb-6 @lg:py-10">
        <div className="relative">
          <span className="absolute -top-7 left-[-7px] rounded-[5px] bg-fm-ink px-1.5 py-0.5 font-mono text-[0.75rem] leading-4 text-fm-inverse">
            {work.title}
          </span>
          <div
            style={card}
            className={cn(
              "bo-design-card w-[11.5rem] bg-fm-surface @lg:w-[13rem]",
              shown.shadow ? "shadow-fm-pop" : "shadow-fm-ring"
            )}
          >
            <div
              className="bo-design-media relative overflow-hidden bg-fm-fill"
              style={{ aspectRatio: `${work.width} / ${work.height}` }}
            >
              <Image src={work.poster} alt="" fill sizes="208px" className="object-cover" />
            </div>
            <div className="px-1 pt-2.5 pb-1">
              <p className="truncate text-[0.8125rem] font-medium tracking-[-0.01em]">
                {work.title}
              </p>
              <p className="truncate text-[0.75rem] text-fm-ink-3">{work.category}</p>
            </div>
          </div>
          {/* Zaznaczenie: obrys i cztery uchwyty — dekoracja, poza drzewem dostępności. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[7px] rounded-[3px] ring-1 ring-fm-ink"
          >
            {[
              "-top-[4px] -left-[4px]",
              "-top-[4px] -right-[4px]",
              "-bottom-[4px] -left-[4px]",
              "-right-[4px] -bottom-[4px]",
            ].map((corner) => (
              <span
                key={corner}
                className={cn(
                  "absolute size-[7px] rounded-[2px] bg-fm-surface ring-1 ring-fm-ink",
                  corner
                )}
              />
            ))}
          </span>
        </div>
        {/* Reguła koncentryczności jako jedna linia pod kartą (panel ma tylko trzy sterowania). */}
        <p aria-live="polite" className="mt-5 font-mono text-[0.75rem] text-fm-ink-3 tabular-nums">
          {labels.inner}: {shown.radius} − {shown.padding} = {inner} px
        </p>
      </div>

      {/* Panel właściwości */}
      <div
        role="group"
        aria-label={labels.panel}
        onPointerDown={stop}
        onKeyDown={stop}
        className="m-2 mt-0 rounded-[1.125rem] bg-fm-surface p-4 shadow-fm-ring @lg:m-2 @lg:ml-0 @lg:self-center"
      >
        <Slider
          ref={radiusRef}
          label={labels.radius}
          value={shown.radius}
          limits={LIMITS.radius}
          onChange={(radius) => setValues((v) => ({ ...v, radius }))}
        />
        <Slider
          ref={paddingRef}
          label={labels.padding}
          value={shown.padding}
          limits={LIMITS.padding}
          onChange={(padding) => setValues((v) => ({ ...v, padding }))}
          className="mt-4"
        />
        <div className="mt-4 flex items-center justify-between">
          <span id={shadowId} className="text-fm-micro font-medium text-fm-ink-2">
            {labels.shadow}
          </span>
          <button
            ref={shadowRef}
            type="button"
            role="switch"
            aria-checked={shown.shadow}
            aria-labelledby={shadowId}
            onClick={() => setValues((v) => ({ ...v, shadow: !v.shadow }))}
            className="bo-switch group/switch -me-1 grid h-11 w-12 shrink-0 place-items-center rounded-full fm-focus"
          >
            {/* Pole trafienia 44 px, widoczny przełącznik 24 × 40 px. */}
            <span className="relative h-6 w-10 rounded-full bg-fm-fill-strong transition-colors duration-200 group-aria-checked/switch:bg-fm-ink">
              <span className="bo-switch__thumb absolute top-0.5 left-0.5 size-5 rounded-full bg-fm-surface shadow-fm-card transition-[translate] duration-300 ease-fm-snap" />
            </span>
          </button>
        </div>
      </div>

      {/* Kursor-duch */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 20"
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-20 h-5 w-4 drop-shadow-[0_2px_3px_oklch(0_0_0/0.25)] transition-[translate,opacity,scale] ease-fm-move",
          cursor.on ? "opacity-100" : "opacity-0"
        )}
        style={{
          translate: `${cursor.x - 2}px ${cursor.y - 2}px`,
          scale: cursor.down ? 0.86 : 1,
          // Przy przeciąganiu kursor idzie za uchwytem klatka w klatkę (bez przejścia).
          transitionDuration: `${cursor.drag ? 0 : MOVE_MS}ms, 200ms, 140ms`,
        }}
      >
        <path
          d="M1 1l13.5 8.2-6 1.4-3 6.4z"
          className="fill-fm-ink stroke-fm-surface"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function Slider({
  ref,
  label,
  value,
  limits: [min, max],
  onChange,
  className,
}: {
  ref: Ref<HTMLInputElement>
  label: string
  value: number
  limits: readonly [number, number]
  onChange: (value: number) => void
  className?: string
}) {
  const fill = ((value - min) / (max - min)) * 100
  return (
    <label className={cn("block", className)}>
      <span className="flex items-baseline justify-between text-fm-micro">
        <span className="font-medium text-fm-ink-2">{label}</span>
        <span className="font-mono text-fm-ink tabular-nums">{value}</span>
      </span>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--bo-fill-pct": `${fill}%` } as CSSProperties}
        className="bo-range mt-2 block w-full"
      />
    </label>
  )
}
