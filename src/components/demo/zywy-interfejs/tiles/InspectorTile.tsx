"use client"

import { useId, useState, type CSSProperties } from "react"
import Image from "next/image"
import { cn } from "../../forma/cn"

/**
 * Projektowanie: inspektor, który zmienia kartę na żywo. Promień zewnętrzny
 * i odstęp są suwakami, a promień obrazka liczy się sam — zasada promieni
 * koncentrycznych (zewnętrzny = wewnętrzny + odstęp) widoczna jako wzór.
 */
export function InspectorTile({
  image,
  title,
  category,
  labels,
}: {
  image: string
  title: string
  category: string
  labels: { radius: string; padding: string; shadow: string }
}) {
  const [radius, setRadius] = useState(22)
  const [padding, setPadding] = useState(8)
  const [shadow, setShadow] = useState(true)
  const inner = Math.max(radius - padding, 2)
  const id = useId()

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid flex-1 place-items-center px-6 py-8">
        <figure
          className={cn(
            "w-full max-w-[17rem] bg-fm-surface transition-[border-radius,padding,box-shadow] duration-300 ease-fm-snap",
            shadow ? "shadow-fm-float" : "shadow-fm-ring"
          )}
          style={{ borderRadius: radius, padding } as CSSProperties}
        >
          <Image
            src={image}
            alt=""
            width={720}
            height={466}
            sizes="272px"
            className="aspect-[16/10] w-full object-cover transition-[border-radius] duration-300 ease-fm-snap"
            style={{ borderRadius: inner }}
          />
          <figcaption className="flex items-baseline justify-between gap-3 px-1.5 pt-3 pb-1">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="shrink-0 text-fm-micro text-fm-ink-3">{category}</span>
          </figcaption>
        </figure>
        <p
          className="mt-5 font-mono text-[0.6875rem] text-fm-ink-3 tabular-nums"
          aria-live="polite"
        >
          {radius} = {inner} + {padding}
        </p>
      </div>

      <div className="grid gap-x-5 gap-y-3 border-t border-fm-edge bg-fm-surface/60 px-5 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
        <Slider
          id={`${id}-r`}
          label={labels.radius}
          value={radius}
          min={0}
          max={40}
          onChange={setRadius}
        />
        <Slider
          id={`${id}-p`}
          label={labels.padding}
          value={padding}
          min={0}
          max={20}
          onChange={setPadding}
        />
        <label className="flex h-11 cursor-pointer items-center gap-2.5 text-fm-micro font-medium text-fm-ink-2">
          <input
            type="checkbox"
            checked={shadow}
            onChange={(event) => setShadow(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-5 w-8 rounded-full bg-fm-fill-strong transition-colors duration-200 peer-checked:bg-fm-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fm-ink after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-fm-surface after:shadow-sm after:transition-[translate] after:duration-200 after:ease-fm-snap peer-checked:after:translate-x-3"
          />
          {labels.shadow}
        </label>
      </div>
    </div>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between text-fm-micro">
        <label htmlFor={id} className="font-medium text-fm-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-fm-ink-3 tabular-nums">
          {value} px
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="zi-range"
        style={{ "--zi-fill": `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      />
    </div>
  )
}
