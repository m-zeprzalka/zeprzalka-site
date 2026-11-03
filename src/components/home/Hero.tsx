import Link from "next/link"
import { MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/StatusBadge"
import { HeroVideo } from "@/components/home/HeroVideo"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"
import { getHome } from "@/i18n/content/home"

export function Hero({ locale }: { locale: Locale }) {
  const copy = getHome(locale).hero

  return (
    <section className="flex flex-col gap-6 lg:gap-8 xl:gap-10 p-4 py-6 md:py-8 lg:py-12 xl:py-16 min-h-[calc(100vh-4rem)] container mx-auto">
      <StatusBadge label={copy.status} />
      <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-medium max-w-5xl transition-all duration-300">
        {copy.title}
      </h1>
      <p className="sm:text-xl md:text-2xl text-muted-foreground max-w-3xl transition-all duration-300 font-normal">
        {copy.subtitleRole}
        <span className="text-foreground font-medium">{copy.subtitleHighlight}</span>
        {copy.subtitleRest}
      </p>
      <Button asChild size="lg" className="p-6 w-fit">
        <Link href={ROUTES.contact[locale]}>
          <MousePointerClick />
          {copy.cta}
        </Link>
      </Button>
      <HeroVideo fallback={getCommon(locale).ui.videoFallback} />
    </section>
  )
}
