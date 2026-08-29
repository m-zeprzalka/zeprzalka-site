import type { NextConfig } from "next"

/**
 * Tryb deweloperski wymaga luźniejszej polityki niż produkcja — i tylko tam
 * ją dostaje. Produkcyjne nagłówki nie zmieniają się ani o znak.
 */
const isDev = process.env.NODE_ENV === "development"

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  /*
   * Polityka bezpieczeństwa treści oparta na źródłach.
   *
   * Świadomie bez nonce'ów: w App Routerze nonce wymusza renderowanie każdej
   * strony na żądanie, a serwis ma ponad 200 stron statycznych — zamieniłby
   * je w dynamiczne, tracąc cache brzegowy. Zamiast tego domykamy origin:
   * skrypty, style, obrazy, czcionki, media i połączenia wolno pobierać
   * wyłącznie z własnej domeny (plus YouTube w ramkach i beacon Web Vitals).
   * To nie zatrzymuje wstrzyknięcia inline, ale odcina wyprowadzenie danych
   * i ładowanie obcego kodu — realne wektory dla serwisu bez logowania.
   */
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next osadza dane strumienia w inline'owych <script>; bez nonce'a
      // musi je objąć 'unsafe-inline'. Kluczowe jest to, że lista źródeł
      // nie zawiera żadnej obcej domeny.
      //
      // Dwa odstępstwa wyłącznie lokalnie, oba nieobecne w produkcji:
      // - 'unsafe-eval': React w trybie deweloperskim używa eval() do
      //   odtwarzania stosu wywołań (w produkcji nie używa go nigdy);
      // - va.vercel-scripts.com: analityka i Speed Insights sięgają lokalnie
      //   po wersje debugowe skryptów. Na produkcji ładują się z własnego
      //   origin (`/_vercel/…`), więc lista źródeł zostaje bez obcych domen.
      `script-src 'self' 'unsafe-inline'${
        isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""
      }`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "font-src 'self' data:",
      // HMR Turbopacka chodzi po websocketach na tym samym origin.
      `connect-src 'self' https://vitals.vercel-insights.com${
        isDev ? " ws: wss:" : ""
      }`,
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,

  experimental: {
    /*
     * Serwis ma dwa układy główne (polski w katalogu głównym, angielski
     * pod `/en`), bo atrybut `lang` na `<html>` ustawia w App Routerze
     * wyłącznie układ główny. Przy dwóch układach plik `app/not-found.tsx`
     * nie ma się do czego podpiąć i nieznany adres dostawał surowy dokument
     * bez arkusza stylów. `global-not-found.tsx` renderuje własny, kompletny
     * dokument — i nadal odpowiada statusem 404, a nie 200.
     */
    globalNotFound: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Wideo portfolio jest wersjonowane nazwą pliku — może być cache'owane bez końca
        source: "/:file*.(mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },

  /*
   * Optymalizacja obrazków włączona po przejściu na plan Vercel Pro
   * (wcześniej wyłączona przez limit transformacji na planie Hobby).
   * Pliki źródłowe są już w WebP, ale dopiero to daje warianty rozmiarowe:
   * telefon pobiera kadr dopasowany do ekranu, a nie pełne 1600 px.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    // Rok — nazwy plików są wersjonowane treścią, więc cache może żyć długo.
    minimumCacheTTL: 31536000,
  },
}

export default nextConfig
