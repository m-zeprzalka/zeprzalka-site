"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Pause, Play } from "lucide-react"
import { kinetic, motionAllowed, scrubFor } from "./gsap"

const STAGGER = 0.055
const CHAR_DURATION = 1.1
const seconds = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Komunikacja wizualna: oś czasu animacji liter jak w programie do motion
 * designu. Litery słowa wchodzą z obrotem i rozmyciem, a znaczniki na osi
 * pokazują start każdej litery. Dopóki użytkownik nie dotknie osi, steruje
 * nią przewijanie (właściciel: „powinien się animować przy scrollowaniu”) —
 * to demonstracja osi czasu, więc stan pośredni pokazuje też suwak i licznik
 * sekund. Suwak i przycisk dają pełną kontrolę. „Ogranicz ruch”: słowo w spoczynku.
 */
export function MotionTimeline({
  word,
  labels,
}: {
  word: string
  labels: { play: string; pause: string; progress: string }
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const manual = useRef(false)
  const [playing, setPlaying] = useState(false)
  const chars = Array.from(word)
  const total = CHAR_DURATION + STAGGER * (chars.length - 1)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !motionAllowed()) return
    const { gsap, ScrollTrigger } = kinetic()
    const sync = () => {
      const progress = timeline.current?.progress() ?? 1
      if (inputRef.current) {
        inputRef.current.value = String(Math.round(progress * 1000))
        inputRef.current.style.setProperty("--kn-fill", `${progress * 100}%`)
      }
      if (timeRef.current) timeRef.current.textContent = `${seconds.format(progress * total)} s`
    }
    const ctx = gsap.context(() => {
      timeline.current = gsap
        .timeline({ paused: true, onUpdate: sync, onComplete: () => setPlaying(false) })
        .from(panel.querySelectorAll(".kn-tl-ch"), {
          yPercent: 115,
          rotate: 18,
          opacity: 0,
          filter: "blur(10px)",
          duration: CHAR_DURATION,
          ease: "expo.out",
          stagger: STAGGER,
        })
      ScrollTrigger.create({
        trigger: panel,
        start: "top 85%",
        end: "bottom 55%",
        scrub: scrubFor(),
        onUpdate: (self) => {
          if (!manual.current) timeline.current?.progress(self.progress)
        },
      })
    }, panel)
    return () => {
      ctx.revert()
      timeline.current = null
    }
  }, [total])

  const toggle = () => {
    const tl = timeline.current
    if (!tl) return
    manual.current = true
    if (tl.isActive()) {
      tl.pause()
      setPlaying(false)
    } else {
      if (tl.progress() >= 1) tl.progress(0)
      tl.play()
      setPlaying(true)
    }
  }

  return (
    <div
      ref={panelRef}
      className="kn-panel flex min-h-80 flex-col overflow-hidden rounded-fm-3xl bg-fm-fill p-5 sm:p-6"
    >
      <p
        aria-hidden="true"
        className="flex flex-1 items-center overflow-hidden py-8 text-[clamp(2.75rem,1.5rem+4.6vw,5rem)] leading-none font-semibold tracking-[-0.06em]"
      >
        {chars.map((char, index) => (
          <span key={index} className="kn-tl-ch inline-block">
            {char}
          </span>
        ))}
      </p>
      <div className="relative mb-2 h-4" aria-hidden="true">
        {chars.map((_, index) => (
          <span
            key={index}
            className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] bg-fm-ink-3"
            style={{ left: `${((index * STAGGER) / total) * 100}%` } as CSSProperties}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? labels.pause : labels.play}
          className="grid size-11 shrink-0 fm-press place-items-center rounded-full bg-fm-ink text-fm-inverse fm-focus"
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-4 fill-current" />
          ) : (
            <Play aria-hidden="true" className="size-4 fill-current" />
          )}
        </button>
        <input
          ref={inputRef}
          type="range"
          min={0}
          max={1000}
          defaultValue={1000}
          aria-label={labels.progress}
          onInput={(event) => {
            manual.current = true
            timeline.current?.pause()
            setPlaying(false)
            timeline.current?.progress(Number(event.currentTarget.value) / 1000)
          }}
          className="kn-range flex-1"
          style={{ "--kn-fill": "100%" } as CSSProperties}
        />
        <span
          ref={timeRef}
          className="w-14 shrink-0 text-end text-fm-small text-fm-ink-3 tabular-nums"
        >
          {seconds.format(total)} s
        </span>
      </div>
    </div>
  )
}
