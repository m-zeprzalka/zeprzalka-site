"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/Toggle"
import { Logo } from "@/components/layout/Logo"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/blog", label: "Blog" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/kontakt", label: "Kontakt" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger — otwiera panel */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Otwórz menu"
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
          <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>

          <div className="flex items-center justify-between h-16 px-4 border-b shrink-0 container mx-auto">
            <Logo onClick={() => setOpen(false)} />
            <div className="flex items-center justify-end gap-2">
              <ModeToggle />
              <button
                onClick={() => setOpen(false)}
                aria-label="Zamknij menu"
                className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Linki */}
          <nav className="flex flex-col px-6 py-2">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href)
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
