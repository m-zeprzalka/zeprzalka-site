import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/*"],
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://zeprzalka.com/sitemap.xml",
  }
}
