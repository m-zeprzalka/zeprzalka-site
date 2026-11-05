"use client"

import { RotateCcw } from "lucide-react"
import { cn } from "../../forma/cn"

/**
 * Powtórka sceny w rogu kafla — ta sama we wszystkich kaflach. Widoczne kółko
 * ma 36 px, a pole trafienia (cały przycisk) 44 × 44 px.
 */
export function ReplayButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group/replay absolute top-2 right-2 z-10 grid size-11 place-items-center rounded-full fm-focus",
        className
      )}
    >
      <span className="grid size-9 place-items-center rounded-full bg-fm-surface/80 text-fm-ink-2 shadow-fm-ring backdrop-blur transition-[background-color,color,scale] duration-150 ease-fm-snap group-hover/replay:text-fm-ink group-active/replay:scale-[0.97]">
        <RotateCcw aria-hidden="true" className="size-4" />
      </span>
    </button>
  )
}
