"use client"

import Link from "next/link"
import { Logo } from "@/components/layout/Logo"

export function Footer() {
  return (
    <footer className="border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & About */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Projektant / Strateg / Full-Stack Developer. <br></br>Tworzę
              rozwiązania, które łączą biznes z technologią.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Nawigacja</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Social</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="https://github.com/m-zeprzalka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="https://www.facebook.com/michalzeprzalka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Facebook
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            zeprzalka.com - next.js / tailwindcss / radix / shadcn
          </p>
        </div>
      </div>
    </footer>
  )
}
