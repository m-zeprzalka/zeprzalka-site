import { Code, DsNote, DsSection, Lead, type ChapterProps } from "@/design-system/ds-section"
import { Example } from "@/design-system/example"
import { FooterExample } from "@/design-system/examples/footer"
import { HeaderControlsExample } from "@/design-system/examples/header-controls"
import { SearchExample } from "@/design-system/examples/search"
import { TracksExample } from "@/design-system/examples/tracks"

export function ShellChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="Nagłówek, menu w torze, ⌘K i stopka">
      <DsNote>
        <Lead>Powłoka (MainShell).</Lead> Link „Przejdź do treści”, przyklejony nagłówek (
        <Code>h-16</Code>, rozmycie z trzech warstw bez koloru i kreski), menu główne w lewym torze,{" "}
        <Code>main#main</Code>, stopka. Ciemny motyw jest w HTML od pierwszej klatki, a skrypt przed
        malowaniem ustawia <Code>data-os</Code> (skrót ⌘ albo Ctrl) i kolor paska przeglądarki.{" "}
        <Code>data-scroll-behavior=&quot;smooth&quot;</Code> na <Code>&lt;html&gt;</Code>: kotwice
        przewijają płynnie, a przejście na inną stronę od razu zaczyna się na górze (Next 16 wyłącza
        płynność na czas nawigacji tylko z tym atrybutem).
      </DsNote>
      <DsNote>
        <Lead>Nawigacja.</Lead> Nagłówek nie ma menu: od 1280 px podstrony prowadzi{" "}
        <Code>RailNav</Code> w lewym torze, węziej — ⌘K (na telefonie arkusz od dołu) i lista w
        stopce. Bieżąca podstrona ma kropkę (wpis podświetla „Blog”). Rozdziały wpisu i tej strony (
        <Code>TableOfContents</Code>) stoją w prawym torze, na wysokości menu: pełne nazwy łamane w
        szerokości toru, kropka płynie do rozdziału, którego nagłówek minął 45% okna. Menu gaśnie
        nad stopką, spis — za końcem treści (<Code>[data-toc-scope]</Code>) i na czas karty podglądu
        w tym samym torze (<Code>useEdgeAbove</Code> w <Code>lib/hooks.ts</Code>); fokus z
        klawiatury pokazuje je z powrotem.
      </DsNote>

      <Example
        file="header-controls.tsx"
        title="Nagłówek — logo, język, motyw"
        note={
          <>
            Logo zaczyna się, a ikona motywu kończy dokładnie na krawędziach kolumny. Język to
            segmenty w stylu <Code>Tabs</Code>: drugi prowadzi na odpowiednik oglądanej strony z jej{" "}
            <Code>hreflang</Code>. Przycisk „Szukaj” jest w nagłówku tej strony.
          </>
        }
      >
        <HeaderControlsExample />
      </Example>
      <Example
        file="tracks.tsx"
        title="Tory — menu główne i spis rozdziałów"
        note={
          <>
            Obraz statyczny w szerokości toru (<Code>w-(--container-track)</Code>). Żywe menu stoi
            od 1280 px w lewym torze, a spis tej strony — w prawym (wchodzi z prawej). Przewiń i
            patrz, jak kropka spisu idzie za rozdziałem; najedź na frazę — spis ustąpi karcie.
          </>
        }
      >
        <TracksExample />
      </Example>
      <Example
        file="search.tsx"
        title="Wyszukiwarka ⌘K"
        note={
          <>
            Grupy: strony (menu główne), realizacje, wpisy, akcje — bez kotwic sekcji. Od tabletu
            okno na szerokość kolumny z podglądem obok listy, na telefonie arkusz, który nie włącza
            sam klawiatury. Kod okna (<Code>cmdk</Code>, <Code>vaul</Code>) pobiera się dopiero przy
            najechaniu na przycisk.
          </>
        }
      >
        <SearchExample />
      </Example>
      <Example
        file="footer.tsx"
        title="Stopka — podstrony, czas, profile, znak"
        note={
          <>
            Jedyne linki podstron w HTML poza torem. Godzina w Warszawie liczy się po hydratacji
            (szerokość zarezerwowana cyframi tabelarycznymi), znak „Zeprzałka” to SVG z{" "}
            <Code>textLength</Code> — zawsze dokładnie na szerokość, bez mierzenia.
          </>
        }
      >
        <FooterExample />
      </Example>
    </DsSection>
  )
}
