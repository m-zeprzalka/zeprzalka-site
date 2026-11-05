"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Dialog } from "radix-ui"
import { X } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { CardBody } from "./CardBody"
import { hideCard, useCardState, type CardState } from "./card-store"
import { Follower } from "./follow"
import { COL } from "./grid"
import { portalRoot, useReduced, useStage } from "./hooks"
import type { Card } from "./types"

/** Karta stoi co najmniej tyle od górnej krawędzi (pod nagłówkiem) i od dołu ekranu. */
const TOP = 88
const BOTTOM = 24

/**
 * Jedna karta dla całej strony. Od 1024 px z myszą: na marginesie, na
 * wysokości wskazanego elementu (sprężyna, bez pływania); wyzwalacz może mieć
 * `data-dock="<id>"` — wtedy karta zajmuje miejsce tamtego elementu (twarz na
 * starcie „staje się” tym, co wskazujesz). Klik (i każdy dotyk) przypina kartę
 * jako okno u dołu ekranu: na telefonie o szerokości kontenera siatki, od
 * 1024 px w kolumnach marginesu.
 */
export function Stage({ cards, closeLabel }: { cards: Record<string, Card>; closeLabel: string }) {
  const stage = useStage()
  const state = useCardState()
  return (
    <>
      {stage && <MarginCard cards={cards} state={state} />}
      <SheetCard cards={cards} state={state} closeLabel={closeLabel} />
    </>
  )
}

function MarginCard({ cards, state }: { cards: Record<string, Card>; state: CardState }) {
  const reduced = useReduced()
  const cardRef = useRef<HTMLDivElement>(null)
  const follower = useRef<Follower | null>(null)
  // Ostatnia pokazana karta zostaje w DOM na czas wyjścia (140 ms).
  const [shown, setShown] = useState<{ key: string; phase: "in" | "out" } | null>(null)
  const visibleKey = state.via === "tap" ? null : state.key

  // Stan z poprzedniego renderu (wzorzec Reacta „adjusting state on prop change”), bez efektu.
  const target = visibleKey && cards[visibleKey] ? visibleKey : null
  if (target && (shown?.key !== target || shown.phase !== "in"))
    setShown({ key: target, phase: "in" })
  else if (!target && shown?.phase === "in") setShown({ ...shown, phase: "out" })

  useEffect(() => {
    if (shown?.phase !== "out") return
    const timer = setTimeout(() => setShown(null), 150)
    return () => clearTimeout(timer)
  }, [shown])

  // Położenie: miejsce zadokowania albo wysokość wyzwalacza, w granicach ekranu.
  useLayoutEffect(() => {
    const node = cardRef.current
    const anchor = state.anchor
    if (!node || !anchor || !shown || shown.phase === "out") return
    if (!follower.current) follower.current = new Follower(node)
    const place = (jump: boolean) => {
      const dock = anchor.dataset.dock ? document.getElementById(anchor.dataset.dock) : null
      const dockRect = dock?.getBoundingClientRect()
      const target =
        dockRect && dockRect.bottom > TOP && dockRect.top < window.innerHeight
          ? dockRect.top
          : anchor.getBoundingClientRect().top - 12
      const height = node.offsetHeight
      const y = Math.max(TOP, Math.min(target, window.innerHeight - height - BOTTOM))
      follower.current?.to(0, y, jump || reduced)
    }
    place(node.dataset.placed !== "1")
    node.dataset.placed = "1"
    const onScroll = () => place(false)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [state.anchor, shown, reduced])

  useEffect(() => {
    if (!shown && cardRef.current) cardRef.current.dataset.placed = "0"
  }, [shown])

  const card = shown ? cards[shown.key] : undefined

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <div className="i2-grid">
        <div className={cn("relative", COL.margin)}>
          <div ref={cardRef} className="absolute inset-x-0 top-0 will-change-transform">
            {card && shown && (
              <div
                key={shown.key}
                data-state={shown.phase}
                className="i2-card origin-top rounded-[calc(var(--i2-inset)+0.75rem)] bg-fm-surface p-(--i2-inset) shadow-fm-pop"
              >
                <CardBody card={card} live={shown.phase === "in"} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SheetCard({
  cards,
  state,
  closeLabel,
}: {
  cards: Record<string, Card>
  state: CardState
  closeLabel: string
}) {
  const open = state.via === "tap" && !!state.key && !!cards[state.key]
  // Treść zostaje na czas wyjścia arkusza.
  const [key, setKey] = useState<string | null>(null)
  if (open && state.key && state.key !== key) setKey(state.key)
  const card = key ? cards[key] : undefined

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && hideCard(undefined, 0)}>
      <Dialog.Portal container={portalRoot()}>
        <Dialog.Overlay className="i2-overlay fixed inset-0 z-50 bg-[oklch(0_0_0/0.25)] dark:bg-[oklch(0_0_0/0.55)]" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            // Fokus wraca do wyzwalacza bez przewijania strony.
            event.preventDefault()
            state.anchor?.focus({ preventScroll: true })
          }}
          className="i2-sheet fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),var(--i2-margin))] z-50 outline-none"
        >
          <div className="i2-grid">
            <div className="relative col-span-full max-h-[min(80dvh,40rem)] overflow-y-auto overscroll-contain rounded-[calc(var(--i2-inset)+0.75rem)] bg-fm-surface p-(--i2-inset) shadow-fm-pop sm:col-[2/8] lg:col-[8/13] xl:col-[9/13]">
              {card && (
                <>
                  <Dialog.Title className="sr-only">{card.heading}</Dialog.Title>
                  <CardBody card={card} live={open} />
                  <Dialog.Close
                    aria-label={closeLabel}
                    className="absolute top-[calc(var(--i2-inset)+0.5rem)] right-[calc(var(--i2-inset)+0.5rem)] grid size-9 fm-press place-items-center rounded-full bg-fm-surface text-fm-ink shadow-fm-pop fm-focus after:absolute after:-inset-1 after:content-['']"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </Dialog.Close>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
