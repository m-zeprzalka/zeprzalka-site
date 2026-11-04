"use client"

import { useEffect, useEffectEvent, useRef, useState, type RefObject } from "react"
import { useMotionValue, useSpring } from "motion/react"
import * as m from "motion/react-m"
import { FALLBACK_RATIO } from "./use-poster-ratios"
import type { Work } from "./types"

/**
 * Stałe pole karty (≈ 320 × 200 px): kadr zmienia proporcje, ale nie „wagę”.
 * Pionowy film dostaje 233 × 275, strona 16:9 — 337 × 190.
 */
const AREA = 64_000
/** Odstęp karty od kolumny (tryb marginesu) albo od kursora (tryb wąski). */
const GAP = 28
const EDGE = 16
/** Górna granica: pod lepkim nagłówkiem (4rem) z oddechem 8 px. */
const TOP = 72
/** Pozioma „smycz”: w marginesie karta przesuwa się o ułamek ruchu kursora. */
const DRIFT = 0.04
/** Sprężyna pozycji: krytycznie tłumiona, ~300 ms — karta płynie, ale nie pływa. */
const FOLLOW = { stiffness: 420, damping: 40, mass: 0.8 }
const RESIZE = { type: "spring", visualDuration: 0.35, bounce: 0 } as const
/** Wideo startuje dopiero, gdy kursor zatrzyma się na wierszu — przelot nad listą to same plakaty. */
const DWELL = 140

function sizeFor(ratio: number) {
  return { w: Math.round(Math.sqrt(AREA * ratio)), h: Math.round(Math.sqrt(AREA / ratio)) }
}

/**
 * Pływająca karta wideo nad listą realizacji (tylko mysz/gładzik).
 *
 * Gdy obok kolumny jest miejsce, karta mieszka w prawym marginesie: w pionie
 * podąża za kursorem na sprężynie, w poziomie tylko lekko dryfuje — lista
 * zostaje czytelna. Na węższym ekranie płynie przy kursorze i przeskakuje na
 * jego lewą stronę przy krawędzi. Przenika między projektami (rozmycie 6 px),
 * a rozmiar dojeżdża do proporcji kolejnego materiału. Gra najwyżej jedno
 * wideo naraz (plus to, które właśnie gaśnie). Dekoracja: `aria-hidden`.
 */
export function FloatingPreview({
  works,
  active,
  visible,
  armed,
  ratios,
  reduced,
  anchorRef,
  cardRef,
}: {
  works: readonly Work[]
  active: string | null
  visible: boolean
  /** Warstwy (plakaty) montują się dopiero po pierwszym wskazaniu wiersza. */
  armed: boolean
  ratios: Readonly<Record<string, number>>
  reduced: boolean
  /** Lista, przy której karta parkuje w marginesie. */
  anchorRef: RefObject<HTMLElement | null>
  /** Karta — Works nadaje jej nazwę przejścia widoku przy morfie do wiersza. */
  cardRef: RefObject<HTMLDivElement | null>
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, FOLLOW)
  const springY = useSpring(y, FOLLOW)
  const pointer = useRef({ x: 0, y: 0 })
  const [flip, setFlip] = useState(false)

  const size = sizeFor((active && ratios[active]) || FALLBACK_RATIO)

  const place = useEffectEvent((jump: boolean) => {
    // Ukryta karta tylko zapamiętuje kursor — żadnych sprężyn i renderów w tle.
    if (!visible && !jump) return
    const { x: px, y: py } = pointer.current
    const list = anchorRef.current?.getBoundingClientRect()
    const docked = !!list && window.innerWidth - list.right - GAP - EDGE >= size.w + 12
    let tx: number
    let flipped = false
    if (docked && list) {
      tx = list.right + GAP + (px - (list.left + list.right) / 2) * DRIFT
    } else {
      flipped = px + GAP + size.w + EDGE > window.innerWidth
      tx = flipped ? px - GAP - size.w : px + GAP
    }
    const ty = Math.min(Math.max(py, TOP + size.h / 2), window.innerHeight - size.h / 2 - EDGE)
    x.set(tx)
    y.set(ty)
    // Przy „ogranicz ruch” karta stoi na miejscu bez dociągania sprężyną.
    if (jump || reduced) {
      springX.jump(tx)
      springY.jump(ty)
    }
    setFlip(flipped)
  })

  useEffect(() => {
    function onMove(event: PointerEvent) {
      pointer.current = { x: event.clientX, y: event.clientY }
      place(false)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  // Karta pojawia się tam, gdzie jest kursor — nie przylatuje z poprzedniego miejsca.
  const wasVisible = useRef(false)
  useEffect(() => {
    if (visible && !wasVisible.current) place(true)
    wasVisible.current = visible
  }, [visible])

  // Nowy kadr to nowy rozmiar: pozycja (i strona kursora) liczy się od nowa.
  useEffect(() => {
    place(false)
  }, [size.w, size.h])

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30"
      style={{ x: springX, y: springY }}
    >
      <m.div
        ref={cardRef}
        data-visible={visible || undefined}
        data-flip={flip || undefined}
        initial={false}
        animate={{ width: size.w, height: size.h }}
        transition={reduced ? { duration: 0 } : RESIZE}
        className="ix-float__card ix-media-ring relative overflow-hidden rounded-fm-xl bg-fm-fill shadow-fm-float"
      >
        {armed &&
          works.map((work) => (
            <Layer key={work.slug} work={work} active={work.slug === active} video={!reduced} />
          ))}
      </m.div>
    </m.div>
  )
}

function Layer({ work, active, video }: { work: Work; active: boolean; video: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!active || !video || mounted) return undefined
    const timer = setTimeout(() => setMounted(true), DWELL)
    return () => clearTimeout(timer)
  }, [active, video, mounted])

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (active) {
      element.play().catch(() => {
        /* autoodtwarzanie zablokowane — zostaje plakat */
      })
      return undefined
    }
    // Pauza po przenikaniu, żeby gasnący kadr nie zamarł w pół ruchu.
    const timer = setTimeout(() => element.pause(), 300)
    return () => clearTimeout(timer)
  }, [active, mounted])

  return (
    <div data-active={active || undefined} className="ix-layer absolute inset-0">
      {/* Plakaty to już 720-pikselowe WebP; zwykły <img>, bo ten sam plik mierzy usePosterRatios. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={work.poster}
        alt=""
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      {mounted && work.video && (
        <video
          ref={ref}
          src={work.video}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          data-ready={ready || undefined}
          onPlaying={() => setReady(true)}
          className="ix-video absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  )
}
