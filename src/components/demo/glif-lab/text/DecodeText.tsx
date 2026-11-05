"use client"

import { useRef, type CSSProperties, type ElementType } from "react"
import { cn } from "@/components/demo/forma/cn"
import { CHARSET_SPECS, FONT_VAR } from "../engine/charsets"
import type { SectionId } from "../lab/config"
import { useVariant } from "../lab/store"
import { Letters } from "./Letters"
import { useDecode } from "./useDecode"

/**
 * Tekst dekodowany z glifów według wariantu sekcji (nagłówki, liczby).
 * Czytnik ekranu dostaje całe zdanie raz; pocięte litery są ukryte przed
 * technologiami asystującymi.
 */
export function DecodeText({
  text,
  section,
  as: Tag = "span",
  id,
  className,
  duration = 1,
}: {
  text: string
  section: SectionId
  as?: ElementType
  id?: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const variant = useVariant(section)
  // Tekst nie miga szybciej niż 12 kl./s, gdy tempo sekcji ustawia jej wideo (D, E).
  useDecode(ref, section, {
    duration,
    view: true,
    maxFps: section === "works" || section === "cta" ? 12 : 60,
  })
  const font = FONT_VAR[CHARSET_SPECS[variant.charset].font]

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("gll-code")}
        style={{ "--gll-glyph-font": font } as CSSProperties}
      >
        <Letters text={text} />
      </span>
    </Tag>
  )
}
