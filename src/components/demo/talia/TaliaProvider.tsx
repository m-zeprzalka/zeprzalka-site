"use client"

import {
  createContext,
  startTransition,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { LazyMotion, MotionConfig } from "motion/react"
import { ContactSheet, type ContactLabels } from "./ContactSheet"
import { ProjectDialog, type ProjectDialogLabels } from "./ProjectDialog"
import type { OpenCard, Origin, Project, ProjectGroup, Still } from "./types"

const loadFeatures = () => import("./motion-features").then((module) => module.default)

/**
 * Zatrzymuje bieżącą klatkę grającej karty na płótnie. Bez tego przejście
 * przenikałoby klatkę z karty z plakatem dialogu (pierwszą klatką filmu) —
 * podwójna ekspozycja w połowie lotu. Płótno, nie obraz `data:`: rysuje się
 * synchronicznie, więc trafia do „nowej” migawki przejścia na pewno.
 */
function captureStill(trigger: HTMLElement): Still | undefined {
  const video = trigger.querySelector("video")
  if (!video || video.readyState < 2 || !video.videoWidth) return undefined
  const canvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext("2d")?.drawImage(video, 0, 0)
  return { canvas, time: video.currentTime }
}

interface TaliaContextValue {
  /** Karta, która jest teraz wyjęta z talii (w jej miejscu zostaje sylwetka). */
  open: OpenCard | null
  openProject: (slug: string, origin: Origin, trigger: HTMLElement) => void
  openContact: () => void
  /** Dialog przykrywa stronę — pętle w tle mogą się zatrzymać. */
  covered: boolean
  /** Użytkownik wstrzymał wideo (WCAG 2.2.2) — dotyczy całej strony. */
  paused: boolean
  togglePaused: () => void
}

const TaliaContext = createContext<TaliaContextValue | null>(null)

export function useTalia(): TaliaContextValue {
  const value = use(TaliaContext)
  if (!value) throw new Error("useTalia: brak <TaliaProvider>")
  return value
}

/** Nazwa przejścia widoku karty — unikalna dla pary (talia, realizacja). */
export function morphName(origin: Origin, slug: string): string {
  return `talia-${origin}-${slug}`
}

/**
 * Korzeń kliencki koncepcji: leniwie ładowane cechy Motion, „ogranicz ruch”
 * z ustawień systemu, stan obu dialogów. Sekcje strony (komponenty
 * serwerowe) przychodzą jako `children`.
 */
export function TaliaProvider({
  projects,
  groups,
  projectLabels,
  contactLabels,
  children,
}: {
  projects: readonly Project[]
  groups: readonly ProjectGroup[]
  projectLabels: ProjectDialogLabels
  contactLabels: ContactLabels
  children: ReactNode
}) {
  const [open, setOpen] = useState<OpenCard | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const togglePaused = useCallback(() => setPaused((value) => !value), [])
  // Karta, z której otwarto dialog — fokus wraca na nią także wtedy,
  // gdy po drodze otworzył się formularz kontaktowy.
  const lastTrigger = useRef<HTMLElement | null>(null)
  // Dialogi trafiają do węzła wewnątrz `.fm` — w <body> tokeny Formy nie istnieją.
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  const contactReturn = useRef<HTMLElement | null>(null)
  const switching = useRef(false)

  const openProject = useCallback((slug: string, origin: Origin, trigger: HTMLElement) => {
    const img = trigger.querySelector("img")
    const aspect = img?.naturalWidth ? img.naturalWidth / img.naturalHeight : 0.8
    const still = captureStill(trigger)
    lastTrigger.current = trigger
    // Przejście widoku rusza tylko z aktualizacji w transition (React 19.3).
    startTransition(() => setOpen({ slug, origin, aspect, still }))
  }, [])

  const closeProject = useCallback(() => {
    startTransition(() => setOpen(null))
  }, [])

  const openContact = useCallback(() => {
    contactReturn.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setContactOpen(true)
  }, [])

  const projectToContact = useCallback(() => {
    switching.current = true
    contactReturn.current = lastTrigger.current
    startTransition(() => setOpen(null))
    setContactOpen(true)
  }, [])

  // Po zamknięciu karty fokus wraca na nią — chyba że z karty przeszliśmy
  // do formularza; wtedy wróci tam dopiero po jego zamknięciu.
  const returnFocus = useCallback(() => {
    if (switching.current) {
      switching.current = false
      return
    }
    lastTrigger.current?.focus({ preventScroll: true })
  }, [])

  const returnFromContact = useCallback(() => {
    const target = contactReturn.current
    if (target?.isConnected) target.focus({ preventScroll: true })
  }, [])

  const value = useMemo<TaliaContextValue>(
    () => ({
      open,
      openProject,
      openContact,
      covered: open !== null || contactOpen,
      paused,
      togglePaused,
    }),
    [open, openProject, openContact, contactOpen, paused, togglePaused]
  )

  const project = open ? projects.find((item) => item.slug === open.slug) : undefined
  const group = project ? groups.find((item) => item.id === project.group) : undefined

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <TaliaContext value={value}>
          {children}
          {open && project && group && (
            <ProjectDialog
              card={open}
              project={project}
              group={group}
              labels={projectLabels}
              onClose={closeProject}
              onContact={projectToContact}
              onReturnFocus={returnFocus}
              container={portal}
            />
          )}
          <ContactSheet
            container={portal}
            open={contactOpen}
            onOpenChange={setContactOpen}
            labels={contactLabels}
            onReturnFocus={returnFromContact}
          />
          <div ref={setPortal} />
        </TaliaContext>
      </MotionConfig>
    </LazyMotion>
  )
}
