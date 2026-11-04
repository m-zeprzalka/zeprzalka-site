"use client"

import type { RefObject } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/layout/Logo"
import { isActivePath } from "@/components/layout/NavLink"
import { cn } from "@/lib/utils"
import { ROUTES, type Locale } from "@/i18n/config"
import type { NavLink } from "@/i18n/navigation"
import type { MobileNavLabels } from "@/components/layout/MobileNav"

/**
 * Panel menu mobilnego (Radix Dialog). Ładowany dopiero przy pierwszym
 * otwarciu — Dialog nie obciąża więc pierwszego wczytania żadnej strony.
 * Radix daje overlay, blokadę przewijania, Escape i pułapkę fokusu; powrót
 * fokusu na przycisk menu obsługuje `returnFocusTo` (przycisk jest poza Dialogiem).
 */
export default function MobileNavPanel({
  locale,
  links,
  labels,
  themeClassName,
  open,
  onOpenChange,
  returnFocusTo,
}: {
  locale: Locale
  links: NavLink[]
  labels: MobileNavLabels
  themeClassName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocusTo: RefObject<HTMLButtonElement | null>
}) {
  const pathname = usePathname()
  const home = ROUTES.home[locale]
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusTo.current?.focus()
        }}
        className="flex h-dvh w-full flex-col gap-0 bg-background p-0"
      >
        {/* Wymagany przez Radix dla czytników ekranu */}
        <SheetTitle className="sr-only">{labels.title}</SheetTitle>

        <div className="container mx-auto flex h-16 shrink-0 items-center justify-between border-b px-4">
          <Logo locale={locale} onClick={close} />
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle label={labels.theme} className={themeClassName} />
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav aria-label={labels.nav} className="flex flex-col px-6 py-2">
          {links.map(({ href, label }) => {
            const isActive = isActivePath(pathname, href, home)
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "border-b border-border/40 py-4 text-base transition-colors last:border-0",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
