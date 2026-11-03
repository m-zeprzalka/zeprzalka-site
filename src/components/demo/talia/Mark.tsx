import { cn } from "@/lib/utils"

/**
 * Sygnet koncepcji: trzy karty w wachlarzu. Po najechaniu na link (rodzic
 * z klasą `group`) wachlarz rozkłada się jak talia w hero — ten sam gest
 * w skali 24 px.
 */
export function Mark({ className }: { className?: string }) {
  const card =
    "[transform-box:view-box] origin-[12px_21px] transition-transform duration-500 ease-fm-snap"
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-6", className)}>
      <rect
        x="7.5"
        y="4"
        width="9"
        height="14"
        rx="2.25"
        fill="currentColor"
        opacity="0.22"
        className={cn(card, "-rotate-[16deg] group-hover:-rotate-[26deg]")}
      />
      <rect
        x="7.5"
        y="4"
        width="9"
        height="14"
        rx="2.25"
        fill="currentColor"
        opacity="0.45"
        className={cn(card, "rotate-[16deg] group-hover:rotate-[26deg]")}
      />
      <rect x="7.5" y="4" width="9" height="14" rx="2.25" fill="currentColor" className={card} />
    </svg>
  )
}
