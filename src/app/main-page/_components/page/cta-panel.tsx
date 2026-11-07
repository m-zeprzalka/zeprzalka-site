import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { SectionHeading } from "@/app/main-page/_components/sections/section-heading"
import { Button } from "@/app/main-page/_components/ui/button"
import type { LinkData } from "@/app/main-page/_lib/types"
import { cn } from "@/lib/utils"

const VARIANTS = ["default", "outline", "ghost"] as const

/**
 * Zamknięcie podstrony albo wpisu: karta z nagłówkiem, akapitem i działaniami.
 * Pierwsze działanie jest główne (ze strzałką), kolejne coraz cichsze.
 */
export function CtaPanel({
  id,
  heading,
  body,
  actions,
  as: Tag = "section",
  className,
}: {
  id: string
  heading: string
  body: string
  actions: readonly LinkData[]
  as?: "section" | "aside"
  className?: string
}) {
  return (
    <Tag aria-labelledby={`${id}-title`} className={cn("column mt-24 md:mt-32", className)}>
      <div className="rounded-2xl border bg-card p-6 text-card-foreground sm:p-8">
        <SectionHeading id={`${id}-title`} title={heading} />
        <p className="mt-3 max-w-[60ch] text-pretty text-muted-foreground">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action, index) => (
            <Button key={action.href} asChild size="lg" variant={VARIANTS[Math.min(index, 2)]}>
              <Link href={action.href}>
                {action.label}
                {index === 0 && <ArrowRightIcon />}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </Tag>
  )
}
