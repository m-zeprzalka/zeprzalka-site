"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/components/demo/forma/cn"
import { useThemeTransition } from "./glyph"

/**
 * Przełącznik motywu: przejście kafelkowe ze znaków (silnik). Obie ikony są
 * w HTML, a widoczną wybiera klasa `.dark` — serwer i klient renderują to samo.
 */
export function ThemeButton({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme } = useTheme()
  const transition = useThemeTransition()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => transition(resolvedTheme === "light" ? "dark" : "light")}
      className={cn(
        "relative grid size-11 fm-press place-items-center rounded-full text-fm-ink-2 fm-focus transition-[background-color,color,scale] duration-150 hover:bg-fm-fill hover:text-fm-ink sm:size-9",
        className
      )}
    >
      <Moon aria-hidden="true" className="hidden size-4 dark:block" />
      <Sun aria-hidden="true" className="size-4 dark:hidden" />
    </button>
  )
}
