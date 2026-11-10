import Link from "next/link"
import { SectionHeading } from "@/app/main-page/_components/sections/section-heading"
import { Button } from "@/app/main-page/_components/ui/button"
import type { LinkData } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"
import { LinkArrow } from "./link-arrow"

/**
 * Zamknięcie podstrony albo wpisu: karta z nagłówkiem, akapitem i najwyżej dwoma
 * działaniami — główne (ze strzałką linku) i ciche obok. Trzecie rozmywało wybór,
 * więc typ go nie przyjmuje.
 */
export function CtaPanel({
  id,
  heading,
  body,
  actions: [primary, secondary],
  as: Tag = "section",
  className,
}: {
  id: string
  heading: string
  body: string
  actions: readonly [primary: LinkData, secondary?: LinkData]
  as?: "section" | "aside"
  className?: string
}) {
  return (
    <Tag aria-labelledby={`${id}-title`} className={cn("column mt-24 md:mt-32", className)}>
      <div className="rounded-2xl border bg-card p-6 text-card-foreground sm:p-8">
        <SectionHeading id={`${id}-title`} title={heading} />
        <p className="mt-3 max-w-[60ch] text-pretty text-muted-foreground">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="group/link">
            <Link href={primary.href}>
              {primary.label}
              <LinkArrow />
            </Link>
          </Button>
          {secondary && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </Tag>
  )
}
