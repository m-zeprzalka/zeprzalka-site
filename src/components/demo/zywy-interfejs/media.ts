import "server-only"
import fs from "node:fs"
import path from "node:path"

/**
 * Proporcje obrazu WebP z nagłówka pliku (bez zależności). Kafle realizacji
 * dostają `aspect-ratio`, zanim wczyta się plakat — bez przeskoków układu.
 */
export function webpRatio(publicPath: string): number {
  const file = fs.readFileSync(path.join(process.cwd(), "public", publicPath))
  const chunk = file.toString("ascii", 12, 16)
  if (chunk === "VP8X") {
    const width = 1 + file.readUIntLE(24, 3)
    const height = 1 + file.readUIntLE(27, 3)
    return width / height
  }
  if (chunk === "VP8L") {
    const bits = file.readUInt32LE(21)
    return ((bits & 0x3fff) + 1) / (((bits >> 14) & 0x3fff) + 1)
  }
  // „VP8 ” (stratny): wymiary po sygnaturze klatki.
  return (file.readUInt16LE(26) & 0x3fff) / (file.readUInt16LE(28) & 0x3fff)
}
