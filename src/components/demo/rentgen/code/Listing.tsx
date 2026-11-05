import fs from "node:fs"
import path from "node:path"
import { cn } from "../../forma/cn"

/**
 * Tło kliszy: prawdziwy kod źródłowy tej sekcji (plik z repozytorium,
 * czytany przy prerenderze — strona jest statyczna). Przygaszony, z numerami
 * linii, w lewej kolumnie sekcji (dalej „minimapa” kodu w CSS): gdziekolwiek
 * stanie soczewka, pod nią jest kod, a bliźniaki elementów leżą na nim jak
 * jasne „narządy”.
 * Fragment (od `return (`) ograniczony do `MAX_LINES`, jeden węzeł tekstu z numerami
 * linii w treści — bez spanów na linię, więc HTML i ładunek RSC zostają lekkie.
 */

const MAX_LINES = 56

function readSection(file: string): string[] {
  try {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/demo/rentgen/sections", file),
      "utf8"
    )
    const lines = source.split("\n")
    const start = Math.max(
      0,
      lines.findIndex((line) => /^\s*return \(/.test(line))
    )
    return lines
      .slice(start, start + MAX_LINES)
      .map((line, index) => `${String(index + 1).padStart(3, " ")}  ${line.replace(/\s+$/, "")}`)
  } catch {
    return []
  }
}

export function Listing({ file, className }: { file: string; className?: string }) {
  const lines = readSection(file)
  if (lines.length === 0) return null
  return (
    <div className={cn("rg-listing", className)}>
      <pre className="rg-listing__pre">{lines.join("\n")}</pre>
    </div>
  )
}
