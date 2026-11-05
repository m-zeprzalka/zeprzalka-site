"use client"

/*
 * Warstwa glifów koncepcji = wspólny silnik (`shared/glyph`) + dwie rzeczy:
 * - zestaw znaków wybrany przy twarzy (`glyph-store.ts`), wstrzykiwany do każdej powierzchni,
 * - brama startu (`engine-gate.ts`): do jej otwarcia powierzchnie stoją jako statyczne
 *   klatki w tych samych wymiarach co komponenty silnika (wejście strony nie czeka).
 */
import type { CSSProperties, ComponentProps } from "react"
import faceDark from "@/components/demo/shared/portrait/face-glyphs-dark.webp"
import faceLight from "@/components/demo/shared/portrait/face-glyphs-light.webp"
import {
  GlyphFigure as EngineFigure,
  GlyphLens as EngineLens,
  GlyphMedia as EngineMedia,
  GlyphNumber as EngineNumber,
  GlyphPortrait as EnginePortrait,
  GlyphText as EngineText,
  GlyphWordmark as EngineWordmark,
  type FigureShape,
} from "@/components/demo/shared/glyph"
import { cn } from "@/components/demo/forma/cn"
import { useEngineGate } from "./engine-gate"
import { useCharset } from "./glyph-store"

export { GlyphMark, useThemeTransition } from "@/components/demo/shared/glyph"

/** Ustawienia z wyborem odwiedzającego (jawne `settings` komponentu mają pierwszeństwo). */
function useSettings<T extends { settings?: object }>(props: T) {
  const charset = useCharset()
  return charset ? { ...props, settings: { charset, ...props.settings } } : props
}

/** Statyczna klatka twarzy ze znaków (ta sama co w silniku: maska w kolorze tekstu). */
function FaceFrame({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative isolate aspect-[346/461] select-none", className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-current [mask-image:var(--i2-face-light)] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] dark:[mask-image:var(--i2-face-dark)]"
        style={
          {
            "--i2-face-light": `url(${faceLight.src})`,
            "--i2-face-dark": `url(${faceDark.src})`,
          } as CSSProperties
        }
      />
    </div>
  )
}

/** Szkielet mediów przed startem silnika — kropki na czerni, jak wydruk silnika. */
const SKELETON: CSSProperties = {
  backgroundColor: "#0b0b0b",
  backgroundImage: "radial-gradient(circle at center, #3a3a3a 0.9px, transparent 1.3px)",
  backgroundSize: "8px 12.8px",
}

export function GlyphPortrait(props: ComponentProps<typeof EnginePortrait>) {
  const open = useEngineGate()
  const settled = useSettings(props)
  return open ? (
    <EnginePortrait {...settled} />
  ) : (
    <FaceFrame className={props.className} label={props.label} />
  )
}

export function GlyphMedia(props: ComponentProps<typeof EngineMedia>) {
  const open = useEngineGate()
  const settled = useSettings(props)
  return open ? (
    <EngineMedia {...settled} />
  ) : (
    <div
      className={cn("relative isolate overflow-hidden", props.className)}
      style={{ aspectRatio: `${props.width} / ${props.height}`, ...SKELETON }}
    />
  )
}

export function GlyphLens(props: ComponentProps<typeof EngineLens>) {
  const open = useEngineGate()
  const settled = useSettings(props)
  return open ? (
    <EngineLens {...settled} />
  ) : (
    <div className={cn("relative isolate", props.className)}>{props.children}</div>
  )
}

export function GlyphWordmark(props: ComponentProps<typeof EngineWordmark>) {
  const open = useEngineGate()
  const settled = useSettings(props)
  return open ? (
    <EngineWordmark {...settled} />
  ) : (
    <div
      aria-hidden="true"
      className={cn(
        "[container-type:inline-size] relative isolate aspect-[4.6/1] w-full overflow-hidden font-semibold select-none",
        props.className
      )}
    >
      <span className="absolute inset-0 grid place-items-center text-[20.5cqw] leading-none tracking-[-0.05em]">
        {props.text}
      </span>
    </div>
  )
}

/* Tekst i liczby to DOM (bez WebGL) — bez bramy. */
export const GlyphText = (props: ComponentProps<typeof EngineText>) => (
  <EngineText {...useSettings(props)} />
)
export const GlyphNumber = (props: ComponentProps<typeof EngineNumber>) => (
  <EngineNumber {...useSettings(props)} />
)

/** Kształty silnika w kolejności numerów figur (0 kostka, 1 torus, 2 kropla, 3 ośmiościan — AI). */
const SHAPES: readonly FigureShape[] = ["cube", "torus", "drop", "octahedron"]

export function GlyphFigure({
  shape,
  label,
  className,
}: {
  shape: number
  label: string
  className?: string
}) {
  const open = useEngineGate()
  const charset = useCharset()
  return open ? (
    <EngineFigure
      shape={SHAPES[shape] ?? "cube"}
      label={label}
      settings={charset ? { charset } : undefined}
      className={className}
    />
  ) : (
    <div role="img" aria-label={label} className={cn("relative aspect-[4/3]", className)} />
  )
}
