import Link from "next/link"
import { SOCIAL_PROFILES } from "@/lib/site"

export function Footer() {
  return (
    <footer className="border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link href="/" className="font-semibold text-lg tracking-tight hover:text-primary transition-colors">
              zeprzalka.com
            </Link>
            <p className="text-sm text-muted-foreground">
              Projektant / Strateg / Full-Stack Developer. <br></br>Tworzę
              rozwiązania, które łączą biznes z technologią.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h2 className="font-semibold" id="footer-nav">Nawigacja</h2>
            <nav aria-labelledby="footer-nav" className="flex flex-col space-y-2">
              <Link
                href="/uslugi"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Usługi
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/o-mnie"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                O mnie
              </Link>
              <Link
                href="/kontakt"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h2 className="font-semibold" id="footer-social">Social</h2>
            <nav aria-labelledby="footer-social" className="flex flex-col space-y-2">
              {SOCIAL_PROFILES.map(({ label, url }) => (
                <Link
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            Michał Zeprzałka - Copyright {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
