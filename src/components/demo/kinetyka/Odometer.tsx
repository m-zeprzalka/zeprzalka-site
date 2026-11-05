"use client"

import { useEffect, useRef } from "react"
import { kinetic, motionAllowed, playOnEnter } from "./gsap"

/** Czas obrotu bębnów (s) i przesunięcie startu kolejnych cyfr. */
const SPIN = 1.2
const STAGGER = 0.06

/**
 * Liczba jak licznik taśmy w magnetofonie: każda cyfra to kolumna, która —
 * raz, gdy liczba wejdzie w kadr — obraca się od 0 do swojej wartości
 * (1,2 s, `expo.out`); niższe rzędy robią więcej obrotów (ostatnia cyfra dwa),
 * więc liczba „dojeżdża” falą. Przewijanie tylko uruchamia obrót — w spoczynku
 * zawsze stoi prawdziwa wartość. Serwer renderuje stan końcowy (bez JS i przy
 * „ogranicz ruch” liczba po prostu stoi); znaki inne niż cyfry są stałe.
 */
export function Odometer({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const chars = Array.from(value)
  const digits = chars.filter((char) => /\d/.test(char)).length
  let seen = 0

  useEffect(() => {
    const host = ref.current
    if (!host || !motionAllowed()) return
    const { gsap } = kinetic()
    let stop = () => {}
    const ctx = gsap.context(() => {
      const columns = host.querySelectorAll<HTMLElement>("[data-kn-col]")
      const timeline = gsap.timeline({ paused: true })
      columns.forEach((column, index) => {
        const rows = Number(column.dataset.knCol)
        timeline.fromTo(
          column,
          { y: 0, yPercent: 0 },
          { y: 0, yPercent: (-100 * (rows - 1)) / rows, duration: SPIN, ease: "expo.out" },
          index * STAGGER
        )
      })
      stop = playOnEnter(host, timeline)
    }, host)
    return () => {
      stop()
      ctx.revert()
    }
  }, [])

  return (
    <span ref={ref} aria-hidden="true" className="kn-odo">
      {chars.map((char, index) => {
        if (!/\d/.test(char)) {
          return (
            <span key={index} className="kn-odo-static">
              {char}
            </span>
          )
        }
        const digit = Number(char)
        // Obroty: ostatnia cyfra 2, przedostatnia 1, wcześniejsze 0 (jedzie tylko do wartości).
        const turns = Math.max(0, 2 - (digits - 1 - seen))
        seen += 1
        const sequence = Array.from({ length: turns * 10 + digit + 1 }, (_, n) => n % 10)
        return (
          <span key={index} className="kn-odo-window">
            <span
              data-kn-col={sequence.length}
              className="kn-odo-col"
              style={{
                transform: `translateY(${(-100 * (sequence.length - 1)) / sequence.length}%)`,
              }}
            >
              {sequence.map((n, row) => (
                <span key={row}>{n}</span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
