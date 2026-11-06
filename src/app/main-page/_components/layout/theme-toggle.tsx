"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/app/main-page/_components/ui/button"

/**
 * Przełącznik jasny / ciemny — zwykła zmiana klasy bez animacji (next-themes
 * z `disableTransitionOnChange`, jak w dokumentacji shadcn). Ikonę wybiera CSS
 * (`dark:`), więc HTML z serwera i klienta jest ten sam.
 */
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
