# Roadmapa: droga do produkcji i pierwszych przychodów

Stan na: 2026-08-26. Kod po wdrożeniu roadmapy — build, lint i typy przechodzą
czysto, audyt dostępności daje 0 naruszeń na każdym typie strony.

Legenda: `[x]` zrobione · `[~]` zrobione inaczej niż zakładano (z uzasadnieniem)
· `[ ]` wymaga działania poza kodem (Twojego konta, decyzji albo treści).

---

## Etap 1 — Konfiguracja produkcyjna

- [x] **Domena kanoniczna rozstrzygnięta: `www.zeprzalka.com`.**
      Sprawdzenie na żywo pokazało, że apex odpowiada przekierowaniem 308 na
      `www` — czyli `www` jest domeną główną w Vercelu, a kod wskazywał apex.
      Adres jest teraz w jednym miejscu (`src/lib/site.ts`) i domyślnie wskazuje
      `www`; wszystkie 152 wystąpienia w zbudowanej stronie są spójne.
      **Do zrobienia u Ciebie:** ustaw w Vercelu `NEXT_PUBLIC_SITE_URL` na
      `https://www.zeprzalka.com` **albo usuń tę zmienną** — wartość domyślna
      jest już poprawna.
- [ ] **Zmienne środowiskowe w Vercel (Production):** `SMTP_HOST`, `SMTP_PORT`,
      `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, opcjonalnie `CONTACT_EMAIL`,
      `NEXT_PUBLIC_LINKEDIN_URL`, `GOOGLE_SITE_VERIFICATION`,
      `BING_SITE_VERIFICATION`. Nie dało się zweryfikować — CLI Vercela nie jest
      zalogowane w tym środowisku (`vercel login`, potem `vercel env ls`).
- [ ] **Test formularza kontaktowego na produkcji** (wysyłka + odbiór +
      odpowiedź na reply-to). Kod ma teraz dodatkowo limit zgłoszeń, więc przy
      testach nie wysyłaj więcej niż 5 wiadomości na 10 minut z jednego adresu.
- [x] **Commit i push zmian** — historia rozbita na commity tematyczne.
      Deploy: `vercel deploy --prod` (push na GitHub nie wyzwala builda).
- [ ] **Decyzja o 7 nieużywanych filmach w `public/`**
      (Polish-Ukrainian-Israeli-Tech-Summit, Realizacje-motoryzacyjne,
      White-Paintings-Black-Paintings, banana-socks-min, cellove, content-sport,
      rolki-lifestyle — ~13 MB). Nadal leżą poza repozytorium.
      **Potrzebuję od Ciebie tytułów i kategorii**, żeby dodać je do portfolio —
      sam nie przypiszę im nazw klientów. Alternatywa: usuwamy pliki.

## Etap 2 — Widoczność w Google

- [ ] **Google Search Console**: weryfikacja domeny i zgłoszenie sitemapy.
      Kod jest gotowy: ustaw `GOOGLE_SITE_VERIFICATION` (sam token, bez
      znacznika `<meta>`), a znacznik pojawi się na wszystkich stronach.
- [ ] **Bing Webmaster Tools**: analogicznie `BING_SITE_VERIFICATION`.
- [x] **Analityka**: `@vercel/analytics` i `@vercel/speed-insights` wpięte
      w layout. Oba skrypty ładują się z własnej domeny (`/_vercel/…`), nie
      ustawiają ciasteczek i nie wymagają banera zgody. Lokalnie zwracają 404 —
      działają dopiero po wdrożeniu na Vercela.
- [x] **Dane strukturalne zweryfikowane lokalnie**: `WebSite` + `Person` (/),
      `ProfilePage` (/o-mnie), `BlogPosting` + `BreadcrumbList` (wpisy),
      `ProfessionalService` + `OfferCatalog` (/uslugi) — wszystkie z kompletem
      wymaganych pól i bezwzględnymi adresami obrazów. Po wdrożeniu warto
      przepuścić przez Rich Results Test dla pewności.
- [x] **Lighthouse**: desktop 100/100/100 (wydajność, dostępność, SEO),
      mobile 95/100/100. CLS 0 na wszystkich stronach.

## Etap 3 — Konwersja i wiarygodność

- [ ] **LinkedIn**: kod czeka na adres. Ustaw `NEXT_PUBLIC_LINKEDIN_URL`, a
      profil sam dopisze się do stopki i do pola `sameAs` w danych
      strukturalnych na `/` i `/o-mnie` (`src/lib/site.ts`).
- [x] **Sekcja usług z widełkami cen**: nowa strona `/uslugi` — pięć pakietów,
      opieka miesięczna wyróżniona jako przychód powtarzalny, trzy kroki
      współpracy i wezwanie do wyceny. Podlinkowana w nagłówku, stopce, menu
      mobilnym i mapie strony.
      **Ceny pochodzą z rekomendacji w docs/MONETYZACJA.md i wymagają Twojego
      potwierdzenia przed wdrożeniem** — wszystkie siedzą w jednym pliku
      (`src/lib/services.ts`), zmiana stawki to zmiana jednej liczby.
- [ ] **2–3 case studies** (Orlen, Vinci, aifeed.pl): problem → rozwiązanie →
      wynik. To praca redakcyjna — potrzebuję od Ciebie liczb i kontekstu.
- [ ] **Social proof**: rekomendacje muszą być prawdziwe, więc nie da się ich
      napisać za Ciebie. Poproś 3–5 klientów, wtedy dołożę sekcję.
- [x] **CV do pobrania (PDF)**: generowane ze strony `/o-mnie`
      (`public/cv-michal-zeprzalka.pdf`, 2 strony, 147 KB), przycisk wrócił.
      Style druku ukrywają nawigację i stopkę, więc wydruk każdej strony jest
      czysty. Po większej zmianie treści `/o-mnie` wygeneruj PDF ponownie.
- [x] **Wezwanie do działania pod każdym wpisem** (`components/blog/PostCta`):
      realizuje regułę z docs/SEO.md §3 — każdy artykuł prowadzi do `/kontakt`
      i `/o-mnie`, bez dopisywania czegokolwiek do 27 plików z treścią.

## Etap 4 — Wydajność i bezpieczeństwo

- [x] **Optymalizacja obrazków** — wariant (b) z tego dokumentu: pre-kompresja
      w `public/`. 22 pliki JPEG → WebP przy zachowaniu jakości:
      **4,6 MB → 464 KB (−90%)**. Odwołania w treści i frontmatterze
      przepisane, `images.unoptimized: true` zostaje (limit planu Hobby).
- [x] **Wideo hero**: ponowna kompresja **4,0 → 1,8 MB** (VP9) i
      **5,8 → 3,2 MB** (H.264), bez widocznej różnicy w jakości. Do tego
      prawdziwy poster (28 KB WebP) zamiast przezroczystego piksela,
      `preload="metadata"` i wstępne pobranie posteru. LCP na mobile: 3,6 → 3,0 s.
- [x] **Postery w portfolio**: osiem kadrów WebP zamiast pustych ramek —
      galeria pokazuje treść, zanim wideo się wczyta.
- [~] **CSP**: wdrożone jako polityka oparta na źródłach (`default-src 'self'`
      plus jawne listy dla skryptów, stylów, obrazów, mediów, czcionek
      i połączeń). **Świadomie bez nonce'ów**: w App Routerze nonce wymusza
      renderowanie na żądanie, a serwis ma kilkadziesiąt stron statycznych —
      zamieniłby je w dynamiczne i skasował cache brzegowy. Polityka nie
      zatrzyma wstrzyknięcia inline, ale odcina ładowanie obcego kodu
      i wyprowadzanie danych, czyli realne wektory dla serwisu bez logowania.
- [x] **Limit zgłoszeń formularza**: 5 wysyłek na 10 minut z jednego adresu
      (`src/lib/rate-limit.ts`), z komunikatem dla użytkownika. Licznik działa
      w pamięci instancji — zatrzymuje zalewanie formularza, nie zdeterminowanego
      napastnika. Gdy pojawi się realny spam: Upstash albo reguła Vercel WAF.
- [x] **Ikony i manifest**: monogram 192/512 px, `apple-icon` 180 px,
      `manifest.webmanifest` z kolorami motywu.
- [x] **Dedykowany obraz Open Graph 1200×630** generowany kodem — osobny dla
      serwisu i **osobny dla każdego wpisu**, z jego tytułem, kategoriami
      i czasem czytania. Wcześniej wszystko dzieliło jeden PNG 300×300.

## Etap 5 — Maszyna treści (proces ciągły)

- [ ] **Rytm publikacji: 1 wpis / tydzień.** W `content/drafts/` czeka 5 szkiców.
- [ ] **Dystrybucja każdego wpisu**: LinkedIn, grupy branżowe, newsletter.
- [ ] **Przegląd GSC co miesiąc**: które frazy rosną → pod nie kolejne wpisy.

---

## Co zostało zrobione 2026-08-26

**Adresy i dane strukturalne**
- `src/lib/site.ts` jako jedyne źródło adresu, nazwy, opisu, autora i profili
  społecznościowych (wcześniej powielone w 8 plikach).
- Autor w danych strukturalnych to teraz osoba, a nie nazwa domeny — pokrywa się
  z widoczną notą pod wpisem. Bloki `author` usunięte z 25 plików treści.
- Obsługa `updated` we frontmatterze → `dateModified` i data w mapie strony.

**Higiena treści (docs/SEO.md §4)**
- Kategorie: **48 → 6** (Web development, Next.js, AI, SaaS, Design, Projekty).
- Tagi: **114 → 18** przekrojowych (86 tagów występowało dokładnie raz).
- Tytuły: 12 skróconych do ≤60 znaków, fraza kluczowa z przodu.
- Opisy meta: 20 przepisanych, wszystkie 27 mieszczą się w 140–165 znakach.
- Efekt uboczny: **207 → 70 stron statycznych** — zniknęły dziesiątki stron
  z jednym wpisem, które rozpraszały ruch i budżet indeksowania.

**Dostępność**
- Etykiety dla nawigacji w nagłówku, stopce i menu mobilnym.
- Naprawiona hierarchia nagłówków na listach kategorii i tagów.
- Nagłówki kategorii pokazują właściwą nazwę („AI"), a nie odwrócony slug („ai").
- Audyt axe: **0 naruszeń** na wszystkich typach stron.

## Co zostało zrobione w audycie (2026-08-12)

Bezpieczeństwo formularza (escapowanie HTML, ochrona nagłówków przed CRLF,
limity długości, honeypot, obsługa błędów SMTP), naprawiony link `/cv` → 404,
naruszenie zasad hooków w `ActiveTOC`, parsowanie `?page=`, nagłówki
bezpieczeństwa, deduplikacja komponentów (`components/home`, wspólny
`ContactForm`, `slugify` w `lib/posts.ts`), aktualizacja `eslint-config-next`.
