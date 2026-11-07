"use client"

import { useRef } from "react"
import { useReveal } from "@/app/main-page/_lib/hooks"
import { cn } from "@/lib/utils"

/**
 * Znak „Zeprzałka” na całą szerokość okna, wyostrzający się z rozmycia, gdy
 * wjedzie w kadr (raz, w czasie — przewijanie tylko go uruchamia). SVG
 * z `textLength`, więc napis zawsze dokładnie wypełnia szerokość, bez mierzenia.
 *
 * Bez JS i przy „ogranicz ruch” stoi od razu. Ukrywamy go dopiero po
 * zamontowaniu i tylko wtedy, gdy jest poza kadrem — nikt nie widzi skoku.
 */
export function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const state = useReveal(ref, { threshold: 0.35 })

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 1000 206"
      className={cn(
        // Uzbrojenie poza kadrem bez przejścia — 1,2 s przeliczeń stylu, których nikt nie widzi.
        "block w-full fill-current transition-[opacity,filter,translate] duration-1200 ease-out",
        state === "armed" && "translate-y-6 opacity-0 blur-xl transition-none"
      )}
    >
      <text
        x="0"
        y="166"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        className="font-sans font-semibold tracking-tight"
        fontSize="226"
      >
        {text}
      </text>
    </svg>
  )
}
