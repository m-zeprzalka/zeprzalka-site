"use client"

import { useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { usePeek } from "./peek-context"
import { STAGE_ID } from "./peek-stage"

const loadPopover = () => import("./peek-popover")
/** Popover z pozycjonowaniem dochodzi przy pierwszym dotknięciu frazy — desktop go nie pobiera. */
const PeekPopover = dynamic(loadPopover, { ssr: false })

/**
 * Fraza w tekście, która otwiera kartę podglądu: obłe tło pod słowem na
 * najechanie i gdy karta jest otwarta. Na desktopie z myszą karta stoi
 * w prawym torze (najechanie pokazuje, kliknięcie przypina — wygląd ten sam),
 * gdzie indziej otwiera się popover pod frazą na szerokość kolumny.
 */
export function PeekTrigger({
  id,
  icon,
  emphasis = true,
  children,
}: {
  id: string
  icon?: ReactNode
  /** Fraza jaśniejsza od otaczającego tekstu (start, „O mnie”); bez — kolor otoczenia (podpisy liczb). */
  emphasis?: boolean
  children: ReactNode
}) {
  const { peeks, stage, state, show, hide, toggle } = usePeek()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const peek = peeks[id]
  const active = stage ? state.id === id : open

  return (
    <>
      <button
        ref={ref}
        type="button"
        data-peek-trigger=""
        data-active={active || undefined}
        aria-expanded={active}
        aria-controls={stage ? STAGE_ID : undefined}
        {...(stage
          ? {
              onPointerEnter: (event) => show(id, event.currentTarget, "pointer"),
              onPointerMove: (event) => show(id, event.currentTarget, "pointer"),
              onPointerLeave: () => hide(id),
              onFocus: (event) => show(id, event.currentTarget, "focus"),
              onBlur: () => hide(id),
              onClick: (event) => toggle(id, event.currentTarget),
            }
          : {
              onPointerDown: () => void loadPopover(),
              onClick: () => {
                setMounted(true)
                setOpen((value) => !value)
              },
            })}
        className={cn(
          "-mx-[0.14em] inline cursor-pointer rounded-[0.32em] [box-decoration-break:clone] px-[0.14em] text-start underline decoration-muted-foreground/70 decoration-dashed decoration-1 underline-offset-[0.22em] transition-colors outline-none",
          emphasis && "text-foreground",
          "hover:bg-accent hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/50 data-active:bg-accent data-active:no-underline",
          "[&>svg]:mr-[0.22em] [&>svg]:inline [&>svg]:size-[0.72em] [&>svg]:-translate-y-[0.06em] [&>svg]:text-muted-foreground"
        )}
      >
        {icon}
        {children}
      </button>
      {!stage && mounted && peek && (
        <PeekPopover peek={peek} open={open} onOpenChange={setOpen} trigger={ref} />
      )}
    </>
  )
}
