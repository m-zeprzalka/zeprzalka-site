#!/usr/bin/env node
/**
 * CV w PDF ze strony „O mnie” w obu językach — jedna treść, dwa formaty.
 * Arkusz druku z `globals.css` daje jasną paletę i chowa `data-print-hide`.
 *
 *   pnpm build && pnpm start          # w drugim terminalu
 *   pnpm cv [adres-serwisu]           # domyślnie http://localhost:3000
 *
 * Wynik: public/cv-michal-zeprzalka.pdf i public/cv-michal-zeprzalka-en.pdf
 * (adresy w `CV_PDF`, src/lib/site.ts). Przeglądarka: CHROME_PATH albo
 * systemowy Google Chrome (jak w `pnpm visual`).
 */
import path from "node:path"
import { chromium } from "playwright-core"

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "")
const PAGES = [
  { url: "/o-mnie", file: "cv-michal-zeprzalka.pdf" },
  { url: "/en/about", file: "cv-michal-zeprzalka-en.pdf" },
]

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" }
)
try {
  const page = await browser.newPage()
  for (const { url, file } of PAGES) {
    const response = await page.goto(base + url, { waitUntil: "networkidle" })
    if (!response?.ok()) throw new Error(`${base + url}: HTTP ${response?.status()}`)
    await page.emulateMedia({ media: "print" })
    await page.evaluate(() => document.fonts.ready)
    await page.pdf({
      path: path.join(process.cwd(), "public", file),
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    })
    console.log(`CV: public/${file} (z ${url})`)
  }
} finally {
  await browser.close()
}
