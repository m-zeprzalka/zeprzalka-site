import Link from "next/link"
import { LogoGlyph } from "./logo-glyph"

/** Znak serwisu: zmienny sygnet + domena. Kliencki jest tylko sygnet. */
export function Logo({ domain, href }: { domain: string; href: string }) {
  return (
    <Link
      href={href}
      className="-mx-2 flex h-11 items-center gap-2 rounded-full px-2 text-lg font-medium tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <LogoGlyph />
      {domain}
    </Link>
  )
}
