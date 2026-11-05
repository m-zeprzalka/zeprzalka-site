"use client"

import { useState } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight, X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import type { DemoWork } from "@/components/demo/shared/content"
import { UI } from "../ui-strings"
import { MediaSurface } from "./MediaSurface"

export interface WorkLabels {
  preview: string
  close: string
  openSite: string
  portfolio: { label: string; href: string }
}

/**
 * Kafel realizacji (D): zakodowany w glifach, odkodowuje się w kolor według
 * wariantu z laboratorium. Kliknięcie otwiera podgląd w oknie — tam obraz
 * dekoduje się sam, a wideo gra z możliwością pauzy.
 */
export function WorkTile({
  work,
  description,
  sizes,
  labels,
  index,
}: {
  work: DemoWork
  description: string
  sizes: string
  labels: WorkLabels
  index: number
}) {
  const [root, setRoot] = useState<HTMLElement | null>(null)

  return (
    <Dialog.Root
      onOpenChange={(open) => open && setRoot(document.querySelector<HTMLElement>(".gll"))}
    >
      <figure data-gll-host="" className="gll-tile">
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`${labels.preview}: ${work.title}`}
            className="block w-full fm-press-soft rounded-fm-2xl fm-focus"
          >
            <MediaSurface
              section="works"
              index={index}
              src={work.poster}
              width={work.width}
              height={work.height}
              sizes={sizes}
              video={work.video}
            />
          </button>
        </Dialog.Trigger>
        <figcaption className="mt-3 flex flex-col gap-0.5 text-fm-small sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <span className="font-medium tracking-[-0.01em] text-fm-ink">{work.title}</span>
          <span className="text-fm-ink-3 sm:shrink-0">{work.category}</span>
        </figcaption>
      </figure>

      <Dialog.Portal container={root}>
        <Dialog.Overlay className="gll-overlay" />
        <Dialog.Content className="gll-dialog">
          <div
            className="gll-dialog__media"
            style={{ "--gll-ratio": `${work.width / work.height}` } as React.CSSProperties}
          >
            <MediaSurface
              section="works"
              mode="reveal"
              src={work.poster}
              width={work.width}
              height={work.height}
              // Te same `sizes` co kafel: przeglądarka bierze plik z pamięci podręcznej, więc
              // plakat stoi w oknie od pierwszej klatki (pliki źródłowe mają 720–1200 px).
              sizes={sizes}
              video={work.video}
              controls={{ pause: UI.pauseVideo, play: UI.playVideo }}
              rounded="rounded-fm-3xl"
            />
          </div>
          <div className="flex items-start justify-between gap-4 px-2 pt-5 sm:px-3">
            <div>
              <Dialog.Title className="text-[1.5rem] leading-tight font-medium tracking-[-0.03em]">
                {work.title}
              </Dialog.Title>
              <p className="mt-1 text-fm-small text-fm-ink-3">
                {work.category}, {work.groupLabel.toLowerCase()}
              </p>
            </div>
            <Dialog.Close
              aria-label={labels.close}
              className="-me-1 grid size-11 shrink-0 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-3 max-w-[56ch] px-2 text-fm-body text-pretty text-fm-ink-2 sm:px-3">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap gap-3 px-2 sm:px-3">
            {work.url && (
              <Button asChild>
                <a href={work.url} target="_blank" rel="noopener">
                  {labels.openSite}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            )}
            <Button asChild variant="secondary">
              <a href={labels.portfolio.href}>{labels.portfolio.label}</a>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
