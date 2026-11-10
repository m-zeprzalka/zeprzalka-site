import type { NextConfig } from "next"

/**
 * Tryb deweloperski wymaga luźniejszej polityki niż produkcja — i tylko tam
 * ją dostaje. Produkcyjne nagłówki nie zmieniają się ani o znak.
 */
const isDev = process.env.NODE_ENV === "development"

/**
 * Piaskownica `/demo` (src/app/demo) istnieje wyłącznie poza produkcją: jej
 * pliki tras mają końcówkę `.demo.tsx`, którą rozpoznajemy jako trasę tylko
 * w `pnpm dev`, lokalnym buildzie i podglądach Vercela. Build produkcyjny
 * nie widzi ich wcale — `/demo` dostaje zwykłą stronę 404, a ślady funkcji nie
 * zawierają plików dem (pilnuje `check:build --production`). `DEMO_PUBLIC=1`
 * świadomie to wyłącza.
 */
const withDemos = process.env.VERCEL_ENV !== "production" || process.env.DEMO_PUBLIC === "1"

const securityHeaders = [
  // Przeglądarka nie rozwiązuje z wyprzedzeniem domen linków zewnętrznych.
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Serwis nie osadza sam siebie w ramkach — nikt inny też nie powinien.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Domyślna wartość przeglądarek: pełny adres tylko w obrębie serwisu,
  // na zewnątrz sam origin i nic przy przejściu z HTTPS na HTTP.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Okno otwarte z serwisu nie dostaje uchwytu do niego (i odwrotnie).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    // fullscreen, autoplay i encrypted-media świadomie bez wpisu — pusta
    // lista zablokowałaby je także w ramce YouTube we wpisach.
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "serial=()",
      "hid=()",
      "midi=()",
      "magnetometer=()",
      "display-capture=()",
      "idle-detection=()",
      "browsing-topics=()",
      "xr-spatial-tracking=()",
    ].join(", "),
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
      `connect-src 'self' https://vitals.vercel-insights.com${isDev ? " ws: wss:" : ""}`,
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      // Filmy we wpisach ładują się wyłącznie z domeny bez ciasteczek.
      "frame-src 'self' https://www.youtube-nocookie.com",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  pageExtensions: withDemos ? ["demo.tsx", "tsx", "ts"] : ["tsx", "ts"],

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
    // Jedyna akcja serwerowa to formularz kontaktowy; najdłuższa poprawna
    // wiadomość ma ~21 KB, więc domyślny 1 MB to niepotrzebny zapas dla DoS.
    serverActions: { bodySizeLimit: "64kb" },
  },

  /*
   * Paginacja bloga przeszła z `?page=N` na statyczne adresy, żeby indeks
   * bloga mógł być serwowany z cache CDN. Stare adresy prowadzą na nowe.
   * Strona 1 nie ma odpowiednika — `/blog?page=1` to i tak `/blog`.
   */
  async redirects() {
    const page = "(?<n>[2-9]|[1-9]\\d+)"
    return [
      // iOS i część robotów pytają o ten adres wprost; Next serwuje ikonę jako /apple-icon.png.
      { source: "/apple-touch-icon.png", destination: "/apple-icon.png", permanent: true },
      // Podgląd nowej wersji (do 10.11.2026) żył pod /main-page — udostępnione linki
      // prowadzą na te same strony bez prefiksu.
      { source: "/main-page", destination: "/", permanent: true },
      { source: "/main-page/:path*", destination: "/:path*", permanent: true },
      {
        source: "/blog",
        has: [{ type: "query", key: "page", value: page }],
        destination: "/blog/strona/:n",
        permanent: true,
      },
      {
        source: "/en/blog",
        has: [{ type: "query", key: "page", value: page }],
        destination: "/en/blog/page/:n",
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        /*
         * Media z public/ (obrazy, wideo, ikony). Ich nazwy NIE zawierają
         * skrótu treści, więc nie mogą być `immutable` jak /_next/static:
         * podmiana pliku pod tą samą nazwą musi dotrzeć do czytelnika.
         * Tydzień cache + dzień rewalidacji w tle zamiast domyślnego
         * `max-age=0` Vercela. Plik zmieniony? Nowa nazwa albo odczekaj tydzień.
         * `_next/` wykluczone: tam pliki mają skrót w nazwie i rok `immutable`.
         */
        source: "/:file((?!_next/).*)\\.:ext(webp|avif|png|jpg|jpeg|svg|ico|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
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
    // Tydzień — ta sama reguła co dla plików z public/ (nazwy bez skrótu treści).
    minimumCacheTTL: 604800,
  },
}

export default nextConfig
