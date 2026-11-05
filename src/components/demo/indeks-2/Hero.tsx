import { Fragment, type CSSProperties, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/demo/forma/Button"
import { LiveDot } from "@/components/demo/forma/Chip"
import { CopyButton } from "@/components/demo/forma/CopyButton"
import { cn } from "@/components/demo/forma/cn"
import { SECTION } from "./anchors"
import { Chip } from "./Chip"
import type { Indeks2Content } from "./content"
import type { Segment } from "./types"
import { COL } from "./grid"
import { HeroFace } from "./HeroFace"

/** Id twarzy na marginesie — karty z chipów startu zajmują jej miejsce. */
export const FACE_ID = "i2-face"

/**
 * Start: tytuł i pierwsze zdanie biogramu jako jeden akapit w dwóch tonach
 * (tytuł atramentem, dalej szarość z trzema chipami). Na marginesie twarz ze
 * znaków; wskazanie chipa zamienia ją w kartę (film kategorii + narzędzia).
 * Wejście „harmonijka” to czysty CSS z serwera: nawigacja → słowa z rozmycia
 * → twarz. Komponent serwerowy — klienckie są tylko chipy i twarz.
 */
export function Hero({
  hero,
  email,
  ui,
  faceLabel,
  chooserLabel,
}: {
  hero: Indeks2Content["hero"]
  email: string
  ui: Indeks2Content["ui"]
  faceLabel: string
  chooserLabel: string
}) {
  let word = 0
  const words = (text: string, className?: string) =>
    // Tylko zwykłe spacje: twarda spacja z `typo` („w produkty”) zostaje w słowie.
    text.split(/( +)/).map((part, index) =>
      /^ +$/.test(part) || !part ? (
        part
      ) : (
        <span
          key={index}
          className={cn("i2-word", className)}
          style={{ "--i": word++ } as CSSProperties}
        >
          {part}
        </span>
      )
    )

  const chip = (segment: Extract<Segment, { card: string }>, index: number) => (
    <Chip
      key={index}
      text={segment.text}
      card={segment.card}
      icon={segment.icon}
      dock={FACE_ID}
      className="i2-fade-in text-fm-ink"
      style={{ "--d": `${160 + word++ * 22}ms` } as CSSProperties}
    />
  )

  // Słowo z twardą spacją przed chipem („i multimedialnych”) jedzie z chipem w jednej
  // linii — koniec zdania nie schodkuje na telefonie.
  const leadNodes = () => {
    const nodes: ReactNode[] = []
    const lead = hero.lead
    for (let index = 0; index < lead.length; index++) {
      const segment = lead[index]
      const next = lead[index + 1]
      if (!segment) continue
      if ("card" in segment) {
        nodes.push(chip(segment, index))
        continue
      }
      const glued = next && "card" in next ? segment.text.match(/^([\s\S]*?)(\S+\u00a0)$/) : null
      if (glued && next && "card" in next) {
        nodes.push(<Fragment key={index}>{words(glued[1] ?? "")}</Fragment>)
        nodes.push(
          <span key={`${index}-glued`} className="whitespace-nowrap">
            {words(glued[2] ?? "")}
            {chip(next, index + 1)}
          </span>
        )
        index++
        continue
      }
      nodes.push(<Fragment key={index}>{words(segment.text)}</Fragment>)
    }
    return nodes
  }

  return (
    <section
      id={SECTION.start}
      aria-labelledby={`${SECTION.start}-title`}
      className="pt-[calc(var(--i2-header)+3.5rem)] sm:pt-[calc(var(--i2-header)+5rem)] lg:pt-[calc(var(--i2-header)+4.5rem)]"
    >
      <div className="i2-grid gap-y-14">
        <div className={cn(COL.text, "lg:row-start-1 lg:self-center lg:pb-14")}>
          <p
            className="i2-in flex items-center gap-2.5 text-fm-small text-fm-ink-2"
            style={{ "--d": "80ms" } as CSSProperties}
          >
            <LiveDot />
            {hero.status}
          </p>
          <h1
            id={`${SECTION.start}-title`}
            tabIndex={-1}
            data-anchor-focus=""
            className="mt-6 text-[1.75rem] leading-[1.2] font-medium tracking-[-0.03em] text-balance outline-none sm:text-[2rem] xl:text-[1.875rem] 2xl:text-[2.125rem] min-[105rem]:text-[2.375rem]"
          >
            <span className="text-fm-ink">{words(hero.title)}</span>{" "}
            <span className="text-fm-ink-3">{leadNodes()}</span>
          </h1>
          <div
            className="i2-in mt-10 flex flex-wrap items-center gap-3"
            style={{ "--d": "380ms" } as CSSProperties}
          >
            <a
              href={`#${SECTION.contact}`}
              className={cn(buttonVariants({ size: "lg" }), "group w-full sm:w-auto")}
            >
              {hero.cta}
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-200 ease-fm-snap group-hover:translate-x-0.5"
              />
            </a>
            <CopyButton
              value={email}
              label={email}
              copiedLabel={ui.copied}
              className="h-12 w-full justify-center sm:w-auto"
            />
          </div>
        </div>

        <div className="col-span-full sm:col-[4/9] lg:col-[8/13] lg:row-start-1 xl:col-[9/13]">
          <HeroFace id={FACE_ID} label={faceLabel} chooserLabel={chooserLabel} />
        </div>
      </div>
    </section>
  )
}
