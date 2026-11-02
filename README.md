# zeprzalka.com

Strona osobista Michała Zeprzałki: portfolio, blog i kanał pozyskiwania klientów.
Next.js 16 (App Router) + MDX, wersja polska i angielska, deploy na Vercel.

**Dokumentacja:**

| Plik | Po co |
| --- | --- |
| [docs/AUDYT-2026-11.md](docs/AUDYT-2026-11.md) | aktualna diagnoza serwisu: co jest dobre, co nie, co zrobiono |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **lista rzeczy do zrobienia** z terminami i celami |
| [docs/SEO.md](docs/SEO.md) | stan techniczny SEO, reguły treści, plan tematów |
| [docs/MONETYZACJA.md](docs/MONETYZACJA.md) | pozycjonowanie, oferta i ceny, lejek, pomiar, kanały |
| [docs/KIERUNEK-WIZUALNY.md](docs/KIERUNEK-WIZUALNY.md) | propozycja języka wizualnego i dług designu |
| [docs/DWUJEZYCZNOSC.md](docs/DWUJEZYCZNOSC.md) | gdzie mieszkają teksty PL/EN, jak dodać stronę lub wpis |
| `docs/prywatne/` | tylko lokalnie (w `.gitignore`): bezpieczeństwo konta, pełne raporty audytu |

---

## Stack

| Warstwa | Technologia |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), wszystkie strony statyczne |
| Runtime | React 19.3, Node.js 24 (`.nvmrc`) |
| Język | TypeScript (strict) |
| CSS / UI | Tailwind CSS 4, shadcn/ui + Radix |
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
pnpm check:content    # reguły treści bloga (frontmatter, pary PL↔EN, obrazy, długości)
pnpm check            # treść + lint + build — przed każdym commitem
```

## Jak publikować (ważne)

**Push na `main` od razu wdraża produkcję** (integracja Vercel ↔ GitHub). Dlatego:

1. `git switch -c moja-zmiana`, praca, `pnpm check`.
2. `git push -u origin moja-zmiana` → Vercel buduje podgląd, GitHub Actions uruchamia CI.
3. Sprawdzasz podgląd → `git switch main && git merge --ff-only moja-zmiana && git push`.

Nowy wpis: `content/posts/<slug>.mdx` (+ wersja EN i para w `src/i18n/blog-map.ts`,
szczegóły w docs/DWUJEZYCZNOSC.md) → `pnpm check:content` → jak wyżej.

### Zmienne środowiskowe (`.env.local` / Vercel)

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
│   │   ├── blog/                # indeks, [slug], strona/[n], kategoria/, tag/
│   │   ├── design-system/       # żywy katalog języka wizualnego (noindex)
│   │   └── **/opengraph-image.tsx  # karty udostępniania 1200×630, generowane przy buildzie
│   ├── en/                      # wersja angielska — lustro (pl) z angielskimi adresami
│   ├── actions/contact.ts       # Server Action formularza
│   ├── global-not-found.tsx     # 404 dla nieznanych adresów
│   ├── sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
├── components/
│   ├── views/                   # widoki stron — jeden na stronę, wspólny dla obu języków
│   ├── home/                    # sekcje strony głównej (wygląd nietykalny — patrz niżej)
│   ├── layout/                  # RootShell, Header, Footer, MobileNav, Logo, Bar
│   ├── blog/                    # ActiveTOC, CodeBlock, PostCta, YouTubeEmbed
│   ├── portfolio/               # PortfolioCard, PortfolioGrid
│   ├── design-system/           # sekcje katalogu /design-system
│   ├── ui/                      # shadcn/ui
│   ├── ContactForm.tsx JsonLd.tsx og.tsx PageHeader.tsx
├── i18n/
│   ├── config.ts                # ROUTES, Localized<T>, hreflang
│   ├── content/                 # teksty: common, home, pages, meta, legal (pl + en)
│   ├── blog-map.ts              # pary wpisów, kategorii i tagów PL↔EN
│   ├── metadata.ts              # metadane układów głównych
│   └── page-metadata.ts         # buildMetadata — metadane każdej strony
├── lib/
│   ├── posts.ts                 # odczyt i walidacja MDX, kategorie, tagi, powiązane
│   ├── schema.ts                # dane strukturalne (Person z @id i reszta)
│   ├── site.ts                  # adres, autor, e-mail, profile
│   ├── services.ts portfolio.ts # dane oferty i realizacji (pary PL/EN)
│   ├── feed.ts rate-limit.ts slug.ts utils.ts
content/
├── posts/*.mdx  en/posts/*.mdx  # wpisy
└── drafts/*.txt                 # robocze notatki (nieparsowane)
scripts/check-content.mjs        # pnpm check:content
.github/workflows/ci.yml         # CI
vercel.json                      # build przez pnpm z lockfile'a
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

- **Wygląd strony głównej jest nietykalny bez zgody właściciela.** Zmiany wyglądu
  zaczynają się w `/design-system`. Refaktor pliku używanego przez stronę główną
  wymaga porównania zrzutów przed i po.
- **Żaden tekst nie istnieje tylko w jednym języku** — pilnuje tego kompilator
  (docs/DWUJEZYCZNOSC.md).
- **Ścieżki `fs` w `src/lib/posts.ts`** składamy jako `path.join(process.cwd(), "content", …)`
  — gotowa zmienna ze ścieżką psuje śledzenie plików w Turbopacku i wrzuca całe
  `public/` (dziesiątki MB wideo) do paczki serwerowej.
- **Wszystkie strony statyczne.** Trasy z segmentem mają `generateStaticParams`
  i `dynamicParams = false`; nie czytamy `searchParams` w stronach publicznych.

### Kontrola wizualna (porównanie zrzutów)

Playwright + pixelmatch na lokalnym `pnpm build && pnpm start`: zrzuty pełnych stron
w 1440 i 390 px, z `reducedMotion: "reduce"` i wideo zatrzymanym na klatce 0 —
wtedy szum między dwoma przebiegami tej samej wersji wynosi 0,000%, a każda
różnica jest prawdziwa. Najpierw zrzuty stanu wyjściowego, potem zmiana, potem
porównanie.

## Bezpieczeństwo (zaimplementowane)

- Nagłówki: HSTS, CSP oparta na źródłach (bez obcych domen w `script-src`),
  `frame-ancestors 'none'`, COOP, `strict-origin-when-cross-origin`, pełna
  Permissions-Policy, `nosniff` (`next.config.ts`); `/.well-known/security.txt`.
- Formularz: walidacja zod (serwer) + HTML (przeglądarka), escapowanie HTML w mailu,
  ochrona nagłówków przed CRLF, honeypot, limit zgłoszeń, timeouty SMTP, limit
  rozmiaru żądania 64 kB.
- YouTube jako fasada „kliknij, by wczytać” z domeny youtube-nocookie.
- Zależności: `pnpm audit --prod` = 0 (CI przerywa przy podatności wysokiej).
