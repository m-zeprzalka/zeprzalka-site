"use client"

import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { ArrowUpRightIcon } from "lucide-react"
import { usePeekActions, usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import { PeekMedia } from "@/app/main-page/_components/peek/peek-media"
import { STAGE_ID } from "@/app/main-page/_components/peek/peek-stage"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/main-page/_components/ui/accordion"
import { Button } from "@/app/main-page/_components/ui/button"
import { ANCHOR_EVENT, WORK_PREFIX, goToAnchor, workAnchor } from "@/app/main-page/_lib/anchors"
import { keepInView } from "@/app/main-page/_lib/keep-in-view"
import { morph } from "@/app/main-page/_lib/morph"
import type { Link, Work, WorkGroup } from "@/app/main-page/_lib/types"

/** Przelot kadru do panelu (CSS `::view-transition-group(peek-media)`) — wiersz stoi tyle w miejscu. */
const MORPH_MS = 480

interface Labels {
  visitSite: string
  inPortfolio: string
  newTab: string
  portfolioHref: string
}

const peekOf = (slug: string) => `work-${slug}`

/**
 * Realizacje w grupach: wiersz = projekt i kategoria. Najechanie pokazuje
 * kadr na marginesie (gra klip); kliknięcie rozwija panel, a kadr z karty
 * przelatuje w jego miejsce (View Transition) — także z klawiatury, gdy karta
 * stoi przy wierszu po fokusie. Dotyk: rozwinięcie w miejscu.
 *
 * Kotwice `#realizacja-…` (adres strony, wyszukiwarka, dowody kompetencji,
 * wstecz/dalej) prowadzą przez jedną ścieżkę: wiersz otwiera się od razu, bez
 * animacji zwijania poprzedniego, i dopiero wtedy strona do niego przewija —
 * cel nie ucieka w trakcie przewijania.
 */
export function WorkList({
  groups,
  all,
  labels,
}: {
  groups: readonly WorkGroup[]
  all: Link
  labels: Labels
}) {
  const [open, setOpen] = useState("")
  const { hide } = usePeekActions()
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /** Otwiera wiersz z kotwicy i przewija do niego; `false` — to nie kotwica realizacji. */
    const reveal = (id: string, scroll: boolean) => {
      const item = id.startsWith(WORK_PREFIX) ? document.getElementById(id) : null
      if (!item) return false
      flushSync(() => {
        hide()
        setOpen(id.slice(WORK_PREFIX.length))
      })
      // Zwijanie i rozwijanie od razu w stanie końcowym — układ jest ostateczny przed przewinięciem.
      list.current?.getAnimations({ subtree: true }).forEach((animation) => animation.finish())
      if (scroll) item.scrollIntoView()
      return true
    }
    const onAnchor = (event: Event) => {
      if (reveal((event as CustomEvent<string>).detail, true)) event.preventDefault()
    }
    const onHashChange = () => reveal(window.location.hash.slice(1), true)
    // Linki do realizacji w treści strony (dowody kompetencji) — także ponowny klik w ten sam.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest?.(`a[href^="#${WORK_PREFIX}"]`)
      if (!link) return
      event.preventDefault()
      goToAnchor(link.getAttribute("href")!.slice(1))
    }
    // Wejście z adresem: przeglądarka już przewinęła do wiersza — wystarczy go otworzyć.
    reveal(window.location.hash.slice(1), false)
    window.addEventListener(ANCHOR_EVENT, onAnchor)
    window.addEventListener("hashchange", onHashChange)
    document.addEventListener("click", onClick)
    return () => {
      window.removeEventListener(ANCHOR_EVENT, onAnchor)
      window.removeEventListener("hashchange", onHashChange)
      document.removeEventListener("click", onClick)
    }
  }, [hide])

  const change = (next: string) => {
    const item = next ? document.getElementById(workAnchor(next)) : null
    const card = next
      ? document.querySelector<HTMLElement>(
          `#${STAGE_ID} [data-peek-layer="${peekOf(next)}"] [data-peek-media]`
        )
      : null
    if (item) keepInView(item, card ? MORPH_MS : undefined)
    const morphed = morph(card, () => {
      flushSync(() => {
        hide()
        setOpen(next)
      })
      return item?.querySelector<HTMLElement>("[data-peek-media]") ?? null
    }, [document.getElementById(STAGE_ID)])
    if (!morphed) {
      hide()
      setOpen(next)
    }
  }

  return (
    <>
      <Accordion
        ref={list}
        type="single"
        collapsible
        value={open}
        onValueChange={change}
        className="mt-8 grid gap-10"
      >
        {groups.map((group) => (
          <div key={group.id} className="grid gap-1 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-6">
            <h3 className="py-2 text-sm text-muted-foreground md:py-3">{group.label}</h3>
            <div>
              {group.works.map((work) => (
                <WorkItem key={work.slug} work={work} open={open === work.slug} labels={labels} />
              ))}
            </div>
          </div>
        ))}
      </Accordion>
      <Button asChild variant="ghost" size="sm" className="-ms-2.5 mt-6">
        <a href={all.href}>
          {all.label}
          <ArrowUpRightIcon />
        </a>
      </Button>
    </>
  )
}

function WorkItem({ work, open, labels }: { work: Work; open: boolean; labels: Labels }) {
  const hover = usePeekHover(peekOf(work.slug))

  return (
    <AccordionItem asChild value={work.slug} id={workAnchor(work.slug)} className="border-0">
      <article>
        <AccordionTrigger
          headingLevel={4}
          // Rozwinięty wiersz pokazuje kadr w panelu — karta z marginesu by go dublowała.
          {...(open ? {} : hover)}
          className="-mx-3 items-center rounded-xl px-3 py-3 text-base font-normal transition-colors hover:bg-accent/60 data-[state=open]:bg-accent/60"
        >
          <span className="grid flex-1 gap-0.5 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
            <span>{work.title}</span>
            <span className="text-sm text-muted-foreground">{work.category}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent forceMount className="grid gap-4 pt-3 pb-6">
          <PeekMedia
            media={work.media}
            play={open}
            sizes="(min-width: 48rem) 40rem, 100vw"
            className="max-h-[70svh]"
          />
          {work.description && (
            <p className="text-base text-pretty text-muted-foreground">{work.description}</p>
          )}
          <Button asChild variant="secondary" className="w-fit">
            {work.url ? (
              <a href={work.url} target="_blank" rel="noopener noreferrer">
                {labels.visitSite}
                <ArrowUpRightIcon />
                <span className="sr-only">({labels.newTab})</span>
              </a>
            ) : (
              <a href={labels.portfolioHref}>
                {labels.inPortfolio}
                <ArrowUpRightIcon />
              </a>
            )}
          </Button>
        </AccordionContent>
      </article>
    </AccordionItem>
  )
}
