# Zasady pracy w tym repozytorium (dla agentów AI i ludzi)

zeprzalka.com — strona osobista: portfolio, blog MDX, oferta. Next.js 16 App Router,
React 19, TypeScript strict, Tailwind 4, shadcn/ui, pnpm, Vercel. Opis architektury:
`README.md`; lista zadań: `docs/ROADMAP.md`; dziennik iteracji: `docs/DZIENNIK.md`.

## Twarde zasady

1. **Wygląd strony głównej (`/`, `/en`) jest nietykalny bez zgody właściciela.**
   Każda zmiana pliku z `src/components/home/*`, `layout/*`, `ContactForm`,
   `PortfolioCard` albo `ui/*` → `pnpm visual <bazowy> <zmiana>` musi pokazać 0 px.
2. **Nie zmieniamy tekstów na stronie bez prośby** — copy mieszka w `src/i18n/content/*`.
3. **Żaden tekst nie istnieje w jednym języku.** Moduły treści to lustrzane drzewa
   `pl`/`en` (`en: typeof pl`); dane mają pary `Localized<T>`. Wyjątki: katalog
   `/design-system` (wewnętrzny, `noindex`) i piaskownica `/demo` — tylko po polsku.
4. **Wszystkie strony są statyczne.** Trasy z segmentem: `generateStaticParams` +
   `dynamicParams = false` (literał w pliku trasy). Nie czytamy `searchParams`.
5. **Piaskownica `/demo` jest odizolowana.** Serwis nie importuje z `src/components/demo`
   ani `src/app/demo` ani zależności piaskownicy (`motion`, `@number-flow/react`,
   `react-intersection-observer`) — ESLint to blokuje. Pliki tras dem mają końcówkę `.demo.tsx`.
   Komponenty systemu „Forma” łączą klasy przez `forma/cn.ts` (zna tokeny `fm-*`).
6. **Push na `main` = wdrożenie produkcyjne.** Pracujemy na gałęzi; commit/push tylko na prośbę.
7. **Repozytorium jest publiczne.** Szczegóły bezpieczeństwa wyłącznie w `docs/prywatne/` (gitignore).
8. Każda iteracja dopisuje wpis do `docs/DZIENNIK.md` i aktualizuje dotknięte dokumenty.

## Pułapki

- Ścieżki `fs` w `src/lib/posts.ts` składamy jako `path.join(process.cwd(), "content", …)` —
  gotowa zmienna psuje śledzenie plików Turbopacka (do paczki trafia całe `public/`).
- Next scala metadane płytko — strony przechodzą przez `buildMetadata` (`src/i18n/page-metadata.ts`),
  karty OG daje plik `opengraph-image.tsx` w segmencie (fabryki w `src/lib/og.tsx`).
- `generateImageMetadata` + `generateStaticParams` nie prerenderuje kart OG w Next 16.4 (404).
- Komponenty klienckie nie importują `src/i18n/content/*` — teksty przez propsy (wyjątek:
  `error.tsx` → mały `content/system.ts`). Moduły treści i serwerowe `lib/*` mają
  `import "server-only"`, więc pomyłka kończy się błędem builda.
- „Ta sama strona w drugim języku” liczy wyłącznie `src/i18n/alternates.ts` (metadane,
  mapa strony, przełącznik). Parametry tras bloga i ich kart OG — `src/routes/params.ts`.
- Ciemny motyw działa tylko na ekranie (`@custom-variant dark` w `@media not print`) —
  nowe style ciemne piszemy przez `dark:` albo w `.dark` wewnątrz `@media not print`.
- Wrappery `relative` wokół `ContactForm` (strona główna, `/kontakt`) zostają: bez nich
  pole-pułapka (`absolute -z-10`) zmienia kompozycję warstw i antyaliasing tekstu formularza.
- Klasy przycisków w nagłówku liczy serwer (`buttonVariants`) i podaje propsem do
  komponentów klienckich — `cva` i `tailwind-merge` nie trafiają do wspólnego JS.
- Lokalny build z `VERCEL_ENV=production` po `pnpm dev`: najpierw `rm -rf .next/dev`
  (typy tras dev zawierają dema, których build produkcyjny nie zna).

## Przed commitem

`pnpm check` (treść, formatowanie, lint, build, `check:build` — kontrola gotowego HTML).
Typy: `pnpm typecheck` (z `next typegen`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
