import type { ComponentProps } from "react"
import { cn } from "./cn"

/** Mała pigułka z informacją (status, kategoria, filtr). */
export function Chip({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full bg-fm-fill px-3 text-fm-micro font-medium text-fm-ink-2",
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
      <span className="absolute inset-0 rounded-full bg-fm-live motion-safe:animate-[fm-pulse_2.4s_var(--ease-fm-snap)_infinite]" />
      <span className="relative size-2 rounded-full bg-fm-live" />
    </span>
  )
}

/** Skrót klawiszowy. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-fm-xs bg-fm-surface px-1.5 font-mono text-[0.6875rem] text-fm-ink-2 shadow-fm-ring",
        className
      )}
      {...props}
    />
  )
}
