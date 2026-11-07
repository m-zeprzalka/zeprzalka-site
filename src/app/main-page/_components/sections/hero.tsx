import { ArrowRightIcon, ClapperboardIcon, HistoryIcon, MonitorSmartphoneIcon } from "lucide-react"
import { CopyEmail } from "@/app/main-page/_components/layout/copy-email"
import { Segments } from "@/app/main-page/_components/peek/segments"
import { Button } from "@/app/main-page/_components/ui/button"
import { SECTION } from "@/app/main-page/_lib/anchors"
import { noOrphans } from "@/app/main-page/_lib/text"
import type { Segment } from "@/app/main-page/_lib/types"
import { HeroVideo } from "./hero-video"

/** Ikony fraz w pierwszym zdaniu — klucze jak w kartach podglądu. */
const CHIP_ICONS = {
  experience: <HistoryIcon />,
  web: <MonitorSmartphoneIcon />,
  motion: <ClapperboardIcon />,
}

/**
 * Start: status, dwutonowe zdanie (tytuł + pierwsze zdanie biogramu z trzema
 * frazami-podglądami), dwa działania i wideo. Wejście „harmonijką” po nagłówku:
 * status, słowa tytułu i zdania wyostrzają się z rozmycia jedno po drugim,
 * potem przyciski i wideo — tylko CSS, czasy w klasach `[--enter-…]`.
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
    <section id={SECTION.start} data-peek-column="" className="column pt-14 md:pt-24">
      <p className="flex items-center gap-2.5 text-sm text-muted-foreground motion-safe:animate-enter motion-safe:[animation-delay:80ms]">
        <span aria-hidden="true" className="size-2 rounded-full bg-success" />
        {status}
      </p>
      <h1 id="start-title" className="mt-6 text-display">
        <span className="enter-stagger [--enter-delay:140ms] [--enter-step:32ms]">
          <Segments segments={[{ text: noOrphans(title) }]} split="block" />
        </span>{" "}
        <span className="enter-stagger text-muted-foreground [--enter-delay:320ms] [--enter-step:14ms]">
          <Segments segments={lead} icons={CHIP_ICONS} split="block" />
        </span>
      </h1>
      <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-enter motion-safe:[animation-delay:560ms] max-sm:*:w-full">
        <Button asChild size="lg">
          <a href={`#${SECTION.contact}`}>
            {cta}
            <ArrowRightIcon />
          </a>
        </Button>
        <CopyEmail email={email} label={labels.copyEmail} copiedLabel={labels.copied} />
      </div>
      <HeroVideo labels={{ play: labels.playVideo, pause: labels.pauseVideo }} />
    </section>
  )
}
