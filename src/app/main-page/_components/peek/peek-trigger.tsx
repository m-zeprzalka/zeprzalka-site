"use client"

import { useId, useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { cva, type VariantProps } from "class-variance-authority"
import { usePeekActions, usePeekHover, usePeekState } from "./peek-context"

const loadPopover = () => import("./peek-popover")
/** Popover z pozycjonowaniem dochodzi przy pierwszym dotknięciu frazy — desktop go nie pobiera. */
const PeekPopover = dynamic(loadPopover, { ssr: false })

const triggerVariants = cva(
  "inline cursor-pointer text-start underline decoration-dashed decoration-1 underline-offset-[0.22em] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
  {
    variants: {
      variant: {
        /** Fraza w tekście: jaśniejsza od otoczenia, obłe tło pod słowem na najechanie i otwarciu. */
        phrase: [
          "mx-[-0.14em] rounded-[0.32em] [box-decoration-break:clone] px-[0.14em] text-foreground decoration-muted-foreground/70",
          "hover:bg-accent hover:no-underline data-active:bg-accent data-active:no-underline",
          "[&>svg]:mr-[0.22em] [&>svg]:inline [&>svg]:size-[0.72em] [&>svg]:-translate-y-[0.06em] [&>svg]:text-muted-foreground",
        ],
        /** Podpis (liczby w „O mnie”): bez tła — tylko odcień, jak link. */
        quiet:
          "rounded-sm decoration-muted-foreground/50 hover:text-foreground hover:decoration-foreground/60 data-active:text-foreground",
      },
    },
    defaultVariants: { variant: "phrase" },
  }
)

/**
 * Fraza, która pokazuje kartę podglądu.
 * - Desktop z myszą: karta stoi w prawym torze tylko na czas najechania albo
 *   fokusu — kliknięcie myszą jej nie przypina. Tor jest czysto wizualny
 *   (`inert`), więc klawiatura i czytnik (Enter, Spacja) otwierają tę samą kartę
 *   jako popover pod frazą — z fokusem w środku i osiągalnym linkiem.
 * - Gdzie indziej kliknięcie otwiera popover pod frazą na szerokość kolumny;
 *   drugie kliknięcie albo klik obok go zamyka.
 */
export function PeekTrigger({
  id,
  icon,
  variant,
  children,
}: {
  id: string
  icon?: ReactNode
  children: ReactNode
} & VariantProps<typeof triggerVariants>) {
  const { peeks, stage, hide } = usePeekActions()
  const state = usePeekState()
  const hover = usePeekHover(id)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const popoverId = useId()
  const peek = peeks[id]
  const active = open || (stage && state.id === id)

  return (
    <>
      <button
        ref={ref}
        type="button"
        data-peek-trigger=""
        data-active={active || undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        {...hover}
        onPointerDown={stage ? undefined : () => void loadPopover()}
        onClick={(event) => {
          // `detail === 0`: kliknięcie z klawiatury albo czytnika, nie myszą ani palcem.
          const keyboard = event.detail === 0
          if (stage && !keyboard) return
          if (stage) hide()
          setMounted(true)
          setOpen((value) => !value)
        }}
        className={triggerVariants({ variant })}
      >
        {icon}
        {children}
      </button>
      {mounted && peek && (
        <PeekPopover id={popoverId} peek={peek} open={open} onOpenChange={setOpen} trigger={ref} />
      )}
    </>
  )
}
