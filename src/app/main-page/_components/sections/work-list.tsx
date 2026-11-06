"use client"

import { useEffect, useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { usePeek, usePeekHover } from "@/app/main-page/_components/peek/peek-context"
import { PeekMedia } from "@/app/main-page/_components/peek/peek-media"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/main-page/_components/ui/accordion"
import { Button } from "@/app/main-page/_components/ui/button"
import { WORK_PREFIX, workAnchor } from "@/app/main-page/_lib/anchors"
import { keepInView } from "@/app/main-page/_lib/keep-in-view"
import type { Link, Work, WorkGroup } from "@/app/main-page/_lib/types"

interface Labels {
  visitSite: string
  inPortfolio: string
  newTab: string
  portfolioHref: string
}

/**
 * Realizacje w grupach: wiersz = projekt i kategoria. Najechanie pokazuje
 * kadr na marginesie (gra klip), kliknięcie rozwija panel z wideo, opisem
 * i linkiem. Adres `#realizacja-…` (wyszukiwarka, dowody kompetencji)
 * otwiera właściwy wiersz.
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

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash.startsWith(`#${WORK_PREFIX}`)) {
        setOpen(window.location.hash.slice(WORK_PREFIX.length + 1))
      }
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [])

  return (
    <>
      <Accordion
        type="single"
        collapsible
        value={open}
        onValueChange={(next) => {
          setOpen(next)
          const item = next && document.getElementById(workAnchor(next))
          if (item) keepInView(item)
        }}
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
      <Button asChild variant="ghost" className="mt-8">
        <a href={all.href}>
          {all.label}
          <ArrowUpRightIcon />
        </a>
      </Button>
    </>
  )
}

function WorkItem({ work, open, labels }: { work: Work; open: boolean; labels: Labels }) {
  const peekId = `work-${work.slug}`
  const hover = usePeekHover(peekId)
  const { hide } = usePeek()

  return (
    <AccordionItem value={work.slug} id={workAnchor(work.slug)} className="scroll-mt-24 border-0">
      <AccordionTrigger
        {...(open ? {} : hover)}
        // Rozwinięty wiersz pokazuje kadr w panelu — karta z marginesu by go dublowała.
        onClick={() => hide(peekId)}
        className="items-center rounded-xl px-3 py-3 text-base font-normal hover:bg-accent/60 data-[state=open]:bg-accent/60"
      >
        <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4">
          <span>{work.title}</span>
          <span className="text-sm text-muted-foreground">{work.category}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent forceMount className="grid gap-4 pt-3 pb-6">
        <PeekMedia
          media={work.media}
          play={open}
          sizes="(min-width: 48rem) 40rem, 100vw"
          className="aspect-[3/2] [&_img]:object-top [&_video]:object-top"
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
    </AccordionItem>
  )
}
