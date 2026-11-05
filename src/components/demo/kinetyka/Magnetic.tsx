"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "../forma/cn"
import { finePointer, kinetic, motionAllowed } from "./gsap"

/** Siła przyciągania (część przesunięcia kursora) i jego górna granica w px. */
const PULL = 0.3
const LIMIT = 10

/**
 * Magnetyczne CTA: przycisk lekko „pochyla się” do kursora (do 10 px), a jego
 * etykieta o połowę mniej — dwie warstwy, więc ruch ma głębię. Tylko mysz
 * (dotyk nie ma kursora) i tylko bez „ogranicz ruch”; powrót 600 ms.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = ref.current
    const target = host?.firstElementChild as HTMLElement | null
    if (!host || !target || !finePointer() || !motionAllowed()) return
    const { gsap } = kinetic()
    const label = target.querySelector<HTMLElement>("[data-kn-label]")
    const ease = { duration: 0.6, ease: "power3.out" }
    const x = gsap.quickTo(target, "x", ease)
    const y = gsap.quickTo(target, "y", ease)
    const lx = label ? gsap.quickTo(label, "x", ease) : null
    const ly = label ? gsap.quickTo(label, "y", ease) : null

    const move = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()
      const dx = gsap.utils.clamp(-LIMIT, LIMIT, (event.clientX - box.left - box.width / 2) * PULL)
      const dy = gsap.utils.clamp(-LIMIT, LIMIT, (event.clientY - box.top - box.height / 2) * PULL)
      x(dx)
      y(dy)
      lx?.(dx * 0.5)
      ly?.(dy * 0.5)
    }
    const leave = () => {
      x(0)
      y(0)
      lx?.(0)
      ly?.(0)
    }
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    return () => {
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
      gsap.set([target, label], { clearProps: "transform" })
    }
  }, [])

  return (
    // Strefa przyciągania jest o 16 px większa niż przycisk (padding), żeby ruch zaczynał się przed dotknięciem krawędzi.
    <span ref={ref} className={cn("-m-4 inline-flex p-4", className)}>
      {children}
    </span>
  )
}
