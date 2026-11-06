import Link from "next/link"
import { buttonVariants } from "@/app/main-page/_components/ui/button"
import { cn } from "@/lib/utils"

interface LanguageLink {
  label: string
  href: string
  current: boolean
}

/**
 * PL / EN jako dwie pigułki (przycisk shadcn `ghost`). Bieżący język nie
 * jest linkiem (`aria-current`), drugi prowadzi do strony w tamtym języku.
 */
export function LanguageSwitch({
  label,
  links,
}: {
  label: string
  links: readonly LanguageLink[]
}) {
  return (
    <nav aria-label={label} className="flex items-center">
      {links.map((link) =>
        link.current ? (
          <span
            key={link.label}
            aria-current="page"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "bg-accent px-2.5")}
          >
            {link.label}
          </span>
        ) : (
          <Link
            key={link.label}
            href={link.href}
            hrefLang={link.label.toLowerCase()}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "px-2.5 text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      )}
    </nav>
  )
}
