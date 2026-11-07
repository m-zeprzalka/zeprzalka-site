"use client"

import { useEffect, useRef, type RefObject } from "react"
import { Popover, PopoverAnchor, PopoverContent } from "@/app/main-page/_components/ui/popover"
import { HEADER_OFFSET } from "@/app/main-page/_lib/anchors"
import { focusAfter, tabbables } from "@/app/main-page/_lib/focus"
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
 * Karta podglądu jako popover pod frazą (dotyk i ekrany bez prawego toru),
 * ładowana leniwie przy pierwszym dotknięciu. Wysokość ograniczona do miejsca
 * w oknie, a gdy pod frazą brakuje miejsca, strona dosuwa się — karta nigdy nie jest ucięta. Bez `PopoverTrigger`: owinięty przycisk
 * Radix rejestruje jako własną kotwicę i gubi kotwicę wirtualną, więc otwiera
 * sama fraza, a jej kliknięcie nie liczy się jako „klik poza”.
 */
export default function PeekPopover({
  id,
  peek,
  open,
  onOpenChange,
  trigger,
}: {
  id: string
  peek: Peek
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: RefObject<HTMLButtonElement | null>
}) {
  const anchor = useRef({
    getBoundingClientRect: () => (trigger.current ? columnRect(trigger.current) : new DOMRect()),
  })
  const content = useRef<HTMLDivElement>(null)

  // Karta, która nie mieści się pod frazą, dosuwa stronę (nie wyżej niż fraza pod nagłówkiem).
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const card = content.current
      const phrase = trigger.current?.getBoundingClientRect()
      if (!card || !phrase) return
      const hidden = card.scrollHeight - card.clientHeight
      // Płynnie albo od razu — jak każe CSS („ogranicz ruch”). Fraza zostaje pod nagłówkiem.
      if (hidden > 0) window.scrollBy({ top: Math.min(hidden + 12, phrase.top - HEADER_OFFSET) })
    })
    return () => cancelAnimationFrame(frame)
  }, [open, trigger])

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor virtualRef={anchor} />
      <PopoverContent
        ref={content}
        id={id}
        aria-label={peek.title}
        side="bottom"
        align="start"
        sideOffset={10}
        // Zawsze pod frazą: zamiast odwracać kartę nad tekst, dosuwamy stronę (efekt wyżej).
        avoidCollisions={false}
        // Fokus na samej karcie (bez skoku strony i bez obwódki): czytnik czyta kartę,
        // a następny Tab trafia w jej link.
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          content.current?.focus({ preventScroll: true })
        }}
        // Karta stoi w kolejności Tab zaraz po frazie, choć w DOM jest na końcu `<body>`:
        // Tab za ostatnim elementem karty idzie dalej po frazie, Shift+Tab z początku — na nią.
        onKeyDown={(event) => {
          const card = content.current
          const phrase = trigger.current
          if (event.key !== "Tab" || !card || !phrase) return
          const inside = tabbables(card)
          const active = document.activeElement
          const leaving = event.shiftKey
            ? active === card || active === inside[0]
            : inside.length === 0 || active === inside.at(-1)
          if (!leaving) return
          event.preventDefault()
          onOpenChange(false)
          if (event.shiftKey) phrase.focus()
          else focusAfter(phrase, card)
        }}
        // Bez `PopoverTrigger` Radix nie wie, dokąd oddać fokus: po Escape wraca na frazę,
        // a po wyjściu Tabem zostaje tam, dokąd użytkownik przeszedł.
        onCloseAutoFocus={(event) => {
          const active = document.activeElement
          if (active && active !== document.body && !content.current?.contains(active)) return
          event.preventDefault()
          trigger.current?.focus({ preventScroll: true })
        }}
        onPointerDownOutside={(event) => {
          if (trigger.current?.contains(event.target as Node)) event.preventDefault()
        }}
        // Telefon — na szerokość kolumny; od 768 px karta 24 rem, nie zasłania pół ekranu.
        className="max-h-(--radix-popover-content-available-height) w-(--radix-popover-trigger-width) overflow-y-auto overscroll-contain p-0 md:w-96"
      >
        <PeekCard peek={peek} play={open} onNavigate={() => onOpenChange(false)} />
      </PopoverContent>
    </Popover>
  )
}
