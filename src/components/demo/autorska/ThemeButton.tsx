"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useThemeTransition } from "../shared/glyph"

/**
 * Przełącznik motywu: start w ciemnym (`layout.demo.tsx`), zmiana przez rozpad kafli ze znaków
 * ze wspólnego silnika (miękki front z góry, niezależny od przycisku — nie „koło”). Ikona zależy
 * od klasy `.dark` (CSS), więc HTML z serwera i hydratacja są zgodne.
 */
export function ThemeButton({ label }: { label: string }) {
  const { resolvedTheme } = useTheme()
  const transition = useThemeTransition()

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => transition(resolvedTheme === "dark" ? "light" : "dark")}
      className="-me-2.5 grid size-10 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink"
    >
      <Sun aria-hidden="true" className="hidden size-[1.125rem] dark:block" />
      <Moon aria-hidden="true" className="size-[1.125rem] dark:hidden" />
    </button>
  )
}
