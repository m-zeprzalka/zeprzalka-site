"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/Toggle"
import { Logo } from "@/components/layout/Logo"
import { cn } from "@/lib/utils"
import { ROUTES, type Locale } from "@/i18n/config"
import { getCommon } from "@/i18n/content/common"

export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const copy = getCommon(locale)

  const home = ROUTES.home[locale]
  const navLinks = [
    { href: home, label: copy.nav.home },
    { href: ROUTES.services[locale], label: copy.nav.services },
    { href: ROUTES.blog[locale], label: copy.nav.blog },
    { href: ROUTES.about[locale], label: copy.nav.about },
    { href: ROUTES.contact[locale], label: copy.nav.contact },
  ]

  return (
    <>
      {/* Hamburger — otwiera panel */}
      <button
        onClick={() => setOpen(true)}
        aria-label={copy.nav.openMenu}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/*
        Sheet renderuje SheetContent w Radix Portal (koniec <body>).
        bg-background działa, bo element jest poza stacking context headera.
        Radix obsługuje automatycznie: overlay, scroll-lock, Escape.
      */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="top"
          showCloseButton={false}
          className="flex flex-col p-0 gap-0 w-full h-screen bg-background"
        >
          {/* Wymagany przez Radix dla screen readerów */}
          <SheetTitle className="sr-only">{copy.nav.menuTitle}</SheetTitle>

          <div className="flex items-center justify-between h-16 px-4 border-b shrink-0 container mx-auto">
            <Logo locale={locale} onClick={() => setOpen(false)} />
            <div className="flex items-center justify-end gap-2">
              <ModeToggle label={copy.ui.themeToggle} />
              <button
                onClick={() => setOpen(false)}
                aria-label={copy.nav.closeMenu}
                className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Linki */}
          <nav aria-label={copy.nav.mobileAria} className="flex flex-col px-6 py-2">
            {navLinks.map(({ href, label }) => {
              // Strona główna jest aktywna tylko przy dokładnym trafieniu —
              // inaczej „/en" świeciłoby się na każdej angielskiej podstronie.
              const isActive =
                href === home ? pathname === home : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "py-4 text-base border-b border-border/40 last:border-0 transition-colors",
                    isActive
                      ? "text-foreground font-medium"
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
    </>
  )
}
