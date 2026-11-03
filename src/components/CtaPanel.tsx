import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CtaAction {
  href: string
  label: string
  variant?: "default" | "outline" | "ghost"
}

const SIZES = {
  /** Zamknięcie strony (oferta, portfolio). */
  lg: { box: "rounded-xl p-6 md:p-10", heading: "text-2xl", body: "mt-3", button: "lg" },
  /** Zamknięcie wpisu na blogu. */
  md: { box: "rounded-lg p-6 sm:p-8", heading: "text-xl", body: "mt-2", button: "default" },
} as const

/**
 * Panel wezwania do działania: nagłówek, akapit i przyciski. Pierwszy
 * przycisk to akcja główna (ze strzałką), kolejne — drugorzędne.
 */
export function CtaPanel({
  id,
  heading,
  body,
  actions,
  size = "lg",
  as: Tag = "section",
}: {
  /** Id nagłówka — panel jest landmarkiem nazwanym przez `aria-labelledby`. */
  id?: string
  heading: string
  body: string
  actions: readonly CtaAction[]
  size?: keyof typeof SIZES
  as?: "section" | "aside"
}) {
  const s = SIZES[size]

  return (
    <Tag aria-labelledby={id} className={cn("border bg-muted/40", s.box)}>
      <h2 id={id} className={cn("font-semibold tracking-tight", s.heading)}>
        {heading}
      </h2>
      <p className={cn("max-w-2xl leading-relaxed text-muted-foreground", s.body)}>{body}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {actions.map(({ href, label, variant = "default" }, index) => (
          <Button
            key={href}
            asChild
            variant={variant}
            size={s.button}
            className={size === "lg" ? "w-fit" : undefined}
          >
            <Link href={href}>
              {label}
              {index === 0 && <ArrowRight />}
            </Link>
          </Button>
        ))}
      </div>
    </Tag>
  )
}
