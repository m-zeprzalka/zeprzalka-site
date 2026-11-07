"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"
import { useToggleTheme } from "@/app/main-page/_lib/hooks"

/**
 * Przełącznik jasny / ciemny — zwykła zmiana klasy bez animacji (przejścia
 * wstrzymane tylko na czas zmiany, `useToggleTheme`). Ikonę wybiera CSS
 * (`dark:`), więc HTML z serwera i klienta jest ten sam.
 */
export function ThemeToggle({ label }: { label: string }) {
  const toggle = useToggleTheme()

  return (
    // Pole dotyku 44 px bez zmiany rysunku (36 px) — sąsiedzi stoją 4–6 px obok.
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={toggle}
      className="relative after:absolute after:-inset-1"
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
