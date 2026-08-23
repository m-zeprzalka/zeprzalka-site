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
  // Częściowe CSP bez script-src/style-src — pełne (nonce) wymaga proxy,
  // opisane w docs/ROADMAP.md. Te dyrektywy nie psują niczego, a domykają
  // realne wektory: osadzanie w ramkach, wstrzykiwanie <base> i <object>,
  // przekierowanie formularzy na obce originy.
  {
    key: "Content-Security-Policy",
    value: [
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
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
