import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Obie wersje językowe są otwarte dla robotów; `/en` to pełna
        // wersja serwisu, nie duplikat — pary opisuje `hreflang`.
        allow: ["/", "/blog", "/blog/*", "/en", "/en/*"],
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
