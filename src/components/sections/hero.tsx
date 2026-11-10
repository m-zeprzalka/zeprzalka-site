import { ClapperboardIcon, HistoryIcon, MonitorSmartphoneIcon } from "lucide-react"
import { LinkArrow } from "@/components/page/link-arrow"
import { CopyEmail } from "@/components/layout/copy-email"
import { Segments } from "@/components/peek/segments"
import { Button } from "@/components/ui/button"
import { SECTION } from "@/lib/anchors"
import { noOrphans } from "@/lib/text"
import type { Segment } from "@/lib/types"
import { HeroVideo } from "./hero-video"

/** Ikony fraz w pierwszym zdaniu — klucze jak w kartach podglądu. */
export const CHIP_ICONS = {
  experience: <HistoryIcon />,
  web: <MonitorSmartphoneIcon />,
  motion: <ClapperboardIcon />,
}

/**
 * Start: status, dwutonowe zdanie (tytuł + pierwsze zdanie biogramu z trzema
 * frazami-podglądami), dwa działania i wideo. Wejście „harmonijką” po nagłówku
 * i menu: status, słowa tytułu i zdania wjeżdżają z rozmycia jedno po drugim,
 * potem przyciski, a na końcu kadr wideo — tylko CSS, pory w `--enter-*` (globals.css).
 */
export function Hero({
  status,
  title,
  lead,
  cta,
  email,
  labels,
}: {
  status: string
  title: string
  lead: readonly Segment[]
  cta: string
  email: string
  labels: { copyEmail: string; copied: string; playVideo: string; pauseVideo: string }
}) {
  return (
    <section
      id={SECTION.start}
      aria-labelledby="start-title"
      data-peek-column=""
      className="column pt-14 md:pt-24"
    >
      <p className="flex items-center gap-2.5 text-sm text-muted-foreground motion-safe:animate-enter motion-safe:[animation-delay:var(--enter-status)]">
        <span aria-hidden="true" className="size-2 rounded-full bg-success" />
        {status}
      </p>
      <h1 id="start-title" className="mt-6 text-display">
        <span className="enter-stagger [--enter-delay:var(--enter-title)] [--enter-step:40ms]">
          <Segments segments={[{ text: noOrphans(title) }]} split="block" />
        </span>{" "}
        <span className="enter-stagger text-muted-foreground [--enter-delay:var(--enter-lead)] [--enter-step:16ms]">
          <Segments segments={lead} icons={CHIP_ICONS} split="block" />
        </span>
      </h1>
      {/* Pełna szerokość dostają same przyciski, nie każde dziecko rzędu: `*:w-full` rozciągał
          też komunikat czytnika `CopyEmail` (sr-only, `absolute`) i poszerzał stronę na telefonie. */}
      <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-enter motion-safe:[animation-delay:var(--enter-actions)]">
        <Button asChild size="lg" className="group/link max-sm:w-full">
          <a href={`#${SECTION.contact}`}>
            {cta}
            <LinkArrow />
          </a>
        </Button>
        <CopyEmail
          email={email}
          label={labels.copyEmail}
          copiedLabel={labels.copied}
          className="max-sm:w-full"
        />
      </div>
      <HeroVideo labels={{ play: labels.playVideo, pause: labels.pauseVideo }} />
    </section>
  )
}
