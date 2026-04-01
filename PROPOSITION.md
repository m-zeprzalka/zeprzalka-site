# PROPOSITION — Analiza i propozycje zmian

Dokument zawiera wszystkie zidentyfikowane problemy, nieścisłości i propozycje poprawek.
Każdy punkt zawiera: opis problemu, lokalizację w kodzie, ocenę priorytetu i konkretną propozycję.

---

## TIER 1 — Krytyczne (blokują poprawne działanie lub mają duże konsekwencje)

---

### P1 — Formularz kontaktu nie działa

**Plik:** `src/components/alternative/ContactB.tsx`, linia 41

**Problem:**
`<form>` nie ma ani `action`, ani `onSubmit`. Kliknięcie "Wyślij wiadomość" nie powoduje żadnej akcji — dane nigdzie nie trafiają. Formularz renderuje się poprawnie, ale jest całkowicie niefunkcjonalny.

Dodatkowo: komponent jest Server Component (brak `"use client"`), więc i tak nie może obsługiwać zdarzeń przez JS. Brak walidacji po stronie serwera.

**Propozycja:**
Dodać funkcjonalność formularza kontaktowego.

m@zeprzalka.com

   // Konfiguracja transportu SMTP (super-host.pl)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-sh188996.super-host.pl",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

---

### P2 — `extractHeadings()` obsługuje tylko nagłówki h2 — TOC jest niekompletny

**Plik:** `src/lib/posts.ts`, linia 85

**Problem:**
```typescript
const headingRegex = /^(#{2})\s+(.+)$/gm  // ← wyłącznie ##
```
Nagłówki `###` (h3) i `####` (h4) nie trafiają do spisu treści. `ActiveTOC` na stronie artykułu wyświetla tylko h2, choć artykuły używają wszystkich poziomów nagłówków. TOC jest wprowadzający w błąd — sugeruje strukturę, której nie pokazuje.

Nie wpływa na renderowanie MDX (rehype-slug tworzy `id` dla wszystkich nagłówków) — wpływa wyłącznie na dane przekazane do `<ActiveTOC>`.

**Propozycja:**
```typescript
// src/lib/posts.ts, linia 85 — zmienić:
const headingRegex = /^(#{2,4})\s+(.+)$/gm
// level = match[1].length zwróci 2, 3 lub 4
```

W `ActiveTOC.tsx` — dodać indent zależny od poziomu:
```tsx
style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
```

---

### P3 — URL domeny hardcoded w wielu miejscach

**Pliki:**
- `src/app/layout.tsx`, linia 53: `new URL("https://zeprzalka.com")`
- `src/app/sitemap.ts`, linie 9, 17, 22: `https://zeprzalka.com/...`
- `src/app/robots.ts`, linia 12: `https://zeprzalka.com/sitemap.xml`
- `src/app/blog/[slug]/page.tsx`, linia 183: `https://zeprzalka.com/logo.png`

**Problem:**
Hardcoded URL utrudniają pracę lokalną (CORS, canonical URL do `localhost` przy testach), uniemożliwiają staging środowisko, i wymagają ręcznej zmiany w 4+ miejscach przy zmianie domeny.

**Propozycja:**
Dodać `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://zeprzalka.com
```
I używać wszędzie:
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
new URL(siteUrl)
`${siteUrl}/blog/${post.slug}`
```

---

## TIER 2 — Ważne (obniżają jakość, wpływają na performance lub maintainability)

---

### P4 — Nieużywane komponenty zajmują przestrzeń i mylą czytelnika kodu

**Pliki:**
```
src/components/sections/Hero.tsx      (nieużywany — zastąpiony przez HeroB)
src/components/sections/Skills.tsx    (nieużywany — zastąpiony przez SkillsB)
src/components/sections/Gallery.tsx   (nieużywany — zastąpiony przez GalleryB)
src/components/sections/Contact.tsx   (nieużywany — zastąpiony przez ContactB)
src/components/alternative/BlogB.tsx  (nieużywany — zastąpiony przez BlogC)
src/components/archive/               (cały katalog — stare layouty)
src/components/layout/Full.tsx        (niezaimplementowany nigdzie)
```

**Problem:**
Projekt zawiera dwie "generacje" komponentów sekcji (A i B) plus archiwum. Komponenty sekcji A i archiwum nie są nigdzie importowane. Zwiększają cognitive load przy pracy z kodem, mylą przy szukaniu "aktywnego" komponentu sekcji.

**Propozycja:**
Usunąć wszystkie nieużywane pliki. Jeśli chcesz zachować historię — są w git. Finalna struktura powinna mieć tylko `components/sections/` z aktualnie używanymi komponentami (bez sufiksu B/C).

Opcjonalnie: przenieść aktywne B-wersje do `components/sections/` i usunąć katalog `alternative/`.

---

### P5 — Header ma duplikat `mx-auto` w jednym elemencie

**Plik:** `src/components/layout/Header.tsx`, linia 14

**Problem:**
```tsx
<div className="mx-auto flex h-16 items-center justify-between px-4 container mx-auto">
```
Klasa `mx-auto` pojawia się dwa razy, a `container` też wymusza `mx-auto`. Nie powoduje błędu wizualnego, ale jest to niechlujna redundancja.

**Propozycja:**
```tsx
<div className="container mx-auto flex h-16 items-center justify-between px-4">
```

---

### P6 — CodeBlock używa inline styles zamiast klas Tailwind

**Plik:** `src/components/blog/CodeBlock.tsx`, linie 31–37

**Problem:**
```tsx
style={{
  margin: 0,
  padding: "1.5rem",      // komentarz: "inline style ZAWSZE działa!"
  background: "transparent",
  fontSize: "0.875rem",
  lineHeight: "1.7",
}}
```
Komentarz wskazuje, że inline styles zostały dodane jako obejście konfliktu z Tailwind. To anti-pattern — utrudnia nadpisanie stylów, przyszłą customizację motywu, i łamie spójność podejścia w projekcie.

**Propozycja:**
Ustalić skąd pochodzi konflikt (najprawdopodobniej `prose` klasy z `@tailwindcss/typography`) i rozwiązać go przez `prose-pre:p-0 prose-pre:m-0` (już obecne w `[slug]/page.tsx` linia 291). Inline styles można wtedy zastąpić klasami:
```tsx
className={`${className || ""} p-6 text-sm leading-relaxed bg-transparent`}
```

---

### P7 — GalleryB używa zewnętrznych URL do wideo bez fallbacków i CDN

**Plik:** `src/components/alternative/GalleryB.tsx`, linie 13–63

**Problem:**

Dodatkowy problem: każda karta autoplay'uje wideo przy wejściu na stronę — 8 równoczesnych requestów do zewnętrznego CDN przy pierwszym renderze strony głównej.

**Propozycja:**
- Rozważyć lazy loading: ładować wideo dopiero po wejściu elementu w viewport (`IntersectionObserver`)

---

### P8 — GalleryB używa `<img>` zamiast Next.js `<Image>` (eslint-disable)

**Plik:** `src/components/alternative/GalleryB.tsx`, linia 107

**Problem:**
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={item.src} alt={item.title} ... />
```
Obecna sytuacja: gałąź `type === "image"` nie jest aktualnie używana (wszystkie items są `type: "video"`). Jednak kod jest przygotowany na zdjęcia i wyłącza ESLint zamiast użyć `<Image>`.

**Propozycja:**
Zmienić na `<Image>` gdy items będą mieć `type: "image"`, lub usunąć tę gałąź jeśli nie jest planowana. Nie wyłączać reguł ESLint dla obejścia własnego kodu.

---


---

### P10 — Metadata artykułu używa niespójnego formatu tytułu

**Plik:** `src/app/blog/[slug]/page.tsx`, linia 141

**Problem:**
```typescript
title: `${post.frontmatter.title} | Zeprzalka.com`,
```
Root layout (`layout.tsx` linia 27) definiuje `template: "%s | Michał Zeprzałka"`. Strona artykułu ignoruje ten template i buduje tytuł ręcznie, używając innej nazwy (`Zeprzalka.com` vs `Michał Zeprzałka`). Efekt: niespójny tytuł w zakładce przeglądarki i w Google.

**Propozycja:**
```typescript
title: post.frontmatter.title,  // template z layout.tsx doda resztę automatycznie
```

---

### P11 — Blog page — brak paginacji

**Plik:** `src/app/blog/page.tsx`

**Problem:**
`getAllPosts()` zwraca wszystkie 24 artykuły naraz, bez paginacji. Przy 50+ artykułach strona będzie ładować wszystkie dane i renderować wszystkie karty jednocześnie. BlogC na stronie głównej ogranicza do 6 (`.slice(0, 6)`) — to właściwe podejście dla preview, ale strona bloga nie ma żadnego ograniczenia.

**Propozycja:**
Dodać podstawową paginację lub infinite scroll. Minimum: limit parametr w URL (`?page=1`) i `getAllPosts().slice(offset, offset + PAGE_SIZE)`. Zgodną z shadcn

---

### P12 — JSON-LD schema używa `Article` zamiast `BlogPosting`

**Plik:** `src/app/blog/[slug]/page.tsx`, linia 170

**Problem:**
```typescript
"@type": "Article",
```
Dla bloga poprawny typ to `BlogPosting` (podklasa `Article`). Google rozróżnia te typy w Rich Results. Brakuje też pól `dateModified` i `mainEntityOfPage`.

**Propozycja:**
```typescript
"@type": "BlogPosting",
datePublished: post.frontmatter.date,
dateModified: post.frontmatter.date,
mainEntityOfPage: {
  "@type": "WebPage",
  "@id": `${siteUrl}/blog/${post.slug}`
}
```

---

### P13 — Strona `/blog/kategoria` to placeholder dostępny publicznie

**Plik:** `src/app/blog/kategoria/page.tsx`

**Problem:**
Strona pokazuje tekst "Ta sekcja jest w przygotowaniu" — jest indeksowana przez Google (robots.txt nie blokuje), trafia do sitemapa (o ile nie jest pominięta). Brak obsługi dynamicznego parametru kategorii — jest to pojedyncza strona bez `[kategoria]` w ścieżce, co czyni ją bezużyteczną dla nawigacji po kategoriach.

**Propozycja (opcja A):** Usunąć stronę do czasu implementacji.
**Propozycja (opcja B):** Zaimplementować prawidłowo jako `blog/kategoria/[kategoria]/page.tsx` wzorem istniejącego `tag/[tag]/page.tsx`. Funkcja `getPostsByCategory()` w `posts.ts` już istnieje.

---

### P14 — Logo importowane w Footer powoduje hydration mismatch

**Plik:** `src/components/layout/Footer.tsx`, linia 2

**Problem:**
`Footer` jest Server Component. Importuje `Logo` który jest `"use client"` z `setInterval` i losowym stanem animacji. Next.js obsłuży to poprawnie (granica client/server), ale animacja w stopce jest zbędna — footer to statyczny element. Dodatkowy setInterval dla każdej instancji Logo.

**Propozycja:**
Użyć statycznej wersji logo w Footer — zwykły link z tekstem `zeprzalka.com` bez animowanego symbolu. `Logo` z animacją zostawić wyłącznie w `Header`.

---

## TIER 3 — Nice to have (jakość, przyszłościowość)

---

### P15 — ActiveTOC nie obsługuje krawędziowego przypadku braku nagłówków

**Plik:** `src/components/blog/ActiveTOC.tsx`

**Problem:**
Jeśli artykuł nie ma nagłówków h2, komponent renderuje pusty `<ul>` z nagłówkiem "Spis treści" — niepotrzebny element UI.

**Propozycja:**
```tsx
if (headings.length === 0) return null
```

---

### P16 — `HeroB.tsx` — `<h2>` użyty semantycznie jako podtytuł

**Plik:** `src/components/alternative/HeroB.tsx`, linia 19

**Problem:**
```tsx
<h2 className="sm:text-xl md:text-2xl text-muted-foreground ...">
  Digital Solutions Architect ...
</h2>
```
Na stronie głównej hierarchia nagłówków powinna być `h1` → następnie sekcje z `h2`. Użycie `h2` jako podtytułu/podnagłówka bezpośrednio pod `h1` w tej samej sekcji jest semantycznie nieścisłe — to bardziej `<p>` lub `<strong>`.

**Propozycja:**
Zmienić na `<p>` z odpowiednimi klasami stylistycznymi. Pozwoli to utrzymać poprawną hierarchię heading tree.

---

### P17 — Breadcrumb w artykule nie prowadzi do aktualnej strony

**Plik:** `src/app/blog/[slug]/page.tsx`, linia 213

**Problem:**
```tsx
<BreadcrumbLink href="#" aria-current="page">
  {post.frontmatter.title}
</BreadcrumbLink>
```
`href="#"` to niedziałający link. Breadcrumb powinien wskazywać na `href={`/blog/${slug}`}` lub być renderowany jako nieaktywny `<span>` (bez elementu `<a>`). Wpływa też na JSON-LD breadcrumb schema (której i tak brakuje).

**Propozycja:**
```tsx
<BreadcrumbItem>
  <span aria-current="page">{post.frontmatter.title}</span>
</BreadcrumbItem>
```

---

### P18 — BlogC karty mają stałą wysokość `h-[450px]` — ucina treść

**Plik:** `src/components/alternative/BlogC.tsx`, linia 33

**Problem:**
```tsx
<Card className="relative h-[450px] overflow-hidden ...">
```
Stała wysokość może ucinać długie tytuły lub powodować nierówny układ. Na małych ekranach (< 768px) jest jedna kolumna — karty są bardzo wysokie bez potrzeby.

**Propozycja:**
Użyć `aspect-ratio` lub dynamicznej wysokości z `min-h`. Rozważyć `aspect-[4/3]` dla bardziej elastycznego layoutu.

---

### P19 — GalleryB — inline styles na efekty hover zamiast Tailwind group-*

**Plik:** `src/components/alternative/GalleryB.tsx`, linie 121–149

**Problem:**
```tsx
style={{ opacity: isHovered ? 1 : 0 }}
style={{ transform: isHovered ? "translateY(0)" : "translateY(8px)", opacity: isHovered ? 1 : 0 }}
```
Używa React state (`hoveredId`) i inline styles do efektów hover. Tailwind oferuje do tego `group-hover:` — podejście CSS-only bez JS state, lepsze dla performance.

**Propozycja:**
Zastąpić `useState(hoveredId)` przez Tailwind `group-hover:opacity-100`, `group-hover:translate-y-0`. Komponent może stać się Server Component.

---

### P20 — Brak `<meta name="description">` na stronie `tag/[tag]`

**Plik:** `src/app/blog/tag/[tag]/page.tsx`

**Problem:**
Strona filtrowania po tagach prawdopodobnie nie ma dynamicznie generowanych metadanych (brak `generateMetadata`). Strony tagów są indeksowane, ale bez description mają słabe SEO.

**Propozycja:**
Dodać `generateMetadata` analogicznie do `[slug]/page.tsx`:
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `#${tag}`,
    description: `Artykuły o tematyce: ${tag}`,
  }
}
```

---


---

### P22 — Bar.tsx — gradient odwrócony w dark mode

**Plik:** `src/components/layout/Bar.tsx`, linia 29

**Problem:**
```tsx
className="h-full bg-gradient-to-r from-white to-black dark:from-black dark:to-white"
```
W trybie jasnym: gradient od białego do czarnego — na białym tle pasek jest niewidoczny na początku (biały na białym). W trybie ciemnym: od czarnego do białego — odwrócona logika. Pasek jest funkcjonalnie poprawny (pokazuje postęp), ale wizualnie może być nieczytelny.

**Propozycja:**
Użyć koloru `primary` lub `foreground` z theme variables:
```tsx
className="h-full bg-gradient-to-r from-primary/20 to-primary"
```
Albo stały kolor `bg-primary` bez gradientu.

---

## Podsumowanie priorytetów

| # | Problem | Tier | Pliki |
|---|---------|------|-------|
| P1 | Formularz kontaktu bez backendu | KRYTYCZNY | ContactB.tsx |
| P2 | TOC obsługuje tylko h2 | KRYTYCZNY | posts.ts |
| P3 | Hardcoded URL domeny | KRYTYCZNY | layout.tsx, sitemap.ts, robots.ts, [slug]/page.tsx |
| P4 | Nieużywane komponenty | WAŻNY | sections/, archive/, Full.tsx |
| P5 | Duplikat klas w Header | WAŻNY | Header.tsx |
| P6 | Inline styles w CodeBlock | WAŻNY | CodeBlock.tsx |
| P7 | Zewnętrzne CDN bez fallback w Gallery | WAŻNY | GalleryB.tsx |
| P8 | `<img>` zamiast `<Image>` w Gallery | WAŻNY | GalleryB.tsx |
| P9 | Duplikacja tablicy symbols | WAŻNY | Logo.tsx, Full.tsx |
| P10 | Niespójny format tytułu metadata | WAŻNY | [slug]/page.tsx |
| P11 | Brak paginacji bloga | WAŻNY | blog/page.tsx |
| P12 | JSON-LD — Article zamiast BlogPosting | WAŻNY | [slug]/page.tsx |
| P13 | Placeholder kategorii publicznie dostępny | WAŻNY | kategoria/page.tsx |
| P14 | Logo z animacją w Footer | WAŻNY | Footer.tsx |
| P15 | ActiveTOC bez obsługi pustej listy | NICE TO HAVE | ActiveTOC.tsx |
| P16 | h2 jako podtytuł w HeroB | NICE TO HAVE | HeroB.tsx |
| P17 | Breadcrumb href="#" | NICE TO HAVE | [slug]/page.tsx |
| P18 | Stała wysokość kart BlogC | NICE TO HAVE | BlogC.tsx |
| P19 | Hover state w JS zamiast CSS group-hover | NICE TO HAVE | GalleryB.tsx |
| P20 | Brak generateMetadata na stronach tagów | NICE TO HAVE | tag/[tag]/page.tsx |
| P21 | Drafts w formacie .txt | NICE TO HAVE | content/drafts/ |
| P22 | Gradient paska nieczytelny | NICE TO HAVE | Bar.tsx |
