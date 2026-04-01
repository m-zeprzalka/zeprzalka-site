import Link from "next/link"
import { Logo } from "@/components/layout/Logo"
import { ModeToggle } from "@/components/Toggle"
import { MobileNav } from "@/components/layout/MobileNav"

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/cv", label: "CV" },
  { href: "/kontakt", label: "Kontakt" },
]

export function Header() {
  return (
    <header className="sticky top-1 z-50 w-full border-b bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 mr-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
