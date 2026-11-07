import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * `tailwind-merge` zna tokeny Tailwinda, ale nie nasze: bez tego `max-w-column`
 * (kolumna nowej wersji, `--container-column`) nie gasiłoby `max-w-lg` z komponentu,
 * a wygrywałoby to, co stoi później w arkuszu.
 */
const twMerge = extendTailwindMerge({
  extend: { theme: { container: ["column"] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
