# 🚀 Zeprzalka.com - Professional Tech Blog & Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Private-red?style=flat)]()

Profesjonalny blog technologiczny i portfolio dla Digital Solutions Architecta. Zbudowany z naciskiem na performance, SEO i user experience.

**🌐 Live:** [zeprzalka.com](https://zeprzalka.com)  
**👤 Author:** Michał Zeprzałka - Digital Solutions Architect  
**📧 Contact:** m@zeprzalka.com

---

## 📋 Spis Treści

- [O Projekcie](#-o-projekcie)
- [Stack Technologiczny](#-stack-technologiczny)
- [Kluczowe Features](#-kluczowe-features)
- [Architektura](#-architektura)
- [Rozpoczęcie Pracy](#-rozpoczęcie-pracy)
- [Struktura Projektu](#-struktura-projektu)
- [Content Management](#-content-management-mdx)
- [Performance](#-performance--optymalizacja)
- [SEO](#-seo--metadane)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Rekomendacje](#-rekomendacje-optymalizacyjne)

---

## 🎯 O Projekcie

Blog technologiczny i portfolio prezentujące expertise w:

- **Web Development** (Next.js, React, TypeScript)
- **AI Integration** (Vercel AI SDK, LangChain)
- **Multimedia** (Video, Graphics, Animations)
- **Digital Strategy** (Architecture, Product Design)

### Cel Biznesowy

Platforma do:

- Demonstracji umiejętności technicznych
- Publikacji artykułów edukacyjnych (HTML, CSS, Bootstrap, AI)
- Budowania personal brand w branży IT
- Pozyskiwania klientów B2B

---

## 🛠️ Stack Technologiczny

### Core

- **Framework:** [Next.js 15.5.3](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript 5.0](https://www.typescriptlang.org/) (Strict Mode)
- **UI Library:** [React 19.1.0](https://react.dev/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) + PostCSS

### Content & Markdown

- **MDX:** [next-mdx-remote 5.0.0](https://github.com/hashicorp/next-mdx-remote) (Server Components)
- **Syntax Highlighting:** [rehype-highlight 7.0.2](https://github.com/rehypejs/rehype-highlight)
- **Markdown Plugins:**
  - `remark-gfm` - GitHub Flavored Markdown
  - `remark-emoji` - Emoji support
  - `rehype-slug` - Auto-generated heading IDs
  - `rehype-autolink-headings` - Heading anchors

### UI Components

- **Component Library:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons:** [Lucide React 0.544.0](https://lucide.dev/)
- **Animations:** [tw-animate-css 1.3.8](https://github.com/bentatum/tw-animate-css)
- **Toast Notifications:** [Sonner 2.0.7](https://sonner.emilkowal.ski/)

### Utilities

- **Frontmatter Parsing:** [gray-matter 4.0.3](https://github.com/jonschlinkert/gray-matter)
- **Reading Time:** [reading-time 1.5.0](https://github.com/ngryman/reading-time)
- **Slug Generation:** [github-slugger 2.0.0](https://github.com/Flet/github-slugger)
- **Themes:** [next-themes 0.4.6](https://github.com/pacocoursey/next-themes) (Dark/Light mode)

### Developer Tools

- **Linting:** ESLint 9 + `eslint-config-next`
- **Build:** Turbopack (Dev) / Webpack (Production)
- **Package Manager:** npm

---

## ✨ Kluczowe Features

### 🎨 Design & UX

- ✅ **Fully Responsive** - Mobile-first design
- ✅ **Dark/Light Mode** - System preference + manual toggle
- ✅ **Smooth Animations** - Framer-like transitions
- ✅ **Modern Typography** - Geist Sans + Geist Mono
- ✅ **Accessibility** - WCAG 2.1 AA compliant

### 📝 Blog System

- ✅ **MDX Support** - React components w artykułach
- ✅ **Syntax Highlighting** - GitHub Light/Dark themes
- ✅ **Code Copy Button** - One-click code copying
- ✅ **Active Table of Contents** - Auto-scroll tracking
- ✅ **Reading Time** - Automatic calculation
- ✅ **Categories & Tags** - Taxonomy system
- ✅ **Featured Posts** - Priority content display

### 🎯 SEO & Performance

- ✅ **Static Generation** - Pre-rendered at build time
- ✅ **Optimized Images** - Next.js Image component
- ✅ **JSON-LD Schema** - Article, Person, Blog markup
- ✅ **Open Graph** - Social media previews
- ✅ **Meta Tags** - Comprehensive metadata
- ✅ **Breadcrumbs** - Navigation enhancement

### 🔧 Developer Experience

- ✅ **TypeScript** - Type safety
- ✅ **Hot Reload** - Turbopack fast refresh
- ✅ **Code Splitting** - Automatic optimization
- ✅ **Server Components** - Reduced JS bundle
- ✅ **Error Boundaries** - Graceful error handling

---

## 🏗️ Architektura

### App Router Structure

```
src/app/
├── layout.tsx           # Root layout (theme, fonts, providers)
├── page.tsx             # Homepage (Hero, Skills, Gallery, Blog, Contact)
├── globals.css          # Global styles (Tailwind, themes)
│
├── blog/
│   ├── page.tsx         # Blog index (featured + all posts)
│   ├── [slug]/
│   │   ├── page.tsx     # Dynamic blog post page
│   │   └── highlight.css # Syntax highlighting themes
│   └── tag/[tag]/
│       └── page.tsx     # Tag-filtered posts
```

### Components Architecture

```
src/components/
├── ui/                  # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   └── accordion.tsx
│
├── layout/              # Layout components
│   ├── Header.tsx       # Navigation + mobile menu
│   ├── Footer.tsx       # Footer links
│   └── Bar.tsx          # Scroll progress indicator
│
├── blog/                # Blog-specific
│   ├── ActiveTOC.tsx    # Table of Contents (client)
│   └── CodeBlock.tsx    # Code with copy button (client)
│
├── alternative/         # Page sections
│   ├── HeroB.tsx        # Hero section
│   ├── SkillsB.tsx      # Services accordion
│   ├── GalleryB.tsx     # Portfolio gallery
│   ├── BlogC.tsx        # Blog preview cards
│   └── ContactB.tsx     # Contact form
│
└── theme-provider.tsx   # Dark mode provider
```

### Data Flow

```
content/posts/*.mdx
      ↓
lib/posts.ts (Server)
      ↓
generateStaticParams()
      ↓
SSG (Build Time)
      ↓
Static HTML + JSON
```

---

## 🚀 Rozpoczęcie Pracy

### Wymagania

- **Node.js:** 20.x lub nowszy
- **npm:** 10.x lub nowszy

### Instalacja

```bash
# Klonowanie repo
git clone https://github.com/m-zeprzalka/zeprzalka-site.git
cd zeprzalka-site

# Instalacja zależności
npm install

# Uruchomienie dev servera (Turbopack)
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

### Komendy

```bash
# Development (z Turbopack)
npm run dev

# Build (production)
npm run build

# Start production server
npm start

# Linting
npm run lint
```

---

## 📁 Struktura Projektu

```
zeprzalka-last/
│
├── content/
│   └── posts/              # MDX blog posts
│       ├── html.mdx
│       ├── css.mdx
│       ├── bootstrap.mdx
│       └── twoja-pierwsza-strona.mdx
│
├── public/
│   ├── blog/               # Blog images
│   ├── hero_web.mp4        # Hero video
│   ├── avatar.png          # Author avatar
│   └── *.svg               # Icons
│
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   │   ├── posts.ts        # MDX post loading
│   │   └── utils.ts        # Helpers (cn)
│   └── sections/           # Legacy sections (do usunięcia)
│
├── next.config.ts          # Next.js config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
├── README.md               # Ten plik
└── RECOMMENDATIONS.md      # Raport optymalizacyjny
```

---

## 📝 Content Management (MDX)

### Tworzenie Nowego Artykułu

1. **Stwórz plik** `content/posts/moj-artykal.mdx`

2. **Dodaj frontmatter:**

```yaml
---
title: "Tytuł Artykułu"
description: "Krótki opis (160 znaków)"
date: "2025-11-07"
categories: ["Web Development", "Frontend"]
tags: ["Next.js", "React", "TypeScript"]
image: "/blog/moj-artykal.jpg"
imageCaption: "Opis obrazka"
featured: true
author:
  name: "zeprzalka.com"
  title: "Digital Solutions Architect"
  bio: "Tworzę rozwiązania łączące biznes z technologią."
avatar: "/avatar.png"
---
```

3. **Pisz treść w MDX:**

```mdx
## Nagłówek H2

Paragraf tekstu z **bold** i _italic_.

### Kod z podświetlaniem

\`\`\`typescript
const hello = (name: string) => {
console.log(`Hello, ${name}!`)
}
\`\`\`

### Lista

- Element 1
- Element 2

### Tabela

| Kolumna 1 | Kolumna 2 |
| --------- | --------- |
| Wartość A | Wartość B |
```

4. **Build** - Post pojawi się automatycznie na `/blog`

### Supported MDX Features

- ✅ GitHub Flavored Markdown (GFM)
- ✅ Tables
- ✅ Task lists
- ✅ Strikethrough
- ✅ Autolinks
- ✅ Emoji (`:rocket:` → 🚀)
- ✅ Syntax highlighting (50+ languages)
- ✅ Custom React components

---

## ⚡ Performance & Optymalizacja

### Zoptymalizowane Elementy

- ✅ Server Components (domyślnie)
- ✅ Code Splitting (automatyczny)
- ✅ Image Optimization (`next/image`)
- ✅ Font Optimization (Geist)
- ✅ CSS Purging (Tailwind)
- ✅ Gzip/Brotli compression

### Do Optymalizacji (patrz RECOMMENDATIONS.md)

- ⚠️ Video compression (`hero_web.mp4` - 6.1 MB!)
- ⚠️ Image conversion to WebP/AVIF
- ⚠️ Lazy loading for gallery videos
- ⚠️ Bundle size reduction (client components)

---

## 🔍 SEO & Metadane

### Implemented

- ✅ **Meta Tags:** Title, Description, Keywords
- ✅ **Open Graph:** og:title, og:description, og:image, og:type
- ✅ **Twitter Cards:** twitter:card, twitter:title, twitter:image
- ✅ **JSON-LD Schema:**
  - Article (blog posts)
  - Person (homepage)
  - Organization (footer)
- ✅ **Canonical URLs:** Per-page canonical
- ✅ **Breadcrumbs:** Navigation structure

### Missing (TODO)

- ❌ `sitemap.xml` (dynamiczny)
- ❌ `robots.txt`
- ❌ Structured data dla Blog listing
- ❌ Breadcrumb schema

### SEO Best Practices

```typescript
// Każdy post ma pełne metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = getPostBySlug(slug)

  return {
    title: `${post.frontmatter.title} | Zeprzalka.com`,
    description: post.frontmatter.description,
    openGraph: {
      /* ... */
    },
    twitter: {
      /* ... */
    },
  }
}
```

---

## 🚢 Deployment

### Recommended: Vercel (Zero-Config)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment Variables:**

```bash
NEXT_PUBLIC_SITE_URL=https://zeprzalka.com
```

### Alternative: Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

### Self-Hosted (VPS)

```bash
# Build
npm run build

# Start PM2
pm2 start npm --name "zeprzalka" -- start

# Nginx reverse proxy
server {
  listen 80;
  server_name zeprzalka.com;

  location / {
    proxy_pass http://localhost:3000;
  }
}
```

---

## 🗓️ Roadmap

### Phase 1: Performance (W TOKU)

- [ ] Kompresja video (`hero_web.mp4`)
- [ ] Konwersja obrazów (WebP/AVIF)
- [ ] Lazy loading dla gallery
- [ ] Bundle size optimization

### Phase 2: SEO (NASTĘPNY)

- [ ] `sitemap.xml` (dynamiczny)
- [ ] `robots.txt`
- [ ] Security headers
- [ ] Canonical URLs

### Phase 3: Features

- [ ] Search functionality (Pagefind)
- [ ] Comments (Giscus)
- [ ] Newsletter (Resend)
- [ ] Analytics (Vercel/Umami)

### Phase 4: Content

- [ ] 10+ artykułów technicznych
- [ ] Case studies (projekty)
- [ ] English version (i18n)

---

## 📊 Rekomendacje Optymalizacyjne

**Przeczytaj pełny raport:** [RECOMMENDATIONS.md](./RECOMMENDATIONS.md)

### Top 3 Priorytety

1. **Kompresja mediów** - Video 6MB → 500KB, obrazy do WebP
2. **SEO fundamenty** - sitemap.xml + robots.txt
3. **Security headers** - CSP, HSTS, X-Frame-Options

**Cel biznesowy:** Lighthouse 95+ = większe zaufanie klientów B2B

---

## 📞 Kontakt & Wsparcie

**Author:** Michał Zeprzałka  
**Email:** m@zeprzalka.com  
**Website:** [zeprzalka.com](https://zeprzalka.com)  
**GitHub:** [@m-zeprzalka](https://github.com/m-zeprzalka)  
**Facebook:** [michalzeprzalka](https://www.facebook.com/michalzeprzalka)

---

## 📄 Licencja

**Copyright © 2025 Michał Zeprzałka. All rights reserved.**

Ten projekt jest własnością prywatną i nie jest dostępny na licencji open-source.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Vercel](https://vercel.com/) - Deployment platform
- [MDX](https://mdxjs.com/) - Markdown for the component era

---

**Built with ❤️ and ☕ by Michał Zeprzałka**

_Last updated: November 7, 2025_
