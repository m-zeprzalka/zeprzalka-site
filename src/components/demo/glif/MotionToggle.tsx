"use client"

import { Pause, Play } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { setGlyphsPaused, useGlyphMotion } from "./motion"

/** Zatrzymuje i wznawia ruch glifów (logo, pole, emblematy). Przy „ogranicz ruch” zbędny. */
export function MotionToggle({
  labels,
  className,
}: {
  labels: { pause: string; resume: string }
  className?: string
}) {
  const { paused, reduced } = useGlyphMotion()
  if (reduced) return null
  const label = paused ? labels.resume : labels.pause

  return (
    <button
      type="button"
      onClick={() => setGlyphsPaused(!paused)}
      aria-pressed={paused}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink",
        className
      )}
    >
      {paused ? (
        <Play aria-hidden="true" className="size-4" />
      ) : (
        <Pause aria-hidden="true" className="size-4" />
      )}
    </button>
  )
}
