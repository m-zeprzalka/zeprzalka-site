"use client"
import React from "react"

// Wyselekcjonowane najdziwniejsze, rzadko spotykane symbole i znaki
const chars = [
  "⍟",
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

// Funkcja do generowania losowego znaku
function getRandomChar() {
  return chars[Math.floor(Math.random() * chars.length)]
}

export function Full() {
  // Oblicz liczbę znaków w poziomie i pionie na podstawie rozmiaru okna
  const [dimensions, setDimensions] = React.useState({ cols: 0, rows: 0 })

  React.useEffect(() => {
    function updateSize() {
      const fontSize = 24 // px, zgodnie z text-2xl
      const cols = Math.ceil(window.innerWidth / (fontSize * 0.6))
      const rows = Math.ceil(window.innerHeight / (fontSize * 1.1))
      setDimensions({ cols, rows })
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const lines = React.useMemo(
    () =>
      Array.from({ length: dimensions.rows }, () =>
        Array.from({ length: dimensions.cols }, getRandomChar).join("")
      ),
    [dimensions]
  )

  return (
    <div className="container mx-auto">
      <div
        className="inset-0 font-mono text-2xl leading-none select-none overflow-hidden z-50"
        style={{ letterSpacing: "0.1ch" }}
      >
        <pre className="whitespace-pre leading-none">{lines.join("\n")}</pre>
      </div>
    </div>
  )
}
