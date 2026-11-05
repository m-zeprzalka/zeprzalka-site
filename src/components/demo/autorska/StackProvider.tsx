"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

/**
 * Stan stosu kart: która warstwa jest „na wierzchu” (podpis przycisku „Warstwy”) i do której
 * karty włącznie wszystko jest już przykryte (bryły przykrytych kart się odmontowują — silnik
 * widzi je jako „w kadrze”, bo karta przyklejona stoi w oknie). Do tego `--au-stick`: wysoka
 * karta przykleja się dolną krawędzią do dołu okna, więc nic z niej nie ginie.
 *
 * Jedna lekka obsługa przewijania (rAF, tylko odczyty), żadnego zapisu stylów w trakcie.
 */
interface Stack {
  active: number
  coveredUpTo: number
}

const StackContext = createContext<Stack>({ active: 0, coveredUpTo: -1 })

export function useStack() {
  return useContext(StackContext)
}

/** Margines strony z `autorska.css` (8 / 12 / 16 px) — te same progi co tam. */
function pageMargin(width: number) {
  return width >= 1024 ? 16 : width >= 640 ? 12 : 8
}

/** Nagłówek 56 px + szczelina 12 px (`--au-t`). */
const STICK_TOP = 68

export function StackProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Stack>({ active: 0, coveredUpTo: -1 })

  useEffect(() => {
    const sheets = Array.from(document.querySelectorAll<HTMLElement>("[data-au-sheet]"))
    if (sheets.length === 0) return

    const place = () => {
      const view = window.innerHeight
      const margin = pageMargin(window.innerWidth)
      for (const sheet of sheets) {
        const stick = Math.min(STICK_TOP, view - sheet.offsetHeight - margin)
        sheet.style.setProperty("--au-stick", `${Math.round(stick)}px`)
      }
    }

    let frame = 0
    const read = () => {
      frame = 0
      const view = window.innerHeight
      let active = 0
      let coveredUpTo = -1
      sheets.forEach((sheet, index) => {
        const top = sheet.getBoundingClientRect().top
        if (top <= view * 0.5) active = index
        if (index > 0 && top <= STICK_TOP + 8) coveredUpTo = index - 1
      })
      setStack((prev) =>
        prev.active === active && prev.coveredUpTo === coveredUpTo ? prev : { active, coveredUpTo }
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    place()
    read()
    const resize = new ResizeObserver(() => {
      place()
      onScroll()
    })
    sheets.forEach((sheet) => resize.observe(sheet))
    window.addEventListener("resize", place)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      resize.disconnect()
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <StackContext.Provider value={stack}>{children}</StackContext.Provider>
}
