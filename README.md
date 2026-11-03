# zeprzalka.com

Strona osobista Michała Zeprzałki: portfolio, blog i kanał pozyskiwania klientów.
Next.js 16 (App Router) + MDX, wersja polska i angielska, deploy na Vercel.

**Dokumentacja:**

| Plik | Po co |
| --- | --- |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **lista rzeczy do zrobienia** z terminami i celami |
| [docs/DZIENNIK.md](docs/DZIENNIK.md) | dziennik iteracji: co zrobiono, jak sprawdzono, co otwarte |
| [docs/AUDYT-2026-11.md](docs/AUDYT-2026-11.md) | diagnoza serwisu: co jest dobre, co nie, decyzje do podjęcia |
| [docs/SEO.md](docs/SEO.md) | stan techniczny SEO, reguły treści, plan tematów |
| [docs/MONETYZACJA.md](docs/MONETYZACJA.md) | pozycjonowanie, oferta i ceny, lejek, pomiar, kanały |
| [docs/KIERUNEK-WIZUALNY.md](docs/KIERUNEK-WIZUALNY.md) | kierunek „Precyzja”, demo, plan prac UX/UI, narzędzia |
| [docs/DWUJEZYCZNOSC.md](docs/DWUJEZYCZNOSC.md) | gdzie mieszkają teksty PL/EN, jak dodać stronę lub wpis |
| [AGENTS.md](AGENTS.md) | zasady pracy w repozytorium dla agentów AI (i ludzi) |
| `docs/prywatne/` | tylko lokalnie (w `.gitignore`): bezpieczeństwo konta, pełne raporty audytu |

---

## Stack

| Warstwa | Technologia |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), wszystkie strony statyczne |
| Runtime | React 19.3, Node.js 24 (`.nvmrc`, `engines`); Vercel: region fra1, Fluid Compute |
| Język | TypeScript (strict) |
| CSS / UI | Tailwind CSS 4, shadcn/ui + Radix (`radix-ui`), Prettier z sortowaniem klas |
| Blog | MDX (`next-mdx-remote`), gray-matter, frontmatter walidowany przez zod |
| Markdown | remark-gfm, remark-emoji, rehype-slug, rehype-autolink-headings, rehype-highlight |
| Formularz | Server Action + nodemailer 10 (SMTP) + zod |
| Analityka | Vercel Analytics + Speed Insights (bez ciasteczek) |
| Wersje językowe | polska (`/`) i angielska (`/en`), bez bibliotek i18n — pary tekstów wymuszane typami |
| Menedżer pakietów | pnpm 10 (`packageManager` w `package.json`, build na Vercelu przez `vercel.json`) |

## Polecenia

```bash
pnpm install
pnpm dev              # serwer deweloperski
pnpm build            # build produkcyjny (sprawdza też typy)
pnpm start            # serwer produkcyjny
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm check:content    # reguły treści bloga (frontmatter, pary PL↔EN, obrazy, długości, slugi)
pnpm format           # Prettier (format:check — tylko sprawdzenie)
pnpm check            # treść + formatowanie + lint + build — przed każdym commitem
pnpm visual <bazowy> <zmiana>   # porównanie pikseli / i /en (strażnik strony głównej)
```

## Jak publikować (ważne)

**Push na `main` od razu wdraża produkcję** (integracja Vercel ↔ GitHub). Dlatego:

1. `git switch -c moja-zmiana`, praca, `pnpm check`.
2. `git push -u origin moja-zmiana` → Vercel buduje podgląd, GitHub Actions uruchamia CI
   i strażnika strony głównej (porównanie pikseli z `main`).
3. Sprawdzasz podgląd → `git switch main && git merge --ff-only moja-zmiana && git push`.

Nowy wpis: `content/posts/<slug>.mdx` (+ wersja EN i para w `src/i18n/blog-map.ts`,
szczegóły w docs/DWUJEZYCZNOSC.md) → `pnpm check:content` → jak wyżej.

### Zmienne środowiskowe (`.env.local` / Vercel)

Wzór z opisem każdej zmiennej: `.env.example`.

```
NEXT_PUBLIC_SITE_URL=https://www.zeprzalka.com  # opcjonalnie; domyślna wartość jest poprawna
NEXT_PUBLIC_LINKEDIN_URL=...   # profil trafia do stopki i danych strukturalnych (sameAs)
GOOGLE_SITE_VERIFICATION=...   # sam token, bez <meta> (albo weryfikacja przez DNS)
BING_SITE_VERIFICATION=...

SMTP_HOST=...                  # formularz kontaktowy — tylko środowisko Production
SMTP_PORT=465
SMTP_SECURE=true               # false dla 587 (wtedy wymuszany STARTTLS)
SMTP_USER=...
SMTP_PASS=...
CONTACT_EMAIL=...              # opcjonalnie; domyślnie m@zeprzalka.com
```

Bez kompletu `SMTP_*` formularz nie wysyła i prosi o kontakt mailowy (nie wywraca się).
Lokalne testy formularza bez wysyłki: `SMTP_HOST= pnpm start`.

## Struktura

```
src/
├── app/
│   ├── (pl)/                    # wersja polska (katalog główny adresu), własny układ główny
│   │   ├── page.tsx             # strona główna
│   │   ├── uslugi/ o-mnie/ kontakt/ portfolio/ polityka-prywatnosci/
│   │   ├── blog/                # indeks, [slug], strona/[n], kategoria/, tag/ (cienkie re-eksporty)
│   │   ├── design-system/       # żywy katalog obecnego języka wizualnego (noindex)
│   │   └── **/opengraph-image.tsx  # karty 1200×630 — jednolinijkowce nad src/lib/og.tsx
│   ├── en/                      # wersja angielska — lustro (pl) z angielskimi adresami
│   ├── demo/                    # PIASKOWNICA: trasy *.demo.tsx, tylko poza produkcją
│   ├── actions/contact.ts       # Server Action formularza
│   ├── global-not-found.tsx     # 404 dla nieznanych adresów
│   ├── sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
├── routes/blog.tsx              # fabryki tras bloga (wpis, taksonomia, archiwum) dla obu języków
├── components/
│   ├── views/                   # widoki stron — jeden na stronę, wspólny dla obu języków
│   ├── home/                    # sekcje strony głównej (wygląd nietykalny), HomeSection
│   ├── layout/                  # RootShell, Header, Footer, MobileNav(+Panel), Logo(+Glyph), ReadingProgress
│   ├── blog/                    # PostCard, ActiveTOC, CodeBlock, PostCta, YouTubeEmbed, highlight.css
│   ├── portfolio/               # PortfolioCard, PortfolioGrid
│   ├── design-system/           # sekcje katalogu /design-system
│   ├── demo/                    # PIASKOWNICA: dawne warianty i demo „Precyzja” (README w środku)
│   ├── ui/                      # shadcn/ui (9 komponentów, wszystkie w użyciu)
│   ├── ContactForm.tsx CtaPanel.tsx StatusBadge.tsx ThemeToggle.tsx JsonLd.tsx PageHeader.tsx
├── i18n/
│   ├── config.ts                # ROUTES, PATH_BASES, Localized<T>, INTL_LOCALE, hreflang
│   ├── format.ts                # fill, plural (Intl.PluralRules), daty, liczby, czas lektury
│   ├── navigation.ts            # jedna lista menu (nagłówek, stopka, menu mobilne)
│   ├── content/                 # teksty: common, home, pages, meta, legal, system (pl + en)
│   ├── blog-map.ts              # pary wpisów, kategorii i tagów PL↔EN
│   ├── metadata.ts              # metadane i viewport układów głównych
│   └── page-metadata.ts         # buildMetadata — metadane każdej strony
├── lib/
│   ├── posts.ts                 # odczyt i walidacja MDX, indeks kategorii/tagów, powiązane
│   ├── blog-pages.ts            # paginacja archiwum bloga
│   ├── og.tsx                   # karty Open Graph: wygląd + fabryki
│   ├── schema.ts                # dane strukturalne (Person z @id i reszta)
│   ├── site.ts                  # adres, autor, e-mail, profile
│   ├── services.ts portfolio.ts # dane oferty i realizacji (pary PL/EN)
│   ├── feed.ts rate-limit.ts escape.ts slug.ts utils.ts
├── hooks/use-reduced-motion.ts  # useReducedMotion, useReducedMotionVideo
content/
├── posts/*.mdx  en/posts/*.mdx  # wpisy
└── drafts/*.txt                 # robocze notatki (nieparsowane)
scripts/check-content.mjs        # pnpm check:content
scripts/visual-diff.mjs          # pnpm visual — strażnik strony głównej
.github/workflows/ci.yml         # CI: treść, formatowanie, typy, lint, build, audyt
.github/workflows/visual.yml     # porównanie pikseli / i /en z main
vercel.json                      # build przez pnpm z lockfile'a, region fra1, Fluid Compute
AGENTS.md CLAUDE.md              # zasady dla agentów AI
```

## Blog — frontmatter

```yaml
---
title: "Tytuł (≤ 60 znaków)"
description: "Opis meta, 120–160 znaków"
date: "2026-11-02"            # zawsze YYYY-MM-DD
updated: "2026-12-01"         # opcjonalnie — po istotnej aktualizacji
categories: ["AI"]            # maks. 2, z listy w src/i18n/blog-map.ts
tags: ["Next.js", "React"]    # 3–5, z listy w src/i18n/blog-map.ts
image: "/blog/okladka.webp"   # WebP, min. 1200 px szerokości
imageCaption: "Opcjonalny podpis"
featured: false               # true tylko dla 2–4 wpisów filarowych
draft: false                  # true = tylko w pnpm dev
---
```

Błędny typ pola albo data w złym formacie zatrzymuje build z nazwą pliku.
Reguły SEO (długości, liczba kategorii) sprawdza `pnpm check:content`.

## Zasady, których pilnujemy

- **Wygląd strony głównej jest nietykalny bez zgody właściciela.** Nowy wygląd rodzi
  się w piaskownicy `/demo`, potem w `/design-system`. Refaktor pliku używanego przez
  stronę główną wymaga `pnpm visual` z wynikiem 0 px (CI robi to samo względem `main`).
- **Piaskownica `/demo` nie dotyka serwisu:** serwis z niej nie importuje (ESLint),
  jej klasy nie trafiają do CSS serwisu (`@source not`), a trasy `*.demo.tsx` istnieją
  tylko poza produkcją (`pageExtensions` w `next.config.ts`). Opis: `src/components/demo/README.md`.
- **Żaden tekst nie istnieje tylko w jednym języku** — pilnuje tego kompilator
  (docs/DWUJEZYCZNOSC.md).
- **Ścieżki `fs` w `src/lib/posts.ts`** składamy jako `path.join(process.cwd(), "content", …)`
  — gotowa zmienna ze ścieżką psuje śledzenie plików w Turbopacku i wrzuca całe
  `public/` (dziesiątki MB wideo) do paczki serwerowej.
- **Wszystkie strony statyczne.** Trasy z segmentem mają `generateStaticParams`
  i `dynamicParams = false` (literał w pliku trasy — Next czyta go statycznie);
  nie czytamy `searchParams` w stronach publicznych.
- **Komponenty klienckie nie importują modułów treści** — teksty dostają w propsach
  (inaczej do przeglądarki trafiają oba języki całego pliku).

### Kontrola wizualna (porównanie zrzutów)

`pnpm visual <bazowy> <zmiana>` (scripts/visual-diff.mjs): Playwright + pixelmatch,
zrzuty pełnych stron w 1440 i 390 px z `reducedMotion: "reduce"` i wideo
zatrzymanym na klatce 0 — szum między dwoma przebiegami tej samej wersji wynosi
0,000%, więc każda różnica jest prawdziwa. Lokalnie: zbuduj stan wyjściowy
(np. `git worktree add ../base main`) i zmianę, uruchom na dwóch portach,
`CHROME_PATH=… pnpm visual http://localhost:3200 http://localhost:3100`
(`--all` dokłada podstrony). Wyjątek: `/portfolio` (leniwe wideo).

## Bezpieczeństwo (zaimplementowane)

- Nagłówki: HSTS, CSP oparta na źródłach (bez obcych domen w `script-src`),
  `frame-ancestors 'none'`, COOP, `strict-origin-when-cross-origin`, pełna
  Permissions-Policy, `nosniff` (`next.config.ts`); `/.well-known/security.txt`.
- Formularz: walidacja zod (serwer) + HTML (przeglądarka), escapowanie HTML w mailu,
  ochrona nagłówków przed CRLF, honeypot, limit zgłoszeń, timeouty SMTP, limit
  rozmiaru żądania 64 kB.
- YouTube jako fasada „kliknij, by wczytać” z domeny youtube-nocookie.
- Zależności: `pnpm audit --prod` = 0 (CI przerywa przy podatności wysokiej).
