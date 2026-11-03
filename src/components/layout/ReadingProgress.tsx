"use client"

import { useEffect, useRef } from "react"

/**
 * Pasek postępu czytania.
 *
 * Szerokość jest ustawiana bezpośrednio na elemencie, raz na klatkę
 * (`requestAnimationFrame`), a nasłuch przewijania jest pasywny. Wcześniej
 * każde zdarzenie `scroll` zmieniało stan Reacta, czyli wywoływało
 * renderowanie komponentu kilkadziesiąt razy na sekundę — na słabszym
 * telefonie to realny koszt dla płynności (INP). Wygląd bez zmian.
 */
export function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const totalHeight = document.body.scrollHeight - window.innerHeight
      if (totalHeight > 0 && fillRef.current) {
        fillRef.current.style.width = `${(window.scrollY / totalHeight) * 100}%`
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      data-print-hide
      className="sticky top-0 z-60 h-1 surface-glass"
    >
      <div
        ref={fillRef}
        className="h-full bg-gradient-to-r from-primary/20 to-primary"
        style={{ width: "0%" }}
      />
    </div>
  )
}
