"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/layout/Logo"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/config"
import type { NavLink } from "@/i18n/navigation"
import type { MobileNavLabels } from "@/components/layout/MobileNav"

/**
 * Panel menu mobilnego (Radix Dialog). Ładowany dopiero przy pierwszym
 * otwarciu — Dialog nie obciąża więc pierwszego wczytania żadnej strony.
 * Radix daje overlay, blokadę przewijania, Escape i powrót fokusu na
 * przycisk, który otworzył menu.
 */
export default function MobileNavPanel({
  locale,
  links,
  labels,
  open,
  onOpenChange,
}: {
  locale: Locale
  links: NavLink[]
  labels: MobileNavLabels
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pathname = usePathname()
  const home = links[0]?.href
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        showCloseButton={false}
        className="flex flex-col p-0 gap-0 w-full h-screen bg-background"
      >
        {/* Wymagany przez Radix dla czytników ekranu */}
        <SheetTitle className="sr-only">{labels.title}</SheetTitle>

        <div className="flex items-center justify-between h-16 px-4 border-b shrink-0 container mx-auto">
          <Logo locale={locale} onClick={close} />
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle label={labels.theme} />
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav aria-label={labels.nav} className="flex flex-col px-6 py-2">
          {links.map(({ href, label }) => {
            // Strona główna jest aktywna tylko przy dokładnym trafieniu —
            // inaczej „/en” świeciłoby się na każdej angielskiej podstronie.
            const isActive = href === home ? pathname === home : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "py-4 text-base border-b border-border/40 last:border-0 transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
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
