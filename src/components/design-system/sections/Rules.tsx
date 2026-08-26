import {
  DsBlock,
  DsInline,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

export function RulesSection() {
  return (
    <DsSection
      id="zasady"
      title="Zasady i dostępność"
      description="Reguły, które trzymają serwis w jednym tonie — językowe, redakcyjne i techniczne. To one decydują, czy nowa sekcja będzie wyglądać jak reszta strony."
    >
      <DsBlock title="Język i ton">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground leading-relaxed">
          <li>
            Polski, pierwsza osoba liczby pojedynczej („Projektuję”,
            „Wdrażam”) — serwis jednej osoby, nie agencji.
          </li>
          <li>
            Zdania w wersji naturalnej, bez wersalików w treści. Wersaliki
            wyłącznie w etykietach kolumn bocznych.
          </li>
          <li>
            Nagłówki sekcji jednowyrazowe (Kompetencje, Portfolio, Blog,
            Kontakt); wprowadzenie pod nimi w jednym zdaniu, do ok. 45 znaków.
          </li>
          <li>
            Wezwania do działania mówią o korzyści, nie o mechanice:
            „Zarezerwuj Bezpłatną Konsultację”, nie „Wyślij formularz”.
          </li>
          <li>Angielskie nazwy technologii zostają w oryginale.</li>
        </ul>
      </DsBlock>

      <DsBlock title="Semantyka i SEO">
        <DsTable
          head={["Reguła", "Realizacja"]}
          rows={[
            ["Jeden H1 na stronę", "Hero na stronie głównej, PageHeader na podstronach"],
            ["Sekcje jako landmarki", <span key="a">Element <DsInline>section</DsInline>, treść wpisu w <DsInline>article</DsInline></span>],
            ["Adres kanoniczny", <span key="b"><DsInline>alternates.canonical</DsInline> na każdej podstronie</span>],
            ["Dane strukturalne", "WebSite + Person (/), ProfilePage (/o-mnie), BlogPosting + BreadcrumbList (wpis)"],
            ["Mapa strony", "Statyczne trasy, wpisy i kategorie; tagi celowo pominięte"],
            ["Kanał RSS", <span key="c"><DsInline>/feed.xml</DsInline> + odnośnik alternate w nagłówku</span>],
            ["Język", <span key="d"><DsInline>lang=&quot;pl&quot;</DsInline> na dokumencie, daty formatowane dla pl-PL</span>],
          ]}
        />
      </DsBlock>

      <DsBlock
        title="Dostępność"
        note={
          <>
            Po poprawkach z 26 sierpnia 2026 audyt axe nie zgłasza naruszeń na
            żadnym typie strony. Została jedna luka:{" "}
            <strong className="font-medium text-foreground">
              wideo bez sterowania
            </strong>{" "}
            — materiały w portfolio odtwarzają się w pętli i osoba bez ustawienia
            „ogranicz ruch&rdquo; nie ma jak ich zatrzymać (WCAG 2.2.2).
            Komponent <DsInline>media/SmartVideo</DsInline> (używany przez
            warianty) ma już przycisk pauzy — wystarczy przenieść go do galerii.
          </>
        }
      >
        <DsTable
          head={["Obszar", "Stan"]}
          rows={[
            ["Kontrast", "Pary tokenów spełniają AA w obu motywach"],
            ["Fokus", "Widoczny pierścień na każdym elemencie interaktywnym"],
            ["Obsługa klawiaturą", "Pełna — menu mobilne, akordeon i panel z Radix"],
            ["Teksty alternatywne", "Obrazy wpisów opisane tytułem; kadry portfolio dekoracyjne"],
            ["Etykiety landmarków", "Każda nawigacja ma własną nazwę"],
            ["Kolejność nagłówków", "Bez przeskoków (H1 → H2 → H3)"],
            [
              "Ograniczony ruch",
              "Obsługiwany: animacje, przewijanie, sygnet i wideo respektują ustawienie systemowe",
            ],
          ]}
        />
      </DsBlock>

      <DsBlock title="Zasady kodu">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground leading-relaxed">
          <li>
            Komponenty domyślnie serwerowe. <DsInline>&quot;use client&quot;</DsInline>{" "}
            tylko tam, gdzie potrzebny jest stan lub API przeglądarki.
          </li>
          <li>
            Klasa <DsInline>className</DsInline> od układu, nie od kolorów —
            wygląd zmieniamy w komponencie w <DsInline>src/components/ui</DsInline>.
          </li>
          <li>
            Odstępy przez <DsInline>gap</DsInline> we flexie i siatce, nie przez{" "}
            <DsInline>space-y</DsInline>.
          </li>
          <li>
            Treść list (kompetencje, dane kontaktowe, doświadczenie) jako tablice
            nad komponentem — nigdy wpisana w JSX.
          </li>
        </ul>
      </DsBlock>
    </DsSection>
  )
}
