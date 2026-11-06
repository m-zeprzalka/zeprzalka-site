"use client"

import { useRef, type RefObject } from "react"
import { Popover, PopoverAnchor, PopoverContent } from "@/app/main-page/_components/ui/popover"
import type { Peek } from "@/app/main-page/_lib/types"
import { PeekCard } from "./peek-card"

/**
 * Prostokąt kolumny treści na wysokości frazy — popover ma szerokość kolumny
 * i trzyma jej krawędzie, a nie krawędzie samego słowa. Kolumnę wskazuje
 * najbliższy element z `data-peek-column`.
 */
function columnRect(trigger: HTMLElement): DOMRect {
  const word = trigger.getBoundingClientRect()
  const column = trigger.closest<HTMLElement>("[data-peek-column]")
  if (!column) return word
  const box = column.getBoundingClientRect()
  const style = getComputedStyle(column)
  const left = box.left + parseFloat(style.paddingLeft)
  const width = box.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  return new DOMRect(left, word.top, width, word.height)
}

/**
 * Karta podglądu jako popover (dotyk i ekrany bez prawego toru), ładowana
 * leniwie przy pierwszym dotknięciu frazy. Bez `PopoverTrigger`: owinięty
 * przycisk Radix rejestruje jako własną kotwicę i gubi kotwicę wirtualną —
 * otwiera więc sama fraza, a jej kliknięcie nie liczy się jako „klik poza”.
 */
export default function PeekPopover({
  peek,
  open,
  onOpenChange,
  trigger,
}: {
  peek: Peek
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: RefObject<HTMLButtonElement | null>
}) {
  const anchor = useRef({
    getBoundingClientRect: () => (trigger.current ? columnRect(trigger.current) : new DOMRect()),
  })

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor virtualRef={anchor} />
      <PopoverContent
        align="start"
        sideOffset={10}
        collisionPadding={12}
        onPointerDownOutside={(event) => {
          if (trigger.current?.contains(event.target as Node)) event.preventDefault()
        }}
        className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
      >
        <PeekCard peek={peek} play={open} />
      </PopoverContent>
    </Popover>
  )
}
