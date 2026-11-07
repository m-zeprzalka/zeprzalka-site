import fs from "node:fs"
import path from "node:path"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Przykład w design systemie: żywy komponent i jego kod. Kod czytamy z pliku
 * przykładu przy buildzie (strona jest statyczna), więc dokumentacja nie może
 * rozjechać się z tym, co widać nad nią.
 */
export function Example({
  file,
  children,
  className,
}: {
  /** Nazwa pliku w `_design-system/examples/`. */
  file: string
  children: ReactNode
  className?: string
}) {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "app", "main-page", "_design-system", "examples", file),
    "utf8"
  )

  return (
    <figure className="mt-6 overflow-hidden rounded-2xl border text-foreground">
      <div className={cn("flex flex-wrap items-center gap-3 p-6", className)}>{children}</div>
      <figcaption className="sr-only">{file}</figcaption>
      <pre
        tabIndex={0}
        role="group"
        aria-label={`Kod przykładu: ${file}`}
        className="max-h-96 overflow-auto border-t bg-muted/40 px-5 py-4 font-mono text-[0.8125rem] leading-relaxed text-muted-foreground"
      >
        <code>{source.trim()}</code>
      </pre>
    </figure>
  )
}
