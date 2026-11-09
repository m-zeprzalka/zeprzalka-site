import {
  Code,
  DsNote,
  DsSection,
  Lead,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { Example } from "@/app/main-page/_design-system/example"
import { CtaPanelExample } from "@/app/main-page/_design-system/examples/cta-panel"
import { FeaturedPostExample } from "@/app/main-page/_design-system/examples/featured-post"
import { GalleryTileExample } from "@/app/main-page/_design-system/examples/gallery-tile"
import { IndexRowExample } from "@/app/main-page/_design-system/examples/index-row"
import { LabelRowExample } from "@/app/main-page/_design-system/examples/label-row"
import { PackageRowExample } from "@/app/main-page/_design-system/examples/package-row"
import { PagerExample } from "@/app/main-page/_design-system/examples/pager"
import { TermLinksExample } from "@/app/main-page/_design-system/examples/term-links"

export function SubpagesChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="Klocki usług, portfolio, bloga, o mnie i kontaktu">
      <DsNote>
        <Lead>Przepis na podstronę</Lead> (<Code>_components/page</Code>): <Code>PageHeader</Code>,
        potem sekcje <Code>Section</Code> (<Code>column mt-24 md:mt-32</Code> i ten sam nagłówek co
        na starcie), na końcu zamknięcie — <Code>CtaPanel</Code> (usługi, portfolio, blog, wpis),
        formularz (kontakt) albo rząd działań z CV (o mnie). Listy wpisów to wiersze startu (
        <Code>PostIndex</Code> = <Code>PostRow</Code>) z okładką na marginesie. Pierwszy kadr w
        ekranie dostaje <Code>priority</Code> (LCP).
      </DsNote>
      <DsNote>
        Adresy w podglądzie mają prefiks <Code>/main-page</Code> — dokleja go wyłącznie{" "}
        <Code>_lib/routes.ts</Code>, także w linkach z treści wpisów.
      </DsNote>

      <Example
        file="page-header.tsx"
        title="Nagłówek podstrony"
        note={
          <>
            Żywy przykład to nagłówek tej strony (na górze). Okruszki, potem słowa tytułu i
            rozwinięcia wchodzą z rozmycia jedno po drugim, na końcu <Code>children</Code>. Tytuł i
            rozwinięcie to <Code>h1</Code> i <Code>p</Code>, a czytają się jak dwutonowe zdanie
            startu; wpis ma rozwinięcie stopień niżej (<Code>compactLead</Code>).
          </>
        }
      />
      <Example
        file="label-row.tsx"
        title="Wiersz z kolumną etykiety"
        note={
          <>
            Okres, numer kroku albo grupa: od 768 px w kolumnie 9,5 rem, węziej nad treścią.{" "}
            <Code>labelAfter</Code> — w kodzie etykieta po treści (czytnik słyszy najpierw
            nagłówek), a wygląda tak samo.
          </>
        }
      >
        <LabelRowExample />
      </Example>
      <Example
        file="index-row.tsx"
        title="Wiersz indeksu — link"
        note={
          <>
            <Code>INDEX_ROW</Code>: pełna szerokość z wcięciem równym ujemnemu marginesowi, obłe tło
            przy najechaniu. Ten sam kształt co wiersz akordeonu w wariancie <Code>row</Code>.
          </>
        }
      >
        <IndexRowExample />
      </Example>
      <Example
        file="package-row.tsx"
        title="Pakiet usług — akordeon row"
        note={
          <>
            Wiersze renderuje serwer, a wyspa <Code>IndexAccordion</Code> tylko pilnuje, żeby
            otwierany wiersz został w kadrze (<Code>keepInView</Code>).
          </>
        }
      >
        <PackageRowExample />
      </Example>
      <Example
        file="term-links.tsx"
        title="Kategorie i tagi"
        note={
          <>
            Plakietki-linki <Code>md</Code> bez prefetchu (powtarzają się na listach). Cel dotyku
            ok. 26 px — próg AA (24 px) spełniony, decyzja właściciela w ROADMAP.
          </>
        }
      >
        <TermLinksExample />
      </Example>
      <Example
        file="featured-post.tsx"
        title="Wyróżniony wpis"
        note={
          <>
            Link stoi na tytule (jego nazwa to sam tytuł), a rozciągnięty <Code>::after</Code> robi
            z całej karty pole kliknięcia; fokus obrysowuje całą kartę.
          </>
        }
      >
        <FeaturedPostExample />
      </Example>
      <Example
        file="gallery-tile.tsx"
        title="Kafel galerii portfolio"
        note={
          <>
            Klip gra tylko na żądanie (WCAG 2.2.2): najechanie myszą to podgląd, przycisk włącza i
            wyłącza. Plik pobiera się dopiero wtedy, a poza kadrem klip stoi.
          </>
        }
      >
        <GalleryTileExample />
      </Example>
      <Example
        file="pager.tsx"
        title="Strony archiwum — Pager"
        className="[&>nav]:mt-0 [&>nav]:px-0"
        note={
          <>
            shadcn <Code>Pagination</Code> z <Code>next/link</Code>; brzeg archiwum to{" "}
            <Code>span</Code> z <Code>aria-disabled</Code>, nie link bez celu. Na telefonie same
            strzałki z nazwą dla czytnika.
          </>
        }
      >
        <PagerExample />
      </Example>
      <Example
        file="cta-panel.tsx"
        title="Zamknięcie podstrony — CtaPanel"
        note={
          <>
            Pierwsze działanie jest główne (ze strzałką), kolejne coraz cichsze:{" "}
            <Code>default</Code> → <Code>outline</Code> → <Code>ghost</Code>. We wpisie jako{" "}
            <Code>aside</Code>.
          </>
        }
      >
        <CtaPanelExample />
      </Example>
    </DsSection>
  )
}
