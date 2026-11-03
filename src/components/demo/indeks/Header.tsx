import { ThemeSwitch } from "@/components/demo/forma/ThemeSwitch"
import { CommandPalette, type PaletteLabels } from "./CommandPalette"
import { SECTION } from "./anchors"
import type { PaletteGroup } from "./types"

/**
 * Imię i rola jako jedna dwutonowa linia (na telefonie dwie). Nagłówek jest
 * lepki; po przewinięciu wokół niego wyrasta kapsuła z rozmyciem tła
 * (CSS `animation-timeline: scroll()`, zero JS).
 */
export function Header({
  name,
  role,
  themeLabel,
  palette,
  paletteLabels,
  email,
}: {
  name: string
  role: string
  themeLabel: string
  palette: readonly PaletteGroup[]
  paletteLabels: PaletteLabels
  email: string
}) {
  return (
    <header className="sticky top-0 z-40">
      <div className="ix-col relative flex h-(--ix-header) items-center justify-between gap-4">
        <span aria-hidden="true" className="ix-capsule" />
        <a
          href={`#${SECTION.start}`}
          className="relative flex min-w-0 flex-col rounded-fm-sm text-[0.9375rem] leading-snug fm-focus after:absolute after:inset-x-0 after:-inset-y-2 after:content-[''] sm:flex-row sm:gap-2"
        >
          <span className="font-medium tracking-[-0.01em] text-fm-ink">{name}</span>
          <span className="truncate text-fm-ink-3">{role}</span>
        </a>
        <div className="relative -me-1.5 flex items-center gap-1 sm:me-0 sm:gap-2">
          <CommandPalette groups={palette} email={email} labels={paletteLabels} />
          <ThemeSwitch
            label={themeLabel}
            className="relative size-11 after:absolute after:-inset-1 after:content-[''] sm:size-9"
          />
        </div>
      </div>
    </header>
  )
}
