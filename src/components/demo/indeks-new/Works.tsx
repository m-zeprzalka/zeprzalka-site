"use client"

import { useEffect, useEffectEvent, useState, type MouseEvent } from "react"
import { flushSync } from "react-dom"
import { ArrowUpRight } from "lucide-react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { workAnchor, workFromHash } from "./anchors"
import { GlyphMedia } from "./GlyphMedia"
import { getPeek, mutePeek } from "./peek-store"
import { peekHandlers } from "./peek-trigger"
import { cardVideoTime, visibleCard } from "./Stage"
import type { WorkGroup } from "./types"

interface Labels {
  play: string
  pause: string
  visit: string
  newTab: string
  link: { label: string; href: string }
}

/** Panel rozwija się przez siatkę 0fr → 1fr w 320 ms — tyle trwa kotwiczenie wiersza. */
const EXPAND_MS = 360
/** Górna granica wiersza (pod lepkim nagłówkiem) i dolny oddech pod panelem. */
const TOP_LIMIT = 80
const BOTTOM_GAP = 24

/**
 * Gdzie ma stanąć wiersz: tam, gdzie był (pod kursorem, pod palcem), chyba
 * że panel pod nim nie zmieściłby się w oknie — wtedy wiersz podjeżdża
 * dokładnie o tyle, żeby było widać cały panel, ale nie wyżej niż pod nagłówek.
 */
function goalTop(top: number, rowHeight: number, panelHeight: number): number {
  const fit = window.innerHeight - BOTTOM_GAP - rowHeight - panelHeight
  return Math.max(Math.min(top, TOP_LIMIT), Math.min(top, fit))
}

/**
 * Wiersz stoi tam, gdzie był: przez cały czas przejścia przewijamy stronę
 * o tyle, o ile wiersz się przesunął (zwijający się panel nad nim nie
 * „wyciąga” go spod kursora ani spod palca). Potem, jeśli rozwinięty panel
 * wystaje poza okno, strona łagodnie dosuwa go do kadru.
 */
function holdInPlace(
  element: HTMLElement,
  panel: HTMLElement | null,
  top: number,
  duration: number
) {
  const end = performance.now() + duration
  const step = () => {
    const delta = element.getBoundingClientRect().top - top
    if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: "instant" })
    if (performance.now() < end) {
      requestAnimationFrame(step)
      return
    }
    if (!panel || !panel.hasAttribute("data-open")) return
    const goal = goalTop(top, element.offsetHeight, panel.offsetHeight)
    if (goal < top - 0.5) window.scrollBy({ top: top - goal })
  }
  requestAnimationFrame(step)
}

/** Nazwy przejścia widoku: nagłówek (rysowany nad resztą), pozostałe sekcje i elementy listy. */
function nameScene(root: HTMLElement): () => void {
  const named: HTMLElement[] = []
  const name = (element: Element | null, value: string, group?: string) => {
    if (!(element instanceof HTMLElement)) return
    element.style.viewTransitionName = value
    if (group) element.style.setProperty("view-transition-class", group)
    named.push(element)
  }
  name(document.querySelector("[data-ixn-header]"), "ixn-head")
  // Każda inna sekcja płynie jako całość — nic nie przeskakuje w zrzucie strony.
  const own = root.closest("section")
  document.querySelectorAll("main > section").forEach((section) => {
    if (section !== own) name(section, `ixn-s-${section.id}`, "ixn-block")
  })
  name(own?.querySelector(".ixn-shead") ?? null, "ixn-wh", "ixn-block")
  root
    .querySelectorAll("[data-vt-item]")
    .forEach((element, index) => name(element, `ixn-i-${index}`, "ixn-item"))
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
export function Works({ groups, labels }: { groups: readonly WorkGroup[]; labels: Labels }) {
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
    const frame = requestAnimationFrame(() => onHash())
    window.addEventListener("hashchange", onHash)
    return () => {
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
    card.style.viewTransitionName = "ixn-work"
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
      if (media) media.style.viewTransitionName = "ixn-work"
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
    <div data-works="" className="ixn-dim">
      <ol className="flex flex-col gap-7 sm:gap-6">
        {groups.map((group) => (
          <li key={group.id} className="sm:grid sm:grid-cols-[var(--ixn-lane)_1fr]">
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
                      className="ixn-row ixn-bleed flex min-h-12 items-center gap-4 rounded-fm-lg py-2.5 text-left text-fm-ink fm-focus"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block tracking-[-0.01em]">{work.title}</span>
                        <span className="ixn-row__meta block text-fm-small text-fm-ink-3 transition-colors duration-150 sm:hidden">
                          {work.category}
                        </span>
                      </span>
                      <span className="ixn-row__meta hidden shrink-0 text-fm-small text-fm-ink-3 transition-colors duration-150 sm:block">
                        {work.category}
                      </span>
                      {/* Plus tylko na dotyku: myszą wiersz zdradza się kartą na marginesie. */}
                      <span
                        aria-hidden="true"
                        className="ixn-plus text-fm-ink-3 pointer-fine:hidden!"
                      />
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-label={work.title}
                      data-open={isOpen || undefined}
                      data-instant={instant || undefined}
                      inert={!isOpen}
                      className="ixn-panel"
                    >
                      <div>
                        <div className="ixn-panel__inner pt-2 pb-6">
                          {opened.has(work.slug) && (
                            <GlyphMedia
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
                              style={{
                                width: `min(100%, calc(64svh * ${work.poster.width / work.poster.height}))`,
                              }}
                            />
                          )}
                          <div className="ixn-caption mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-fm-small">
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
                              {work.url ? labels.visit : labels.link.label}
                              <ArrowUpRight aria-hidden="true" className="ixn-arrow size-3.5" />
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
    </div>
  )
}
