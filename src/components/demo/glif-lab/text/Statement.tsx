"use client"

import { useRef, type CSSProperties } from "react"
import { cn } from "@/components/demo/forma/cn"
import { CHARSET_SPECS, FONT_VAR } from "../engine/charsets"
import { useVariant } from "../lab/store"
import { Letters } from "./Letters"
import { useDecode } from "./useDecode"

/**
 * Biogram (B): akapit dekodowany z glifów w tempie przewijania — wolno,
 * szerokim pasmem (czas dekodowania z laboratorium). Pierwsze zdanie
 * atramentem, reszta szarością. Czytnik ekranu dostaje zwykły tekst.
 */
export function Statement({
  parts,
  className,
}: {
  parts: readonly { text: string; tone: "ink" | "muted" }[]
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const variant = useVariant("bio")
  useDecode(ref, "bio", { scrollSpan: 0.6, duration: 2.4 })
  const font = FONT_VAR[CHARSET_SPECS[variant.charset].font]

  return (
    <p className={cn("gll-statement", className)}>
      <span className="sr-only">{parts.map((part) => part.text).join(" ")}</span>
      <span
        ref={ref}
        aria-hidden="true"
        className="gll-code"
        style={{ "--gll-glyph-font": font } as CSSProperties}
      >
        {parts.map((part, index) => (
          <span key={index} className={part.tone === "ink" ? "text-fm-ink" : "text-fm-ink-2"}>
            <Letters text={part.text} />
            {index < parts.length - 1 && " "}
          </span>
        ))}
      </span>
    </p>
  )
}
