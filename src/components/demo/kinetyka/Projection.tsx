"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { Dialog } from "radix-ui"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { kinetic, motionAllowed } from "./gsap"
import { portalRoot } from "./ids"

export interface ProjectionWork {
  slug: string
  title: string
  category: string
  /** Opis grupy (Strony i aplikacje, Wideo i animacja) — jedno zdanie pod tytułem. */
  note: string
  poster: string
  width: number
  height: number
  video?: string
}

interface Labels {
  close: string
  prev: string
  next: string
  of: string
}

interface ProjectionApi {
  open: (slug: string, origin?: HTMLElement | null) => void
}

const ProjectionContext = createContext<ProjectionApi>({ open: () => {} })

export function useProjection() {
  return useContext(ProjectionContext)
}

/** Lot kadru do projekcji i z powrotem. */
const FLY = { duration: 0.72, ease: "expo.out" }
const BACK = { duration: 0.45, ease: "power3.inOut" }

/**
 * Projekcja realizacji: kliknięty kadr (z taśmy albo z masonry) przelatuje
 * do dużego okna na czarnym tle — sala kinowa w obu motywach. Kolejne
 * realizacje (strzałki, klawisze ← →) zmieniają się NA MIEJSCU przez
 * rozmycie, bez drugiego lotu (uwaga do „Indeksu”). Zamknięcie odsyła kadr
 * tam, skąd przyleciał, jeśli wciąż jest na ekranie; inaczej okno gaśnie.
 * Radix Dialog: pułapka fokusu, Esc, powrót fokusu do kadru.
 */
export function ProjectionProvider({
  works,
  labels,
  children,
}: {
  works: readonly ProjectionWork[]
  labels: Labels
  children: ReactNode
}) {
  const [index, setIndex] = useState<number | null>(null)
  const [swap, setSwap] = useState(0)
  const origin = useRef<HTMLElement | null>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const closing = useRef(false)
  const flying = useRef(false)
  const returnTo = useRef<HTMLElement | null>(null)

  const open = useCallback(
    (slug: string, from?: HTMLElement | null) => {
      const found = works.findIndex((work) => work.slug === slug)
      if (found < 0) return
      origin.current = from ?? null
      returnTo.current = from?.closest<HTMLElement>("button, a") ?? null
      flying.current = true
      setSwap(0)
      setIndex(found)
    },
    [works]
  )

  // Lot: kadr startuje z prostokąta źródła i dolatuje do swojego miejsca (FLIP).
  // Ref-funkcja zamiast efektu: portal dialogu montuje treść w kolejnym commicie, a ref
  // wywołuje się dokładnie wtedy, gdy kadr jest już w DOM — przed pierwszym malowaniem.
  const mediaCallback = useCallback((media: HTMLDivElement | null) => {
    mediaRef.current = media
    if (!media || !flying.current) return
    flying.current = false
    const from = origin.current?.getBoundingClientRect()
    if (!from || !motionAllowed()) return
    const { gsap } = kinetic()
    const to = media.getBoundingClientRect()
    gsap.fromTo(
      media,
      {
        x: from.left - to.left,
        y: from.top - to.top,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        borderRadius: 6,
      },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 16, ...FLY }
    )
    const chrome = media.closest(".kn-projection")?.querySelectorAll("[data-kn-chrome]") ?? []
    gsap.fromTo(
      chrome,
      { opacity: 0, y: 12, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        delay: 0.18,
        stagger: 0.04,
      }
    )
  }, [])

  const close = useCallback(() => {
    if (closing.current || index === null) return
    const media = mediaRef.current
    const content = contentRef.current
    if (!media || !content || !motionAllowed()) return setIndex(null)
    // Kadr BIEŻĄCEJ realizacji na stronie (taśma ma kilka kopii — bierzemy najlepiej widoczną).
    const slug = works[index]?.slug
    const target = [
      ...document.querySelectorAll<HTMLElement>(`[data-kn-slug="${slug}"] [data-kn-frame]`),
    ]
      .map((frame) => {
        const box = frame.getBoundingClientRect()
        const seen =
          Math.max(0, Math.min(box.right, window.innerWidth) - Math.max(box.left, 0)) *
          Math.max(0, Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0))
        return { frame, box, seen }
      })
      .filter((candidate) => candidate.seen > candidate.box.width * candidate.box.height * 0.5)
      .sort((a, b) => b.seen - a.seen)[0]
    returnTo.current = target?.frame.closest<HTMLElement>("button, a") ?? returnTo.current
    const { gsap } = kinetic()
    closing.current = true
    const done = () => {
      closing.current = false
      setIndex(null)
    }
    // Najpierw znikają tytuł i przyciski — dopiero potem prześwituje strona (bez nakładania się tytułów).
    gsap.to(content.querySelectorAll("[data-kn-chrome]"), { opacity: 0, duration: 0.14 })
    if (target) {
      const to = media.getBoundingClientRect()
      const { box } = target
      gsap.to(media, {
        x: box.left - to.left,
        y: box.top - to.top,
        scaleX: box.width / to.width,
        scaleY: box.height / to.height,
        borderRadius: 6,
        ...BACK,
        onComplete: done,
      })
      gsap.to(content, { backgroundColor: "rgba(0,0,0,0)", ...BACK, delay: 0.1 })
    } else {
      // Kadru nie ma na ekranie: przenikanie zamiast lotu donikąd.
      gsap.to(content, { opacity: 0, duration: 0.24, delay: 0.1, onComplete: done })
    }
  }, [index, works])

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      setIndex((index + delta + works.length) % works.length)
      setSwap((value) => value + 1)
    },
    [index, works.length]
  )

  const api = useMemo(() => ({ open }), [open])
  const work = index === null ? null : works[index]

  return (
    <ProjectionContext.Provider value={api}>
      {children}
      <Dialog.Root open={index !== null} onOpenChange={(next) => !next && close()}>
        <Dialog.Portal container={portalRoot()}>
          <Dialog.Content
            ref={contentRef}
            // Fokus wraca do kadru, z którego przyleciała projekcja (bez przewijania strony).
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              returnTo.current?.focus({ preventScroll: true })
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") step(1)
              if (event.key === "ArrowLeft") step(-1)
            }}
            className="kn-projection fixed inset-0 z-[80] flex flex-col bg-black text-white outline-none"
          >
            {work && (
              <>
                <div
                  data-kn-chrome=""
                  className="kn-wrap flex h-16 shrink-0 items-center justify-between"
                >
                  <p className="text-fm-small text-white/65 tabular-nums">
                    {index! + 1} {labels.of} {works.length}
                  </p>
                  <Dialog.Close className="inline-flex h-11 fm-press items-center rounded-full bg-white/12 px-4.5 text-[0.9375rem] font-medium text-white fm-focus hover:bg-white/18">
                    {labels.close}
                  </Dialog.Close>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center px-(--kn-gutter)">
                  <div
                    ref={mediaCallback}
                    className="kn-projection-media relative max-h-full overflow-hidden rounded-fm-xl bg-white/5"
                    style={{ "--kn-ratio": work.width / work.height } as CSSProperties}
                  >
                    <ProjectionMedia key={work.slug} work={work} animate={swap > 0} />
                  </div>
                </div>
                <div className="kn-wrap grid shrink-0 gap-4 pt-6 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:grid-cols-[1fr_auto] sm:items-end sm:pb-8">
                  <div
                    key={work.slug}
                    data-kn-chrome=""
                    className={swap > 0 ? "kn-swap" : undefined}
                  >
                    <Dialog.Title className="text-[clamp(2rem,1.2rem+3.4vw,4.25rem)] leading-[0.95] font-semibold tracking-[-0.055em] text-balance">
                      {work.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-3 max-w-[56ch] text-fm-small text-pretty text-white/70">
                      <span className="text-white">{work.category}.</span> {work.note}
                    </Dialog.Description>
                  </div>
                  <div data-kn-chrome="" className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={labels.prev}
                      className="grid size-12 fm-press place-items-center rounded-full bg-white/12 text-white fm-focus hover:bg-white/18"
                    >
                      <ArrowLeft aria-hidden="true" className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={labels.next}
                      className="grid size-12 fm-press place-items-center rounded-full bg-white/12 text-white fm-focus hover:bg-white/18"
                    >
                      <ArrowRight aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ProjectionContext.Provider>
  )
}

/** Kadr projekcji: plakat od razu, wideo gra od otwarcia (wyciszone, w pętli). */
function ProjectionMedia({ work, animate }: { work: ProjectionWork; animate: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !motionAllowed()) return
    video.play().catch(() => {})
  }, [])

  return (
    <div className={animate ? "kn-swap absolute inset-0" : "absolute inset-0"}>
      {/* eslint-disable-next-line @next/next/no-img-element -- plakat w docelowym rozmiarze */}
      <img src={work.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {work.video && (
        <video
          ref={videoRef}
          src={work.video}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setLive(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: live ? 1 : 0 }}
        />
      )}
    </div>
  )
}
