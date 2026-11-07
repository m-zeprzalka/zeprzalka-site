"use client"

import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import Link from "next/link"
import { ArrowUpRightIcon, ArrowRightIcon } from "lucide-react"
import { usePeekActions, usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import { LabelRow } from "@/app/main-page/_components/page/label-row"
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
import type { LinkData, Work, WorkGroup } from "@/app/main-page/_lib/types"
import { COLUMN_SIZES } from "@/app/main-page/_lib/media"

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
  all: LinkData
  labels: Labels
}) {
  const [open, setOpen] = useState("")
  const { hide } = usePeekActions()
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /** Otwiera wiersz z kotwicy i przewija do niego; `false` — to nie kotwica realizacji. */
    const reveal = (id: string) => {
      const item = id.startsWith(WORK_PREFIX) ? document.getElementById(id) : null
      if (!item) return false
      flushSync(() => {
        hide()
        setOpen(id.slice(WORK_PREFIX.length))
      })
      // Zwijanie i rozwijanie od razu w stanie końcowym — układ jest ostateczny przed przewinięciem.
      list.current?.getAnimations({ subtree: true }).forEach((animation) => animation.finish())
      item.scrollIntoView()
      return true
    }
    const onAnchor = (event: Event) => {
      if (reveal((event as CustomEvent<string>).detail)) event.preventDefault()
    }
    const onHashChange = () => reveal(window.location.hash.slice(1))
    // Linki do realizacji w treści strony (dowody kompetencji) — także ponowny klik w ten sam.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest?.(`a[href^="#${WORK_PREFIX}"]`)
      if (!link) return
      event.preventDefault()
      goToAnchor(link.getAttribute("href")!.slice(1))
    }
    window.addEventListener(ANCHOR_EVENT, onAnchor)
    window.addEventListener("hashchange", onHashChange)
    document.addEventListener("click", onClick)
    return () => {
      window.removeEventListener(ANCHOR_EVENT, onAnchor)
      window.removeEventListener("hashchange", onHashChange)
      document.removeEventListener("click", onClick)
    }
  }, [hide])

  // Wejście z adresem `#realizacja-…`: przeglądarka już przewinęła do wiersza — wystarczy go
  // otworzyć, raz. (Bez `flushSync`: w efekcie i tak nie opróżnia kolejki.)
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id.startsWith(WORK_PREFIX) || !document.getElementById(id)) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- stan z adresu, raz po hydratacji
    setOpen(id.slice(WORK_PREFIX.length))
  }, [])

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
          <LabelRow key={group.id} label={group.label} labelAs="h3" labelClassName="py-2 md:py-3">
            {group.works.map((work) => (
              <WorkItem key={work.slug} work={work} open={open === work.slug} labels={labels} />
            ))}
          </LabelRow>
        ))}
      </Accordion>
      <Button asChild variant="ghost" size="sm" className="-ms-2.5 mt-6">
        <Link href={all.href}>
          {all.label}
          <ArrowRightIcon />
        </Link>
      </Button>
    </>
  )
}

function WorkItem({ work, open, labels }: { work: Work; open: boolean; labels: Labels }) {
  const hover = usePeekHover(peekOf(work.slug))
  // Kadr panelu dopiero po pierwszym otwarciu: zamknięte wiersze (opisy są w HTML) nie pobierają
  // przy starcie kilkunastu obrazów — na wolnej sieci Chrome ładuje „leniwe” z dużym wyprzedzeniem.
  const [seen, setSeen] = useState(open)
  if (open && !seen) setSeen(true)

  return (
    <AccordionItem asChild value={work.slug} id={workAnchor(work.slug)} className="border-0">
      <article>
        <AccordionTrigger
          headingLevel={4}
          // Rozwinięty wiersz pokazuje kadr w panelu — karta z marginesu by go dublowała.
          {...(open ? {} : hover)}
          variant="row"
        >
          <span className="grid flex-1 gap-0.5 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
            <span>{work.title}</span>{" "}
            <span className="text-sm text-muted-foreground">{work.category}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent forceMount className="grid gap-4 pt-3 pb-6">
          {seen && (
            <PeekMedia
              media={work.media}
              play={open}
              sizes={COLUMN_SIZES}
              className="max-h-[70svh]"
            />
          )}
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
              <Link href={`${labels.portfolioHref}#${workAnchor(work.slug)}`}>
                {labels.inPortfolio}
                <ArrowUpRightIcon />
              </Link>
            )}
          </Button>
        </AccordionContent>
      </article>
    </AccordionItem>
  )
}
