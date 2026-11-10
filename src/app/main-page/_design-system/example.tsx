import fs from "node:fs"
import path from "node:path"
import type { ReactNode } from "react"
import { renderArticle } from "@/app/main-page/_components/blog/render-article"
import { cn } from "@/lib/utils"

/** Język bloku kodu z rozszerzenia pliku (nazwy jak w highlight.js; `mdx` — alias z `renderArticle`). */
const LANGUAGE: Record<string, string> = {
  ".tsx": "tsx",
  ".ts": "ts",
  ".css": "css",
  ".mdx": "mdx",
}

/** Od tylu wierszy kod przykładu przewija się w ramce o wysokości 24 rem (`max-h-96`). */
const TALL_LINES = 15

/**
 * Plik przykładu z `_design-system/examples/`, czytany przy buildzie (strona jest statyczna).
 * Ścieżka z dosłownych segmentów — Turbopack śledzi wtedy tylko ten katalog (pułapka z AGENTS.md).
 */
export function readExample(file: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), "src", "app", "main-page", "_design-system", "examples", file),
    "utf8"
  )
}

/**
 * Kod przykładu tym samym torem co blok kodu we wpisie (`renderArticle`): MDX → rehype-highlight →
 * `CodeBlock` (kopiowanie, przewijanie, paleta składni z `code.css`). Design system
 * pokazuje więc dokładnie ten wygląd, który dostanie kod na blogu.
 */
export async function HighlightedCode({ code, language }: { code: string; language: string }) {
  // Płot dłuższy niż najdłuższy ciąg „`” w kodzie — treść nigdy go nie zamknie.
  const fence = "`".repeat(Math.max(3, ...(code.match(/`+/g) ?? []).map((run) => run.length + 1)))
  const { content } = await renderArticle(`${fence}${language}\n${code}\n${fence}`, "pl")
  return content
}

/**
 * Przykład w design systemie: tytuł, żywy komponent i jego kod. Kod to plik przykładu,
 * więc dokumentacja nie może rozjechać się z tym, co widać nad nią. Bez `children` —
 * sam kod (żywy przykład stoi gdzie indziej na stronie, opisuje to `note`).
 */
export async function Example({
  file,
  title,
  note,
  children,
  className,
}: {
  /** Nazwa pliku w `_design-system/examples/`. */
  file: string
  title: string
  note?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const code = readExample(file).trim()
  const name = path.basename(file, path.extname(file))
  // Wiersz kodu ma 22–24 px (13–14 px × 1,7) — od 16 wierszy blok przekracza 24 rem ramki.
  const tall = code.split("\n").length > TALL_LINES

  return (
    <figure
      id={`przyklad-${name}`}
      className="mt-6 overflow-hidden rounded-2xl border text-foreground"
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-3.5">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="font-mono text-xs text-muted-foreground">examples/{file}</span>
      </figcaption>
      {note && (
        <p className="max-w-[72ch] px-5 pt-5 text-sm text-pretty text-muted-foreground">{note}</p>
      )}
      {children && (
        <div className={cn("flex flex-wrap items-center gap-3 p-5 sm:p-6", className)}>
          {children}
        </div>
      )}
      {/* Blok kodu wpisu bez własnej ramki — figura ma już obrys. Wysoki kod przewija się
          w miejscu, w ramce z przystankiem Tab (przewijanie z klawiatury); krótki stoi cały. */}
      <div
        tabIndex={tall ? 0 : undefined}
        role={tall ? "group" : undefined}
        aria-label={tall ? `Kod: examples/${file}` : undefined}
        className={cn(
          "border-t outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset [&_.code-block]:rounded-none [&_.code-block]:border-0",
          tall && "max-h-96 overflow-y-auto"
        )}
      >
        <HighlightedCode code={code} language={LANGUAGE[path.extname(file)] ?? "tsx"} />
      </div>
    </figure>
  )
}
