"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/** Zestaw znaków sygnetu — ten sam co w obecnym logo serwisu. */
const GLYPHS = Array.from(
  "⍤⍨⍫⍮⍯⍰⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿⎈⎇⎋⎌⎍⎎⎏⎄⎅⎆⎊⎉⎂⎃⎀⎁⋇⋉⋊⋋⋌⋍⋎⋏⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿⌀⍂⍙⍚⍛⍜⍝⍞⍠⍡⍢⍣⍦⍧⍩⍪⍬⍭⧫⧬⧭⧮⧯⧰⧱⧲⧳⧴⧵⧶⧷⧸⧹⧺⧻⧼⧽⧾⧿⨀⨁⨂⨃⨄⨅⨆⨇⨈⨉⨊⨋⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⨞⨟"
)

/** Znak startowy jest stały — HTML z serwera i pierwszy render klienta są identyczne. */
const START = "⨝"
const INTERVAL_MS = 1000

/**
 * Sygnet: znak podmieniany co sekundę. Stałe, kwadratowe pudełko wyśrodkowane
 * w wierszu napisu — zmiana znaku nie przesuwa domeny. Przy „ogranicz ruch”
 * znak stoi. `aria-hidden`: inaczej nazwa linku zmieniałaby się razem z nim.
 */
export function LogoGlyph() {
  const [glyph, setGlyph] = useState(START)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const timer = setInterval(() => {
      setGlyph(GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? START)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [reducedMotion])

  return (
    <span
      aria-hidden="true"
      className="font-logo inline-grid size-[1.2em] place-items-center text-[1.1em] leading-none"
    >
      {glyph}
    </span>
  )
}
