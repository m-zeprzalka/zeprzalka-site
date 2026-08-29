"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { ROUTES, type Locale } from "@/i18n/config"

const chars = [
  "⍤",
  "⍨",
  "⍫",
  "⍮",
  "⍯",
  "⍰",
  "⍲",
  "⍳",
  "⍴",
  "⍵",
  "⍶",
  "⍷",
  "⍸",
  "⍹",
  "⍺",
  "⍻",
  "⍼",
  "⍽",
  "⍾",
  "⍿",
  "⎈",
  "⎇",
  "⎋",
  "⎌",
  "⎍",
  "⎎",
  "⎏",
  "⎄",
  "⎅",
  "⎆",
  "⎊",
  "⎉",
  "⎂",
  "⎃",
  "⎀",
  "⎁",
  "⋇",
  "⋉",
  "⋊",
  "⋋",
  "⋌",
  "⋍",
  "⋎",
  "⋏",
  "⋒",
  "⋓",
  "⋔",
  "⋕",
  "⋖",
  "⋗",
  "⋘",
  "⋙",
  "⋚",
  "⋛",
  "⋜",
  "⋝",
  "⋞",
  "⋟",
  "⊜",
  "⊝",
  "⊞",
  "⊟",
  "⊠",
  "⊡",
  "⊢",
  "⊣",
  "⊤",
  "⊥",
  "⊦",
  "⊧",
  "⊨",
  "⊩",
  "⊪",
  "⊫",
  "⊬",
  "⊭",
  "⊮",
  "⊯",
  "∰",
  "∱",
  "∲",
  "∳",
  "∴",
  "∵",
  "∶",
  "∷",
  "∸",
  "∹",
  "∺",
  "∻",
  "∼",
  "∽",
  "∾",
  "∿",
  "⌀",
  "⍂",
  "⍙",
  "⍚",
  "⍛",
  "⍜",
  "⍝",
  "⍞",
  "⍠",
  "⍡",
  "⍢",
  "⍣",
  "⍦",
  "⍧",
  "⍩",
  "⍪",
  "⍬",
  "⍭",
  "⍮",
  "⍯",
  "⧫",
  "⧬",
  "⧭",
  "⧮",
  "⧯",
  "⧰",
  "⧱",
  "⧲",
  "⧳",
  "⧴",
  "⧵",
  "⧶",
  "⧷",
  "⧸",
  "⧹",
  "⧺",
  "⧻",
  "⧼",
  "⧽",
  "⧾",
  "⧿",
  "⨀",
  "⨁",
  "⨂",
  "⨃",
  "⨄",
  "⨅",
  "⨆",
  "⨇",
  "⨈",
  "⨉",
  "⨊",
  "⨋",
  "⨌",
  "⨍",
  "⨎",
  "⨏",
  "⨐",
  "⨑",
  "⨒",
  "⨓",
  "⨔",
  "⨕",
  "⨖",
  "⨗",
  "⨘",
  "⨙",
  "⨚",
  "⨛",
  "⨜",
  "⨝",
  "⨞",
  "⨟",
]

function getRandomChar() {
  return chars[Math.floor(Math.random() * chars.length)]
}

export function Logo({
  locale,
  onClick,
}: {
  locale: Locale
  onClick?: () => void
}) {
  const [animated, setAnimated] = useState("⨝")
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    // Znak podmienia się co sekundę — to ruch ciągły, więc przy ustawieniu
    // „ogranicz ruch" sygnet zostaje statyczny.
    if (reducedMotion) return
    const interval = setInterval(() => setAnimated(getRandomChar()), 1000)
    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <Link href={ROUTES.home[locale]} onClick={onClick} className="flex items-center gap-2 text-xl">
      <span
        className="transition-all duration-150 inline-block"
        style={{ width: "2ch", textAlign: "center" }}
      >
        {animated}
      </span>
      zeprzalka.com
    </Link>
  )
}
