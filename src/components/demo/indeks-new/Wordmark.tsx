"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"

/**
 * Nazwisko na całą szerokość ekranu: gdy wejdzie w kadr (pierwszy piksel),
 * litery wyostrzają się z rozmycia falą od lewej — każda 1000 ms,
 * co 45 ms, razem ok. 1,4 s, niezależnie od tempa przewijania. Bez JS i przy
 * „ogranicz ruch” znak stoi ostry od razu (uzbrojenie robi dopiero skrypt).
 */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const letters = Array.from(text)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return undefined
    // Znak już widoczny przy wejściu na stronę — bez animacji.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.8) return undefined
    node.dataset.armed = ""
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        node.dataset.in = ""
      },
      { threshold: 0 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      delete node.dataset.armed
      delete node.dataset.in
    }
  }, [reduced])

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="ixn-wordmark"
      style={{ "--n": letters.length } as CSSProperties}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="ixn-wordmark__letter"
          style={{ "--i": index } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </p>
  )
}
