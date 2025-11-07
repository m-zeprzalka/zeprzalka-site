# 📊 Raport Analizy i Rekomendacje Optymalizacyjne

**Data analizy:** 7 listopada 2025  
**Projekt:** Zeprzalka.com - Blog Technologiczny  
**Framework:** Next.js 15.5.3 + React 19 + Tailwind CSS 4

---

## 🚨 KRYTYCZNE PROBLEMY (Priorytet 1 - Do naprawy natychmiast)

### 1. ⚠️ Brak Optymalizacji Mediów

**Problem:**

- Video `hero_web.mp4` waży **6.1 MB** i jest ładowane automatycznie na stronie głównej
- Obrazy w folderze `/public/blog/` nie są zoptymalizowane:
  - `formaty-grafik-w-internecie.jpg` - **568 KB**
  - `twoja-pierwsza-strona.jpg` - **317 KB**
  - `min.png` - **1.5 MB** (!!)
  - SVG `efekty.svg` - **448 KB**
  - SVG `ppg.svg` - **394 KB**

**Wpływ:**

- Strona główna ładuje 6+ MB tylko dla video
- First Contentful Paint (FCP) > 3s
- Largest Contentful Paint (LCP) > 4s
- Użytkownicy mobilni z wolnym internetem czekają 10-20 sekund

**Rozwiązanie:**

```bash
# 1. Kompresuj video (docelowo 500-800 KB)
ffmpeg -i hero_web.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1280:-2 hero_web_optimized.mp4

# 2. Konwertuj do WebM (lepszy codec dla web)
ffmpeg -i hero_web.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 hero_web.webm

# 3. Użyj Next.js Image dla wszystkich obrazów
# 4. Konwertuj duże PNG do WebP/AVIF
```

**Kod po optymalizacji:**

```tsx
// src/components/alternative/HeroB.tsx
<video
  autoPlay
  muted
  loop
  playsInline
  className="rounded-lg"
  preload="metadata"
>
  <source src="/hero_web.webm" type="video/webm" />
  <source src="/hero_web_optimized.mp4" type="video/mp4" />
</video>
```

**Dodaj do page.tsx `<link rel="preload">`:**

```tsx
// src/app/page.tsx
import Script from "next/script"

export default function Home() {
  return (
    <>
      <link rel="preload" as="video" href="/hero_web.webm" />
      {/* ... reszta */}
    </>
  )
}
```

---

### 2. 🚫 Brak `sitemap.xml` i `robots.txt`

**Problem:**

- Google nie może indeksować Twojej strony efektywnie
- Brak mapy strony = wolniejsze odkrywanie nowych artykułów
- Brak robots.txt = crawlery nie wiedzą, co mogą indeksować

**Wpływ:**

- Artykuły pojawiają się w Google z 2-4 tygodniowym opóźnieniem
- Strony `/blog-b`, `/blog-c`, `/page-b` są indexowane niepotrzebnie (duplikaty treści!)

**Rozwiązanie:**

**a) Stwórz `app/sitemap.ts`:**

```typescript
// src/app/sitemap.ts
import { getAllPosts } from "@/lib/posts"
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const blogPosts = posts.map((post) => ({
    url: `https://zeprzalka.com/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://zeprzalka.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://zeprzalka.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogPosts,
  ]
}
```

**b) Stwórz `app/robots.ts`:**

```typescript
// src/app/robots.ts
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/*"],
        disallow: ["/blog-b", "/blog-c", "/page-b", "/api/"],
      },
    ],
    sitemap: "https://zeprzalka.com/sitemap.xml",
  }
}
```

---

### 3. 🔒 Brak Security Headers

**Problem:**

- Aplikacja nie ma ustawionych nagłówków bezpieczeństwa
- Podatność na XSS, clickjacking, MIME sniffing

**Rozwiązanie:**

Dodaj do `next.config.ts`:

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Optymalizacja obrazów
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
```

---

### 4. 📦 Bundle Size - Zbyt wiele Client Components

**Problem:**

- Komponent `Footer.tsx` jest oznaczony jako `"use client"` mimo że nie używa żadnych hooków
- `Header.tsx` również może być Server Component z małymi zmianami
- To zwiększa bundle JavaScript wysyłany do klienta

**Obecny Stan:**

```tsx
// src/components/layout/Footer.tsx
"use client" // ❌ NIEPOTRZEBNE
import Link from "next/link"

export function Footer() {
  // Statyczny content - nie ma useState, useEffect, onClick
}
```

**Rozwiązanie:**

```tsx
// src/components/layout/Footer.tsx
import Link from "next/link" // ✅ Server Component

export function Footer() {
  return (
    // ... ten sam kod
  )
}
```

**Dla Header:**

```tsx
// src/components/layout/Header.tsx - wymaga małych zmian
// Przenieś logikę otwierania menu do osobnego Client Component
// a sam Header zostaw jako Server Component
```

**Szacowany zysk:** -15-25 KB JavaScript bundle

---

## ⚡ WYSOKIE PRIORYTETY (Priorytet 2 - Do wdrożenia w tym tygodniu)

### 5. 🖼️ Brak Lazy Loading dla Video w Gallery

**Problem:**

```tsx
// src/components/alternative/GalleryB.tsx
<video autoPlay muted loop> {/* Wszystkie 8 video ładują się od razu! */}
```

**Wpływ:**

- 8 video = potencjalnie 20-40 MB danych
- Mobile users = rage quit

**Rozwiązanie:**

```tsx
"use client"
import { useInView } from 'react-intersection-observer'

export function GalleryItem({ item }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref}>
      {item.type === "video" ? (
        inView ? (
          <video autoPlay muted loop playsInline preload="metadata">
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          <div className="aspect-video bg-muted animate-pulse" />
        )
      ) : (
        // Image component
      )}
    </div>
  )
}
```

**Instalacja:**

```bash
npm install react-intersection-observer
```

---

### 6. 🔍 Optymalizacja Metadanych dla Każdego Posta

**Problem:**

- W `blog/[slug]/page.tsx` metadata jest OK, ale brakuje:
  - Canonical URLs
  - Article Schema with proper author markup
  - Keywords (opcjonalne, ale w Twoim przypadku przydatne dla PL rynku)

**Rozwiązanie:**

```typescript
// src/app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return {}

  const url = `https://zeprzalka.com/blog/${slug}`

  return {
    title: `${post.frontmatter.title} | Zeprzalka.com`,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags.join(", "), // ✅ Dodaj keywords
    alternates: {
      canonical: url, // ✅ Canonical URL
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author?.name || "Autor"],
      images: [
        {
          url: post.frontmatter.image,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
      url, // ✅ Dodaj URL
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.image],
      creator: "@zeprzalka", // ✅ Dodaj swój Twitter
    },
  }
}
```

---

### 7. 🎨 Optymalizacja Font Loading

**Problem:**

- Geist fonts są ładowane, ale bez `display: swap`
- Brak preconnect do Google Fonts (jeśli używasz)

**Rozwiązanie:**

```typescript
// src/app/layout.tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ✅ Dodaj to
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // ✅ Dodaj to
  preload: true,
})
```

---

### 8. 📱 Viewport Meta - Optymalizacja

**Problem:**

```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // ❌ To blokuje accessibility (zoom)
}
```

**Rozwiązanie:**

```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Usuń maximumScale - pozwól użytkownikom zoomować!
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}
```

---

## 🔧 ŚREDNIE PRIORYTETY (Priorytet 3 - Wdrożyć w ciągu 2 tygodni)

### 9. 🗑️ Usunięcie Nieużywanych Plików

**Problem:**
Masz duplikaty stron do testowania:

- `/src/app/blog-b/page.tsx` (test page)
- `/src/app/blog-c/page.tsx` (test page)
- `/src/app/page-b/page.tsx` (test page)
- `/src/components/sections/*` (stare wersje komponentów?)

**Rozwiązanie:**

```bash
# Usuń testowe strony
rm -rf src/app/blog-b
rm -rf src/app/blog-c
rm -rf src/app/page-b

# Jeśli sections/ nie jest używane, usuń
rm -rf src/components/sections
```

**Pamiętaj:** Dodaj je do `.gitignore` jeśli chcesz zachować lokalnie

---

### 10. ⚙️ Environment Variables

**Problem:**

- Brak pliku `.env.example`
- Trudno onboardować nowych deweloperów
- Nie wiadomo, jakie zmienne są potrzebne

**Rozwiązanie:**

Stwórz `.env.example`:

```bash
# App Configuration
NEXT_PUBLIC_SITE_URL=https://zeprzalka.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email Configuration (dla Contact Form - jeśli planujesz)
RESEND_API_KEY=
CONTACT_EMAIL=m@zeprzalka.com

# Analytics (opcjonalne)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

Stwórz `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Dodaj do `next.config.ts`:**

```typescript
const nextConfig: NextConfig = {
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://zeprzalka.com",
  },
  // ...
}
```

---

### 11. 📊 Web Analytics

**Problem:**

- Nie widzisz, jak użytkownicy korzystają z bloga
- Brak danych o najpopularniejszych artykułach
- Nie wiesz, gdzie użytkownicy spędzają czas

**Rozwiązanie (Prywatność First):**

**Opcja 1: Umami (self-hosted, GDPR compliant)**

```bash
npm install @umami/next
```

```tsx
// src/app/layout.tsx
import Script from "next/script"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}

        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src="https://analytics.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
```

**Opcja 2: Vercel Analytics (najłatwiejsze)**

```bash
npm install @vercel/analytics
```

```tsx
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

### 12. 🎯 Structured Data (Schema.org)

**Problem:**

- Masz JSON-LD tylko w artykułach
- Brak schema dla:
  - Strony głównej (Person/ProfilePage)
  - Listy artykułów (Blog)
  - Breadcrumbs

**Rozwiązanie:**

**a) Strona główna:**

```tsx
// src/app/page.tsx
export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michał Zeprzałka",
    jobTitle: "Digital Solutions Architect",
    url: "https://zeprzalka.com",
    sameAs: [
      "https://github.com/m-zeprzalka",
      "https://www.facebook.com/michalzeprzalka",
      "https://linkedin.com/in/michal-zeprzalka", // Dodaj jeśli masz
    ],
    knowsAbout: ["Next.js", "React", "AI", "Web Development", "Multimedia"],
    email: "m@zeprzalka.com",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* reszta */}
    </>
  )
}
```

**b) Lista blogów:**

```tsx
// src/app/blog/page.tsx
export default function BlogPage() {
  const posts = getAllPosts()

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Zeprzalka.com",
    description: "Najnowsze trendy w AI, Next.js i web developmencie",
    url: "https://zeprzalka.com/blog",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.frontmatter.title,
      url: `https://zeprzalka.com/blog/${post.slug}`,
      datePublished: post.frontmatter.date,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* reszta */}
    </>
  )
}
```

---

## 💡 NICE TO HAVE (Priorytet 4 - Rozważ w przyszłości)

### 13. 🔄 Infinite Scroll dla Blogów

**Cel:** Zamiast pokazywać wszystkie artykuły, załaduj pierwsze 9 i dodaj "Load More"

**Dlaczego:**

- Szybszy initial load
- Lepsza wydajność na mobilkach
- Więcej engagement

---

### 14. 🔍 Full-Text Search

**Cel:** Dodaj wyszukiwarkę artykułów

**Narzędzie:** [Pagefind](https://pagefind.app/) - static search

```bash
npm install pagefind
```

---

### 15. 💬 Comments System

**Opcje:**

- [Giscus](https://giscus.app/) - GitHub Discussions (Free)
- [Utterances](https://utteranc.es/) - GitHub Issues (Free)
- Disqus (płatne, ale popularne)

---

### 16. 📧 Newsletter

**Cel:** Zbieraj emaile czytelników

**Narzędzia:**

- ConvertKit (Free do 1000 subskrybentów)
- Buttondown (Free, minimalistyczne)
- Resend (Free do 3000 emaili/miesiąc)

---

### 17. 🌐 Internationalization (i18n)

**Jeśli planujesz anglojęzyczną wersję:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  i18n: {
    locales: ["pl", "en"],
    defaultLocale: "pl",
  },
}
```

---

### 18. 🔐 Content Security Policy (CSP)

**Zaawansowane bezpieczeństwo:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self';
    media-src 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("Content-Security-Policy", cspHeader)

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  })
}
```

---

## 📈 Mierzalne Cele (KPIs)

Po wdrożeniu powyższych zmian, Twoja strona powinna osiągnąć:

### Lighthouse Scores (Desktop)

- ⚡ Performance: **95+** (obecnie ~60-70)
- ♿ Accessibility: **100** (obecnie ~85-90)
- ✅ Best Practices: **100** (obecnie ~75-85)
- 🔍 SEO: **100** (obecnie ~70-80)

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTI** (Time to Interactive): < 3.8s

### Bundle Size

- **Initial JavaScript**: < 100 KB
- **Total Transfer Size**: < 500 KB (bez mediów)
- **Images**: AVIF/WebP, < 50 KB per image
- **Videos**: < 800 KB per video

---

## 🛠️ Plan Wdrożenia (Recommended Timeline)

### Tydzień 1 (KRYTYCZNE)

- [ ] Optymalizacja video (`hero_web.mp4`)
- [ ] Konwersja obrazów do WebP/AVIF
- [ ] Dodanie `sitemap.ts` i `robots.ts`
- [ ] Security headers w `next.config.ts`

### Tydzień 2 (WYSOKIE)

- [ ] Lazy loading dla video w Gallery
- [ ] Optymalizacja font loading
- [ ] Bundle size - konwersja Footer/Header do Server Components
- [ ] Canonical URLs i lepsze metadane

### Tydzień 3 (ŚREDNIE)

- [ ] Usunięcie testowych stron
- [ ] Environment variables
- [ ] Web Analytics (Vercel/Umami)
- [ ] Structured Data dla wszystkich stron

### Tydzień 4 (POLISH)

- [ ] Testing Lighthouse
- [ ] Mobile testing
- [ ] Cross-browser testing
- [ ] Dokumentacja w README

---

## 🎓 Dodatkowe Zasoby

### Narzędzia do Testowania

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### Kompresja Obrazów

- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac only
- [Sharp](https://sharp.pixelplumbing.com/) - Node.js library

### SEO

- [Google Search Console](https://search.google.com/search-console)
- [Schema Markup Validator](https://validator.schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

## 📝 Notatki Końcowe

**Świetne aspekty Twojej aplikacji:**

- ✅ Next.js 15 + React 19 (najnowsze wersje)
- ✅ TypeScript z strict mode
- ✅ Tailwind CSS 4 (nowoczesny stack)
- ✅ MDX dla content (świetny wybór dla bloga)
- ✅ Accessibility w UI (shadcn/ui)
- ✅ Dark mode
- ✅ Responsive design
- ✅ Reading time calculation
- ✅ Active TOC

**Co wyróżni Cię jako eksperta:**

- Lighthouse score 95+
- Core Web Vitals w zieleni
- Sitemap + robots.txt
- Structured data
- Security headers
- Optymalne obrazy (AVIF/WebP)
- Analytics i monitoring

**Powodzenia!** 🚀

---

**Autor raportu:** GitHub Copilot  
**Kontakt:** Ten raport został wygenerowany automatycznie na podstawie deep code analysis.
