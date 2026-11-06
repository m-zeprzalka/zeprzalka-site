"use client"

import { useEffect, useRef, useState } from "react"
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
  const [state, setState] = useState<"static" | "waiting" | "shown">("static")

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (node.getBoundingClientRect().top < window.innerHeight) return
    setState("waiting")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setState("shown")
        observer.disconnect()
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 1000 206"
      className={cn(
        "block w-full fill-current transition-[opacity,filter,translate] duration-1200 ease-(--ease-out)",
        state === "waiting" && "translate-y-6 opacity-0 blur-xl"
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
