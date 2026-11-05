"use client"

import { useEffect, useRef } from "react"
import { kinetic, motionAllowed, playOnEnter } from "./gsap"
import { Sygnet } from "./Sygnet"

/**
 * Nazwisko na 100vw: litery wchodzą z rozmycia (16 px) i z dołu, jedna po
 * drugiej z zakładką (1,3 s, raz, gdy znak wejdzie na 90% wysokości ekranu) —
 * przewijanie tylko uruchamia wejście, w spoczynku słowo jest zawsze ostre.
 * Przed nazwiskiem glif sygnetu
 * (jak w logo), raz przewinięty przy wejściu. Całe słowo, z ogonkiem „p”,
 * mieści się nad dolną krawędzią z oddechem. Bez JS i przy „ogranicz ruch”:
 * znak stoi od razu.
 */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const chars = Array.from(text)

  useEffect(() => {
    const mark = ref.current
    if (!mark || !motionAllowed()) return
    const { gsap } = kinetic()
    let stop = () => {}
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true }).fromTo(
        mark.querySelectorAll(".kn-mark-ch"),
        { yPercent: 55, opacity: 0, filter: "blur(16px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.05,
        }
      )
      stop = playOnEnter(mark, timeline)
    }, mark)
    return () => {
      stop()
      ctx.revert()
    }
  }, [])

  return (
    <p ref={ref} aria-hidden="true" className="kn-wordmark group select-none">
      {/* Sygnet jak w nagłówku: glif przed nazwiskiem, w całości, na wysokość wersalików. */}
      <Sygnet className="kn-mark-glyph" auto={false} />
      {chars.map((char, index) => (
        // „ł” dostaje lokalny odstęp — przy światle −0,065 em poprzeczka dotykała brzuszka „a”.
        <span key={index} className={char === "ł" ? "kn-mark-ch kn-mark-l" : "kn-mark-ch"}>
          {char}
        </span>
      ))}
    </p>
  )
}
