"use client"

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react"
import { flushSync } from "react-dom"
import { LazyMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { useInView, useReducedMotion } from "@/components/demo/forma/use-in-view"
import { workAnchor, workFromHash } from "./anchors"
import { FloatingPreview } from "./FloatingPreview"
import { useFinePointer } from "./hooks"
import { FALLBACK_RATIO, usePosterRatios } from "./use-poster-ratios"
import { WorkMedia } from "./WorkMedia"
import type { Work } from "./types"

const loadFeatures = () => import("./motion-features").then((module) => module.default)

interface Labels {
  play: string
  pause: string
  link: { label: string; href: string }
}

/**
 * Indeks realizacji: wiersz = projekt, kategoria; grupa stoi w lewej kolumnie
 * tylko przy pierwszym wierszu (jak rok w spisie wpisów). Myszą: najechanie
 * pokazuje pływającą kartę z wideo, reszta listy cofa się do szarości.
 * Palcem i klawiaturą: wiersz to przycisk, który rozwija wideo w miejscu.
 * Kotwica `#realizacja-…` (paleta, dowody w kompetencjach) otwiera wiersz.
 */
export function Works({ works, labels }: { works: readonly Work[]; labels: Labels }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<string | null>(null)
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set())
  // Ostatni wskazany projekt zostaje w karcie, gdy ta gaśnie — bez zmiany kadru w trakcie wyjścia.
  const [preview, setPreview] = useState<{ slug: string; visible: boolean } | null>(null)
  const [instant, setInstant] = useState<string | null>(null)
  const [rootRef, near] = useInView<HTMLDivElement>("600px 0px")
  const cardRef = useRef<HTMLDivElement>(null)
  const ratios = usePosterRatios(works, near)

  const groups = useMemo(() => {
    const byGroup = new Map<string, { label: string; works: Work[] }>()
    for (const work of works) {
      const group = byGroup.get(work.group) ?? { label: work.groupLabel, works: [] }
      group.works.push(work)
      byGroup.set(work.group, group)
    }
    return [...byGroup.entries()]
  }, [works])

  function expand(slug: string | null) {
    setOpen(slug)
    if (slug) setOpened((prev) => (prev.has(slug) ? prev : new Set(prev).add(slug)))
  }

  const onHash = useEffectEvent(() => {
    const slug = workFromHash(window.location.hash)
    if (!slug || !works.some((work) => work.slug === slug)) return
    expand(slug)
    document
      .getElementById(workAnchor(slug))
      ?.querySelector<HTMLElement>("button")
      ?.focus({ preventScroll: true })
  })

  useEffect(() => {
    // Adres z kotwicą przy wejściu na stronę: otwieramy wiersz po pierwszym układzie.
    const frame = requestAnimationFrame(() => onHash())
    window.addEventListener("hashchange", onHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", onHash)
    }
  }, [])

  function onRowPointer(event: PointerEvent, slug: string) {
    if (event.pointerType === "mouse") setPreview({ slug, visible: true })
  }

  /**
   * Klik w wiersz, nad którym wisi karta: karta „wlatuje” w wiersz i staje się
   * odtwarzaczem (View Transition). Proporcje karty i panelu są te same, więc
   * morf to czyste przesunięcie ze skalą; kolejne wiersze zjeżdżają w dół.
   * Bez wsparcia przeglądarki, z klawiatury albo przy „ogranicz ruch” — zwykłe rozwinięcie.
   */
  function onRowClick(event: MouseEvent, slug: string) {
    const card = cardRef.current
    const root = rootRef.current
    // Morf tylko z zamkniętej listy: wtedy przesuwa się wyłącznie to, co leży pod wierszem.
    const canMorph =
      open === null &&
      preview?.visible &&
      preview.slug === slug &&
      event.detail > 0 &&
      !reduced &&
      typeof document.startViewTransition === "function"
    if (!canMorph || !card || !root) return expand(open === slug ? null : slug)

    // Nazwy dostają tylko wiersz i to, co pod nim (wiersze i podpisy grup) — elementy
    // wyżej stoją w miejscu, a nazwane malowałyby się nad lepkim nagłówkiem.
    const target = document.getElementById(workAnchor(slug))
    const rows = [...root.querySelectorAll<HTMLElement>("li[id^='realizacja-'], h3")].filter(
      (node) =>
        node === target ||
        (!!target && !!(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING))
    )
    rows.forEach((row, index) => {
      row.style.viewTransitionName = `ix-row-${index}`
      row.style.setProperty("view-transition-class", "ix-row")
    })
    card.style.viewTransitionName = "ix-work"
    // Duży cień karty w zrzucie zamieniłby się w szarą poświatę — na czas morfu mniejszy.
    card.dataset.morphing = ""
    let media: HTMLElement | null = null

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setInstant(slug)
        expand(slug)
      })
      card.style.viewTransitionName = ""
      card.style.visibility = "hidden"
      media = document.querySelector<HTMLElement>(`#${workAnchor(slug)} [data-media]`)
      if (media) media.style.viewTransitionName = "ix-work"
    })
    void transition.finished.finally(() => {
      rows.forEach((row) => {
        row.style.viewTransitionName = ""
        row.style.removeProperty("view-transition-class")
      })
      if (media) media.style.viewTransitionName = ""
      card.style.visibility = ""
      delete card.dataset.morphing
      setInstant(null)
    })
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <div
        ref={rootRef}
        onPointerLeave={() => setPreview((prev) => prev && { ...prev, visible: false })}
      >
        <ol className="ix-dim flex flex-col gap-7 sm:gap-6">
          {groups.map(([id, group]) => (
            <li key={id} className="sm:grid sm:grid-cols-[var(--ix-lane)_1fr]">
              <h3 className="text-fm-small text-fm-ink-3 mb-1 sm:mb-0 sm:pt-[0.8125rem]">
                {group.label}
              </h3>
              <ol>
                {group.works.map((work) => {
                  const isOpen = open === work.slug
                  const panelId = `${workAnchor(work.slug)}-panel`
                  return (
                    <li key={work.slug} id={workAnchor(work.slug)} className="scroll-mt-24">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={(event) => onRowClick(event, work.slug)}
                        onPointerEnter={(event) => onRowPointer(event, work.slug)}
                        className="ix-row ix-bleed fm-focus text-fm-ink rounded-fm-lg flex min-h-12 items-center gap-4 py-2.5 text-left"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block tracking-[-0.01em]">{work.title}</span>
                          <span className="ix-row__meta text-fm-small text-fm-ink-3 block transition-colors duration-150 sm:hidden">
                            {work.category}
                          </span>
                        </span>
                        <span className="ix-row__meta text-fm-small text-fm-ink-3 hidden shrink-0 transition-colors duration-150 sm:block">
                          {work.category}
                        </span>
                        {/* Plus tylko na dotyku: myszą wiersz zdradza się kartą wideo, a piętnaście
                            plusów to szum (i kategorie trzymają prawą krawędź kolumny). */}
                        <span
                          aria-hidden="true"
                          className="ix-plus text-fm-ink-3 pointer-fine:hidden!"
                        />
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        aria-label={work.title}
                        data-open={isOpen || undefined}
                        data-instant={instant === work.slug || undefined}
                        inert={!isOpen}
                        className="ix-panel"
                      >
                        <div>
                          <div className="ix-panel__inner pt-2 pb-6">
                            {opened.has(work.slug) && (
                              <WorkMedia
                                work={work}
                                ratio={ratios[work.slug] ?? FALLBACK_RATIO}
                                open={isOpen}
                                reduced={reduced}
                                labels={labels}
                              />
                            )}
                            <div className="ix-caption text-fm-small mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                              <p className="text-fm-ink-3 max-w-[26rem] text-pretty">
                                {work.groupDescription}
                              </p>
                              <a
                                href={labels.link.href}
                                className="group fm-focus text-fm-ink rounded-fm-xs decoration-fm-edge-strong relative inline-flex items-center gap-1 font-medium underline underline-offset-4 transition-[text-decoration-color] duration-150 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:decoration-current"
                              >
                                {labels.link.label}
                                <ArrowUpRight aria-hidden="true" className="ix-arrow size-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ol>

        {fine && (
          <FloatingPreview
            works={works}
            active={preview?.slug ?? null}
            visible={!!preview?.visible && preview.slug !== open}
            armed={preview !== null}
            ratios={ratios}
            reduced={reduced}
            anchorRef={rootRef}
            cardRef={cardRef}
          />
        )}
      </div>
    </LazyMotion>
  )
}
