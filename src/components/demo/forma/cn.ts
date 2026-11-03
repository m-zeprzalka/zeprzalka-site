import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * `cn` Formy: tailwind-merge, który zna tokeny systemu. Bez tego
 * `text-fm-micro` (rozmiar) i `text-fm-ink-2` (kolor) wyglądają dla niego
 * jak ta sama klasa i jedna z nich znika przy łączeniu.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["fm-display", "fm-h2", "fm-h3", "fm-lead", "fm-body", "fm-small", "fm-micro"],
      color: [
        "fm-canvas",
        "fm-surface",
        "fm-fill",
        "fm-fill-strong",
        "fm-ink",
        "fm-ink-2",
        "fm-ink-3",
        "fm-edge",
        "fm-edge-strong",
        "fm-inverse",
        "fm-live",
      ],
      radius: ["fm-xs", "fm-sm", "fm-md", "fm-lg", "fm-xl", "fm-2xl", "fm-3xl", "fm-4xl"],
      shadow: ["fm-ring", "fm-card", "fm-pop", "fm-float"],
      ease: ["fm-snap", "fm-move", "fm-drawer", "fm-spring"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
