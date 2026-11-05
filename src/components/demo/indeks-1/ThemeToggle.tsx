"use client"

import type { MouseEvent } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/components/demo/forma/cn"
import { useThemeTransition } from "@/components/demo/shared/glyph"

/**
 * Zmiana motywu kafelkami ze znaków (wspólny silnik): zdjęcie starej strony
 * znika kafel po kaflu falą od przycisku, w odsłoniętych kaflach na chwilę
 * miga znak logo — 620 ms. Bez koła z przycisku. Bez View Transitions albo przy
 * „ogranicz ruch” motyw zmienia się od razu. Ikona zależy od klasy `.dark`
 * (CSS), nie od stanu — brak rozjazdu hydratacji.
 */
export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme } = useTheme()
  const transition = useThemeTransition("tiles")

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    transition(resolvedTheme === "dark" ? "light" : "dark", {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
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
        "relative grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] after:absolute after:-inset-1 after:content-[''] hover:bg-fm-fill hover:text-fm-ink sm:size-8",
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
