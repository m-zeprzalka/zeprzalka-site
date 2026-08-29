# zeprzalka.com

Strona osobista: portfolio, blog techniczny i kanał pozyskiwania klientów.
Next.js 16 (App Router) + MDX, deploy na Vercel.

**Dokumentacja projektu:**

- [docs/ROADMAP.md](docs/ROADMAP.md) — ścieżka do wersji produkcyjnej krok po kroku
- [docs/SEO.md](docs/SEO.md) — strategia SEO (stan techniczny + plan treści)
- [docs/MONETYZACJA.md](docs/MONETYZACJA.md) — jak zarabiać na serwisie
- [docs/DWUJEZYCZNOSC.md](docs/DWUJEZYCZNOSC.md) — wersja polska i angielska: gdzie mieszkają teksty

---

## Stack

| Warstwa             | Technologia                                       |
| ------------------- | ------------------------------------------------- |
| Framework           | Next.js 16 (App Router, Turbopack)                |
| Runtime             | React 19                                          |
| Język               | TypeScript (strict)                               |
| CSS                 | Tailwind CSS 4                                    |
| UI                  | shadcn/ui + Radix UI                              |
| Treść bloga         | MDX (`next-mdx-remote`) + gray-matter             |
| Markdown pipeline   | remark-gfm, remark-emoji, rehype-slug/-highlight  |
| Motywy              | next-themes (dark/light)                          |
| E-mail (formularz)  | nodemailer (SMTP) + zod (walidacja)               |
| Wersje językowe     | polska (`/`) i angielska (`/en`), bez bibliotek i18n |

## Uruchomienie

```bash
pnpm install
pnpm dev        # dev server (Turbopack)
pnpm build      # build produkcyjny
pnpm start      # serwer produkcyjny
pnpm lint       # ESLint
```

### Zmienne środowiskowe (`.env.local` / Vercel)

```
NEXT_PUBLIC_SITE_URL=https://zeprzalka.com   # kanoniczny adres serwisu (bez / na końcu)

SMTP_HOST=...        # serwer SMTP formularza kontaktowego
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=...
SMTP_PASS=...
CONTACT_EMAIL=...    # opcjonalnie; domyślnie m@zeprzalka.com
```

Bez kompletu `SMTP_*` formularz zwraca użytkownikowi komunikat z prośbą
o kontakt mailowy (nie wysyła i nie crashuje).

## Struktura

```
src/
├── app/
│   ├── layout.tsx               # metadane globalne, fonty, motyw
│   ├── page.tsx                 # strona główna + JSON-LD (WebSite, Person)
│   ├── o-mnie/                  # CV + JSON-LD (ProfilePage)
│   ├── kontakt/                 # strona kontaktu (współdzielony ContactForm)
│   ├── actions/contact.ts       # Server Action — wysyłka maila (SMTP)
│   ├── blog/
│   │   ├── page.tsx             # lista wpisów (paginacja ?page=)
│   │   ├── [slug]/page.tsx      # artykuł (SSG) + JSON-LD (BlogPosting, Breadcrumb)
│   │   ├── tag/[tag]/           # wpisy po tagu
│   │   └── kategoria/           # indeks kategorii + wpisy po kategorii
│   ├── feed.xml/route.ts        # kanał RSS (statyczny)
│   ├── sitemap.ts               # sitemap.xml (strony, wpisy, kategorie)
│   └── robots.ts                # robots.txt
├── components/
│   ├── home/                    # sekcje strony głównej (Hero, Skills, Gallery…)
│   ├── layout/                  # Header, Footer, MobileNav, Logo, Bar
│   ├── blog/                    # CodeBlock, ActiveTOC, YouTubeEmbed
│   ├── ui/                      # shadcn/ui
│   └── ContactForm.tsx          # wspólny formularz (strona główna + /kontakt)
├── lib/posts.ts                 # odczyt MDX: getAllPosts, slugify, kategorie/tagi
└── hooks/use-mobile.ts

content/
├── posts/*.mdx                  # opublikowane wpisy (frontmatter niżej)
└── drafts/*.txt                 # szkice (nieparsowane)
```

## Blog — frontmatter wpisu

```yaml
---
title: "Tytuł artykułu"
description: "Opis (meta description — ~150 znaków)"
date: "2026-01-01"            # zawsze YYYY-MM-DD
categories: ["Next.js"]
tags: ["nextjs", "tutorial"]  # max 3–5, patrz docs/SEO.md
image: "/blog/obrazek.jpg"
imageCaption: "Opcjonalny podpis"
featured: true                # wyróżnienie na /blog
author:
  name: "Michał Zeprzałka"
  title: "Digital Solutions Architect"
  bio: "…"
  avatar: "/avatar.png"
---
```

## Bezpieczeństwo i SEO (zaimplementowane)

- Nagłówki: HSTS, X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy, częściowe CSP (`next.config.ts`)
- Formularz: walidacja zod (limity długości), escapowanie HTML w mailu,
  ochrona przed header injection, honeypot antyspamowy, obsługa błędów SMTP
- SEO: canonicale na wszystkich podstronach, sitemap.xml, robots.txt,
  RSS (`/feed.xml`), JSON-LD (WebSite, Person, ProfilePage, BlogPosting,
  BreadcrumbList), OG/Twitter cards, `metadataBase` z `NEXT_PUBLIC_SITE_URL`
- Cache: wideo portfolio serwowane z `Cache-Control: immutable`
