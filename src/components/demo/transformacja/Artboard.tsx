import { ArrowDown, ArrowRight } from "lucide-react"
import { LiveDot } from "@/components/demo/forma/Chip"
import { cn } from "@/components/demo/forma/cn"
import type { TransformacjaContent } from "./content"
import { HeroVideo } from "./HeroVideo"
import { sceneRange } from "./range"

/** Słowa nagłówka składają się po kolei: 27% sceny + 1,75% na słowo. */
const WORD_START = 27
const WORD_STEP = 1.75
const WORD_LENGTH = 4.5

/**
 * Rama sceny: ten sam nagłówek, który obok stoi jako prawdziwe hero, tutaj
 * powstaje — szkic → projekt → kod → produkt. To warstwa wizualna: kopia
 * treści jest aria-hidden, przyciski są tylko obrazem (bez linków), a jedynym
 * elementem do obsługi jest pauza wideo. Każdy element ma szkic (`tf-wire`)
 * i gotową postać (`tf-real`); bez trybu przewijanego widać gotową.
 * Układ zależy od naturalnej szerokości ramy (container queries), nie od okna.
 */
export function Artboard({
  hero,
  worksLabel,
  labels,
}: {
  hero: TransformacjaContent["hero"]
  worksLabel: string
  labels: { pause: string; play: string; fallback: string; video: string; owner: string }
}) {
  const words = hero.title.split(" ")

  return (
    <div className="tf-board" id="tf-board">
      <div className="tf-hero">
        {/* Status */}
        <div aria-hidden="true" className="tf-el tf-el--chip self-start">
          <Highlight show={53.3} hide={54.8} />
          <span className="tf-wire tf-anim">
            <span className="flex h-full items-center gap-2 rounded-full px-3 outline-1 -outline-offset-1 outline-fm-ink-3/70 outline-dashed">
              <span className="size-2 rounded-full bg-fm-ink/10" />
              <span className="h-2 flex-1 rounded-full bg-fm-ink/10" />
            </span>
          </span>
          <span className="tf-real tf-anim inline-flex h-7 items-center gap-2 rounded-full bg-fm-surface px-3 text-fm-micro font-medium text-fm-ink-2 shadow-fm-ring">
            <span className="tf-dot tf-anim inline-flex">
              <LiveDot />
            </span>
            {hero.status}
          </span>
        </div>

        {/* Nagłówek: tekst roboczy w Geist Mono → gotowy krój składa się słowo po słowie */}
        <div aria-hidden="true" className="tf-el tf-el--title">
          <Highlight show={53.9} hide={56.2} />
          <Selection className="tf-sel--1" label="Nagłówek" owner={labels.owner} />
          <p className="tf-board__title text-fm-ink">
            <span className="tf-draft tf-anim font-mono font-normal text-fm-ink-2">
              {hero.title}
              <span className="tf-caret ml-1 inline-block h-[1.1em] w-px translate-y-[0.18em] bg-fm-ink" />
            </span>
            <span className="tf-final">
              {words.map((word, index) => (
                <span key={index}>
                  <span
                    className="tf-word tf-anim"
                    style={sceneRange(
                      WORD_START + index * WORD_STEP,
                      WORD_START + index * WORD_STEP + WORD_LENGTH
                    )}
                  >
                    {word}
                  </span>
                  {index < words.length - 1 && " "}
                </span>
              ))}
            </span>
          </p>
        </div>

        {/* Podtytuł: paski w tych samych liniach co tekst */}
        <div aria-hidden="true" className="tf-el tf-el--lead">
          <Redline value="24" />
          <Highlight show={55.7} hide={57.6} />
          <Selection className="tf-sel--2" label="Podtytuł" owner={labels.owner} />
          <p className="tf-wire tf-anim tf-board__lead tf-bars">
            <span>
              {hero.subtitle.role}
              {hero.subtitle.highlight}
              {hero.subtitle.rest}
            </span>
          </p>
          <p className="tf-real tf-anim tf-board__lead text-fm-ink-2">
            {hero.subtitle.role}
            <span className="font-medium text-fm-ink">{hero.subtitle.highlight}</span>
            {hero.subtitle.rest}
          </p>
        </div>

        {/* Akcje — obraz przycisków (prawdziwe są w hero obok) */}
        <div aria-hidden="true" className="tf-el tf-el--actions">
          <Redline value="32" late />
          <Highlight show={57.5} hide={59} />
          <div className="tf-wire tf-anim">
            <div className="tf-board__actions">
              <span className="flex h-12 w-full items-center rounded-full px-6 outline-1 -outline-offset-1 outline-fm-ink-3/70 outline-dashed sm:w-[19.5rem]">
                <span className="h-2 w-full rounded-full bg-fm-ink/10" />
              </span>
              <span className="tf-board__second flex h-12 w-44 items-center rounded-full px-6 outline-1 -outline-offset-1 outline-fm-ink-3/70 outline-dashed">
                <span className="h-2 w-full rounded-full bg-fm-ink/10" />
              </span>
            </div>
          </div>
          <div className="tf-real tf-anim tf-board__actions">
            <span className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-fm-ink px-6 text-[0.9375rem] font-medium whitespace-nowrap text-fm-inverse">
              {hero.cta}
              <ArrowRight className="size-4" />
            </span>
            <span className="tf-board__second inline-flex h-12 items-center justify-center gap-2 rounded-full bg-fm-surface px-6 text-[0.9375rem] font-medium whitespace-nowrap text-fm-ink shadow-fm-ring">
              {worksLabel}
              <ArrowDown className="size-4" />
            </span>
          </div>
        </div>

        {/* Wideo: pole z przekątnymi → plakat → reel */}
        <div className="tf-media">
          <Selection className="tf-sel--3" label={labels.video} owner={labels.owner} />
          <div aria-hidden="true" className="tf-wire tf-anim">
            <div className="absolute inset-0 overflow-hidden rounded-fm-lg outline-1 -outline-offset-1 outline-fm-ink-3/70 outline-dashed">
              <svg
                className="absolute inset-0 size-full text-fm-ink-3/45"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  stroke="currentColor"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke="currentColor"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-fm-surface px-4 py-1.5 font-mono text-[0.9375rem] text-fm-ink-3 shadow-fm-ring">
                {labels.video} 16:9
              </span>
            </div>
          </div>
          <div className="tf-real tf-anim tf-media__frame">
            <HeroVideo
              video={hero.video}
              labels={{ pause: labels.pause, play: labels.play, fallback: labels.fallback }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Zaznaczenie jak w narzędziu projektowym: ramka z uchwytami, nazwa warstwy
 * i kursor z imieniem. Uchwyty, etykiety i kursor mają skalę odwrotną do
 * ramy, więc na ekranie zawsze mają swój rozmiar.
 */
function Selection({
  className,
  label,
  owner,
}: {
  className: string
  label: string
  owner: string
}) {
  const handle =
    "absolute size-[9px] border border-[var(--tf-tool)] bg-fm-surface [scale:calc(1/var(--tf-s,0.62))]"
  return (
    <span aria-hidden="true" className={cn("tf-sel tf-anim", className)}>
      <span className={cn(handle, "-top-[5px] -left-[5px] origin-center")} />
      <span className={cn(handle, "-top-[5px] -right-[5px] origin-center")} />
      <span className={cn(handle, "-bottom-[5px] -left-[5px] origin-center")} />
      <span className={cn(handle, "-right-[5px] -bottom-[5px] origin-center")} />
      <span className="absolute bottom-full left-[-1px] mb-1 origin-bottom-left [scale:calc(1/var(--tf-s,0.62))]">
        <span className="block rounded-[3px] bg-[var(--tf-tool)] px-1.5 py-0.5 font-sans text-[11px] leading-4 font-medium tracking-normal whitespace-nowrap text-[var(--tf-tool-ink)]">
          {label}
        </span>
      </span>
      <span className="absolute top-full left-full origin-top-left [scale:calc(1/var(--tf-s,0.62))]">
        <span className="tf-sel__cursor tf-anim -mt-1 -ml-1 flex items-start">
          <svg width="18" height="20" viewBox="0 0 18 20" className="drop-shadow-sm">
            <path
              d="M1.5 1.5 L1.5 16.2 L5.6 12.6 L8.3 18.4 L11 17.2 L8.4 11.5 L14 11.3 Z"
              fill="var(--fm-ink)"
              stroke="var(--fm-surface)"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-4 -ml-1 rounded-full bg-fm-ink px-2 py-0.5 font-sans text-[11px] leading-4 font-medium tracking-normal whitespace-nowrap text-fm-inverse">
            {owner}
          </span>
        </span>
      </span>
    </span>
  )
}

/**
 * Podświetlenie elementu jak w narzędziach deweloperskich: zapala się, gdy
 * w edytorze pisze się kod tego elementu (etap Kod) — widać, który wiersz
 * buduje którą część hero. Okna liczone z tych samych stałych co wiersze kodu.
 */
function Highlight({ show, hide }: { show: number; hide: number }) {
  return (
    <span
      aria-hidden="true"
      className="tf-hl tf-anim"
      style={{
        animationRange: `contain ${show}% contain ${show + 0.5}%, contain ${hide}% contain ${hide + 0.5}%`,
      }}
    />
  )
}

/** Linia wymiaru w odstępie nad elementem — wartość to prawdziwy odstęp w px. */
function Redline({ value, late = false }: { value: string; late?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "tf-redline tf-anim absolute bottom-full left-[38%] w-px",
        late && "tf-redline--late"
      )}
      style={{ height: value === "24" ? "1.5rem" : "2rem" }}
    >
      <span className="absolute inset-y-0 left-0 w-[calc(1px/var(--tf-s,0.62))] bg-[var(--tf-tool)]" />
      <span className="absolute top-0 -left-1 h-[calc(1px/var(--tf-s,0.62))] w-2.5 bg-[var(--tf-tool)]" />
      <span className="absolute bottom-0 -left-1 h-[calc(1px/var(--tf-s,0.62))] w-2.5 bg-[var(--tf-tool)]" />
      <span className="absolute top-1/2 left-2 origin-left -translate-y-1/2 [scale:calc(1/var(--tf-s,0.62))]">
        <span className="block rounded-[3px] bg-[var(--tf-tool)] px-1 font-mono text-[10px] leading-4 text-[var(--tf-tool-ink)]">
          {value}
        </span>
      </span>
    </span>
  )
}
