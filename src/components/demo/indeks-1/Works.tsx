"use client"

import { useEffect, useEffectEvent, useState, type MouseEvent } from "react"
import { flushSync } from "react-dom"
import { ArrowUpRight } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { workAnchor, workFromHash } from "./anchors"
import { goalTop, holdInPlace } from "./hold"
import { PanelMedia, preloadPanelMedia } from "./LazyMedia"
import { getPeek, mutePeek } from "./peek-store"
import { peekHandlers } from "./peek-trigger"
import { cardVideoTime, visibleCard } from "./stage-dom"
import type { WorkGroup } from "./types"

interface Labels {
  play: string
  pause: string
  visit: string
  newTab: string
  link: { label: string; href: string }
  /** Etykieta linku pod jedną realizacją bez własnego serwisu (podstrona portfolio). */
  inPortfolio: string
}

/** Panel rozwija się przez siatkę 0fr → 1fr w 320 ms — tyle trwa kotwiczenie wiersza. */
const EXPAND_MS = 360

/** Nazwy przejścia widoku: nagłówek (rysowany nad resztą), pozostałe sekcje i elementy listy. */
function nameScene(root: HTMLElement): () => void {
  const named: HTMLElement[] = []
  const name = (element: Element | null, value: string, group?: string) => {
    if (!(element instanceof HTMLElement)) return
    element.style.viewTransitionName = value
    if (group) element.style.setProperty("view-transition-class", group)
    named.push(element)
  }
  name(document.querySelector("[data-i1-header]"), "i1-head")
  // Każda inna sekcja płynie jako całość — nic nie przeskakuje w zrzucie strony.
  const own = root.closest("section")
  document.querySelectorAll("main > section").forEach((section) => {
    if (section !== own) name(section, `i1-s-${section.id}`, "i1-block")
  })
  name(own?.querySelector(".i1-shead") ?? null, "i1-wh", "i1-block")
  root
    .querySelectorAll("[data-vt-item]")
    .forEach((element, index) => name(element, `i1-i-${index}`, "i1-item"))
  return () =>
    named.forEach((element) => {
      element.style.viewTransitionName = ""
      element.style.removeProperty("view-transition-class")
    })
}

/**
 * Indeks realizacji: wiersz = projekt i kategoria, grupa stoi w lewym pasie.
 * Myszą — karta na marginesie (odkodowana z glifów); kliknięcie: karta
 * **wskakuje do panelu pod wierszem** (View Transition), także wtedy, gdy inny
 * panel jest już otwarty — kliknięty wiersz zostaje dokładnie pod kursorem.
 * Palcem i klawiaturą: rozwinięcie w miejscu, obraz odkodowuje się w panelu.
 */
export function Works({
  groups,
  all,
  labels,
}: {
  groups: readonly WorkGroup[]
  /** Minimalny link pod listą: „Wszystkie realizacje” (podstrona portfolio). */
  all: { label: string; href: string }
  labels: Labels
}) {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<string | null>(null)
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set())
  /** Panel, do którego wskoczyła karta: bez ponownego odkodowania, wideo gra dalej. */
  const [handoff, setHandoff] = useState<{ slug: string; time?: number } | null>(null)
  const [instant, setInstant] = useState(false)

  function apply(slug: string | null) {
    setOpen(slug)
    mutePeek(slug ? `work:${slug}` : null)
    if (slug) setOpened((prev) => (prev.has(slug) ? prev : new Set(prev).add(slug)))
  }

  const onHash = useEffectEvent(() => {
    const slug = workFromHash(window.location.hash)
    if (!slug || !groups.some((group) => group.works.some((work) => work.slug === slug))) return
    setHandoff(null)
    apply(slug)
    document
      .getElementById(workAnchor(slug))
      ?.querySelector<HTMLElement>("button")
      ?.focus({ preventScroll: true })
  })

  // Plakaty wierszy bliskich kadru wczytujemy z wyprzedzeniem — po tapnięciu panel ma
  // od pierwszej klatki rozmyty plakat (utajony wydruk), a nie pusty prostokąt.
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>("[data-works] [data-poster]")
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          observer.unobserve(target)
          const image = new Image()
          image.decoding = "async"
          image.src = target.dataset.poster ?? ""
        }
      },
      { rootMargin: "320px 0px" }
    )
    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Kod kadru panelu dochodzi, gdy przeglądarka odpocznie — pierwsze rozwinięcie nie czeka.
    const idle = setTimeout(preloadPanelMedia, 1500)
    const frame = requestAnimationFrame(() => onHash())
    window.addEventListener("hashchange", onHash)
    return () => {
      clearTimeout(idle)
      cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", onHash)
      mutePeek(null)
    }
  }, [])

  function onRowClick(event: MouseEvent<HTMLButtonElement>, slug: string) {
    const next = open === slug ? null : slug
    const button = event.currentTarget
    const top = button.getBoundingClientRect().top
    const root = button.closest<HTMLElement>("[data-works]")
    const card = visibleCard()
    const fromCard =
      next !== null &&
      !!card &&
      !!root &&
      getPeek().key === `work:${slug}` &&
      event.detail > 0 &&
      !reduced &&
      typeof document.startViewTransition === "function"

    const panel = document.getElementById(`${workAnchor(slug)}-panel`)
    if (!fromCard || !card || !root) {
      setHandoff(null)
      apply(next)
      holdInPlace(button, next ? panel : null, top, EXPAND_MS)
      return
    }

    // Morf: karta z marginesu → kadr w panelu. Wiersze, sąsiednie sekcje i nagłówek
    // mają nazwy, więc przesuwają się płynnie, a nie przeskakują w zrzucie strony.
    const unname = nameScene(root)
    const time = cardVideoTime()
    card.style.viewTransitionName = "i1-work"
    card.dataset.morphing = ""
    let media: HTMLElement | null = null
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setInstant(true)
        setHandoff({ slug, time })
        apply(slug)
      })
      // Jedno przesunięcie w tym samym przejściu: wiersz zostaje albo podjeżdża tak,
      // żeby karta wylądowała w całości w kadrze.
      const goal = goalTop(top, button.offsetHeight, panel?.offsetHeight ?? 0)
      const delta = button.getBoundingClientRect().top - goal
      if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: "instant" })
      card.style.viewTransitionName = ""
      card.style.visibility = "hidden"
      media =
        document.getElementById(workAnchor(slug))?.querySelector<HTMLElement>("[data-media]") ??
        null
      if (media) media.style.viewTransitionName = "i1-work"
    })
    void transition.finished.finally(() => {
      unname()
      if (media) media.style.viewTransitionName = ""
      card.style.visibility = ""
      delete card.dataset.morphing
      setInstant(false)
    })
  }

  return (
    <div data-works="" className="i1-dim">
      <ol className="flex flex-col gap-7 sm:gap-6">
        {groups.map((group) => (
          <li key={group.id} className="sm:grid sm:grid-cols-[var(--i1-lane)_1fr]">
            <h3
              data-vt-item=""
              className="mb-1 text-fm-small text-fm-ink-3 sm:mb-0 sm:pt-[0.8125rem]"
            >
              {group.label}
            </h3>
            <ol>
              {group.works.map((work) => {
                const isOpen = open === work.slug
                const panelId = `${workAnchor(work.slug)}-panel`
                const fromCard = handoff?.slug === work.slug
                return (
                  <li
                    key={work.slug}
                    id={workAnchor(work.slug)}
                    data-vt-item=""
                    data-poster={work.poster.src}
                    className="scroll-mt-24"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={(event) => onRowClick(event, work.slug)}
                      {...peekHandlers(`work:${work.slug}`)}
                      className="i1-row i1-bleed flex min-h-12 items-center gap-4 rounded-fm-lg py-2.5 text-left text-fm-ink fm-focus"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block tracking-[-0.01em]">{work.title}</span>
                        <span className="i1-row__meta block text-fm-small text-fm-ink-3 transition-colors duration-150 sm:hidden">
                          {work.category}
                        </span>
                      </span>
                      <span className="i1-row__meta hidden shrink-0 text-fm-small text-fm-ink-3 transition-colors duration-150 sm:block">
                        {work.category}
                      </span>
                      {/* Plus tylko na dotyku: myszą wiersz zdradza się kartą na marginesie. */}
                      <span
                        aria-hidden="true"
                        className="i1-plus text-fm-ink-3 pointer-fine:hidden!"
                      />
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-label={work.title}
                      data-open={isOpen || undefined}
                      data-instant={instant || undefined}
                      inert={!isOpen}
                      className="group/panel grid grid-rows-[0fr] transition-[grid-template-rows] duration-[320ms] ease-fm-snap *:min-h-0 *:overflow-hidden data-instant:transition-none data-open:grid-rows-[1fr]"
                    >
                      <div>
                        <div className="-translate-y-1 pt-2 pb-6 opacity-0 transition-[opacity,translate] [transition-duration:200ms,320ms] ease-fm-snap group-data-instant/panel:transition-none group-data-open/panel:translate-y-0 group-data-open/panel:opacity-100 group-data-open/panel:[transition-duration:0ms,320ms]">
                          {opened.has(work.slug) && (
                            // Szkielet w kadrze, zanim dojdzie leniwy fragment dekodera (zwykle już jest).
                            <div
                              className="i1-media rounded-fm-xl"
                              style={{
                                aspectRatio: `${work.poster.width} / ${work.poster.height}`,
                                width: `min(100%, calc(64svh * ${work.poster.width / work.poster.height}))`,
                              }}
                            >
                              <PanelMedia
                                key={fromCard ? "handoff" : "panel"}
                                frame={work.poster}
                                sources={
                                  work.video ? [{ src: work.video, type: "video/mp4" }] : undefined
                                }
                                decode={fromCard ? "none" : "view"}
                                priority
                                wave="panel"
                                origin="top"
                                active={isOpen}
                                startAt={fromCard ? handoff?.time : undefined}
                                title={work.title}
                                labels={labels}
                                className="rounded-fm-xl"
                              />
                            </div>
                          )}
                          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-fm-small duration-200 ease-fm-snap fill-mode-both group-data-instant/panel:group-data-open/panel:animate-in group-data-instant/panel:group-data-open/panel:delay-300 group-data-instant/panel:group-data-open/panel:fade-in-0">
                            <p className="max-w-[26rem] text-pretty text-fm-ink-3">
                              {work.description ?? group.description}
                            </p>
                            <a
                              href={work.url ?? labels.link.href}
                              {...(work.url
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className="group relative inline-flex items-center gap-1 rounded-fm-xs font-medium text-fm-ink underline decoration-fm-edge-strong underline-offset-4 fm-focus transition-[text-decoration-color] duration-150 after:absolute after:-inset-x-2 after:-inset-y-3.5 after:content-[''] hover:decoration-current"
                            >
                              {work.url ? labels.visit : labels.inPortfolio}
                              <ArrowUpRight aria-hidden="true" className="i1-arrow size-3.5" />
                              {work.url && <span className="sr-only"> ({labels.newTab})</span>}
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
      <div className="mt-4 flex justify-end sm:ps-(--i1-lane)">
        <a
          href={all.href}
          className="group inline-flex h-11 items-center gap-1 rounded-full text-fm-small font-medium text-fm-ink-2 fm-focus transition-colors duration-150 hover:text-fm-ink sm:h-10"
        >
          {all.label}
          {/* Strzałka wystaje poza kolumnę — tekst kończy się na tej samej linii co kategorie. */}
          <ArrowUpRight
            aria-hidden="true"
            className="i1-arrow size-3.5 max-md:hidden md:-me-[1.125rem]"
          />
        </a>
      </div>
    </div>
  )
}
