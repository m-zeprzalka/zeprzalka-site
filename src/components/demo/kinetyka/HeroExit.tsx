"use client"

import { useEffect, useRef } from "react"
import { kinetic, motionAllowed, scrubFor } from "./gsap"

/**
 * Wyjście tytułu: przy przewijaniu wiersze H1 odjeżdżają w górę w trzech
 * tempach (górny najszybciej), więc rozstęp między nimi rośnie — tytuł
 * „rozjeżdża się”, zanim zabierze go krawędź ekranu. Wiersze liczymy po
 * pozycji słów (łamanie zależy od szerokości), tylko `transform`.
 */
export function HeroExit() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hero = ref.current?.closest<HTMLElement>(".kn-hero")
    if (!hero || !motionAllowed()) return
    const { gsap } = kinetic()
    // Wiersze zależą od szerokości — przy zmianie szerokości scena buduje się od nowa.
    let width = window.innerWidth
    let ctx = gsap.context(() => {})
    const build = () => {
      ctx.revert()
      ctx = gsap.context(() => {
        const wordsInTitle = [...hero.querySelectorAll<HTMLElement>("h1 .kn-word")]
        const lines = new Map<number, HTMLElement[]>()
        for (const word of wordsInTitle) {
          const top = Math.round(word.offsetTop)
          lines.set(top, [...(lines.get(top) ?? []), word])
        }
        const rows = [...lines.entries()].sort((a, b) => a[0] - b[0]).map(([, row]) => row)
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: scrubFor() },
        })
        rows.forEach((row, index) => {
          const speed = (rows.length - index) / rows.length
          timeline.to(row, { yPercent: -60 * speed - 20, ease: "none" }, 0)
        })
        const tail = hero.querySelectorAll(".kn-hero-tail")
        timeline.to(tail, { y: () => -window.innerHeight * 0.06, ease: "none" }, 0)
      }, hero)
    }
    build()
    const resize = new ResizeObserver(() => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      build()
    })
    resize.observe(document.documentElement)
    return () => {
      resize.disconnect()
      ctx.revert()
    }
  }, [])

  return <span ref={ref} hidden />
}
