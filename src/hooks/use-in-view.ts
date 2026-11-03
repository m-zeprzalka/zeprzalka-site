"use client"

import { useEffect, useRef, useState } from "react"

/**
 * `true` od pierwszego wejścia elementu w obszar `rootMargin` (jednorazowo).
 * Zastępuje bibliotekę `react-intersection-observer`, z której serwis używał
 * jednej funkcji.
 */
export function useInViewOnce<T extends Element>(rootMargin = "0px") {
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
