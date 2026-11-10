# zeprzalka.com

Strona osobista Michała Zeprzałki: portfolio, blog i kanał pozyskiwania klientów.
Next.js 16 (App Router) + MDX, wersja polska i angielska, deploy na Vercel.

**Dokumentacja:**

| Plik | Po co |
| --- | --- |
| [docs/STRONA.md](docs/STRONA.md) | warstwa widoku: strony, gdzie co zmieniać, struktura, jak działa, ocena gotowości, przegląd kodu |
| [docs/ZASADY.md](docs/ZASADY.md) | **zasady wyglądu i kodu (normatywne)**: kryteria, decyzje z datami, pułapki |
| `/design-system` | żywy katalog systemu (tokeny, komponenty, ruch) — kod w `src/design-system/` |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **jedyna lista otwartych zadań** — zrobione wypadają do dziennika |
| [docs/DZIENNIK.md](docs/DZIENNIK.md) | co zrobiono w każdej iteracji i jak to sprawdzono |
| [docs/KIERUNEK-WIZUALNY.md](docs/KIERUNEK-WIZUALNY.md) | historia: system „Forma” i koncepcje z piaskownicy (iteracje 5–7) |
| [AGENTS.md](AGENTS.md) | twarde zasady i pułapki dla agentów AI (i ludzi) |
| `docs/prywatne/` | tylko lokalnie (w `.gitignore`): `BEZPIECZENSTWO.md`, `MARKETING.md`, materiały referencyjne |

---

## Stack

| Warstwa | Technologia |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), wszystkie strony statyczne |
| Runtime | React 19.3, Node.js 24 (`.nvmrc`, `engines`); Vercel: region fra1, Fluid Compute |
| Język | TypeScript (strict) |
| CSS / UI | Tailwind CSS 4, shadcn/ui + Radix (`radix-ui`), cmdk, vaul, next-themes; Prettier z sortowaniem klas |
| Blog | MDX (`next-mdx-remote`), gray-matter, frontmatter walidowany przez zod |
| Markdown | remark-gfm, remark-emoji, rehype-slug, rehype-highlight; spis treści z tego samego drzewa (`src/lib/mdx.ts`, `src/components/blog/render-article.ts`) |
| Formularz | Server Action + zod; wysyłka przez API Resend (przejściowo SMTP, nodemailer 10) — `src/lib/mail.ts` |
| Analityka | Vercel Analytics + Speed Insights (bez ciasteczek) |
| Wersje językowe | polska (`/`) i angielska (`/en`), bez bibliotek i18n — pary tekstów wymuszane typami |
| Menedżer pakietów | pnpm 10 (`packageManager` w `package.json`, build na Vercelu przez `vercel.json`) |
| Piaskownica `/demo` | Motion 14, Number Flow, GSAP 3.15 i OGL — tylko `devDependencies`, import poza `/demo` blokuje ESLint |

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
pnpm test             # testy jednostkowe (node --test, pliki *.test.ts obok kodu)
pnpm check:classes    # klasy Tailwinda w zapisie kanonicznym (--fix poprawia)
pnpm check            # treść + testy + klasy + formatowanie + lint + build + check:build — przed każdym commitem
pnpm check:build      # kontrola gotowego HTML: karty OG, kotwice, lang, canonical,
                      # robots, JSON-LD; z --production także brak tras /demo
pnpm visual <bazowy> <zmiana> [--all]   # porównanie pikseli dwóch wersji (/, /en, z --all podstrony)
pnpm cv [adres]       # CV w PDF (PL i EN) z wydruku stron „O mnie” działającego serwisu
```

## Jak publikować (ważne)

Pracujemy na jednej gałęzi, `main`. **Push na `main` od razu wdraża produkcję**
(integracja Vercel ↔ GitHub), więc przed pushem:

1. `pnpm check` lokalnie (treść, testy, klasy, formatowanie, lint, build, kontrola HTML).
2. Refaktor bez zmiany wyglądu → `pnpm visual` z wynikiem 0 px (niżej) albo ręczny workflow
   „porównanie pikseli” w GitHub Actions.
3. `git push` → Vercel wdraża, GitHub Actions powtarza `pnpm check` (+ audyt zależności).

Piaskownica `/demo` (dawne koncepcje — specyfikacja ruchu) domyślnie nie istnieje na
produkcji; Vercel ma `DEMO_PUBLIC=1`, więc dema są pod zeprzalka.com/demo (`noindex`, poza
mapą strony). Nowy wpis: sekcja „Dwujęzyczność” niżej.

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
│   │   ├── design-system/       # żywy katalog systemu (noindex)
│   │   └── **/opengraph-image.tsx  # karty 1200×630 — jednolinijkowce nad src/lib/og.tsx
│   ├── en/                      # wersja angielska — lustro (pl) z angielskimi adresami
│   ├── demo/                    # PIASKOWNICA: trasy *.demo.tsx, tylko przy DEMO_PUBLIC=1
│   ├── actions/contact.ts       # Server Action formularza (wysyłka: src/lib/mail.ts)
│   ├── globals.css              # arkusz serwisu: tokeny, siatka, stopnie pisma, ruch
│   ├── fonts.ts                 # Geist i Geist Mono — wspólne dla układów, global-error i /demo
│   ├── global-not-found.tsx     # 404 dla nieznanych adresów; global-error.tsx — błąd w układzie
│   ├── sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
├── components/                  # warstwa widoku (opis: docs/STRONA.md)
│   ├── views/                   # widoki stron — jeden na stronę, wspólny dla obu języków
│   ├── layout/ sections/ peek/ page/ blog/ motion/ seo/
│   ├── ui/                      # shadcn/ui z CLI (+ choice-group)
│   └── demo/                    # PIASKOWNICA: system „Forma” i dawne propozycje (README w środku)
├── design-system/               # rozdziały i przykłady katalogu /design-system
├── routes/                      # fabryki tras bloga (blog.tsx, blog-routes.tsx) i parametry (params.ts)
├── i18n/
│   ├── config.ts                # ROUTES, PATH_BASES, FEEDS, Localized<T>, INTL_LOCALE
│   ├── alternates.ts            # „ta sama strona w drugim języku”: hreflang, mapa strony, przełącznik
│   ├── format.ts                # fill, plural (Intl.PluralRules), daty, liczby, czas lektury
│   ├── content/                 # teksty: ui, common, home, pages, meta, legal, system (pl + en)
│   ├── blog-map.ts              # pary wpisów, kategorii i tagów PL↔EN
│   ├── metadata.ts              # metadane i viewport układów głównych
│   └── page-metadata.ts         # buildMetadata — metadane każdej strony
├── lib/
│   ├── content/                 # model widoku (serwer): źródło, powłoka, start, karty, ⌘K, podstrony
│   ├── posts.ts mdx.ts blog-pages.ts feed.ts   # blog: odczyt i walidacja MDX, kompilacja, paginacja, RSS
│   ├── og.tsx schema.ts page-schema.ts         # karty Open Graph, dane strukturalne
│   ├── site.ts services.ts portfolio.ts        # adres, autor, profile; dane oferty i realizacji (pary PL/EN)
│   ├── mail.ts rate-limit.ts escape.ts contact-fields.ts   # formularz
│   ├── routes.ts anchors.ts hooks.ts motion.ts glyph-reveal.ts …   # logika widoku (docs/STRONA.md)
│   └── utils.ts slug.ts
├── hooks/                       # hooki piaskownicy /demo
content/
├── posts/*.mdx  en/posts/*.mdx  # wpisy
└── drafts/*.txt                 # robocze notatki (nieparsowane)
scripts/check-content.mjs        # pnpm check:content
scripts/check-build.mjs          # pnpm check:build — kontrola wyniku buildu
scripts/check-classes.mjs        # pnpm check:classes — zapis kanoniczny klas
scripts/visual-diff.mjs          # pnpm visual — porównanie pikseli dwóch wersji
scripts/cv-pdf.mjs               # pnpm cv — CV w PDF z „O mnie”
.github/workflows/ci.yml         # CI: audyt, treść, formatowanie, typy, lint, build, check:build
.github/workflows/visual.yml     # porównanie pikseli — uruchamiane ręcznie
.github/dependabot.yml           # aktualizacje miesięczne, zgrupowane; bezpieczeństwo od razu
vercel.json                      # build przez pnpm z lockfile'a, region fra1, Fluid Compute
AGENTS.md CLAUDE.md              # zasady dla agentów AI
```

Poprzednia warstwa widoku (do 10.11.2026) jest w tagu `v1-archiwum`; zrzuty i kopia offline
starej strony — `docs/prywatne/archiwum-v1/` (lokalnie).

## Dwujęzyczność

Polska wersja w katalogu głównym (adresy zaindeksowane przed `/en` nie zmieniły się),
angielska pod `/en`. Dwa niezależne układy główne (`(pl)/layout.tsx`, `en/layout.tsx`),
bo `lang` na `<html>` ustawia tylko układ główny; wspólny szkielet trzyma `MainShell`.
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
`og.cards`) → klucz w `STATIC_PAGES` (`src/app/sitemap.ts`) i ewentualnie `PAGE_KEYS`
(`src/lib/routes.ts` — menu w torze, ⌘K, stopka).

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
tytuły po polsku bez angielskiego Title Case, myślnik „ — ”; każdy wpis kończy wezwanie
(`CtaPanel`) z linkiem do kontaktu i oferty (automatycznie, w widoku wpisu).

## Zasady, których pilnujemy

- **Wygląd zmieniamy tylko na prośbę właściciela** — decyzje z datami w `docs/ZASADY.md`.
  Refaktor bez zmiany wyglądu wymaga `pnpm visual` z wynikiem 0 px.
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
