import type { CSSProperties } from "react"
import dark from "@/components/demo/shared/portrait/face-glyphs-dark.webp"
import light from "@/components/demo/shared/portrait/face-glyphs-light.webp"
import { cn } from "@/components/demo/forma/cn"

/**
 * Statyczna klatka twarzy ze znaków — widać ją od pierwszego malowania (zanim
 * silnik się załaduje), bez JS i bez WebGL2. To wydruk z tego samego silnika
 * w identycznym kadrze (alfa jako maska, kolor z `currentColor`), osobno dla
 * motywów, bo na jasnym tusz siedzi w cieniach, a na ciemnym — w światłach.
 * Pobiera się tylko maska bieżącego motywu. Zdjęcia tu nie ma.
 */
export function PortraitFallback({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-0 bg-current [mask-image:var(--gx-face-light)] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] dark:[mask-image:var(--gx-face-dark)]",
        className
      )}
      style={
        {
          "--gx-face-light": `url(${light.src})`,
          "--gx-face-dark": `url(${dark.src})`,
        } as CSSProperties
      }
    />
  )
}
