# zeprzalka.com

Prywatna strona portfolio z blogiem technicznym. Zbudowana w Next.js z MDX jako systemem treści.

---

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---------|-------------|--------|
| Framework | Next.js (App Router) | ^16.0.8 |
| Runtime | React | ^19.2.1 |
| Język | TypeScript (strict) | ^5 |
| CSS | Tailwind CSS | ^4 |
| UI | shadcn/ui + Radix UI | latest |
| Build | Turbopack | wbudowany |
| MDX | next-mdx-remote | ^5.0.0 |
| Dark mode | next-themes | ^0.4.6 |
| Markdown | remark-gfm, remark-emoji | latest |
| Syntax highlighting | rehype-highlight | ^7.0.2 |
| Czcionki | Geist Sans + Geist Mono | Google Fonts |
| Ikony | lucide-react | ^0.544.0 |

---

## Struktura projektu

```
zeprzalka/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (meta, fonts, theme)
│   │   ├── page.tsx                  # Strona główna
│   │   ├── globals.css               # Tailwind v4 + CSS variables (OKLCH)
│   │   ├── robots.ts                 # robots.txt (Next.js API)
│   │   ├── sitemap.ts                # Dynamiczny sitemap.xml
│   │   └── blog/
│   │       ├── page.tsx              # Lista artykułów
│   │       ├── [slug]/page.tsx       # Pojedynczy artykuł (SSG)
│   │       ├── tag/[tag]/page.tsx    # Filtrowanie po tagach
│   │       └── kategoria/page.tsx    # Placeholder (niezaimplementowane)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navbar z logo i przełącznikiem motywu
│   │   │   ├── Footer.tsx            # Stopka z nawigacją i social linkami
│   │   │   ├── Bar.tsx               # Progress bar przewijania (client)
│   │   │   ├── Logo.tsx              # Animowane logo z losowym symbolem (client)
│   │   │   └── Full.tsx              # Dekoracyjna warstwa znaków (nieużywana)
│   │   │
│   │   ├── alternative/              # Aktywne komponenty sekcji (wersje B/C)
│   │   │   ├── HeroB.tsx             # Hero z video i CTA
│   │   │   ├── SkillsB.tsx           # Umiejętności jako accordion
│   │   │   ├── GalleryB.tsx          # Portfolio (masonry, video preview)
│   │   │   ├── ContactB.tsx          # Formularz kontaktowy (bez backendu)
│   │   │   ├── BlogB.tsx             # Podgląd bloga (statyczny)
│   │   │   └── BlogC.tsx             # Podgląd bloga (dynamiczny, używany)
│   │   │
│   │   ├── sections/                 # Stare wersje A (nieużywane)
│   │   │   ├── Hero.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Gallery.tsx
│   │   │   └── Contact.tsx
│   │   │
│   │   ├── archive/                  # Archiwum starych layoutów stron
│   │   │   ├── blog-b/page.tsx
│   │   │   ├── blog-c/page.tsx
│   │   │   └── page-b/page.tsx
│   │   │
│   │   ├── blog/
│   │   │   ├── CodeBlock.tsx         # Blok kodu z przyciskiem kopiowania (client)
│   │   │   ├── ActiveTOC.tsx         # Aktywna nawigacja po nagłówkach (client)
│   │   │   └── highlight.css         # Podświetlanie składni (rehype-highlight)
│   │   │
│   │   ├── ui/                       # Komponenty shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   └── sonner.tsx
│   │   │
│   │   ├── Toggle.tsx                # Przełącznik dark/light mode (client)
│   │   └── theme-provider.tsx        # next-themes wrapper
│   │
│   └── lib/
│       └── posts.ts                  # Zarządzanie postami MDX (getAllPosts, getPostBySlug itd.)
│
├── lib/
│   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
│
├── content/
│   ├── posts/                        # 24 artykuły MDX (publikowane)
│   └── drafts/                       # 5 szkiców w formacie .txt (nieparsowalnych)
│
├── public/
│   ├── avatar.png
│   ├── hero_web.webm / .mp4          # Video hero (primary: webm, fallback: mp4)
│   └── blog/                         # Obrazy wyróżniające do artykułów
│
├── next.config.ts                    # Security headers, Image optimization
├── postcss.config.mjs                # @tailwindcss/postcss (v4)
├── tsconfig.json                     # strict: true, path alias @/*
├── eslint.config.mjs                 # next/core-web-vitals + typescript
└── components.json                   # shadcn/ui config
```

---

## Uruchomienie

```bash
npm install
npm run dev        # Turbopack dev server
npm run build      # Build produkcyjny
npm run start      # Start serwera produkcyjnego
npm run lint       # ESLint
```

---

## System bloga (MDX)

Artykuły przechowywane są w `content/posts/*.mdx`. Plik `src/lib/posts.ts` dostarcza funkcje:

```typescript
getAllPosts()              // Wszystkie posty posortowane po dacie
getPostBySlug(slug)        // Pojedynczy post po slug
getPostsByCategory(cat)    // Posty filtrowane po kategorii
getFeaturedPosts()         // Posty z featured: true
```

### Struktura frontmatter artykułu

```yaml
---
title: "Tytuł artykułu"
description: "Opis artykułu"
date: "2025-01-01"
categories: ["Next.js", "React"]
tags: ["nextjs", "react", "tutorial"]
image: "/blog/obrazek.jpg"
imageCaption: "Opcjonalny opis obrazka"
featured: true
author:
  name: "Michał Zeprzałka"
  title: "Digital Solutions Architect"
  bio: "Bio autora"
  avatar: "/avatar.png"
---
```

### Przetwarzanie MDX

Przy renderowaniu każdego artykułu aktywne są:

- `remark-gfm` - tabele, strikethrough, tasklists
- `remark-emoji` - konwersja emotikon `:smile:` → 😄
- `rehype-slug` - automatyczne `id` na nagłówkach
- `rehype-autolink-headings` - anchor linki przy nagłówkach
- `rehype-highlight` - podświetlanie składni kodu

Customowe MDX komponenty: `h2`, `h3`, `h4`, `ul`, `ol`, `code`, `pre` (→ `CodeBlock`), `blockquote`, `img`, `a`.

---

## Routing (App Router)

| URL | Plik | Opis |
|-----|------|------|
| `/` | `app/page.tsx` | Strona główna |
| `/blog` | `app/blog/page.tsx` | Lista artykułów |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Artykuł (SSG) |
| `/blog/tag/[tag]` | `app/blog/tag/[tag]/page.tsx` | Posty po tagu |
| `/blog/kategoria` | `app/blog/kategoria/page.tsx` | Placeholder |

---

## SEO i metadane

- **Metadata API** — title template, OpenGraph, Twitter Card
- **JSON-LD** — schema `Article` na każdym artykule
- **sitemap.xml** — generowany dynamicznie (`app/sitemap.ts`)
- **robots.txt** — generowany przez Next.js API (`app/robots.ts`)
- **metadataBase** — `https://zeprzalka.com` (hardcoded)

### Security headers (next.config.ts)

```
X-DNS-Prefetch-Control: on
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Motywy (Dark / Light)

Obsługa via `next-themes`. Default: dark. Kolory w OKLCH w `globals.css`:

```css
:root { --background: oklch(1 0 0); }
.dark { --background: oklch(0.145 0 0); }
```

Toggle w `Header.tsx` (komponent `Toggle.tsx` — client component).

---

## Komponenty client-side (`"use client"`)

| Komponent | Powód |
|-----------|-------|
| `Bar.tsx` | `window.addEventListener("scroll", ...)` |
| `Logo.tsx` | `setInterval` — animacja symbolu |
| `Toggle.tsx` | Interakcja z next-themes |
| `GalleryB.tsx` | `useState(hoveredId)` |
| `CodeBlock.tsx` | `clipboard API`, `useState` |
| `ActiveTOC.tsx` | `IntersectionObserver` |
| `Full.tsx` | `window.innerWidth`, `useMemo` |

---

## Zawartość bloga

- **24 artykuły MDX** — React, Next.js, Tailwind, TypeScript, AI, Markerkit, WordPress, CSS, HTML
- **5 szkiców** — pliki `.txt` w `content/drafts/` (framer, gra-2067, claude-code, aplikacja-lotto, 2037)
- Szkice są w formacie `.txt` — nie są parsowane jako MDX

---

## Znane ograniczenia

1. Formularz kontaktu (`ContactB.tsx`) nie posiada backendu — submit nie wysyła danych
2. Strona `/blog/kategoria` to placeholder — kategorie niefiltrowane
3. `metadataBase` i URL w `sitemap.ts`/`robots.ts` są hardcoded (nie z `.env`)
4. `extractHeadings()` w `posts.ts` obsługuje tylko `##` (h2) — h3/h4 nie trafiają do TOC
5. Komponenty w `src/components/sections/` i `src/components/archive/` są nieużywane
