# Dokumentacja Projektu: zeprzalka.com
*Wygenerowano: 2026-02-20 | Analiza przeprowadzona przez Claude Code*

---

## 1. OPIS PROJEKTU

**zeprzalka.com** to strona portfolio i blog osobisty Michała Zeprzałki — Digital Solutions Architect z 12+ letnim doświadczeniem. Projekt łączy wizytówkę (landing page), sekcję portfolio z realizacjami oraz blog technologiczny oparty na plikach MDX.

**Domena:** https://zeprzalka.com
**Status:** Aktywny, w fazie rozwoju
**Repozytorium:** git, branch `main`

---

## 2. STACK TECHNOLOGICZNY

| Technologia | Wersja | Rola |
|---|---|---|
| Next.js | ^16.0.8* | Framework (App Router, SSG) |
| React | ^19.2.1 | UI Library |
| TypeScript | ^5 | Typowanie |
| Tailwind CSS | ^4 | Style |
| shadcn/ui (Radix) | various | Komponenty UI |
| next-mdx-remote | ^5.0.0 | Renderowanie MDX |
| gray-matter | ^4.0.3 | Parsowanie frontmatter |
| rehype-highlight | ^7.0.2 | Syntax highlighting |
| rehype-slug | ^6.0.0 | Kotwice nagłówków |
| rehype-autolink-headings | ^7.1.0 | Linki do nagłówków |
| remark-gfm | ^4.0.1 | GitHub Flavored Markdown |
| github-slugger | ^2.0.0 | Generowanie slugów TOC |
| reading-time | ^1.5.0 | Szacowanie czasu czytania |
| next-themes | ^0.4.6 | Dark/Light mode |
| lucide-react | ^0.544.0 | Ikony |
| sonner | ^2.0.7 | Powiadomienia toast (nieużywane) |

*\*Uwaga: Next.js 16 nie istnieje oficjalnie — prawdopodobnie błąd w package.json (powinno być ^15.x)*

---

## 3. STRUKTURA PROJEKTU

```
zeprzalka/
├── content/posts/          # Treści blogowe (MDX + niechciane .txt)
│   ├── *.mdx               # 17 aktywnych postów
│   └── *.txt               # 5 plików notatek — NIE SĄ POSTAMI
├── public/
│   ├── avatar.png          # Avatar autora
│   ├── blog/               # Obrazy do postów (jpg/svg)
│   ├── hero_web.mp4        # Wideo hero
│   ├── hero_web.webm       # Wideo hero (WebM)
│   └── vercel.svg          # Nieużywany plik
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout + metadata globalne
│   │   ├── page.tsx        # Strona główna (składa sekcje)
│   │   ├── globals.css     # Style globalne + Tailwind v4
│   │   ├── robots.ts       # robots.txt (dynamiczny)
│   │   ├── sitemap.ts      # sitemap.xml (dynamiczny)
│   │   ├── favicon.ico
│   │   └── blog/
│   │       ├── page.tsx            # Lista blogowa
│   │       ├── kategoria/page.tsx  # PLACEHOLDER — niegotowe
│   │       ├── tag/[tag]/page.tsx  # Strona tagów (działa)
│   │       └── [slug]/
│   │           ├── page.tsx        # Artykuł (MDX render)
│   │           └── highlight.css   # Style syntax highlight
│   ├── components/
│   │   ├── Toggle.tsx              # Dark/Light toggle
│   │   ├── theme-provider.tsx      # Next-themes wrapper
│   │   ├── layout/
│   │   │   ├── Bar.tsx             # Pasek postępu przewijania
│   │   │   ├── Header.tsx          # Sticky header + nawigacja
│   │   │   ├── Footer.tsx          # Stopka strony
│   │   │   ├── Logo.tsx            # Logo z animowanym znakiem
│   │   │   └── Full.tsx            # Eksperymentalny komponent (FULL BG)
│   │   ├── sections/               # STARE KOMPONENTY (NIEUŻYWANE)
│   │   │   ├── Hero.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Gallery.tsx
│   │   │   └── Contact.tsx
│   │   ├── alternative/            # AKTUALNIE UŻYWANE sekcje strony głównej
│   │   │   ├── HeroB.tsx           # Sekcja hero (UŻYWANA)
│   │   │   ├── SkillsB.tsx         # Sekcja kompetencje (UŻYWANA)
│   │   │   ├── GalleryB.tsx        # Portfolio wideo (UŻYWANA)
│   │   │   ├── BlogC.tsx           # Preview bloga na HP (UŻYWANA)
│   │   │   ├── ContactB.tsx        # Formularz kontaktowy (UŻYWANA)
│   │   │   └── BlogB.tsx           # Alternatywny blog (NIEUŻYWANA)
│   │   ├── archive/                # ARCHIWUM — szablony/szkice (NIEUŻYWANE)
│   │   │   ├── blog-b/page.tsx
│   │   │   ├── blog-c/page.tsx
│   │   │   └── page-b/page.tsx
│   │   ├── blog/
│   │   │   ├── ActiveTOC.tsx       # Spis treści z IntersectionObserver
│   │   │   └── CodeBlock.tsx       # Blok kodu z przyciskiem kopiowania
│   │   └── ui/                     # shadcn/ui komponenty
│   └── lib/
│       └── posts.ts                # Logika ładowania postów MDX
├── lib/
│   └── utils.ts                    # cn() helper (ZDUBLOWANA LOKALIZACJA)
├── next.config.ts                  # Security headers, image optimization
├── tailwind.config (brak — v4 CSS-first)
├── tsconfig.json
├── eslint.config.mjs
├── package.json
├── package-lock.json               # NPM lock
└── pnpm-lock.yaml                  # PNPM lock (konflikt menadżerów!)
```

---

## 4. ROUTING I STRONY

| Ścieżka | Typ | Opis |
|---|---|---|
| `/` | SSG | Strona główna (HP) |
| `/blog` | SSG | Lista wszystkich postów |
| `/blog/[slug]` | SSG | Pojedynczy artykuł MDX |
| `/blog/tag/[tag]` | SSG | Posty wg tagu |
| `/blog/kategoria` | Statyczna | PLACEHOLDER — niegotowe |
| `/sitemap.xml` | Dynamiczny | Automatyczna mapa strony |
| `/robots.txt` | Dynamiczny | Dyrektywy dla botów |

---

## 5. SYSTEM BLOGA

- Posty są plikami `.mdx` w `content/posts/`
- Frontmatter parsowany przez `gray-matter`
- Wymagane pola frontmatter: `title`, `description`, `date`, `categories`, `tags`, `image`, `author`
- Opcjonalne: `imageCaption`, `featured`
- Sortowanie: malejąco po `date`
- Generowane statycznie (`generateStaticParams`)
- TOC (spis treści) generowany z nagłówków H2 przez regex
- Syntax highlighting: rehype-highlight (GitHub theme)

---

## 6. SEO — AKTUALNY STAN

### Co działa poprawnie:
- `metadataBase` ustawione na `https://zeprzalka.com`
- OpenGraph + Twitter Cards dla artykułów
- JSON-LD Schema Article dla postów
- `sitemap.xml` dynamiczny (strona główna + blog + posty)
- `robots.txt` dynamiczny
- Security headers w `next.config.ts`
- `lang="pl"` na `<html>`
- `generateStaticParams` — strony są SSG
- `<time dateTime={...}>` z maszyną czasu artykułu

### Co wymaga naprawy:
- Brak `og:image` w globalnym metadata
- Brak `logo.png` w `/public/` (referenced w JSON-LD)
- Sitemap pomija strony tagów
- `keywords` w metadata są po angielsku (strona PL)
- Niespójność tytułów metadata
- Brak canonical URL w postach
- Brak schema.org `Person`/`Organization` na stronie głównej

---

## 7. KONFIGURACJA BEZPIECZEŃSTWA

Nagłówki HTTP skonfigurowane w `next.config.ts`:
- `X-DNS-Prefetch-Control: on`
- `Strict-Transport-Security` (HSTS z preload)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy` (kamera/mikrofon/geolokacja wyłączone)
- **Brak `Content-Security-Policy`** — najważniejszy header

---

## 8. PODSUMOWANIE ANALIZY — BŁĘDY, PROBLEMY I PLAN NAPRAWY

---

### KATEGORIA A — BŁĘDY KRYTYCZNE (naprawić natychmiast)

---

#### A3. Formularz kontaktowy całkowicie niefunkcjonalny
**Plik:** `src/components/alternative/ContactB.tsx:41`

```tsx
<form className="space-y-4">  // brak onSubmit, brak action
```
Formularz nie ma żadnego handlera, API route ani integracji (Resend, Formspree, etc.). Kliknięcie "Wyślij" nic nie robi. `<textarea>` nie ma atrybutu `name`. To krytyczny błąd funkcjonalny na stronie wizytówce.

**Naprawa:** Dodać Server Action lub API route + integrację z serwisem e-mail (np. Resend). m@zeprzalka.com

---

#### A4. Nieistniejąca wersja Next.js w package.json
**Plik:** `package.json:25`

```json
"next": "^16.0.8"
```
Next.js 16 nie istnieje. Najnowsza stabilna wersja to 15.x. To może być wynik błędu lub automatycznej aktualizacji package.json.

**Naprawa:** Zmienić na `"^15.5.3"` (zgodnie z `eslint-config-next: 15.5.3`).

---

### KATEGORIA B — BŁĘDY KODU I LITERÓWKI (naprawić jak najszybciej)

---

#### B1. Nieistniejąca klasa Tailwind: `md:font-semi-bold`
**Pliki:** `SkillsB.tsx:62`, `BlogC.tsx:16`, `ContactB.tsx:22`, `GalleryB.tsx:73`

```tsx
className="text-3xl md:text-4xl md:font-semi-bold font-medium"
//                              ^^^^^^^^^^^^^^^^^ NIE ISTNIEJE
```
Prawidłowa klasa Tailwind to `md:font-semibold`. Klasa `semi-bold` jest ignorowana — nagłówki sekcji mają nieprawidłowy font-weight na desktopie.

**Naprawa:** Zamienić `md:font-semi-bold` → `md:font-semibold` we wszystkich 4 plikach.



#### B4. Zduplikowana klasa `mx-auto` w Header
**Plik:** `src/components/layout/Header.tsx:14`

```tsx
<div className="mx-auto flex h-16 items-center justify-between px-4 container mx-auto">
//              ^^^^^^^^                                                          ^^^^^^^^
```
`mx-auto` pojawia się dwa razy. Nadmiarowy kod.

---

#### B5. Błędny komentarz w pliku BlogB
**Plik:** `src/components/alternative/BlogB.tsx:1`

```tsx
// [project]/src/components/alternative/BlogB.tsx

import Image from "next/image"
// ...
```
Komentarz i faktyczna ścieżka są niespójne (poprzedni komentarz wskazywał na `src/components/Blog.tsx`).

---

#### B6. Redundancja w opisie metadata
**Plik:** `src/app/layout.tsx:31`

```tsx
description: "Ponad 12+ lat doświadczenia..."
//            ^^^^^ ^^  ← "Ponad" + "+" to podwójne oznaczenie
```
"Ponad 12+ lat" — słowo "ponad" i znak "+" mówią to samo. Prawidłowo: "12+ lat" lub "Ponad 12 lat".

---

### KATEGORIA C — DEAD CODE I PORZĄDEK (wyczyścić)

---

#### C1. Katalog `src/components/sections/` — całkowicie nieużywany
**Pliki:** `Hero.tsx`, `Skills.tsx`, `Gallery.tsx`, `Contact.tsx`

Stare wersje komponentów sekcji, zastąpione przez odpowiedniki w `alternative/`. Zajmują miejsce i dezorientują.

**Naprawa:** Usunąć cały katalog `src/components/sections/`.

---

#### C2. Katalog `src/components/archive/` — śmieci w projekcie
**Pliki:** `blog-b/page.tsx`, `blog-c/page.tsx`, `page-b/page.tsx`

Stare szablony/prototypy trzymane w folderze `components/` (co nie ma sensu — to nie są komponenty React). Referują nieistniejący plik `/min.png`.

**Naprawa:** Usunąć cały katalog `src/components/archive/`.

---

#### C3. `BlogB.tsx` — nieużywany komponent z hardcoded danymi
**Plik:** `src/components/alternative/BlogB.tsx`

Komponent zawiera fikcyjne dane blogowe (`blogPostsData`) hardcoded w pliku zamiast z MDX. Nie jest używany na stronie głównej ani nigdzie indziej. Jest to kopia robocza/prototyp.

**Naprawa:** Usunąć plik lub zastąpić prawdziwymi danymi i użyć.


---

#### C6. Dwa menadżery pakietów jednocześnie
**Pliki:** `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm)

Projekt ma dwa pliki lock dla dwóch różnych menadżerów. To powoduje niejednoznaczność i potencjalne konflikty wersji zależności. `pnpm-lock.yaml` jest untracked (git status).

**Naprawa:** Zdecydować na jeden menadżer (zalecane: pnpm ze względu na szybkość). Usunąć `package-lock.json`, dodać `pnpm-lock.yaml` do repozytorium.



#### C8. `lib/utils.ts` vs `src/lib/posts.ts` — niespójna lokalizacja
**Pliki:** `/lib/utils.ts` (root), `/src/lib/posts.ts` (src)

Plik `utils.ts` jest poza `src/`, podczas gdy reszta kodu jest w `src/`. Brak konsekwencji.

**Naprawa:** Przenieść `lib/utils.ts` → `src/lib/utils.ts` i zaktualizować ścieżkę `@/*` (alias już wskazuje na `./src/*`).

---

#### C9. `src/app/blog/kategoria/page.tsx` — niegotowy placeholder
**Plik:** `src/app/blog/kategoria/page.tsx`

Strona kategorii zawiera tylko tekst "W przygotowaniu". Mimo to jest dostępna publicznie pod URL `/blog/kategoria`.

**Naprawa:** wdrożyć pełną funkcjonalność kategorii

---

### KATEGORIA D — PROBLEMY SEO (priorytet wysoki)

---

#### D1. Brak `og:image` w globalnym metadata
**Plik:** `src/app/layout.tsx`

OpenGraph bez obrazka. Udostępnienie strony głównej na social media pokaże pustą kartę bez podglądu wizualnego.

**Naprawa:** Dodać `/public/og-image.jpg` (1200x630px) i dodać do metadata:
```tsx
openGraph: {
  images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
}
```

---

#### D2. Plik `logo.png` referenced w JSON-LD, ale nie istnieje
**Plik:** `src/app/blog/[slug]/page.tsx:186`

```tsx
url: "https://zeprzalka.com/logo.png"  // plik nie istnieje w /public/
```
Google Search Console może zgłaszać błędy walidacji schema.

**Naprawa:** Dodać `logo.png` do `/public/` lub zmienić URL.

---

#### D3. Sitemap nie uwzględnia stron tagów
**Plik:** `src/app/sitemap.ts`

Strony `/blog/tag/[tag]` są generowane statycznie (`generateStaticParams`) ale nie są w sitemapie.

**Naprawa:** Dodać wszystkie tagi do sitemap.

---

#### D4. Niespójny format tytułów stron
**Pliki:** `blog/[slug]/page.tsx`, `blog/page.tsx`

Blog post: `${post.frontmatter.title} | Zeprzalka.com` — hardcoded, pomija template z layout.
Blog lista: `"Blog | Zeprzalka.com - Najnowsze trendy w technologii"` — niezgodne ze strukturą template `"%s | Michał Zeprzałka"`.

**Naprawa:** Ujednolicić — używać template z root layout we wszystkich podstronach, podając tylko segment `%s`.

---

#### D5. Keywords w metadata po angielsku
**Plik:** `src/app/layout.tsx:32-44`

```tsx
keywords: ["web development", "digital architect", "design", "full-stack", ...]
```
Strona jest po polsku — keywords powinny być po polsku lub mieszane.

---

#### D6. Brak schema.org `Person` na stronie głównej
Strona główna nie ma strukturyzowanych danych o autorze. Artykuły mają `Article` schema, ale strona portfolio powinna mieć `Person` lub `ProfessionalService`.

---

#### D7. `readingTime` nie przetłumaczony na listingach
**Pliki:** `blog/page.tsx`, `blog/tag/[tag]/page.tsx`, `alternative/BlogC.tsx`

Na listingach wyświetla się "X min read" (angielski). Tylko w artykule jest `.replace("min read", "min czytania")`.

**Naprawa:** Dodać ten replace do wszystkich miejsc wyświetlania readingTime lub skonfigurować bibliotekę z locale.

---

### KATEGORIA E — WYDAJNOŚĆ I OPTYMALIZACJA

---

#### E1. Gallery ładuje 8 wideo jednocześnie bez lazy loadingu
**Plik:** `src/components/alternative/GalleryB.tsx`

Każda karta portfolio ma `<video autoPlay loop muted playsInline>`. Wszystkie 8 wideo startują jednocześnie przy załadowaniu strony — znaczące obciążenie sieci i procesora.

**Naprawa:** Lazy load wideo (ładuj tylko po wejściu w viewport) za pomocą `IntersectionObserver` lub `loading="lazy"`. Dodać `poster` dla każdego wideo.

---

#### E2. Wideo bez atrybutu `poster`
**Pliki:** `HeroB.tsx`, `GalleryB.tsx`

Przed załadowaniem wideo użytkownik widzi czarny/pusty prostokąt.

**Naprawa:** Dodać `poster="/hero_web_poster.jpg"` — obraz wyświetlany przed załadowaniem.

---

#### E3. Brak `sizes` na obrazach artykułu
**Plik:** `src/app/blog/[slug]/page.tsx:270-278`

Obraz featured posta ma `fill` bez `sizes`. Next.js Image pobierze pełny rozmiar bez optymalizacji pod viewport.

**Naprawa:** Dodać `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"`.

---

#### E4. Logo animuje się co sekundę przez cały czas życia komponentu
**Plik:** `src/components/layout/Logo.tsx:183-187`

`setInterval` co 1000ms zmienia znak Unicode. Powoduje re-render komponentu co sekundę, nawet gdy user nie patrzy. Minimalny wpływ, ale niepotrzebny.

---

#### E5. Brak Suspense boundaries dla dynamicznych sekcji
Strona główna jest Server Component ale `GalleryB.tsx` jest Client Component z hover state. Brak `Suspense` wokół potencjalnie wolnych sekcji.

---

### KATEGORIA F — DOSTĘPNOŚĆ (Accessibility)

---

#### F1. Hierarchia nagłówków zaburzona w SkillsB
**Plik:** `src/components/alternative/SkillsB.tsx:62,88`

Sekcja ma `<h2>Kompetencje</h2>` (nagłówek sekcji), ale wewnątrz accordion items są też `<h2>` ("Projektowanie Produktu", "Development i Technologia", etc.). Powinny to być `<h3>`.

---

#### F2. HeroB używa `<h2>` dla podtytułu zamiast `<p>`
**Plik:** `src/components/alternative/HeroB.tsx:19`

"Digital Solutions Architect" to podtytuł — semantycznie powinien być `<p>` lub przynajmniej być wytłumaczony dlaczego jest `<h2>`. Na stronie głównej `h1` i `h2` są na tym samym poziomie wizualnym, co jest mylące dla screen readerów.

---

#### F3. Brak strony 404 (not-found.tsx)
Brak `src/app/not-found.tsx`. Next.js używa domyślnej strony błędu, która nie pasuje do designu strony.

---

#### F4. Brak ikony dla zewnętrznych linków w nawigacji
Footer linki do GitHub/Facebook nie sygnalizują wizualnie że otwierają nową kartę (brak ikony zewnętrznego linku). Dla dostępności pomocne jest `aria-label` z informacją "otwiera w nowej karcie".

---

#### F5. Formularz kontaktowy — `<textarea>` nie ma atrybutu `name`
**Plik:** `ContactB.tsx:96`

```tsx
<textarea id="message" ... />  // brak name="message"
```
Pole `message` nie ma atrybutu `name` — nie byłoby wysłane nawet przy standardowym formularzu HTML. Dodatkowo nie jest użyty komponent `Textarea` z shadcn/ui, co powoduje niespójność stylów.

---

### KATEGORIA G — BRAKUJĄCE FUNKCJONALNOŚCI (plan rozwoju)

---

#### G1. Nawigacja między artykułami (prev/next)
W archiwum (`archive/blog-b/page.tsx`) jest szkielet nawigacji "Poprzedni/Następny artykuł" — ale nie jest zaimplementowana w produkcyjnym widoku artykułu.

---

#### G2. Link "Wróć do bloga" w artykule
Artykuł nie ma wyraźnego przycisku/linku powrotu. Breadcrumb jest ale mało widoczny.

---

#### G3. Brak Google Analytics lub innego trackingu
Dla strony z priorytetem SEO brak jakiegokolwiek narzędzia analitycznego. Nie można mierzyć ruchu, konwersji ani skuteczności contentu.

---

#### G4. Brak RSS Feed
Blog technologiczny bez RSS feed to pominięcie dla użytkowników i agregatów treści.

---

#### G5. Strona `/about` lub rozbudowana sekcja "O mnie"
Strona to wizytówka — brak dedykowanej podstrony z CV, historią zawodową, referencjami.

---

#### G6. `sonner` (toast notifications) w dependencies — nieużywany
**Plik:** `package.json`

Biblioteka `sonner` jest zainstalowana ale nigdzie nieużywana — zwiększa bundle size.

**Naprawa:** Usunąć z dependencies lub wdrożyć użycie (np. potwierdzenie formularza kontaktowego).

---

## 9. PLAN NAPRAWY — PRIORYTETY

### SPRINT 1: Krytyczne błędy (1-2 dni)
1. [ ] **A4** — Naprawić wersję Next.js w package.json (`^15.5.3`)
2. [ ] **A1** — Usunąć podwójny `<main>` w blog/[slug]/page.tsx
3. [ ] **A2** — Usunąć `<main>` z BlogC.tsx
4. [ ] **B1** — Naprawić `md:font-semi-bold` → `md:font-semibold` (4 pliki)
5. [ ] **C6** — Wybrać jeden package manager, usunąć drugi lock file
6. [ ] **A3** — Wdrożyć obsługę formularza kontaktowego (Server Action + Resend)

### SPRINT 2: Porządek kodu (1 dzień)
7. [ ] **C1** — Usunąć `src/components/sections/`
8. [ ] **C2** — Usunąć `src/components/archive/`
9. [ ] **C3** — Usunąć `BlogB.tsx` (nieużywany)
10. [ ] **C4** — Usunąć `Full.tsx` lub wyekstrahować `chars.ts`
11. [ ] **C5** — Przenieść pliki `.txt` z `content/posts/`
12. [ ] **C8** — Przenieść `lib/utils.ts` → `src/lib/utils.ts`
13. [ ] **B2** — Zmienić nazwę `Toogle.tsx` → `Toggle.tsx`
14. [ ] **C9** — Naprawić `blog/kategoria` (notFound lub wdrożyć)

### SPRINT 3: SEO (2-3 dni)
15. [ ] **D1** — Dodać `og:image` (stworzyć grafikę 1200x630)
16. [ ] **D2** — Dodać `logo.png` do `/public/`
17. [ ] **D3** — Dodać tagi do sitemap.ts
18. [ ] **D4** — Ujednolicić format tytułów metadata
19. [ ] **D7** — Przetłumaczyć readingTime na listingach
20. [ ] **D6** — Dodać schema.org `Person` na stronie głównej
21. [ ] **D5** — Przetłumaczyć keywords na polski

### SPRINT 4: Wydajność i dostępność (2 dni)
22. [ ] **E1** — Lazy load wideo w GalleryB
23. [ ] **E2** — Dodać `poster` do wideo
24. [ ] **E3** — Dodać `sizes` do obrazów
25. [ ] **F1** — Naprawić hierarchię nagłówków w SkillsB
26. [ ] **F3** — Stworzyć `src/app/not-found.tsx`
27. [ ] **F5** — Dodać `name` do textarea, użyć shadcn Textarea
28. [ ] Dodać `Content-Security-Policy` header

### SPRINT 5: Nowe funkcjonalności
29. [ ] **G1** — Nawigacja prev/next między artykułami
30. [ ] **G3** — Integracja Google Analytics (GA4)
31. [ ] **G4** — RSS Feed (`/feed.xml`)
32. [ ] **G2** — Breadcrumb i przycisk powrotu w artykule
33. [ ] **G6** — Usunąć `sonner` lub wdrożyć

---

## 10. PODSUMOWANIE OCENY PROJEKTU

| Obszar | Ocena | Uwagi |
|---|---|---|
| Architektura Next.js | B+ | App Router, SSG, MDX — solidna baza |
| Jakość kodu TypeScript | B | Dobry, ale dead code i duplikacje |
| SEO | C+ | Dobra baza, ale luki w OG image, sitemap |
| Dostępność (a11y) | C | Błędy semantyczne HTML, brak 404 |
| Wydajność | C+ | Wideo bez lazy load, brak poster |
| Bezpieczeństwo | B | Dobre security headers, brak CSP |
| UX/Design | B+ | Czysty, spójny design system |
| Utrzymywalność kodu | C | Dużo dead code, dwa lock files |
| Funkcjonalność | D+ | Formularz niefunkcjonalny (krytyczne!) |
| Blog System | B | Działa dobrze, brak RSS i prev/next |

**Główna konkluzja:** Projekt ma solidne fundamenty technologiczne (Next.js 15, TypeScript, shadcn/ui, SSG, MDX). Widać dużo eksperymentowania i iteracji, co jest naturalne przy nauce. Największe problemy to: **martwy kod** z iteracji projektowych, **niefunkcjonalny formularz kontaktowy**, **błędy semantyki HTML** (podwójny `<main>`) i **literówki w Tailwind** które powodują że style nie działają. Po wdrożeniu powyższego planu projekt będzie gotowy na dalszy rozwój na solidnym fundamencie.
