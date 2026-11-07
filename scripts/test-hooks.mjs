/**
 * Testy jednostkowe bez dodatkowych paczek: Node 24 uruchamia TypeScript sam
 * (usuwa typy), a ten hook dokłada tylko rozwiązywanie aliasu `@/` (jak w
 * tsconfig) i importów względnych bez rozszerzenia. Uruchamia `pnpm test`.
 */
import { existsSync, statSync } from "node:fs"
import { registerHooks } from "node:module"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const candidates = ["", ".ts", ".tsx", "/index.ts"]

registerHooks({
  resolve(specifier, context, nextResolve) {
    let base = null
    if (specifier.startsWith("@/")) base = path.join(root, "src", specifier.slice(2))
    else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith("file:")) {
      base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier)
    }
    if (base) {
      for (const suffix of candidates) {
        const file = base + suffix
        if (existsSync(file) && statSync(file).isFile()) {
          return nextResolve(pathToFileURL(file).href, context)
        }
      }
    }
    return nextResolve(specifier, context)
  },
})
