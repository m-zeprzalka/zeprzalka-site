"use client"

import { useEffect, useRef } from "react"
import { kinetic, motionAllowed, scrubFor } from "./gsap"

/**
 * Biogram jako napisy filmowe: akapit dzielony na wiersze (SplitText, z
 * ponownym podziałem przy zmianie szerokości), a przez każdy wiersz
 * przechodzi światło — gradient „atrament | ślad” przycięty do tekstu
 * przesuwa się od lewej do prawej, wiersz po wierszu, z zakładką 30%.
 * Świadomie sterowane przewijaniem (od wejścia akapitu na 82% ekranu do
 * 40%) — wypełnianie w tempie czytania to ulubiony efekt właściciela,
 * a niewypełnione wiersze są częścią wzorca. Jedyny wyjątek od zasady
 * „przewijanie tylko uruchamia”. Bez JS i przy „ogranicz ruch”: pełny atrament.
 */
export function StatementText({
  prefix,
  strong,
  suffix,
}: {
  prefix: string
  strong: string
  suffix: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const paragraph = ref.current
    if (!paragraph || !motionAllowed()) return
    const { gsap, SplitText } = kinetic()
    const split = SplitText.create(paragraph, {
      type: "lines",
      linesClass: "kn-sweep",
      autoSplit: true,
      // Bez zwijania białych znaków — inaczej twarde spacje po „w”, „z”, „i” zamieniają się w zwykłe.
      reduceWhiteSpace: false,
      onSplit(self) {
        const timeline = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: paragraph,
            start: "top 82%",
            end: "bottom 40%",
            scrub: scrubFor(),
          },
        })
        self.lines.forEach((line, index) => {
          timeline.fromTo(
            line,
            { backgroundPositionX: "100%" },
            { backgroundPositionX: "0%" },
            index * 0.7
          )
        })
        return timeline
      },
    })
    return () => split.revert()
  }, [])

  return (
    <p ref={ref} className="kn-statement text-pretty">
      {prefix}
      <strong className="font-[620]">{strong}</strong> {suffix}
    </p>
  )
}
