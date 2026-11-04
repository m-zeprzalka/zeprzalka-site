"use client"

import { useEffect } from "react"
import { sceneProgress, stageOf } from "./progress"

/**
 * Ustawia `data-stage` (0–3) na scenie — jedyny JS w przewijaniu. Nakładki
 * (tokeny, edytor) przełączają się przejściami CSS po zmianie etapu, a nie
 * w takt przewijania: dzięki temu jedna znika (150 ms), zanim wejdzie
 * następna (250 ms), i nigdy nie stoją na sobie. Zapis tylko przy zmianie.
 */
export function StageSync({ sceneId }: { sceneId: string }) {
  useEffect(() => {
    const scene = document.getElementById(sceneId)
    if (!scene) return
    let frame = 0
    const update = () => {
      frame = 0
      const progress = sceneProgress()
      const stage = String(progress === null ? 3 : stageOf(progress))
      if (scene.dataset.stage !== stage) scene.dataset.stage = stage
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [sceneId])

  return null
}
