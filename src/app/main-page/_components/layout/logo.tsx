import Link from "next/link"
import { GlyphText } from "@/app/main-page/_components/motion/glyph-text"
import { LogoMark } from "./logo-mark"

/**
 * Znak serwisu: zmienny sygnet + domena. Najechanie puszcza szum sygnetu i falę
 * znaków przez domenę, litera po literze. Rysunek zaczyna się na linii kolumny;
 * większe pole trafienia daje pseudo-element.
 */
export function Logo({ domain, href }: { domain: string; href: string }) {
  return (
    <Link
      href={href}
      className="relative flex items-center gap-1.5 rounded-full text-lg font-medium tracking-tight whitespace-nowrap outline-none after:absolute after:-inset-x-2 after:-inset-y-3 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <LogoMark />
      <GlyphText text={domain} mode="wave" />
    </Link>
  )
}
