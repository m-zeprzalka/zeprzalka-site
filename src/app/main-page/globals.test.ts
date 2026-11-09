import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

const keyframes = (file: string) =>
  [...fs.readFileSync(file, "utf8").matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1])

test("nazwy @keyframes nowej wersji nie powtarzają nazw z tw-animate-css", () => {
  // Tailwind zostawia jedną definicję na nazwę — wygrywa ta z importowanej biblioteki,
  // więc animacja o tej samej nazwie po cichu przestaje działać (tak zniknęło `enter`).
  const ours = keyframes(path.join(process.cwd(), "src/app/main-page/globals.css"))
  const library = new Set(
    keyframes(path.join(process.cwd(), "node_modules/tw-animate-css/dist/tw-animate.css"))
  )
  assert.ok(ours.length > 0)
  assert.deepEqual(
    ours.filter((name) => library.has(name)),
    []
  )
})
