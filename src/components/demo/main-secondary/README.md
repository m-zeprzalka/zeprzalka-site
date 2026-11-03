# /main-secondary — alternatywna strona główna

Wariant strony głównej o **identycznej treści i architekturze** (Hero → Kompetencje →
Portfolio → Blog → Kontakt), zbudowany od zera na nowych komponentach.
Nie dotyka `src/components/home/*`, `src/app/page.tsx`, layoutu ani `globals.css`.

## Struktura

| Plik | Rola |
| --- | --- |
| `fonts.ts` | Fonty tylko dla tej trasy: Bricolage Grotesque (display) + Instrument Serif Italic (akcent) |
| `Section.tsx` | `Section` (landmark + siatka) i `SectionHeader` (indeks / tytuł / lead / akcja) |
| `Reveal.tsx` | Ujawnianie przy scrollu — JS tylko ustawia `data-inview`, ruch robi CSS |
| `Words.tsx` | Nagłówek dzielony na słowa (schodkowe wejście), fragmenty `accent` jako `<em>` |
| `Hero` `Skills` `Portfolio` `Blog` `Contact` | Sekcje — Server Components |
| `ContactForm.tsx` | shadcn `Field` / `Textarea` / `Alert` / `Spinner`; ten sam server action i nazwy pól |
| `SectionNav.tsx` | Szyna orientacyjna (≥1400px), aktywna sekcja przez IntersectionObserver |
| `src/app/main-secondary/main-secondary.css` | Style scoped: typografia display, keyframes, scroll-driven, reduced-motion |

Współdzielone z innymi wariantami (poza tym folderem):
`src/lib/home-content.ts` (treść, metadane sekcji, JSON-LD),
`src/components/media/SmartVideo.tsx`, `src/hooks/use-reduced-motion.ts`,
`public/portfolio/*.webp` (klatki z filmów — LCP i CLS = 0).

## Decyzje

- **Zero bibliotek animacji.** Wejście hero: keyframes CSS. Ujawnianie: IntersectionObserver
  (`react-intersection-observer`, już w projekcie) + `transition`. Efekt na hero-media:
  natywne `animation-timeline: view()` w `@supports`. `prefers-reduced-motion` i
  `@media (scripting: none)` wyłączają ruch, nic nie zostaje ukryte.
- **Typografia:** display z ujemnym trackingiem i `clamp()`, akcent serif italic tylko
  w dwóch miejscach (H1 i tytuł formularza), monospace jako warstwa „techniczna”
  (numeracja, metadane, podpisy). Body zostaje na Geist.
- **Wideo:** montowane ~320px przed viewportem, `preload="metadata"`, play/pause wg
  widoczności, natywne proporcje plików zamiast przycinania do 16:9.
- **SEO:** jeden H1, sekcje z `aria-labelledby`, `figure/figcaption`, `time[datetime]`,
  JSON-LD WebSite + Person, `canonical → /` (wariant testowy, brak duplikatu w indeksie).
- **Geist:** globalnie `--font-geist-sans` jest deklarowane na `<body>`, a Tailwind
  ustawia `font-family` na `<html>` — obecna strona renderuje się fontem systemowym.
  Tu naprawione lokalnie (`.main-secondary { font-family: … }`); globalna poprawka to
  przeniesienie klas `geistSans.variable` na `<html>` w `layout.tsx`.
