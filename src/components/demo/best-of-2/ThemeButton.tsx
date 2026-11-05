"use client"

import type { MouseEvent } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "../forma/cn"
import { useThemeTransition } from "../shared/glyph"

/**
 * Przełącznik motywu. Strona startuje w ciemnym (`layout.demo.tsx`), przycisk
 * przełącza na jasny i z powrotem — przejściem kafelkowo-pikselowym ze znaków
 * (wspólny silnik: stara strona znika kafel po kaflu falą od przycisku, w świeżo
 * odsłoniętym kaflu mignie glif z logo; 620 ms). Zamiast „koła z przycisku”,
 * które właściciel uznał za wiejskie. Ikona zależy od klasy `.dark` (CSS), nie
 * od stanu — HTML z serwera i hydratacja są zgodne.
 */
export function ThemeButton({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme } = useTheme()
  const transition = useThemeTransition("tiles")

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    transition(resolvedTheme === "dark" ? "light" : "dark", {
      x: left + width / 2,
      y: top + height / 2,
    })
  }

  const icon =
    "col-start-1 row-start-1 size-4 transition-[rotate,scale,opacity] duration-300 ease-fm-snap"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] hover:bg-fm-fill hover:text-fm-ink",
        className
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(icon, "dark:scale-50 dark:-rotate-90 dark:opacity-0")}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          icon,
          "scale-50 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100"
        )}
      />
    </button>
  )
}
