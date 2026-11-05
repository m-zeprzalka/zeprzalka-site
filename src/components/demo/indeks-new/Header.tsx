import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { SECTION } from "./anchors"
import { CommandPalette, type PaletteLabels } from "./CommandPalette"
import { Sygnet } from "./Sygnet"
import type { PaletteGroup } from "./types"

/**
 * Sygnet (glif + imię) i rola jako jedna dwutonowa linia; rola tylko tam,
 * gdzie mieści się w jednej linii obok wyszukiwarki. Nagłówek jest lepki; po
 * przewinięciu wokół niego wyrasta kapsuła z rozmyciem tła (CSS
 * `animation-timeline: scroll()`, zero JS).
 */
export function Header({
  name,
  role,
  themeLabel,
  palette,
  paletteLabels,
  email,
  sections,
}: {
  name: string
  role: string
  themeLabel: string
  palette: readonly PaletteGroup[]
  paletteLabels: PaletteLabels
  email: string
  sections: readonly string[]
}) {
  return (
    <header data-ixn-header="" className="sticky top-0 z-40">
      <div className="ixn-col relative flex h-(--ixn-header) items-center justify-between gap-4">
        <span aria-hidden="true" className="ixn-capsule" />
        <a
          href={`#${SECTION.start}`}
          className="group relative flex min-w-0 items-baseline gap-2 rounded-fm-sm text-[0.9375rem] leading-snug whitespace-nowrap fm-focus after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
        >
          <span className="flex items-baseline gap-1.5 font-medium tracking-[-0.01em] text-fm-ink">
            <Sygnet
              sections={sections}
              className="text-fm-ink-2 transition-colors duration-150 group-hover:text-fm-ink"
            />
            {name}
          </span>
          <span className="ixn-role truncate text-fm-ink-3">{role}</span>
        </a>
        <div className="relative -me-1.5 flex items-center gap-1 sm:me-0 sm:gap-1.5">
          <CommandPalette groups={palette} email={email} labels={paletteLabels} />
          <ThemeSwitch
            label={themeLabel}
            className="relative size-11 after:absolute after:-inset-1 after:content-[''] sm:size-8"
          />
        </div>
      </div>
    </header>
  )
}
