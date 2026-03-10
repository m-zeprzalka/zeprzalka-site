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

