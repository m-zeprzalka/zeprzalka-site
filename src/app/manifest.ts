import type { MetadataRoute } from "next"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/site"
import { DEFAULT_LOCALE } from "@/i18n/config"

/**
 * Manifest aplikacji webowej — pozwala dodać serwis do ekranu głównego
 * i podaje systemowi kolory oraz ikony. Kolory odpowiadają tokenom motywu
 * ciemnego z globals.css, bo taki jest motyw domyślny.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // Stały identyfikator aplikacji — niezależny od `start_url`, gdyby ten się zmienił.
    id: "/",
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION[DEFAULT_LOCALE],
    start_url: "/",
    display: "standalone",
    lang: DEFAULT_LOCALE,
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      // 192 px serwuje Next z src/app/icon.png (ten sam plik co <link rel="icon">).
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // Wersja maskowalna ma margines bezpieczeństwa — Android przycina ikonę do koła.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
