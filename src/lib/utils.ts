import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * `tailwind-merge` zna tokeny Tailwinda, ale nie nasze: bez tego `max-w-column`
 * (kolumna nowej wersji, `--container-column`) nie gasiłoby `max-w-lg` z komponentu,
 * a wygrywałoby to, co stoi później w arkuszu. To samo dla odstępów siatki (`px-page`,
 * `top-rail`). `text-display` i `text-title` to stopnie pisma, nie kolory — inaczej
 * `cn("text-foreground", "text-display")` gubiłoby kolor.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { container: ["column"], spacing: ["page", "track", "rail"] },
    classGroups: { "font-size": [{ text: ["display", "title"] }] },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
