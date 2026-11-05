"use client"

import { useSyncExternalStore } from "react"

/**
 * Wspólna pauza ruchu (WCAG 2.2.2): sygnet, taśma, reel i wideo słuchają
 * jednego przełącznika w nagłówku. Bez decyzji użytkownika ruch stoi tylko
 * wtedy, gdy system prosi o ograniczenie ruchu.
 */
const REDUCE = "(prefers-reduced-motion: reduce)"
let choice: boolean | null = null
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  const media = window.matchMedia(REDUCE)
  media.addEventListener("change", listener)
  return () => {
    listeners.delete(listener)
    media.removeEventListener("change", listener)
  }
}

function snapshot() {
  return choice ?? window.matchMedia(REDUCE).matches
}

/** `true`, gdy ruch ciągły ma stać (wybór użytkownika albo ustawienie systemu). */
export function useMotionPaused() {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}

export function setMotionPaused(paused: boolean) {
  choice = paused
  listeners.forEach((listener) => listener())
}

/** Odczyt poza Reactem (pętle w `gsap.ticker`). */
export function motionPausedNow() {
  return typeof window === "undefined" ? false : snapshot()
}

export function onMotionChange(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
