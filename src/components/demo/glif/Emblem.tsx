"use client"

import { useEffect, useRef, useState } from "react"
import { MARK_GLYPHS, randomOf } from "./alphabet"
import { useGlyphMotion } from "./motion"

export type EmblemKind = "design" | "code" | "motion"

/** Znak spoczynkowy każdej kompetencji: siatka makiety, klawisz polecenia, obiektyw. */
const REST: Record<EmblemKind, string> = { design: "⊞", code: "⌘", motion: "◎" }

const STEP_MS = 45
/** Wejście w kadr: ~400 ms losowania, potem znak staje. Najechanie: krótszy przebieg. */
const ENTER_STEPS = 9
const HOVER_STEPS = 5

/**
 * Znak kompetencji: jeden duży glif z kroju „Glif Symbols”, zachowujący się jak
 * sygnet w logo — przy pierwszym wejściu w kadr i po najechaniu na kartę krótko
 * losuje, po czym staje na swoim znaku. Bez ruchu ciągłego; przy „ogranicz ruch”
 * od razu stoi. Czysta dekoracja (`aria-hidden`).
 */
export function Emblem({ kind }: { kind: EmblemKind }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [glyph, setGlyph] = useState(REST[kind])
  const { reduced } = useGlyphMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const run = (steps: number) => {
      clearTimeout(timer)
      let left = steps
      const step = () => {
        left--
        setGlyph(left > 0 ? randomOf(MARK_GLYPHS) : REST[kind])
        if (left > 0) timer = setTimeout(step, STEP_MS)
      }
      step()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        run(ENTER_STEPS)
      },
      { rootMargin: "0px 0px -15% 0px" }
    )
    observer.observe(node)
    const host = node.closest<HTMLElement>("article")
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") run(HOVER_STEPS)
    }
    host?.addEventListener("pointerenter", onEnter)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      host?.removeEventListener("pointerenter", onEnter)
    }
  }, [kind, reduced])

  return (
    <span ref={ref} aria-hidden="true" className="gl-emblem gl-glyph">
      {glyph}
    </span>
  )
}
