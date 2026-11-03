"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/** Zestaw znaków sygnetu (bez powtórzeń). */
const GLYPHS = Array.from(
  "⍤⍨⍫⍮⍯⍰⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿⎈⎇⎋⎌⎍⎎⎏⎄⎅⎆⎊⎉⎂⎃⎀⎁⋇⋉⋊⋋⋌⋍⋎⋏⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿⌀⍂⍙⍚⍛⍜⍝⍞⍠⍡⍢⍣⍦⍧⍩⍪⍬⍭⧫⧬⧭⧮⧯⧰⧱⧲⧳⧴⧵⧶⧷⧸⧹⧺⧻⧼⧽⧾⧿⨀⨁⨂⨃⨄⨅⨆⨇⨈⨉⨊⨋⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⨞⨟"
)

/**
 * Sygnet: znak podmieniany co sekundę. To ruch ciągły, więc przy ustawieniu
 * „ogranicz ruch” zostaje statyczny. Znak startowy jest stały — HTML
 * z serwera i pierwszy render klienta są identyczne.
 */
export function LogoGlyph() {
  const [glyph, setGlyph] = useState("⨝")
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(
      () => setGlyph(GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "⨝"),
      1000
    )
    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    // aria-hidden: bez tego nazwa linku zmieniałaby się razem ze znakiem.
    <span aria-hidden="true" className="inline-block w-[2ch] text-center">
      {glyph}
    </span>
  )
}
