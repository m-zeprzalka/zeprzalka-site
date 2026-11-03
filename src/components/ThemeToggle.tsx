"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

/**
 * Przełącznik motywu. Klasę przycisku liczy komponent serwerowy
 * (`buttonVariants`) i podaje propsem — dzięki temu `cva` i `tailwind-merge`
 * nie trafiają do JavaScriptu każdej strony (−9 KB br).
 */
export function ThemeToggle({ label, className }: { label: string; className: string }) {
  // `resolvedTheme`, a nie `theme`: przy motywie „system" `theme` nie mówi,
  // co jest na ekranie, i pierwsze kliknięcie potrafiło nic nie zmienić.
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      data-slot="button"
      className={className}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{label}</span>
    </button>
  )
}
