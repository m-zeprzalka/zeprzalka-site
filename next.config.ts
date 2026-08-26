import type { NextConfig } from "next"

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
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,

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

  // Optymalizacja obrazków wyłączona świadomie: limit transformacji na planie
  // Vercel Hobby. Po przejściu na plan Pro usunąć tę linię (docs/ROADMAP.md).
  images: {
    unoptimized: true,
  },
}

export default nextConfig
