"use client"

import type { CSSProperties } from "react"
import { CommandPalette, type PaletteLabels } from "./CommandPalette"
import { useThemeTransition } from "./glyph"
import { Logo } from "./Logo"
import { ThemeButton } from "./ThemeButton"
import { useTheme } from "next-themes"
import type { PaletteGroup } from "./types"

/**
 * Nagłówek w kontenerze siatki: znak przy linii kolumny 1, akcje przy
 * krawędzi kolumny 12. Lepki; po zjechaniu ze startu dostaje płótno i włos
 * (oś czasu przewijania — bez JS i bez rozmycia tła). Wchodzi pierwszy
 * w „harmonijce” startu.
 */
export function Header({
  surname,
  domain,
  homeLabel,
  themeLabel,
  palette,
  paletteLabels,
  email,
}: {
  surname: string
  domain: string
  homeLabel: string
  themeLabel: string
  palette: readonly PaletteGroup[]
  paletteLabels: PaletteLabels
  email: string
}) {
  const transition = useThemeTransition()
  const { resolvedTheme } = useTheme()
  return (
    <header className="i2-header fixed inset-x-0 top-0 z-40">
      <div className="i2-grid h-(--i2-header) items-center">
        <div className="col-span-full flex items-center justify-between gap-4">
          <div className="i2-nav-in" style={{ "--d": "0ms" } as CSSProperties}>
            <Logo surname={surname} domain={domain} label={homeLabel} />
          </div>
          <div
            className="i2-nav-in -me-2 flex items-center gap-1 sm:me-0 sm:gap-2"
            style={{ "--d": "60ms" } as CSSProperties}
          >
            <CommandPalette
              groups={palette}
              email={email}
              labels={paletteLabels}
              onToggleTheme={() => transition(resolvedTheme === "light" ? "dark" : "light")}
            />
            <ThemeButton label={themeLabel} className="sm:-me-2.5" />
          </div>
        </div>
      </div>
    </header>
  )
}
