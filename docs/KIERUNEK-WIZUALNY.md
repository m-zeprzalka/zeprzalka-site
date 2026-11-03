# Kierunek wizualny: „Precyzja”

Stan na 3 listopada 2026 (iteracja 2). Zastępuje propozycję „Studio nocą” z 2 listopada,
którą odrzuciłeś: montaż i film odkładamy na bok. **Wygląd strony głównej zmienia się
wyłącznie za Twoją zgodą.** Nowe rzeczy rodzą się w piaskownicy `/demo`, a dopiero
potem przechodzą do serwisu.

Raporty źródłowe (lokalnie, w `.gitignore`): `docs/prywatne/raporty-2026-11/iteracja-2/`
`ux-ui.md` (audyt, 138 zrzutów) i `inspiracje.md` (25 wzorców, techniki, narzędzia, kroje).

---

## 1. Diagnoza obecnego wyglądu: 3,9/10

Interfejs jest już czarno-biały, więc nowy kierunek to ewolucja, a nie budowa od zera.
Psuje go brak systemu i brak kierunku obrazu.

1. **Czterech kompetencji nie widać.** Strona główna pokazuje inne trzy (projektowanie,
   development, komunikacja wizualna). AI jest tagiem, a wykładów i Nagrody Rektora w HTML
   strony głównej nie ma wcale.
2. **Pierwszy ekran nie przedstawia autora.** H1 mógłby należeć do każdego software house'u,
   a wideo to pastelowy render cudzej strony.
3. **Kolor pochodzi z obrazów, nie z systemu.** Render w hero, białe mockupy, pomarańczowo-turkusowe
   okładki AI, pięć identycznych tęczowych logo Makerkit.
4. **Prace są anonimowe.** Podpis kafla pojawia się dopiero po najechaniu (na telefonie nigdy),
   kursor-łapka nie prowadzi nigdzie, nie ma żadnego case study.
5. **Nie ma systemu typografii:** 35 stylów tekstu, 11 stopni, 4 grubości, 7 wartości trackingu.
   Geist Mono występuje tylko w blokach kodu.
6. **Nie ma języka ruchu.** Jedyna animacja to pulsująca zielona kropka. `transition: all`
   stoi na 29 elementach, a hover przycisku CTA jest niewidoczny.
7. **Stany nie są zaprojektowane:** fokus na CTA niewidoczny, błędy formularza jako natywne dymki.
8. Cztery osie wyrównania na podstronach, trzy skale odstępów sekcji, przyciski 48/40/36/32 px.

**Do zachowania:** neutralna paleta bez odcienia i linie 1 px zamiast cieni (80% kierunku już
jest w kodzie), układ 3/9 z przyklejoną kolumną, numeracja kompetencji, katalog `/design-system`,
transparentny cennik.

## 2. Zasady „Precyzji”

Twoje słowa: *chirurgiczna i architektoniczna precyzja z designerskim sznytem*.
Czarny, biały, szarości. Jeden kolor może przyjść później.

1. **Precyzja to struktura, nie dekoracja.** Elementy rysunku technicznego (wymiary, siatka,
   podziałka) pojawiają się tylko tam, gdzie niosą **prawdziwą informację**.
2. **Dwa głosy pisma.** Geist mówi, Geist Mono mierzy. Mono wyłącznie dla danych: wymiary,
   daty, czasy, współrzędne w próbkach, kod.
3. **Linia włosowa zamiast kart i cieni.** Kąty proste. Sekcje i rejestry rysuje linia 1 px.
4. **Kolor należy do pracy, nie do interfejsu.** Obrazy w listach są czarno-białe i odzyskują
   kolor przy wskazaniu. Akcent, jeśli wróci, to tylko jako „redline” (pomiar, fokus, zaznaczenie)
   w jednym tokenie `--pz-signal`.
5. **Ruch jest krótki i zdecydowany.** Elementy „wskakują” na miejsce, linie się rysują, liczby
   się odliczają. Nic nie pływa. Przy „ogranicz ruch” wszystko stoi.
6. **Interakcja nagradza ciekawość.** Rzeczy do dotknięcia, które pokazują warsztat:
   uchwyty krzywej, pomiar elementów, generowanie tokenów.
7. **Polska typografia jako podpis rzemiosła.** Twarde spacje po jednoliterowych spójnikach,
   półpauzy, „cudzysłowy”.

### Czego unikamy (klisze, także stron generowanych przez AI)

Według oficjalnego skilla Anthropic `frontend-design` i researchu: numeracja 01/02/03 dla treści,
które nie są sekwencją; etykiety kapitalikami w mono nad każdym nagłówkiem; metadane łączone
kropką w środku (`A · B · C`); strzałka `→` doklejona do linków; prawie czarne tło z jednym
jaskrawym akcentem; „Linear look” (poświaty, gradienty); magnetyczne przyciski i okrągłe
„Get in touch”; ekran ładowania z licznikiem procentów; smooth scroll przejmujący przewijanie;
display-groteski (Bricolage, Archivo) i ciepły papier z szeryfem.

## 3. Demo: `/demo/precyzja`

Strona główna w nowym języku, zbudowana **wyłącznie z treści, które serwis już ma**
(`src/i18n`, `src/lib`). Nowe są tylko podpisy próbek i etykiety liczb. Oglądasz lokalnie
(`pnpm dev` → http://localhost:3000/demo/precyzja) albo na podglądzie gałęzi na Vercelu.
Na produkcji tego adresu nie ma.

| Sekcja | Co pokazuje | Sygnatura |
| --- | --- | --- |
| Hero | H1 jako **zaznaczony obiekt w edytorze**: ramka, 8 uchwytów, etykieta z prawdziwymi wymiarami mierzonymi na żywo („h1 1081 × 346”), po najechaniu parametry kroju | wymiary z prawdziwymi liczbami |
| Hero, tło | siatka konstrukcyjna widoczna tylko w „świetle” kursora | siatka na żądanie |
| Hero, liczby | 12+ lat, 30+ klientów, 2016–2026 wykłady, 99,28% — liczniki mechaniczne (CSS) | dane z życiorysu |
| Kompetencje | 4 obszary zamiast 3: **projektowanie** (krzywa Béziera do przeciągania: mysz, dotyk, klawiatura), **kod** (komponent pisany na żywo, kolorowanie składni wagą, nie barwą, wynik builda), **AI** (zdanie z hero generowane token po tokenie z prawdopodobieństwami), **wykłady** (skala 0–100 z lupą 99–100 dla 99,28%) | interaktywne objaśnienia — Twój wyróżnik jako wykładowcy |
| Portfolio | rejestr: projekt, rodzaj pracy, dziedzina; kadr podąża za kursorem, czerń i biel → kolor przy wskazaniu, reszta wierszy przygasa | kolor należy do pracy |
| Blog | rejestr wpisów: data, tytuł, kategoria, czas lektury | — |
| Kontakt | formularz na samej linii bazowej, e-mail kopiowany jednym kliknięciem | — |
| Stopka | fakty liczone przy buildzie: liczba artykułów i realizacji, data ostatniego wpisu | prawdziwe dane zamiast ozdób |
| Nagłówek | miarka z podziałką jako wskaźnik lektury, czas w Warszawie, przełącznik „Wymiary” | miarka |
| Tryb „Wymiary” | siatka 12 kolumn i pomiar dowolnego elementu pod kursorem (znacznik, szerokość × wysokość, stopień/interlinia), Esc zamyka | easter egg dla ludzi z branży |

Techniczne: zero nowych zależności, wejścia i ujawnianie przez CSS (`animation-timeline: view()`
działa od października 2026 we wszystkich trzech silnikach), JS tylko tam, gdzie mierzy
albo reaguje na kursor; pełna obsługa `prefers-reduced-motion`; oba motywy; telefon.

**Specimen systemu: `/demo/precyzja/system`** — kolor (8 tokenów, oba motywy), 7 stopni pisma,
8 odstępów, siatka, 4 czasy ruchu, przyciski, link, pole. Źródło prawdy to jeden plik
`src/components/demo/precyzja/precyzja.css` (pięć warstw: tokeny, baza, prymitywy, wzorce, ruch).

Dawne warianty z sierpnia leżą obok: `/demo/main-secondary`, `/demo/main-third`, `/demo/main-fourth`.

## 4. Plan prac nad UX/UI

| Etap | Co | Wynik | Kto |
| --- | --- | --- | --- |
| **A. Decyzja na demie** | Oglądasz `/demo/precyzja` na telefonie i komputerze, w obu motywach. Zapisujesz: co zostaje, co wylatuje, czego brakuje. Najlepiej w formie z §6 | „tak / nie / zmień” dla każdej sygnatury | Ty |
| **B. System w serwisie** | Tokeny „Precyzji” jako druga warstwa w `globals.css` (bez ruszania obecnych), komponenty-prymitywy w `src/components/ui/`, katalog `/design-system` przepisany na nowy system | DS v2 w kodzie, katalog pokazuje nowe | Kod |
| **C. Podstrony testowe** | Twoje „/page-test”: `/demo/podstrony/*` — wpis, `/uslugi`, `/o-mnie`, `/portfolio` w nowym języku, na prawdziwych danych | wzorce stron do akceptacji | Kod |
| **D. Wdrożenie podstron** | Podstrony przechodzą do serwisu (strona główna nietknięta, strażnik `pnpm visual` pilnuje) | nowy wygląd serwisu poza główną | Kod |
| **E. Strona główna** | Za Twoją zgodą, razem z nowymi tekstami (rola, 4 kompetencje, liczby) | nowa strona główna | Ty + kod |
| **F. Case studies** | Szablon `/portfolio/[slug]` w języku „Precyzji”: para „zdjęcie + rysunek” (zrzut UI obok schematu), przejście kafel → case przez `<ViewTransition>` | 3 case studies | Ty + kod |

Kolejność ma sens: etap A kosztuje Cię godzinę, a rozstrzyga wszystko dalej.

## 5. Narzędzia, które warto dołożyć

**Do pracy z Claude Code (zestaw minimalny):**

| Narzędzie | Po co | Instalacja |
| --- | --- | --- |
| skill **frontend-design** (Anthropic) | proces „plan → przegląd względem briefu → budowa → krytyka”, lista klisz AI | `/plugin install frontend-design@claude-plugins-official` |
| **Chrome DevTools MCP** | pomiar LCP/INP, dostępność, ślad wydajności w prawdziwej przeglądarce | `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` |
| **Playwright MCP** | zrzuty w wielu szerokościach, przejścia ścieżek (uzupełnia `pnpm visual`) | `claude mcp add playwright npx @playwright/mcp@latest` |
| **Next.js DevTools MCP** | błędy i trasy z serwera dev Next 16 | `claude mcp add next-devtools npx next-devtools-mcp@latest` |
| skille **emilkowalski/skill** i **jakubkrehel/skills** | rzemiosło ruchu i interfejsu (krzywe, czasy, optyczne wyrównanie) | `npx skills add emilkowalski/skill`, `npx skills add jakubkrehel/skills` |
| **Figma MCP** | tylko jeśli projektujesz w Figmie — plan Starter daje 6 wywołań miesięcznie, sensownie od miejsca Dev/Full | `claude plugin install figma@claude-plugins-official` |

**Biblioteki (dopiero gdy CSS nie wystarczy):** Motion 14 w trybie `LazyMotion` (~5 kB) do gestów
i układu, Number Flow do liczników, `<ViewTransition>` z React 19.3 do przejść między stronami.
**Niepotrzebne:** GSAP, Lenis, Spline, Unicorn Studio, ciężkie rejestry komponentów
(21st.dev daje 2 darmowe komponenty dziennie, Aceternity/Magic UI to dziś klisze).

**Krój:** zostajemy przy Geist + Geist Mono, dopóki układ i siatka nie dowiodą charakteru.
Jeśli specimen pokaże, że czegoś brakuje: **GT Standard** (Grilli Type, superrodzina z wersjami
Mono, koncepcyjnie najbliżej „standaryzacji”) na trialu, obok Geist, na tych samych tekstach.
Darmowa alternatywa: Instrument Sans + Commit Mono.

**Gdzie szukać inspiracji w tym kierunku:** makingsoftware.com (rysunek techniczny w blogu
wykładowcy), devouringdetails.com i rauno.me (miarka, akcent jako „redline”), chanhdai.com
(wymiarowanie na shadcn i Tailwindzie), stripe.dev i oxide.computer (podpisy „FIG.”, prawdziwy
UI zamiast mockupów), officekgdvs.com (zdjęcie obok planu). Galerie: Siteinspire (Monochrome,
Typographic, Architecture) zamiast Awwwards; recent.design (dawne godly.website).
Pełna lista 25 stron z uzasadnieniem: `docs/prywatne/raporty-2026-11/iteracja-2/inspiracje.md`.

## 6. Co od Ciebie (żeby kolejna iteracja była „laserowa”)

**Do etapu A (najpierw):**
- [ ] Notatki do `/demo/precyzja` i `/demo/precyzja/system`: przy każdej sekcji „zostaje / zmień /
      wyrzuć” i jedno zdanie dlaczego. Zrzut z zaznaczeniem jest wart więcej niż opis.
- [ ] 10–15 referencji: URL + **jeden** konkretny detal + dlaczego (np. „miarka przy krawędzi na
      devouringdetails.com, bo pokazuje postęp bez paska”).
- [ ] 3–5 antyreferencji z uzasadnieniem — przyspieszają bardziej niż referencje.
- [ ] Decyzja, gdzie ma być jedno „wow” (404, stopka, intro case study).

**Materiał własny (niezastąpiony):**
- [ ] Portret i zdjęcia pracy w jednym świetle (ręce przy pracy, tablica z wykładu, szkice),
      źródła ≥ 3000 px — konwersję do czerni i bieli robi kod.
- [ ] Do 3 case studies **surowce, nie mockupy**: zrzuty prawdziwego UI w 1× i 2×, szkice,
      wireframe'y, diagramy przepływu, jedna liczba efektu na projekt.
- [ ] Lista klientów ze zgodą na użycie nazwy (NDA), 3–5 opinii z imieniem i rolą.
- [ ] Materiały z wykładów nadające się na interaktywne objaśnienia na blogu.

**Decyzje:** budżet na krój (0 zł / 1–3 tys. zł / więcej), plan w Figmie (jeśli w ogóle),
kolor akcentu (rekomendacja: na razie żaden).

## 7. Dług wizualny obecnej strony (stan po iteracji 2)

| # | Pozycja | Gdzie | Dotyka głównej |
| --- | --- | --- | :-: |
| 1 | Zapętlone wideo bez pauzy (hero, kafle) — WCAG 2.2.2 | `HeroVideo.tsx`, `PortfolioCard.tsx` | tak |
| 2 | Pięć rozmiarów CTA (48, 40, 36, 32 px i `lg`+`p-6`) | Hero, ContactForm, podstrony | tak |
| 3 | Surowe `bg-green-500` w `StatusBadge` i komunikacie sukcesu | `StatusBadge.tsx`, `ContactForm.tsx` | tak |
| 4 | Różne odstępy siatki i `top-22`/`top-24` — dziś jawne w propsach `HomeSection` | `home/*` | tak |
| 5 | „Karta bez karty” w kontakcie, `-my-6` w kaflu portfolio | `home/Contact.tsx`, `PortfolioCard.tsx` | tak |
| 6 | Pole wiadomości w formularzu ze starymi stylami (inne tło w ciemnym motywie, 14 px → zoom na iOS) | `ContactForm.tsx` | tak |
| 7 | Podpisy kafli tylko po najechaniu, kursor-łapka bez akcji | `PortfolioCard.tsx` | tak |
| 8 | Polski „Title Case” i wiszące spójniki — w demie rozwiązane (`typo()`), w serwisie to zmiana tekstów | copy | częściowo |
| 9 | `transition-all` na H1 i leadzie hero | `home/Hero.tsx` | tak |

Rozwiązane w iteracji 2 bez zmiany wyglądu głównej: martwa klasa `md:font-semi-bold`,
cztery kopie nagłówka sekcji (`HomeSection`), dwie kopie odznaki (`StatusBadge`), tokeny
`sidebar-*` i `chart-*`, fałszywe wartości ciemnej palety w katalogu.
