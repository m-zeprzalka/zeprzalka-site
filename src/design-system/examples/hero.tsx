import { CopyEmail } from "@/components/layout/copy-email"
import { LinkArrow } from "@/components/page/link-arrow"
import { CHIP_ICONS } from "@/components/sections/hero"
import { Segments } from "@/components/peek/segments"
import { Button } from "@/components/ui/button"
import { getHomeContent } from "@/lib/content/home"
import { noOrphans } from "@/lib/text"

export function HeroExample() {
  const { hero, email, ui } = getHomeContent("pl")

  return (
    <div className="grid gap-6">
      <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span aria-hidden="true" className="size-2 rounded-full bg-success" />
        {hero.status}
      </p>
      {/* Na starcie to `h1`; tu akapit — strona ma już swój nagłówek. */}
      <p className="text-display">
        {noOrphans(hero.title)}{" "}
        <span className="text-muted-foreground">
          <Segments segments={hero.lead} icons={CHIP_ICONS} />
        </span>
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="group/link max-sm:w-full">
          <a href="#przyklad-contact">
            {hero.cta}
            <LinkArrow />
          </a>
        </Button>
        <CopyEmail
          email={email}
          label={ui.copyEmail}
          copiedLabel={ui.copied}
          className="max-sm:w-full"
        />
      </div>
    </div>
  )
}
