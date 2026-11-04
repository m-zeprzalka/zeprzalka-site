"use client"

import { useEffect, useRef, useState } from "react"
import NumberFlow, { type Format } from "@number-flow/react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"

type Phase = "static" | "armed" | "go"

/**
 * Kiedy liczba ma „dojechać” do wartości. Widoczna od pierwszej klatki — stoi
 * (pierwszy ekran ma ruszać tylko nagłówkiem). Poza kadrem — cofa się do
 * startu i rusza, gdy w kadrze pojawi się choćby piksel. Serwer i hydratacja
 * zawsze renderują wartość docelową.
 */
export function useCountReveal<T extends Element>() {
  const ref = useRef<T>(null)
  const [phase, setPhase] = useState<Phase>("static")

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let first = true
    const observer = new IntersectionObserver(([entry]) => {
      const visible = !!entry?.isIntersecting
      if (first) {
        first = false
        if (visible) observer.disconnect()
        else setPhase("armed")
        return
      }
      if (visible) {
        setPhase("go")
        observer.disconnect()
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, phase] as const
}

/**
 * Liczba z Number Flow (formatowanie Intl — „99,28%”). Przy „ogranicz ruch”
 * nic się nie animuje.
 */
export function Count({
  value,
  format,
  suffix,
  className,
}: {
  value: number
  format?: Format
  suffix?: string
  className?: string
}) {
  const [ref, phase] = useCountReveal<HTMLSpanElement>()
  const reduced = useReducedMotion()

  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={phase === "armed" && !reduced ? 0 : value}
        format={format}
        locales="pl-PL"
        suffix={suffix}
        animated={phase === "go" && !reduced}
        willChange
      />
    </span>
  )
}
