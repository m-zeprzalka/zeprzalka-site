"use client"

import { useRef, useState, type ComponentType } from "react"
import { flushSync } from "react-dom"
import { Tabs } from "radix-ui"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import type { DemoWork } from "@/components/demo/shared/content"
import { inViewport, useFinePointer } from "./hooks"
import type { WorkDialogLabels, WorkDialogProps } from "./WorkDialog"
import { WorkTabs } from "./WorkTabs"
import { WorkTile } from "./WorkTile"

/**
 * Dialog (Radix, ok. 10 KB) pobiera się przy pierwszym zbliżeniu do kafla.
 * Zwykły import do stanu zamiast `next/dynamic`: komponent leniwy zawiesza
 * się przy pierwszym montażu, a morf wymaga, żeby okno istniało w DOM
 * synchronicznie, wewnątrz `startViewTransition`.
 */
const loadDialog = () => import("./WorkDialog").then((module) => module.default)

export interface GroupInfo {
  label: string
  description: string
}

export interface WorkGroup extends GroupInfo {
  id: string
  works: readonly DemoWork[]
}

/**
 * Układ na grupę: zrzuty produktów mają jeden format (16:10), więc stoją
 * w zwykłej siatce — kolejność czyta się wierszami, tak jak liczy dialog;
 * jedna kolumna na telefonie, dwie wyżej. Strony i filmy (różne proporcje) —
 * masonry: dwie kolumny od telefonu, trzy od 1280 px.
 */
const COLUMNS: Record<string, string> = {
  produkty: "grid gap-y-0 sm:grid-cols-2 sm:gap-y-0 xl:gap-y-0",
  web: "columns-2 xl:columns-3",
  wideo: "columns-2 xl:columns-3",
}

/**
 * Wszystkie realizacje w trzech zakładkach (najpierw własne produkty) i podgląd
 * w dialogu, który liczy i przewija tylko w obrębie zakładki. Otwarcie
 * i zamknięcie to morf kadru: miniatura „przelatuje” w okno i z powrotem
 * (View Transitions). Bez wsparcia przeglądarki, przy „ogranicz ruch” albo
 * gdy kafel nie jest cały w kadrze — zwykła animacja dialogu.
 *
 * Panele nieaktywnych zakładek są w HTML (ukryte stylem), więc wszystkie
 * 19 realizacji widzą też roboty.
 */
export function WorkGallery({
  groups,
  labels,
}: {
  groups: readonly WorkGroup[]
  labels: WorkDialogLabels
}) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [tab, setTab] = useState(groups[0]?.id ?? "")
  const works = groups.find((group) => group.id === tab)?.works ?? []
  const groupInfo: Record<string, GroupInfo> = Object.fromEntries(
    groups.map((group) => [group.id, { label: group.label, description: group.description }])
  )
  // `index` zostaje po zamknięciu — dialog pokazuje treść także w trakcie wyjścia.
  const [index, setIndex] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [morph, setMorph] = useState(false)
  const [WorkDialog, setWorkDialog] = useState<ComponentType<WorkDialogProps> | null>(null)
  const busy = useRef(false)

  async function ensureDialog() {
    const component = await loadDialog()
    if (!WorkDialog) setWorkDialog(() => component)
    return component
  }

  const canMorph = (node: Element | null): node is HTMLElement =>
    !reduced && typeof document.startViewTransition === "function" && inViewport(node)

  async function show(next: number, trigger: HTMLButtonElement) {
    if (busy.current) return
    busy.current = true
    const component = await ensureDialog()
    const media = trigger.querySelector<HTMLElement>("[data-work-media]")
    if (!canMorph(media)) {
      setWorkDialog(() => component)
      setIndex(next)
      setOpen(true)
      busy.current = false
      return
    }
    media.style.viewTransitionName = "re-work"
    const transition = document.startViewTransition(() => {
      media.style.viewTransitionName = ""
      flushSync(() => {
        setWorkDialog(() => component)
        setMorph(true)
        setIndex(next)
        setOpen(true)
      })
    })
    void transition.finished.finally(() => {
      setMorph(false)
      busy.current = false
    })
  }

  function hide() {
    if (index === null || busy.current) return
    const media = document.querySelector(`[data-work-media="${works[index]?.slug}"]`)
    if (!canMorph(media)) return setOpen(false)
    busy.current = true
    flushSync(() => setMorph(true))
    const transition = document.startViewTransition(() => {
      flushSync(() => setOpen(false))
      media.style.viewTransitionName = "re-work"
    })
    void transition.finished.finally(() => {
      media.style.viewTransitionName = ""
      setMorph(false)
      busy.current = false
    })
  }

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(next) => {
        setTab(next)
        setIndex(null)
      }}
    >
      <WorkTabs
        value={tab}
        groups={groups.map((group) => ({
          id: group.id,
          label: group.label,
          count: group.works.length,
        }))}
      />

      {groups.map((group) => (
        <Tabs.Content
          key={group.id}
          value={group.id}
          forceMount
          className="re-tabpanel mt-8 rounded-fm-2xl fm-focus data-[state=inactive]:hidden sm:mt-10"
        >
          <ul
            className={cn("gap-3 sm:gap-5 xl:gap-6", COLUMNS[group.id] ?? "columns-2 xl:columns-3")}
          >
            {group.works.map((work, position) => (
              <li key={work.slug} className="re-tile-in mb-6 break-inside-avoid sm:mb-7 xl:mb-8">
                <WorkTile
                  work={work}
                  fine={fine}
                  paused={open}
                  reduced={reduced}
                  onOpen={(trigger) => void show(position, trigger)}
                  onIntent={() => void ensureDialog()}
                />
              </li>
            ))}
          </ul>
        </Tabs.Content>
      ))}

      {WorkDialog && index !== null && (
        <WorkDialog
          works={works}
          groups={groupInfo}
          index={index}
          open={open}
          onIndex={setIndex}
          onClose={hide}
          morph={morph}
          reduced={reduced}
          labels={labels}
        />
      )}
    </Tabs.Root>
  )
}
