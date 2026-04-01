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
| Email | nodemailer | latest |

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
│   │   ├── actions/
│   │   │   └── contact.ts            # Server Action — wysyłanie e-mail (nodemailer)
│   │   └── blog/
│   │       ├── page.tsx              # Lista artykułów z paginacją
│   │       ├── [slug]/page.tsx       # Pojedynczy artykuł (SSG)
│   │       ├── tag/[tag]/page.tsx    # Filtrowanie po tagach
│   │       └── kategoria/
│   │           ├── page.tsx          # Lista wszystkich kategorii
│   │           └── [kategoria]/page.tsx  # Artykuły po kategorii
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navbar z logo i przełącznikiem motywu
│   │   │   ├── Footer.tsx            # Stopka z nawigacją i social linkami
│   │   │   ├── Bar.tsx               # Progress bar przewijania (client)
│   │   │   └── Logo.tsx              # Animowane logo z losowym symbolem (client)
│   │   │
│   │   ├── alternative/              # Aktywne komponenty sekcji (wersje B/C)
│   │   │   ├── HeroB.tsx             # Hero z video i CTA
│   │   │   ├── SkillsB.tsx           # Umiejętności jako accordion
│   │   │   ├── GalleryB.tsx          # Portfolio (masonry, lazy video)
│   │   │   ├── ContactB.tsx          # Formularz kontaktowy (z SMTP backend)
│   │   │   └── BlogC.tsx             # Podgląd bloga (dynamiczny, używany)
│   │   │
│   │   ├── blog/
│   │   │   ├── CodeBlock.tsx         # Blok kodu z przyciskiem kopiowania (client)
│   │   │   ├── ActiveTOC.tsx         # Aktywna nawigacja po nagłówkach h2/h3/h4 (client)
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
├── .env.local                        # Zmienne środowiskowe (SITE_URL, SMTP)
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

### Zmienne środowiskowe (.env.local)

```
NEXT_PUBLIC_SITE_URL=https://zeprzalka.com

SMTP_HOST=smtp-sh188996.super-host.pl
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=twoj@email.pl
SMTP_PASS=haslo
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
| `/blog` | `app/blog/page.tsx` | Lista artykułów (paginacja co 12) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Artykuł (SSG) |
| `/blog/tag/[tag]` | `app/blog/tag/[tag]/page.tsx` | Posty po tagu |
| `/blog/kategoria` | `app/blog/kategoria/page.tsx` | Lista kategorii |
| `/blog/kategoria/[kategoria]` | `app/blog/kategoria/[kategoria]/page.tsx` | Posty po kategorii |

---

## SEO i metadane

- **Metadata API** — title template `%s | Michał Zeprzałka` używany konsekwentnie
- **JSON-LD** — schema `BlogPosting` na każdym artykule (z `dateModified`, `mainEntityOfPage`)
- **sitemap.xml** — generowany dynamicznie (`app/sitemap.ts`)
- **robots.txt** — generowany przez Next.js API (`app/robots.ts`)
- **metadataBase** — z `NEXT_PUBLIC_SITE_URL` (fallback: `http://localhost:3000`)

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
| `GalleryB.tsx` | `IntersectionObserver` — lazy loading video |
| `CodeBlock.tsx` | `clipboard API`, `useState` |
| `ActiveTOC.tsx` | `IntersectionObserver` |
| `ContactB.tsx` | `useActionState` — formularz z Server Action |

---

## Zawartość bloga

- **24 artykuły MDX** — React, Next.js, Tailwind, TypeScript, AI, Markerkit, WordPress, CSS, HTML
- **5 szkiców** — pliki `.txt` w `content/drafts/` (framer, gra-2067, claude-code, aplikacja-lotto, 2037)
- Szkice są w formacie `.txt` — nie są parsowane jako MDX

---

## Formularz kontaktowy

Zaimplementowany jako React Server Action (`src/app/actions/contact.ts`):
- Wysyłka przez SMTP (nodemailer) na `m@zeprzalka.com`
- Walidacja po stronie serwera (wymagane pola, format e-mail)
- Konfiguracja przez zmienne środowiskowe `SMTP_*` w `.env.local`
