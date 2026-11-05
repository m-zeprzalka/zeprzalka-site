"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { kinetic, scrubFor } from "./gsap"

/** Warunek planszy `sticky` — ten sam co w CSS (`.kn-skill`). */
export const STACK_QUERY =
  "(min-width: 64rem) and (min-height: 43.75rem) and (prefers-reduced-motion: no-preference)"

/**
 * Plansze kompetencji nachodzą na siebie (sticky w CSS). Tu tylko cięcie:
 * gdy następna plansza wjeżdża, poprzednia cofa się do `scale(0.94)`
 * i gaśnie do 25% — głębia montażu bez zmiany układu. Na telefonie
 * i niskich ekranach plansze stoją jedna pod drugą (bez tej sceny).
 */
export function SkillStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    const { gsap } = kinetic()
    const media = gsap.matchMedia()
    media.add(STACK_QUERY, () => {
      const cards = [...host.querySelectorAll<HTMLElement>(".kn-skill")]
      cards.slice(0, -1).forEach((card, index) => {
        const next = cards[index + 1]
        const inner = card.querySelector(".kn-skill-inner")
        if (!next || !inner) return
        gsap.fromTo(
          inner,
          { scale: 1, opacity: 1 },
          {
            scale: 0.94,
            opacity: 0.25,
            ease: "none",
            transformOrigin: "50% 0%",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: scrubFor(),
            },
          }
        )
      })
    })
    return () => media.revert()
  }, [])

  return (
    <div ref={ref} className="kn-skills mt-12 sm:mt-16">
      {children}
    </div>
  )
}
