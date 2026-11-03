"use client"

import type { MouseEvent } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Przełącznik motywu z kołowym odsłonięciem od przycisku (View Transitions).
 * Bez wsparcia przeglądarki albo przy „ogranicz ruch” motyw zmienia się od razu.
 * Ikona zależy od klasy `.dark` (CSS), nie od stanu — brak rozjazdu hydratacji.
 */
export function ThemeSwitch({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = resolvedTheme === "dark" ? "light" : "dark"
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle("dark", next === "dark")
      root.style.colorScheme = next
      setTheme(next)
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!document.startViewTransition || reduced) return apply()

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 500,
          easing: "cubic-bezier(0.77, 0, 0.175, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
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
        "fm-focus fm-press text-fm-ink-2 hover:bg-fm-fill hover:text-fm-ink grid size-10 place-items-center rounded-full transition-[background-color,color,scale]",
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
