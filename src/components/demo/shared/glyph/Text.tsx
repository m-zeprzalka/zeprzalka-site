"use client"

import "./glyph.css"
import { useRef, type CSSProperties, type ElementType, type RefObject } from "react"
import { cn } from "@/components/demo/forma/cn"
import { CHARSET_SPECS, FONT_VAR, TEXT_GLYPHS } from "./charsets"
import { glyphFontVariables } from "./fonts"
import type { GlyphSettings } from "./settings"
import { Letters } from "./text/Letters"
import { useDecode, type DecodeTrigger } from "./text/useDecode"
import { useSettings } from "./useSurface"

/**
 * Napis dekodowany ze znaków (nagłówki, krótkie zdania). Tekst docelowy jest
 * w HTML z serwera; czytnik ekranu dostaje całe zdanie raz (pocięte litery są
 * ukryte przed technologiami asystującymi). Szerokość stała — bez skoków układu.
 */
export function GlyphText({
  text,
  as: Tag = "span",
  trigger = "view",
  duration = 1,
  delay = 0,
  host,
  id,
  className,
  settings: patch,
}: {
  text: string
  as?: ElementType
  trigger?: DecodeTrigger
  duration?: number
  delay?: number
  host?: RefObject<HTMLElement | null>
  id?: string
  className?: string
  settings?: Partial<GlyphSettings>
}) {
  const settings = useSettings({ mode: "wave", ...patch })
  const ref = useRef<HTMLSpanElement>(null)
  useDecode(ref, settings, TEXT_GLYPHS[settings.charset], { trigger, duration, delay, host })
  const font = FONT_VAR[CHARSET_SPECS[settings.charset].font]

  return (
    <Tag id={id} className={cn(glyphFontVariables, className)}>
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
