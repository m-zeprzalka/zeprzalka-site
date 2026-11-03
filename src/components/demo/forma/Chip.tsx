import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

/** Mała pigułka z informacją (status, kategoria, filtr). */
export function Chip({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "bg-fm-fill text-fm-micro text-fm-ink-2 inline-flex h-7 items-center gap-2 rounded-full px-3 font-medium",
        className
      )}
      {...props}
    />
  )
}

/** Kropka „na żywo” z delikatną falą — jedyny kolor semantyczny Formy. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative inline-flex size-2", className)}>
      <span className="bg-fm-live absolute inset-0 rounded-full motion-safe:animate-[fm-pulse_2.4s_var(--ease-fm-snap)_infinite]" />
      <span className="bg-fm-live relative size-2 rounded-full" />
    </span>
  )
}

/** Skrót klawiszowy. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "rounded-fm-xs bg-fm-surface text-fm-ink-2 shadow-fm-ring inline-flex h-5 min-w-5 items-center justify-center px-1.5 font-mono text-[0.6875rem]",
        className
      )}
      {...props}
    />
  )
}
