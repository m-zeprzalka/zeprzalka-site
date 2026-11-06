import { ArrowRightIcon, ClapperboardIcon, HistoryIcon, MonitorSmartphoneIcon } from "lucide-react"
import { CopyEmail } from "@/app/main-page/_components/layout/copy-email"
import { Segments } from "@/app/main-page/_components/peek/segments"
import { Button } from "@/app/main-page/_components/ui/button"
import { SECTION } from "@/app/main-page/_lib/anchors"
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
 * frazami-podglądami), dwa działania i wideo. Wchodzi „harmonijką”: nagłówek,
 * tekst, przyciski, wideo — każde z opóźnieniem, całość poniżej sekundy.
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
      <p className="motion-safe:animate-enter flex items-center gap-2.5 text-sm text-muted-foreground motion-safe:[animation-delay:80ms]">
        <span aria-hidden="true" className="bg-success size-2 rounded-full" />
        {status}
      </p>
      <h1
        id="start-title"
        className="motion-safe:animate-enter mt-6 text-[1.625rem] leading-[1.2] font-medium tracking-tight text-pretty motion-safe:[animation-delay:140ms] sm:text-[2.125rem]"
      >
        {title}{" "}
        <span className="text-muted-foreground">
          <Segments segments={lead} icons={CHIP_ICONS} />
        </span>
      </h1>
      <div className="motion-safe:animate-enter mt-8 flex flex-wrap gap-3 motion-safe:[animation-delay:240ms]">
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
