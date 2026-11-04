"use client"

import { useState } from "react"
import { Dialog } from "radix-ui"
import { ArrowUpRight, X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import type { DemoWork } from "@/components/demo/shared/content"
import { CodedMedia } from "./CodedMedia"
import { UI } from "./ui-strings"

export interface WorkLabels {
  preview: string
  close: string
  openSite: string
  portfolio: { label: string; href: string }
}

/**
 * Kafel realizacji: zakodowany w glifach, dekoduje się w kolor pod kursorem
 * (albo w środku ekranu na telefonie). Kliknięcie otwiera podgląd w oknie —
 * tam obraz dekoduje się sam, a wideo gra z możliwością pauzy.
 */
export function WorkTile({
  work,
  description,
  sizes,
  labels,
}: {
  work: DemoWork
  description: string
  sizes: string
  labels: WorkLabels
}) {
  const [root, setRoot] = useState<HTMLElement | null>(null)

  return (
    <Dialog.Root
      onOpenChange={(open) => open && setRoot(document.querySelector<HTMLElement>(".gl"))}
    >
      <figure data-gl-host="" className="gl-tile">
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`${labels.preview}: ${work.title}`}
            className="block w-full fm-press-soft rounded-fm-2xl fm-focus"
          >
            <CodedMedia
              src={work.poster}
              width={work.width}
              height={work.height}
              sizes={sizes}
              video={work.video}
            />
          </button>
        </Dialog.Trigger>
        <figcaption className="mt-3.5 grid gap-0.5 text-fm-small">
          <span className="font-medium tracking-[-0.01em] text-fm-ink">{work.title}</span>
          <span className="text-fm-ink-3">{work.category}</span>
        </figcaption>
      </figure>

      <Dialog.Portal container={root}>
        <Dialog.Overlay className="gl-overlay" />
        <Dialog.Content className="gl-dialog">
          <div
            className="gl-dialog__media"
            style={{ "--gl-ratio": `${work.width / work.height}` } as React.CSSProperties}
          >
            <CodedMedia
              mode="reveal"
              src={work.poster}
              width={work.width}
              height={work.height}
              sizes="(min-width: 960px) 880px, 100vw"
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
              className="-me-1 grid size-10 shrink-0 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"
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
