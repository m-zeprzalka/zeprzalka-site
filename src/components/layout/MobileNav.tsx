"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/Toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/blog", label: "Blog" },
  { href: "/cv", label: "CV" },
  { href: "/kontakt", label: "Kontakt" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
          side="right"
          showCloseButton={false}
          className="flex flex-col p-0 gap-0 w-72 sm:w-72 sm:max-w-72"
        >
          {/* Wymagany przez Radix dla screen readerów */}
          <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>

          {/*
            Nagłówek panelu jest strukturalną kopią prawej strony głównego headera:
              Header:       px-4 … [ModeToggle w-9][gap-2][hamburger w-9]
              Panel header: px-4 [ModeToggle w-9][gap-2][X w-9]
            Panel ma right-0 → prawa krawędź = prawa krawędź viewportu.
            X jest dokładnie w tym samym miejscu co hamburger.
          */}
          <div className="flex items-center justify-end gap-2 h-16 px-4 border-b shrink-0">
            <ModeToggle />
            <button
              onClick={() => setOpen(false)}
              aria-label="Zamknij menu"
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
