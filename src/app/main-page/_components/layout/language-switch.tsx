import Link from "next/link"
import { cn } from "@/lib/utils"

interface LanguageLink {
  label: string
  href: string
  current: boolean
}

const SEGMENT =
  "grid h-7 min-w-9 place-items-center rounded-full px-2.5 text-xs font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50"

/**
 * PL / EN jako przełącznik segmentowy w stylu shadcn (Tabs): obła ścieżka tej
 * samej wysokości co wyszukiwarka i przycisk motywu, bieżący język na jasnym
 * segmencie. Bieżący język nie jest linkiem (`aria-current`).
 */
export function LanguageSwitch({
  label,
  links,
}: {
  label: string
  links: readonly LanguageLink[]
}) {
  return (
    <nav aria-label={label} className="flex h-9 items-center rounded-full bg-secondary p-1">
      {links.map((link) =>
        link.current ? (
          <span
            key={link.label}
            aria-current="page"
            className={cn(SEGMENT, "bg-background text-foreground shadow-xs")}
          >
            {link.label}
          </span>
        ) : (
          <Link
            key={link.label}
            href={link.href}
            hrefLang={link.label.toLowerCase()}
            className={cn(SEGMENT, "text-muted-foreground hover:text-foreground")}
          >
            {link.label}
          </Link>
        )
      )}
    </nav>
  )
}
