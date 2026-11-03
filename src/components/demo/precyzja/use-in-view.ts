"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

/** `true` od pierwszego wejścia elementu w kadr (jednorazowo). */
export function useInView<T extends Element>(rootMargin = "0px 0px -15% 0px") {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return [ref, inView] as const
}

const REDUCE = "(prefers-reduced-motion: reduce)"

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCE)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** `true` przy „ogranicz ruch”. Na serwerze `false`. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCE).matches,
    () => false
  )
}
