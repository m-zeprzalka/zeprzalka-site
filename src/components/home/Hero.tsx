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
    <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-6 p-4 py-6 md:py-8 lg:gap-8 lg:py-12 xl:gap-10 xl:py-16">
      <StatusBadge label={copy.status} />
      <h1 className="max-w-5xl text-4xl font-medium transition-all duration-300 sm:text-5xl md:text-6xl xl:text-7xl">
        {copy.title}
      </h1>
      <p className="max-w-3xl font-normal text-muted-foreground transition-all duration-300 sm:text-xl md:text-2xl">
        {copy.subtitleRole}
        <span className="font-medium text-foreground">{copy.subtitleHighlight}</span>
        {copy.subtitleRest}
      </p>
      <Button asChild size="lg" className="w-fit p-6">
        <Link href={ROUTES.contact[locale]}>
          <MousePointerClick />
          {copy.cta}
        </Link>
      </Button>
      <HeroVideo fallback={getCommon(locale).ui.videoFallback} />
    </section>
  )
}
