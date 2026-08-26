import type { MetadataRoute } from "next"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/site"

/**
 * Manifest aplikacji webowej — pozwala dodać serwis do ekranu głównego
 * i podaje systemowi kolory oraz ikony. Kolory odpowiadają tokenom motywu
 * ciemnego z globals.css, bo taki jest motyw domyślny.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    lang: "pl",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
