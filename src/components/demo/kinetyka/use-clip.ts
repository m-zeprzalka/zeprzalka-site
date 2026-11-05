"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "../forma/use-in-view"

/**
 * Klip kadru pod kursorem: plik dociąga się dopiero przy pierwszym
 * najechaniu (`armed`), gra tylko, gdy `playing`, a klatka zastępuje plakat
 * dopiero wtedy, gdy wideo naprawdę gra (bez czarnego mignięcia).
 * „Ogranicz ruch”: klip nigdy nie rusza, zostaje plakat.
 */
export function useClip(src: string | undefined, playing: boolean) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const [live, setLive] = useState(false)
  // Stan pochodny w trakcie renderu (nie w efekcie): pierwsze najechanie uzbraja klip.
  if (playing && !armed && src && !reduced) setArmed(true)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (playing) video.play().catch(() => {})
    else video.pause()
  }, [playing, armed])

  const state = {
    armed: armed && !!src,
    visible: live && playing,
    events: { onPlaying: () => setLive(true), onPause: () => setLive(false) },
  }
  return [ref, state] as const
}
