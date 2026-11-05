"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { GlyphNumber, GlyphText } from "@/components/demo/shared/glyph"

/**
 * Kiedy napis ma się dekodować ze znaków (reguła: spoczynek zawsze kompletny):
 * `wait` — poza oknem, stoi czytelny; `play` — wszedł w okno z dołu, dekoduje się
 * od razu, do końca; `still` — był w oknie już przy załadowaniu, zostaje czytelny
 * (żadnych znaków na dolnej krawędzi pierwszego ekranu, dopóki nie przewiniesz).
 * Najechanie dalej puszcza krótki przebieg (wyzwalacz `hover` silnika).
 */
function useArmed() {
  const ref = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<"wait" | "play" | "still">("wait")
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let first = true
    const observer = new IntersectionObserver(([entry]) => {
      const initial = first
      first = false
      if (!entry?.isIntersecting) return
      observer.disconnect()
      setState(initial ? "still" : "play")
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return { ref, trigger: state === "play" ? ("mount" as const) : ("hover" as const) }
}

export function ArmedText(props: Omit<ComponentProps<typeof GlyphText>, "trigger">) {
  const { ref, trigger } = useArmed()
  return (
    <span ref={ref}>
      <GlyphText {...props} trigger={trigger} />
    </span>
  )
}

export function ArmedNumber(props: Omit<ComponentProps<typeof GlyphNumber>, "trigger">) {
  const { ref, trigger } = useArmed()
  return (
    <span ref={ref}>
      <GlyphNumber {...props} trigger={trigger} />
    </span>
  )
}
