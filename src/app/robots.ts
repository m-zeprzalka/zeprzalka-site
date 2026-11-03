import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"

/**
 * Cały serwis jest otwarty dla robotów, w obu wersjach językowych. Strony,
 * które nie powinny trafić do wyników (tagi, cienkie kategorie, katalog
 * /design-system, 404), mają `noindex` w metadanych — blokada w robots.txt
 * uniemożliwiłaby robotowi zobaczenie tego znacznika.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
