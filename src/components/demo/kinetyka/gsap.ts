"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

let registered = false

/**
 * GSAP z wtyczkami tej koncepcji — rejestrowane raz, wyłącznie w przeglądarce.
 * Przewijanie zostaje natywne (bez ScrollSmoother): ScrollTrigger tylko czyta
 * postęp. `ignoreMobileResize` — chowanie paska adresu na telefonie nie
 * przelicza scen (inaczej sceny podskakują przy każdym ruchu kciuka).
 */
export function kinetic() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText)
    ScrollTrigger.config({ ignoreMobileResize: true })
    registered = true
  }
  return { gsap, ScrollTrigger, SplitText }
}

/** Ruch jest dozwolony (system nie prosi o ograniczenie). */
export function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Główny wskaźnik to mysz (hover + precyzja) — efekty pod kursorem tylko wtedy. */
export function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

/** Wygładzenie scrubu: na dotyku bez opóźnienia (palec = obraz), na myszy krótko. */
export function scrubFor() {
  return finePointer() ? 0.4 : true
}

/**
 * Zasada strony: przewijanie najwyżej URUCHAMIA animację, a stan spoczynkowy jest
 * zawsze kompletny. `playOnEnter` odtwarza gotową oś czasu raz, gdy pierwszy
 * piksel elementu wejdzie w kadr (`line` < 1 przesuwa próg wyżej — tylko tam,
 * gdzie stan przed startem też jest kompletny). Element, który przy
 * starcie leży już nad ekranem (wejście z kotwicy, odświeżenie w połowie strony),
 * dostaje od razu stan końcowy. Zwraca sprzątanie.
 */
export function playOnEnter(
  element: Element,
  timeline: { play: () => unknown; progress: (value: number) => unknown },
  line = 1
) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      if (entry.isIntersecting) timeline.play()
      else if (entry.boundingClientRect.top < 0) timeline.progress(1)
      else return
      observer.disconnect()
    },
    { rootMargin: `0px 0px ${-Math.round((1 - line) * 100)}% 0px` }
  )
  observer.observe(element)
  return () => observer.disconnect()
}
