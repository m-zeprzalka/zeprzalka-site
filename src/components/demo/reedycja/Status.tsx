import { LiveDot } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"

/** „Gotowy do współpracy” — pigułka z kropką „na żywo” (jedyny kolor strony). */
export function Status({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2.5 rounded-full bg-fm-surface ps-3 pe-3.5 text-[0.8125rem] font-medium text-fm-ink-2 shadow-fm-ring",
        className
      )}
    >
      <LiveDot />
      {label}
    </span>
  )
}
