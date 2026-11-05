"use client"

import { useEffect, useRef, useState } from "react"
import { ScanSearch } from "lucide-react"
import { useReducedMotion } from "../../forma/use-in-view"
import { LensEngine } from "./engine"
import { onModeRequest } from "./store"

/**
 * Soczewka rentgenowska: pierścień + etykieta inspektora, a na telefonie
 * przycisk przywołania. Mysz: soczewka idzie za kursorem (sprężyna), rośnie
 * przy nacisku, przykleja się do przycisków. Dotyk: soczewkę przeciąga się
 * kciukiem po niej samej (`touch-action: none` tylko na pierścieniu — strona
 * przewija się normalnie) i odkłada na papier. Przy „ogranicz ruch” soczewki
 * nie ma — warstwę kodu pokazuje sam przełącznik w nagłówku.
 */
export function Lens({ labels }: { labels: { drag: string; summon: string; dismiss: string } }) {
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const engineRef = useRef<LensEngine | null>(null)
  const reduced = useReducedMotion()
  const [coarse, setCoarse] = useState(false)
  const [summoned, setSummoned] = useState(false)
  const [variant, setVariant] = useState<"lens" | "band" | "hidden">("hidden")
  const [formNear, setFormNear] = useState(false)
  const [scrolling, setScrolling] = useState(false)

  // Przy przewijaniu przycisk znika (nie zasłania czytanego tekstu), wraca chwilę po zatrzymaniu.
  useEffect(() => {
    if (!coarse) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      setScrolling(true)
      clearTimeout(timer)
      timer = setTimeout(() => setScrolling(false), 650)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [coarse])

  // Przycisk soczewki chowa się nad formularzem — nie zasłania pól ani klawiatury.
  useEffect(() => {
    const contact = document.getElementById("kontakt")
    if (!contact || !coarse) return
    const observer = new IntersectionObserver(([entry]) => setFormNear(!!entry?.isIntersecting), {
      rootMargin: "0px 0px -30% 0px",
    })
    observer.observe(contact)
    return () => observer.disconnect()
  }, [coarse])

  useEffect(() => {
    const ring = ringRef.current
    const root = ring?.closest<HTMLElement>("[data-rg-root]")
    if (!ring || !root || reduced) return
    const engine = new LensEngine(root, ring, {
      onLabel: (name, size) => {
        const label = labelRef.current
        if (!label) return
        label.dataset.empty = name ? "false" : "true"
        const [nameEl, sizeEl] = label.children
        if (nameEl) nameEl.textContent = name
        if (sizeEl) sizeEl.textContent = size
        label.classList.remove("rg-swap")
        void label.offsetWidth
        label.classList.add("rg-swap")
      },
      onVariant: setVariant,
      onSummon: setSummoned,
    })
    engineRef.current = engine
    setCoarse(engine.coarse)
    engine.start()
    root.setAttribute("data-rg-live", "")
    onModeRequest((next, x, y) => engine.switchMode(next, x, y))

    // Wejście: skan przez ekran jako pokaz; soczewka pojawia się dopiero po ruchu kursora
    // (na dotyku — po przywołaniu przyciskiem).
    let timer: ReturnType<typeof setTimeout> | undefined
    if (window.scrollY < window.innerHeight * 0.5) {
      timer = setTimeout(() => engine.sweep(() => setVariant("lens")), 650)
    } else {
      setVariant("lens")
    }
    return () => {
      clearTimeout(timer)
      onModeRequest(null)
      engine.destroy()
      engineRef.current = null
      root.removeAttribute("data-rg-live")
    }
  }, [reduced])

  if (reduced) return null

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-variant={variant}
        data-coarse={coarse || undefined}
        className="rg-ring"
      >
        <span ref={labelRef} className="rg-ring__label" data-empty="true">
          <span className="rg-t-g" />
          <span className="rg-ring__size" />
        </span>
        {coarse && <span className="rg-ring__hint">{labels.drag}</span>}
      </div>
      {coarse && (
        <button
          type="button"
          onClick={() => setSummoned(engineRef.current?.toggleSummon() ?? false)}
          aria-label={summoned ? labels.dismiss : labels.summon}
          data-hidden={formNear || undefined}
          data-scrolling={scrolling || undefined}
          className="rg-summon fm-press fm-focus"
        >
          <ScanSearch aria-hidden="true" className="size-5" />
        </button>
      )}
    </>
  )
}
