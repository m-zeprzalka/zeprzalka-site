# Roadmapa: droga do produkcji i pierwszych przychodów

Stan na: 2026-08-12. Kod po audycie — build, lint i typy przechodzą czysto.
Kolejność etapów = kolejność wykonywania. Etap 1 i 2 to warunek startu,
reszta to rozwój po uruchomieniu.

---

## Etap 1 — Konfiguracja produkcyjna (1 dzień)

- [ ] **Decyzja o domenie kanonicznej: `www.zeprzalka.com` vs `zeprzalka.com`.**
      Strona żyje pod `www`, ale `NEXT_PUBLIC_SITE_URL` wskazuje apex — to
      sprzeczne sygnały dla Google (canonicale i sitemap pokazują inną domenę
      niż serwowana). W Vercel → Settings → Domains ustaw jedną jako primary
      (druga dostanie 301) i ustaw `NEXT_PUBLIC_SITE_URL` na dokładnie tę samą.
- [ ] **Zmienne środowiskowe w Vercel (Production):** `NEXT_PUBLIC_SITE_URL`,
      `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
      opcjonalnie `CONTACT_EMAIL`. Sprawdź: `vercel env ls`.
- [ ] **Test formularza kontaktowego na produkcji** (wysyłka + odbiór maila,
      odpowiedź na reply-to). To główny kanał pozyskiwania zleceń — musi działać.
- [ ] **Commit i deploy zmian z audytu**, weryfikacja
      `/sitemap.xml`, `/robots.txt`, `/feed.xml` na produkcji.
- [ ] **Decyzja o 7 nieużywanych filmach w `public/`** (Polish-Ukrainian-…,
      Realizacje-motoryzacyjne, White-Paintings…, banana-socks, cellove,
      content-sport, rolki-lifestyle — ~13 MB): dodać jako nowe pozycje
      portfolio w `src/components/home/Gallery.tsx` albo usunąć z katalogu.
      Teraz leżą martwe i nie są w repo.

## Etap 2 — Widoczność w Google (1–2 dni, PRIORYTET)

- [ ] **Google Search Console**: weryfikacja domeny (rekord DNS TXT),
      zgłoszenie `sitemap.xml`, sprawdzenie indeksacji po tygodniu.
- [ ] **Bing Webmaster Tools** (import z GSC — 10 minut, darmowy ruch).
- [ ] **Analityka**: Vercel Web Analytics (`@vercel/analytics`) albo GA4 /
      Plausible. Bez danych nie da się prowadzić SEO ani mierzyć konwersji.
- [ ] **Rich Results Test** (search.google.com/test/rich-results) dla strony
      głównej, wpisu bloga i /o-mnie — JSON-LD jest wdrożony, upewnij się,
      że Google go czyta.
- [ ] **PageSpeed Insights / Lighthouse** na produkcji — cel: 90+ mobile.
      Największy koszt to wideo hero (~4–6 MB); patrz Etap 4.

## Etap 3 — Konwersja i wiarygodność (1 tydzień)

- [ ] **LinkedIn**: uzupełnij profil, podlinkuj na stronie (stopka + `sameAs`
      w JSON-LD na stronie głównej i /o-mnie). Szukasz pracy/zleceń —
      LinkedIn to najważniejszy brakujący kanał; dziś jest tylko GitHub i FB.
- [ ] **Sekcja usług z widełkami cen** — patrz docs/MONETYZACJA.md. Klient
      musi w 5 sekund wiedzieć: co robisz, za ile "od", jak zamówić.
- [ ] **2–3 case studies** (Orlen, Vinci, aifeed.pl): problem → rozwiązanie →
      wynik. Każde jako wpis bloga lub podstrona — to one sprzedają, nie
      sama galeria wideo.
- [ ] **Social proof**: poproś 3–5 byłych klientów o krótkie rekomendacje
      (mogą być z LinkedIn), dodaj sekcję na stronie głównej.
- [ ] **CV do pobrania (PDF)** — przycisk był, ale plik nie istniał (usunięty
      w audycie). Wygeneruj PDF z /o-mnie i przywróć przycisk.

## Etap 4 — Wydajność i szlify (równolegle, opcjonalnie)

- [ ] **Optymalizacja obrazków**: `images.unoptimized: true` to obejście
      limitu planu Hobby. Opcje: (a) Vercel Pro, (b) pre-kompresja do WebP
      w `public/` i zostawienie unoptimized, (c) zewnętrzny loader
      (Cloudinary free tier). Obrazki blogowe ~100–300 KB są OK; priorytet niski.
- [ ] **Wideo hero**: rozważ skrócenie/mocniejszą kompresję (cel < 2 MB)
      albo `preload="none"` + statyczny poster — to główny wpływ na LCP.
- [ ] **Pełne CSP z nonce** (middleware/proxy) — obecnie jest częściowe CSP;
      pełne wymaga nonce'ów dla skryptów Next. Do zrobienia przy okazji.
- [ ] **Rate limiting formularza** — honeypot już jest; jeśli pojawi się spam,
      dodaj Upstash Ratelimit albo regułę Vercel WAF.
- [ ] **apple-touch-icon + manifest.ts** — drobiazg brandingowy.

## Etap 5 — Maszyna treści (proces ciągły)

- [ ] **Rytm publikacji: 1 wpis / tydzień** (szczegóły w docs/SEO.md).
      W `content/drafts/` czeka 5 szkiców — to gotowy backlog na miesiąc.
- [ ] **Dystrybucja każdego wpisu**: LinkedIn (posty PL działają świetnie),
      dev.to / wykop / odpowiednie grupy FB, newsletter (docelowo).
- [ ] **Przegląd GSC co miesiąc**: które frazy rosną → pod nie kolejne wpisy.

---

## Co zostało zrobione w audycie (2026-08-12)

**Bezpieczeństwo / błędy:**
- Formularz: escapowanie HTML (wcześniej treść szła do maila bez sanityzacji —
  wstrzyknięcie dowolnego HTML), ochrona nagłówków przed CRLF injection,
  limity długości pól, honeypot, try/catch na SMTP (wcześniej błąd wysyłki
  crashował akcję), jawny komunikat gdy brak konfiguracji SMTP, usunięty
  zahardkodowany host SMTP z kodu.
- Naprawiony link `/cv` → 404 w menu mobilnym (strona nazywa się `/o-mnie`).
- Naprawione naruszenie zasad hooków w `ActiveTOC` (early return przed hookami).
- Odporne parsowanie `?page=` na liście bloga (NaN dawał pustą stronę).
- Poprawiona data `2025-11-4` → `2025-11-04` we frontmatter.
- Usunięty przestarzały nagłówek `X-XSS-Protection`, dodane częściowe CSP,
  `poweredByHeader: false`, cache immutable dla wideo.

**Czystość kodu:**
- Zunifikowany formularz kontaktowy (2 kopie → `components/ContactForm.tsx`).
- `components/alternative/{HeroB,SkillsB,GalleryB,ContactB,BlogC}` →
  `components/home/{Hero,Skills,Gallery,Contact,BlogPreview}`.
- Usunięty zduplikowany `lib/utils.ts` (root), nieużywane komponenty
  (`ScrollRestoration`, `ui/navigation-menu`, `ui/sonner`, `SidebarMenuSkeleton`),
  zdublowany `ScrollToTop` na stronie wpisu.
- Usunięte nieużywane zależności: `remark`, `@mdx-js/loader`, `@mdx-js/react`,
  `@next/mdx`, `@types/mdx`, `sonner`, `@radix-ui/react-navigation-menu`.
- `eslint-config-next` 15 → 16 (spójnie z Next 16) + nowy flat config;
  wszystkie nowe błędy reguł React Hooks naprawione u źródła.
- Wspólny `slugify()` i helpery kategorii/tagów w `lib/posts.ts`
  (wcześniej ta sama logika w 8 miejscach), `cache()` na odczycie postów.

**SEO** — patrz docs/SEO.md, sekcja "Stan techniczny".
