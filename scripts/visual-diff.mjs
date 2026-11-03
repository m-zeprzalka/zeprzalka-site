#!/usr/bin/env node
/**
 * Porównanie pikseli dwóch wersji serwisu — strażnik zasady „wygląd strony
 * głównej jest nietykalny bez zgody właściciela”.
 *
 *   pnpm visual <adres-bazowy> <adres-zmiany> [--all] [ścieżki…]
 *   pnpm visual http://localhost:3200 http://localhost:3100
 *
 * Domyślnie porównuje `/` i `/en` w 1440 i 390 px; `--all` dokłada podstrony.
 * Szum pomiaru wynosi 0,000%, bo zrzut jest powtarzalny: ograniczony ruch,
 * wideo zatrzymane na klatce 0, leniwe obrazki wczytane, kroje gotowe.
 * Każda różnica jest więc prawdziwa. Wyjątek: /portfolio (leniwe wideo
 * doczytuje się w różnym momencie) — dlatego nie ma go na liście.
 *
 * Przeglądarka: CHROME_PATH albo systemowy Google Chrome (jest na runnerach
 * GitHub Actions). Mapy różnic trafiają do .visual/ (w .gitignore).
 * Kod wyjścia 1 = jest różnica.
 */
import fs from "node:fs"
import path from "node:path"
import { chromium } from "playwright-core"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"

const args = process.argv.slice(2)
const [base, head] = args.filter((arg) => /^https?:\/\//.test(arg))
const extra = args.filter((arg) => arg.startsWith("/"))

if (!base || !head) {
  console.error("Użycie: pnpm visual <adres-bazowy> <adres-zmiany> [--all] [ścieżki…]")
  process.exit(2)
}

const HOME = ["/", "/en"]
const SUBPAGES = [
  "/uslugi",
  "/o-mnie",
  "/kontakt",
  "/blog",
  "/blog/kategoria",
  "/blog/html",
  "/en/blog",
  "/en/services",
  "/polityka-prywatnosci",
]
const pages = extra.length ? extra : args.includes("--all") ? [...HOME, ...SUBPAGES] : HOME

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true },
}

const OUT = ".visual"
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" }
)

async function shoot(context, url) {
  const page = await context.newPage()
  await page.goto(url, { waitUntil: "networkidle" })
  // Przewinięcie całej strony jak czytelnik: leniwe kafle i obrazy wczytują się,
  // więc porównujemy stan, który widać po lekturze, a nie zastępcze ramki.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState("networkidle")
  await page.evaluate(async () => {
    // Każde wideo na pierwszej klatce i z wczytanym obrazem (bez tego jedno
    // pokazuje poster, drugie klatkę — zależnie od tego, czy zdążyło ruszyć).
    await Promise.all(
      [...document.querySelectorAll("video")].map((video) => {
        video.pause()
        video.currentTime = 0
        if (video.readyState >= 2) return null
        video.preload = "auto"
        video.load()
        return new Promise((resolve) => {
          video.addEventListener("loadeddata", resolve, { once: true })
          setTimeout(resolve, 8000)
        })
      })
    )
    for (const img of document.querySelectorAll("img[loading=lazy]")) img.loading = "eager"
    await document.fonts.ready
  })
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(300)
  const buffer = await page.screenshot({ fullPage: true })
  await page.close()
  return PNG.sync.read(buffer)
}

let failed = false
for (const [name, options] of Object.entries(VIEWPORTS)) {
  const context = await browser.newContext({ ...options, reducedMotion: "reduce" })
  for (const pathname of pages) {
    const [a, b] = [await shoot(context, base + pathname), await shoot(context, head + pathname)]
    const label = `${name.padEnd(8)} ${pathname}`.padEnd(40)

    if (a.width !== b.width || a.height !== b.height) {
      console.log(`${label} ROZMIAR ${a.width}×${a.height} → ${b.width}×${b.height}`)
      failed = true
      continue
    }

    const diff = new PNG({ width: a.width, height: a.height })
    const pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 })
    const share = ((100 * pixels) / (a.width * a.height)).toFixed(3)
    console.log(`${label} ${pixels === 0 ? "bez zmian" : `${pixels} px (${share}%)`}`)

    if (pixels > 0) {
      failed = true
      const file = `${name}${pathname === "/" ? "_home" : pathname.replace(/\//g, "_")}.png`
      fs.writeFileSync(path.join(OUT, file), PNG.sync.write(diff))
    }
  }
  await context.close()
}

await browser.close()

if (failed) {
  console.log(
    `\nSą różnice — mapy w ${OUT}/. Zmiana wyglądu strony głównej wymaga zgody właściciela.`
  )
  process.exit(1)
}
console.log("\nIdentyczne co do piksela.")
