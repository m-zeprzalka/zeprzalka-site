"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import { kinetic, motionAllowed, scrubFor } from "./gsap"
import { setMotionPaused, useMotionPaused } from "./motion"
import { RollText } from "./RollText"

/** Spokojne fragmenty reelu (s): mało ruchu, dobry kontrast z płótnem danego motywu. */
const CALM_LIGHT = 4
const CALM_DARK = 11

interface ReelVideo {
  webm: string
  mp4: string
  poster: string
}

/**
 * Okno: słowo „Portfolio” na całą szerokość ekranu jest szablonem, przez
 * który widać reel. Warstwa-szablon ma kolor płótna i litery w kolorze
 * przeciwnym, a tryb mieszania (`screen` w jasnym, `multiply` w ciemnym)
 * zostawia wideo wyłącznie w literach. Przewijanie (scena sticky):
 *   0–35%  litery rosną ×1 → ×1,5, reel gra w literach (trzymanie),
 *   35–62% szablon gaśnie i rośnie dalej → reel wychodzi z liter na cały ekran,
 *   62–100% kadr zmniejsza się z pełnego ekranu do kadru w siatce.
 * Telefon w pionie: słowo stoi pionowo (CSS), reszta bez zmian.
 * Bez JS i przy „ogranicz ruch”: zwykły nagłówek i kadr z plakatem.
 */
export function Okno({
  video,
  title,
  lead,
  count,
  link,
  labels,
}: {
  video: ReelVideo
  title: string
  lead: string
  count: string
  link: { label: string; href: string }
  labels: { pause: string; play: string; fallback: string }
}) {
  preload(video.poster, { as: "image" })
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const paused = useMotionPaused()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)

  // Scena przewijania.
  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame || !motionAllowed()) return
    const { gsap } = kinetic()
    const ctx = gsap.context(() => {
      const word = section.querySelectorAll(".kn-stencil-word")
      const stencil = section.querySelectorAll(".kn-stencil")
      const media = frame.querySelector("video")
      // Skala, przy której kadr z siatki przykrywa całą scenę (2% zapasu). Kadr nie leży
      // na środku sceny (pod nim jest opis), więc liczymy z odległości jego środka od środka sceny.
      const stage = frame.offsetParent as HTMLElement | null
      const cover = () => {
        const width = stage?.offsetWidth ?? window.innerWidth
        const height = stage?.offsetHeight ?? window.innerHeight
        const dx = Math.abs(frame.offsetLeft + frame.offsetWidth / 2 - width / 2)
        const dy = Math.abs(frame.offsetTop + frame.offsetHeight / 2 - height / 2)
        return (
          Math.max(
            (width / 2 + dx) / (frame.offsetWidth / 2),
            (height / 2 + dy) / (frame.offsetHeight / 2)
          ) * 1.02
        )
      }
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: scrubFor(),
            invalidateOnRefresh: true,
          },
        })
        // Promień kadru jest stały: przy skali „cover” narożniki leżą poza ekranem (bez przemalowań co klatkę).
        .fromTo(frame, { scale: cover }, { scale: cover, duration: 0.62 }, 0)
        // Słowo jest złożone 1,5× większe (CSS) — skala 2/3 to jego rozmiar „naturalny”.
        .fromTo(word, { scale: 2 / 3 }, { scale: 1, duration: 0.35 }, 0)
        .to(word, { scale: 1.75, ease: "power1.in", duration: 0.27 }, 0.35)
        // autoAlpha: po zgaśnięciu szablon dostaje visibility: hidden — znika też koszt mieszania warstw.
        .to(stencil, { autoAlpha: 0, duration: 0.2 }, 0.42)
        // W literach reel jest przyciemniony — jasne kadry nie zlewają się z białym płótnem.
        .fromTo(media, { "--kn-dim": 1 }, { "--kn-dim": 0, duration: 0.2 }, 0.42)
        .to(frame, { scale: 1, ease: "power2.inOut", duration: 0.38 }, 0.62)
    }, section)
    return () => ctx.revert()
  }, [])

  // Plik wideo dopiero blisko sceny; gra tylko w kadrze i bez pauzy.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          nearby.disconnect()
        }
      },
      { rootMargin: "60% 0px" }
    )
    const inView = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting))
    nearby.observe(section)
    inView.observe(section)
    return () => {
      nearby.disconnect()
      inView.disconnect()
    }
  }, [])

  useEffect(() => {
    const element = videoRef.current
    if (!element || !near) return
    if (visible && !paused) element.play().catch(() => {})
    else element.pause()
  }, [near, visible, paused])

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      aria-labelledby="kn-portfolio-title"
      className="kn-okno"
    >
      <div className="kn-okno-stage">
        <div className="kn-wrap">
          <h2 id="kn-portfolio-title" className="kn-okno-title kn-title mb-8 sm:mb-12">
            {title}
          </h2>
          <div ref={frameRef} className="kn-okno-frame">
            <video
              ref={videoRef}
              poster={video.poster}
              preload="none"
              muted
              loop
              playsInline
              aria-hidden="true"
              onLoadedMetadata={(event) => {
                // Start od spokojnego ujęcia: ciemne (4 s) w jasnym motywie, jasne (11 s) w ciemnym —
                // pod literami szablonu najlepiej czyta się kadr kontrastujący z płótnem.
                const dark = document.documentElement.classList.contains("dark")
                event.currentTarget.currentTime = dark ? CALM_DARK : CALM_LIGHT
              }}
              className="absolute inset-0 h-full w-full object-cover"
            >
              {near && <source src={video.webm} type="video/webm" />}
              {near && <source src={video.mp4} type="video/mp4" />}
              {labels.fallback}
            </video>
          </div>
          {/* Opis pod kadrem — w scenie wyłania się spod zmniejszającego się kadru (bez pustego ekranu po scenie). */}
          <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-12 md:gap-6">
            <p className="kn-lead max-w-[30ch] text-pretty md:col-span-6">{lead}</p>
            <div className="flex items-center justify-between gap-6 md:col-span-6 md:justify-end">
              <p className="text-fm-small text-fm-ink-3 tabular-nums">{count}</p>
              <a
                href={link.href}
                className="kn-roll-host inline-flex h-11 items-center gap-1.5 rounded-full text-fm-small font-medium fm-focus"
              >
                <RollText text={link.label} />
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="kn-stencil" aria-hidden="true">
          <span className="kn-stencil-word">{title}</span>
        </div>
        {/* Welon liter nad szablonem — słowo czyta się także wtedy, gdy kadr reelu jest biały albo czarny. */}
        <div className="kn-stencil kn-stencil-rim" aria-hidden="true">
          <span className="kn-stencil-word">{title}</span>
        </div>
        {/* Pauza poza skalowanym kadrem: widoczna przez całą scenę (wideo gra też w literach — WCAG 2.2.2). */}
        <button
          type="button"
          onClick={() => setMotionPaused(!paused)}
          className="kn-okno-control inline-flex h-11 fm-press items-center gap-2 rounded-full bg-black/55 px-3.5 text-fm-small font-medium text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.16)] fm-focus backdrop-blur-md transition-[background-color,scale] hover:bg-black/70 sm:px-4"
        >
          {paused ? (
            <Play aria-hidden="true" className="size-3.5 fill-current" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5 fill-current" />
          )}
          {paused ? labels.play : labels.pause}
        </button>
      </div>
    </section>
  )
}
