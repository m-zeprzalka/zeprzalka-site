import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Linia oddzielająca. Ten sam DOM co Radix Separator (`role="none"` dla
 * ozdobnej, `data-orientation`), ale bez JavaScriptu po stronie klienta —
 * to tylko `<div>`, a stoi na każdej podstronie (PageHeader).
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}) {
  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      role={decorative ? "none" : "separator"}
      aria-orientation={!decorative && orientation === "vertical" ? "vertical" : undefined}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
