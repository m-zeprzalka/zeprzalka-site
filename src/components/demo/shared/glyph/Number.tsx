"use client"

import "./glyph.css"
import { useRef, type CSSProperties, type ElementType } from "react"
import { cn } from "@/components/demo/forma/cn"
import { CHARSET_SPECS, DIGIT_GLYPHS, FONT_VAR } from "./charsets"
import { glyphFontVariables } from "./fonts"
import type { GlyphSettings } from "./settings"
import { Letters } from "./text/Letters"
import { useDecode, type DecodeTrigger } from "./text/useDecode"
import { useSettings } from "./useSurface"

/**
 * Liczba składana ze znaków (cztery najważniejsze liczby): cyfry rozsypują się
 * w glify o „cyfrowej” wadze i wracają falą od lewej. Cyfry tabelaryczne —
 * szerokość nie drgnie. Najechanie puszcza krótki przebieg (dekonstrukcja).
 * `since` — rok początku czegoś, co trwa („od 2016”).
 */
export function GlyphNumber({
  value,
  suffix,
  since = false,
  sinceLabel = "od",
  as: Tag = "span",
  trigger = "view",
  duration = 1,
  delay = 0,
  className,
  settings: patch,
}: {
  value: number | string
  suffix?: string
  since?: boolean
  sinceLabel?: string
  as?: ElementType
  trigger?: DecodeTrigger
  duration?: number
  delay?: number
  className?: string
  settings?: Partial<GlyphSettings>
}) {
  const settings = useSettings({ mode: "wave", ...patch })
  const ref = useRef<HTMLSpanElement>(null)
  useDecode(ref, settings, DIGIT_GLYPHS[settings.charset], { trigger, duration, delay })
  const text = `${since ? `${sinceLabel} ` : ""}${value}${suffix ?? ""}`
  const font = FONT_VAR[CHARSET_SPECS[settings.charset].font]

  return (
    <Tag className={cn(glyphFontVariables, "tabular-nums", className)}>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden="true"
        className="gx-code"
        style={{ "--gx-glyph-font": font } as CSSProperties}
      >
        <Letters text={text} />
      </span>
    </Tag>
  )
}
