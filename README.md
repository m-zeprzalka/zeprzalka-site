# zeprzalka.com

Strona osobista Michała Zeprzałki: portfolio, blog i kanał pozyskiwania klientów.
Next.js 16 (App Router) + MDX, wersja polska i angielska, deploy na Vercel.

**Dokumentacja:**

| Plik | Po co |
| --- | --- |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **jedyna lista otwartych zadań** — zrobione wypadają do dziennika |
| [docs/DZIENNIK.md](docs/DZIENNIK.md) | co zrobiono w każdej iteracji i jak to sprawdzono |
| [docs/KIERUNEK-WIZUALNY.md](docs/KIERUNEK-WIZUALNY.md) | system „Forma”, trzy koncepcje strony głównej, plan nowego wyglądu |
| [AGENTS.md](AGENTS.md) | twarde zasady i pułapki dla agentów AI (i ludzi) |
| `docs/prywatne/` | tylko lokalnie (w `.gitignore`): `BEZPIECZENSTWO.md`, `MARKETING.md`, materiały referencyjne |

---

## Stack

| Warstwa | Technologia |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), wszystkie strony statyczne |
| Runtime | React 19.3, Node.js 24 (`.nvmrc`, `engines`); Vercel: region fra1, Fluid Compute |
| Język | TypeScript (strict) |
| CSS / UI | Tailwind CSS 4, shadcn/ui + Radix (`radix-ui`), Prettier z sortowaniem klas |
| Blog | MDX (`next-mdx-remote`), gray-matter, frontmatter walidowany przez zod |
| Markdown | remark-gfm, remark-emoji, rehype-slug, rehype-highlight; spis treści z tego samego drzewa (`src/lib/mdx.ts`) |
| Formularz | Server Action + zod; wysyłka przez API Resend (przejściowo SMTP, nodemailer 10) — `src/lib/mail.ts` |
| Analityka | Vercel Analytics + Speed Insights (bez ciasteczek) |
| Wersje językowe | polska (`/`) i angielska (`/en`), bez bibliotek i18n — pary tekstów wymuszane typami |
| Menedżer pakietów | pnpm 10 (`packageManager` w `package.json`, build na Vercelu przez `vercel.json`) |
| Piaskownica `/demo` | Motion 14 i Number Flow — tylko `devDependencies`, import poza `/demo` blokuje ESLint |

## Polecenia

```bash
pnpm install
pnpm dev              # serwer deweloperski
pnpm build            # build produkcyjny (sprawdza też typy)
pnpm start            # serwer produkcyjny
pnpm lint             # ESLint
pnpm typecheck        # next typegen + tsc --noEmit (typy tras generowane przez Next)
pnpm check:content    # reguły treści bloga (frontmatter, pary PL↔EN, obrazy, długości, slugi)
pnpm format           # Prettier (format:check — tylko sprawdzenie)
pnpm check            # treść + formatowanie + lint + build + check:build — przed każdym commitem
pnpm check:build      # kontrola gotowego HTML: karty OG, kotwice spisu treści, lang, canonical,
                      # robots, JSON-LD; z --production także brak tras /demo
pnpm visual <bazowy> <zmiana>   # porównanie pikseli / i /en (strażnik strony głównej)
pnpm cv [adres]       # CV w PDF (PL i EN) ze stron „O mnie” działającego serwisu
```

## Jak publikować (ważne)

Pracujemy na jednej gałęzi, `main`. **Push na `main` od razu wdraża produkcję**
(integracja Vercel ↔ GitHub), więc przed pushem:

1. `pnpm check` lokalnie (treść, formatowanie, lint, build, kontrola HTML).
2. Zmiana pliku używanego przez stronę główną → `pnpm visual` (niżej) albo ręczny
   workflow „Strona główna — porównanie pikseli” w GitHub Actions.
3. `git push` → Vercel wdraża, GitHub Actions powtarza `pnpm check` (+ audyt zależności).

Większy eksperyment (np. nowy wygląd) rodzi się w piaskownicy `/demo`. Domyślnie nie ma
jej na produkcji; na czas prac nad wyglądem Vercel ma `DEMO_PUBLIC=1`, więc dema są pod
zeprzalka.com/demo (`noindex`, poza mapą strony). Nowy wpis: sekcja „Dwujęzyczność” niżej.

### Zmienne środowiskowe (`.env.local` / Vercel)

Wzór z opisem każdej zmiennej: `.env.example`.

```
NEXT_PUBLIC_SITE_URL=https://www.zeprzalka.com  # opcjonalnie; domyślna wartość jest poprawna
NEXT_PUBLIC_LINKEDIN_URL=...   # profil trafia do stopki i danych strukturalnych (sameAs)
GOOGLE_SITE_VERIFICATION=...   # sam token, bez <meta> (albo weryfikacja przez DNS)
BING_SITE_VERIFICATION=...

RESEND_API_KEY=...             # formularz — tylko Production, Sensitive; ma pierwszeństwo przed SMTP
SMTP_HOST=...                  # przejściowo, dopóki nie ma klucza Resend
SMTP_PORT=465
SMTP_SECURE=true               # false dla 587 (wtedy wymuszany STARTTLS)
SMTP_USER=...
SMTP_PASS=...
CONTACT_RECIPIENT=...          # opcjonalnie; domyślnie adres kontaktowy z src/lib/site.ts
```

Bez klucza Resend i bez kompletu `SMTP_*` formularz nie wysyła i prosi o kontakt mailowy
(nie wywraca się). Lokalne testy bez wysyłki: `RESEND_API_KEY= SMTP_HOST= pnpm start`.

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
│   ├── actions/contact.ts       # Server Action formularza (wysyłka: src/lib/mail.ts)
│   ├── fonts.ts                 # Geist i Geist Mono — wspólne dla układów, global-error i /demo
│   ├── global-not-found.tsx     # 404 dla nieznanych adresów; global-error.tsx — błąd w układzie
│   ├── sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
├── routes/blog.tsx              # fabryki tras bloga (wpis, taksonomia, archiwum) dla obu języków
├── routes/params.ts             # parametry tras — wspólne dla stron i ich kart OG
├── components/
│   ├── views/                   # widoki stron — jeden na stronę, wspólny dla obu języków
│   ├── home/                    # sekcje strony głównej (wygląd nietykalny), HomeSection
│   ├── layout/                  # RootShell, Header, NavLink, Footer, MobileNav(+Panel), Logo(+Glyph), ReadingProgress (CSS)
│   ├── blog/                    # PostCard/PostGrid, TermLink, mdx-components, ActiveTOC, CodeBlock, PostCta, YouTubeEmbed
│   ├── portfolio/               # PortfolioCard (serwer), LazyVideo (klient), PortfolioGrid
│   ├── design-system/           # sekcje katalogu /design-system
│   ├── demo/                    # PIASKOWNICA: system „Forma” i trzy koncepcje (README w środku)
│   ├── system/                  # ErrorView (+ LazyErrorView), NotFoundView
│   ├── ui/                      # shadcn/ui (10 komponentów, wszystkie w użyciu)
│   ├── ContactForm.tsx CtaPanel.tsx StatusBadge.tsx ThemeToggle.tsx JsonLd.tsx PageHeader.tsx
├── i18n/
│   ├── config.ts                # ROUTES, PATH_BASES, FEEDS, Localized<T>, INTL_LOCALE
│   ├── alternates.ts            # „ta sama strona w drugim języku”: hreflang, mapa strony, przełącznik
│   ├── format.ts                # fill, plural (Intl.PluralRules), daty, liczby, czas lektury
│   ├── navigation.ts            # jedna lista menu (nagłówek, stopka, menu mobilne)
│   ├── content/                 # teksty: common, home, pages, meta, legal, system (pl + en)
│   ├── blog-map.ts              # pary wpisów, kategorii i tagów PL↔EN
│   ├── metadata.ts              # metadane i viewport układów głównych
│   └── page-metadata.ts         # buildMetadata — metadane każdej strony
├── lib/
│   ├── posts.ts                 # odczyt i walidacja MDX, indeks kategorii/tagów, powiązane, latestUpdate
│   ├── mdx.ts                   # kompilacja wpisu + spis treści z drzewa hast
│   ├── blog-pages.ts            # paginacja archiwum bloga
│   ├── og.tsx                   # karty Open Graph: wygląd + fabryki
│   ├── schema.ts                # dane strukturalne (Person z @id i reszta)
│   ├── site.ts                  # adres, autor, e-mail, profile
│   ├── services.ts portfolio.ts # dane oferty i realizacji (pary PL/EN)
│   ├── mail.ts                  # wysyłka wiadomości z formularza (Resend, przejściowo SMTP)
│   ├── feed.ts rate-limit.ts escape.ts slug.ts utils.ts
├── hooks/                       # use-reduced-motion (useReducedMotion, useReducedMotionVideo), use-in-view
content/
├── posts/*.mdx  en/posts/*.mdx  # wpisy
└── drafts/*.txt                 # robocze notatki (nieparsowane)
scripts/check-content.mjs        # pnpm check:content
scripts/check-build.mjs          # pnpm check:build — kontrola wyniku buildu
scripts/visual-diff.mjs          # pnpm visual — strażnik strony głównej
scripts/cv-pdf.mjs               # pnpm cv — CV w PDF z „O mnie”
.github/workflows/ci.yml         # CI: audyt, treść, formatowanie, typy, lint, build, check:build
.github/workflows/visual.yml     # porównanie pikseli / i /en — uruchamiane ręcznie
.github/dependabot.yml           # aktualizacje miesięczne, zgrupowane; bezpieczeństwo od razu
vercel.json                      # build przez pnpm z lockfile'a, region fra1, Fluid Compute
AGENTS.md CLAUDE.md              # zasady dla agentów AI
```

## Dwujęzyczność

Polska wersja w katalogu głównym (adresy zaindeksowane przed `/en` nie zmieniły się),
angielska pod `/en`. Dwa niezależne układy główne (`(pl)/layout.tsx`, `en/layout.tsx`),
bo `lang` na `<html>` ustawia tylko układ główny; wspólną treść trzyma `RootShell`.
Nieznany adres obsługuje `global-not-found.tsx` (flaga `experimental.globalNotFound`).

| Strona | Polski | Angielski |
| --- | --- | --- |
| Start · Usługi · O mnie | `/` · `/uslugi` · `/o-mnie` | `/en` · `/en/services` · `/en/about` |
| Kontakt · Portfolio · Prywatność | `/kontakt` · `/portfolio` · `/polityka-prywatnosci` | `/en/contact` · `/en/portfolio` · `/en/privacy` |
| Blog · archiwum · kategorie · tag | `/blog` · `/blog/strona/2` · `/blog/kategoria` · `/blog/tag/<tag>` | `/en/blog` · `/en/blog/page/2` · `/en/blog/category` · `/en/blog/tag/<tag>` |
| RSS | `/feed.xml` | `/en/feed.xml` |

Mapa adresów: `ROUTES`, `PATH_BASES`, `FEEDS` w `src/i18n/config.ts`. „Ta sama strona
w drugim języku” (hreflang z `x-default` → PL, mapa strony, przełącznik) — wyłącznie
`src/i18n/alternates.ts`.

**Teksty.** Copy stron: lustrzane drzewa `pl`/`en` w `src/i18n/content/*` (`common`,
`home`, `pages`, `meta`, `legal`, `system`), gdzie `en: typeof pl` — brak klucza zatrzymuje
build. Teksty będące danymi: pary `Localized<T>` przy deklaracji (`src/lib/portfolio.ts`,
`services.ts`, `site.ts`). Formatowanie (liczebniki przez `Intl.PluralRules`, daty, czas
lektury, `{klucz}`): `src/i18n/format.ts`. Komponenty klienckie dostają teksty w propsach.

**Nowa strona:** para w `ROUTES` → copy w `pages.ts` i metadane w `meta.ts` → jeden widok
w `src/components/views/` z `locale` → dwa cienkie pliki trasy (`(pl)/…/page.tsx`,
`en/…/page.tsx`) z `buildMetadata` (`src/i18n/page-metadata.ts`) → `opengraph-image.tsx`
w segmencie (`pageOgImage(locale, "klucz")` z `src/lib/og.tsx`, teksty w `meta.ts` →
`og.cards`) → klucz w `STATIC_PAGES` (`src/app/sitemap.ts`) i ewentualnie `MAIN_NAV`.

**Nowy wpis:** `content/posts/<slug>.mdx` → wersja EN `content/en/posts/<slug-en>.mdx`
(własny slug) → para w `POST_SLUGS` (`src/i18n/blog-map.ts`), kategorie i tagi z par
`CATEGORY_LABELS`/`TAG_LABELS` → `pnpm check:content`. Wpis bez tłumaczenia działa,
tylko nie dostaje `alternate`.

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
Reguły SEO (długości, liczba kategorii) sprawdza `pnpm check:content`. Poza tym: nowy
tag dopiero, gdy obejmie min. 3 wpisy; bez emoji w nagłówkach H2/H3 (psują kotwice);
tytuły po polsku bez angielskiego Title Case, myślnik „ — ”; każdy wpis kończy `PostCta`
z linkiem do oferty (automatycznie, w szablonie).

## Zasady, których pilnujemy

- **Wygląd strony głównej jest nietykalny bez zgody właściciela.** Nowy wygląd rodzi
  się w piaskownicy `/demo`, potem w `/design-system`. Refaktor pliku używanego przez
  stronę główną wymaga `pnpm visual` z wynikiem 0 px.
- **Piaskownica `/demo` nie dotyka serwisu:** serwis z niej nie importuje (ESLint),
  jej klasy nie trafiają do CSS serwisu (`@source not`), a trasy `*.demo.tsx` istnieją
  tylko poza produkcją (`pageExtensions` w `next.config.ts`). Opis: `src/components/demo/README.md`.
- **Żaden tekst nie istnieje tylko w jednym języku** — pilnuje tego kompilator
  (sekcja „Dwujęzyczność”).
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
zrzuty pełnych stron w 1440 i 390 px z `reducedMotion: "reduce"`, porównanie bez progu
tolerancji (`threshold: 0`, z antyaliasingiem). Strona jest najpierw
przewijana jak przez czytelnika (leniwe kafle i obrazy się wczytują), a każde wideo
staje na pierwszej klatce z wczytanym obrazem — szum między dwoma przebiegami tej samej
wersji wynosi 0,000%, więc każda różnica jest prawdziwa. Lokalnie: zbuduj stan wyjściowy
(np. `git worktree add ../base main`) i zmianę, uruchom na dwóch portach,
`CHROME_PATH=… pnpm visual http://localhost:3200 http://localhost:3100`
(`--all` dokłada podstrony).

## Bezpieczeństwo (zaimplementowane)

- Nagłówki: HSTS, CSP oparta na źródłach (bez obcych domen w `script-src`),
  `frame-ancestors 'none'`, COOP, `strict-origin-when-cross-origin`, pełna
  Permissions-Policy, `nosniff` (`next.config.ts`); `/.well-known/security.txt`.
- Formularz: walidacja zod (serwer) + HTML (przeglądarka), escapowanie HTML w mailu,
  ochrona nagłówków przed CRLF, honeypot, limit zgłoszeń w pamięci i reguła WAF
  (5 wysyłek / 10 min / IP), timeouty wysyłki, limit rozmiaru żądania 64 kB; wysyłka
  kluczem Resend z uprawnieniem tylko do wysyłki (`src/lib/mail.ts`).
- YouTube jako fasada „kliknij, by wczytać” z domeny youtube-nocookie.
- Zależności: `pnpm audit --prod` = 0 (CI przerywa przy podatności wysokiej), Dependabot
  (alerty, poprawki bezpieczeństwa, aktualizacje miesięczne), akcje CI przypięte do SHA.
- Repozytorium: ruleset na `main` (bez force-push i usuwania), secret scanning + push protection.
- Vercel: sekrety formularza jako *Sensitive* i tylko w Production, region fra1, Fluid
  Compute, Skew Protection 12 h, Bot Protection. Otwarte punkty (konta, DNS poczty):
  `docs/prywatne/BEZPIECZENSTWO.md`.
