import type { CSSProperties } from "react"
import { CommandPalette, type PaletteLabels } from "./CommandPalette"
import { Logo } from "./Logo"
import { ThemeToggle } from "./ThemeToggle"
import type { PaletteGroup } from "./types"

/**
 * Nagłówek trzyma siatkę: pasek na całą szerokość okna, a logo i akcje stoją
 * dokładnie na krawędziach kolumny. Tło z rozmyciem i linia pod paskiem
 * dochodzą wraz z przewinięciem (CSS `animation-timeline: scroll()`, zero JS).
 * Wejście — pierwsze w „harmonijce”: zaraz po nim tekst, potem wideo.
 */
export function Header({
  domain,
  themeLabel,
  palette,
  paletteLabels,
  email,
}: {
  domain: string
  themeLabel: string
  palette: readonly PaletteGroup[]
  paletteLabels: PaletteLabels
  email: string
}) {
  return (
    <header data-i1-header="" className="sticky top-0 z-40">
      <span aria-hidden="true" className="i1-bar pointer-events-none absolute inset-0" />
      <div
        style={{ "--d": "40ms" } as CSSProperties}
        className="i1-col i1-enter relative flex h-(--i1-header) items-center justify-between gap-4"
      >
        <Logo domain={domain} />
        {/* Ujemny margines = wcięcie ikony w przycisku: rysunek ikony kończy się na linii kolumny. */}
        <div className="-me-3.5 flex items-center gap-1 sm:-me-2 sm:gap-1.5">
          <CommandPalette groups={palette} email={email} labels={paletteLabels} />
          <ThemeToggle label={themeLabel} />
        </div>
      </div>
    </header>
  )
}
