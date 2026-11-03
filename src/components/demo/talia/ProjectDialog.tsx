"use client"

import { ViewTransition, type CSSProperties } from "react"
import { Dialog } from "radix-ui"
import { X } from "lucide-react"
import { Button } from "@/components/demo/forma/Button"
import { Chip } from "@/components/demo/forma/Chip"
import { typo } from "@/components/demo/forma/typo"
import { CardMedia } from "./CardMedia"
import { PauseToggle } from "./PauseToggle"
import { morphName } from "./TaliaProvider"
import type { OpenCard, Project, ProjectGroup } from "./types"

export interface ProjectDialogLabels {
  close: string
  pause: string
  ctaHeading: string
  ctaButton: string
}

/**
 * Karta wyjęta z talii. Kadr jest tym samym elementem co w karcie
 * (`<ViewTransition name>`), więc przelatuje z wachlarza, stosu albo siatki
 * na swoje miejsce i przekadrowuje się do natywnych proporcji filmu. Tło
 * i arkusz wchodzą osobnymi przejściami. Radix daje resztę: pułapkę fokusu,
 * Esc, kliknięcie w tło, blokadę przewijania i opis dla czytnika.
 *
 * Komponent istnieje tylko wtedy, gdy karta jest otwarta — zamknięcie to
 * odmontowanie w tej samej transakcji, w której karta wraca do talii.
 */
export function ProjectDialog({
  card,
  project,
  group,
  labels,
  onClose,
  onContact,
  onReturnFocus,
  container,
}: {
  card: OpenCard
  project: Project
  group: ProjectGroup
  labels: ProjectDialogLabels
  onClose: () => void
  onContact: () => void
  onReturnFocus: () => void
  container: HTMLElement | null
}) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal container={container}>
        {/*
         * Portal Radiksa klonuje swoje bezpośrednie dzieci z własnym refem
         * (Presence liczy na nim getComputedStyle), a ref na <ViewTransition>
         * nie jest elementem DOM — stąd zwykły kontener pośrodku.
         */}
        <div className="contents">
          <ViewTransition enter="talia-fade-in" exit="talia-fade-out" default="none">
            <div className="fixed inset-0 z-50">
              <Dialog.Overlay className="absolute inset-0 bg-black/45 dark:bg-black/65" />
            </div>
          </ViewTransition>
          <ViewTransition enter="talia-sheet-in" exit="talia-sheet-out" default="none">
            <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
              <Dialog.Content
                onCloseAutoFocus={(event) => {
                  // Fokus wraca na kartę, z której wyjęto kadr (Radix szukałby wyzwalacza).
                  event.preventDefault()
                  onReturnFocus()
                }}
                style={{ "--ar": card.aspect } as CSSProperties}
                className="bg-fm-surface shadow-fm-float relative flex max-h-[92dvh] w-full flex-col gap-3 overflow-y-auto overscroll-contain rounded-t-[2rem] p-3 outline-none md:w-auto md:max-w-[calc(100vw_-_3rem)] md:flex-row md:overflow-visible md:rounded-[2rem]"
              >
                <ViewTransition
                  name={morphName(card.origin, project.slug)}
                  share="talia-morph"
                  default="none"
                >
                  <CardMedia
                    poster={project.poster}
                    video={project.video}
                    active
                    inDialog
                    still={card.still}
                    sizes="(min-width: 768px) 54rem, 100vw"
                    className="rounded-fm-2xl aspect-(--ar) w-full shrink-0 md:w-[min(calc(var(--ar)*min(100dvh_-_8rem,46rem)),calc(100vw_-_27rem),54rem)]"
                  />
                </ViewTransition>

                <div className="flex flex-col px-2 pt-1 pb-2 md:w-[19rem] md:px-3 md:pt-3">
                  <div className="flex flex-wrap gap-1.5 pe-12 [&>*]:whitespace-nowrap">
                    <Chip className="text-[0.75rem]">{project.category}</Chip>
                    <Chip className="text-fm-ink-3 bg-transparent text-[0.75rem] shadow-[inset_0_0_0_1px_var(--fm-edge)]">
                      {group.label}
                    </Chip>
                  </div>
                  <Dialog.Title className="text-fm-h3 mt-4 font-semibold text-balance md:text-[1.625rem] md:leading-[1.15] md:tracking-[-0.025em]">
                    {project.title}
                  </Dialog.Title>
                  <Dialog.Description className="text-fm-small text-fm-ink-2 mt-3 text-pretty">
                    {typo(group.description)}
                  </Dialog.Description>

                  <div className="bg-fm-fill rounded-fm-2xl mt-6 p-4 md:mt-auto">
                    <p className="text-fm-small font-medium text-balance">
                      {typo(labels.ctaHeading)}
                    </p>
                    <Button size="md" className="mt-3 w-full" onClick={onContact}>
                      {labels.ctaButton}
                    </Button>
                  </div>
                </div>

                <PauseToggle
                  label={labels.pause}
                  className="bg-fm-surface/85 text-fm-ink shadow-fm-ring hover:bg-fm-fill absolute top-5 left-5 size-10 backdrop-blur-md"
                />
                <Dialog.Close
                  aria-label={labels.close}
                  title={labels.close}
                  className="fm-focus fm-press bg-fm-surface/85 text-fm-ink shadow-fm-ring hover:bg-fm-fill absolute top-5 right-5 grid size-10 place-items-center rounded-full backdrop-blur-md transition-[background-color,scale] md:top-4 md:right-4"
                >
                  <X className="size-[1.125rem]" />
                </Dialog.Close>
              </Dialog.Content>
            </div>
          </ViewTransition>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
