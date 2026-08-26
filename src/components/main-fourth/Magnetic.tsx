"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface MagneticProps {
  children: ReactNode
  /** Ile z odległości kursora od środka przejmuje element (0–1). */
  strength?: number
  className?: string
}

/**
 * Element lekko „przyciąga się" do kursora. Efekt włącza się wyłącznie przy
 * precyzyjnym wskaźniku (mysz, trackpad) i poza trybem ograniczonego ruchu —
 * na dotyku nie ma kursora, więc nie ma czego śledzić.
 *
 * Pozycję ustawia `translate` przez rAF, a wygładza ją przejście CSS: brak
 * layoutu w pętli, wszystko na kompozytorze.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reducedMotion) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        node.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`
      })
    }
    const reset = () => {
      cancelAnimationFrame(frame)
      node.style.translate = "0px 0px"
    }

    node.addEventListener("pointermove", onMove)
    node.addEventListener("pointerleave", reset)
    node.addEventListener("blur", reset, true)
    return () => {
      cancelAnimationFrame(frame)
      node.removeEventListener("pointermove", onMove)
      node.removeEventListener("pointerleave", reset)
      node.removeEventListener("blur", reset, true)
    }
  }, [reducedMotion, strength])

  return (
    <span ref={ref} className={cn("m4-magnetic", className)}>
      {children}
    </span>
  )
}
