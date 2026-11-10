import {
  Code,
  DsNote,
  DsSection,
  Lead,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { Example } from "@/app/main-page/_design-system/example"
import { ContactExample } from "@/app/main-page/_design-system/examples/contact"
import { FactsExample } from "@/app/main-page/_design-system/examples/facts"
import { HeroExample } from "@/app/main-page/_design-system/examples/hero"
import { PeekCardExample } from "@/app/main-page/_design-system/examples/peek-card"
import { PeekTriggerExample } from "@/app/main-page/_design-system/examples/peek-trigger"
import { PostListExample } from "@/app/main-page/_design-system/examples/post-list"
import { SectionHeadingExample } from "@/app/main-page/_design-system/examples/section-heading"
import { SkillListExample } from "@/app/main-page/_design-system/examples/skill-list"
import { WorkListExample } from "@/app/main-page/_design-system/examples/work-list"

/** Listy z własnym `mt-8` (stoją pod nagłówkiem sekcji) — w ramce przykładu bez górnego wcięcia. */
const LIST = "pt-0 sm:pt-0"

export function HomeChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="Sekcje startu z prawdziwymi danymi">
      <DsNote>
        <Lead>Kompozycja</Lead> (<Code>_variants/wariant-1/home-page.tsx</Code>): start, o mnie,
        kompetencje, portfolio, blog, kontakt. Każda sekcja to <Code>column mt-28 md:mt-36</Code>,
        nagłówek <Code>SectionHeading</Code> i treść w <Code>reveal</Code>. Jeden{" "}
        <Code>PeekProvider</Code> z kartami i jeden <Code>PeekStage</Code> na stronę — tak samo
        tutaj, więc frazy, wiersze i liczby niżej pokazują prawdziwe karty (od 1280 px z myszą — w
        prawym torze, gdzie indziej — popover pod frazą).
      </DsNote>

      <Example
        file="hero.tsx"
        title="Start — status, zdanie z frazami, działania"
        note={
          <>
            Dwutonowe zdanie w <Code>text-display</Code>: tytuł i — szarym — pierwsze zdanie
            biogramu z trzema frazami-kartami. Na starcie słowa wchodzą „harmonijką”, a pod
            działaniami stoi wideo składane ze znaków (rozdział „Ruch”).
          </>
        }
      >
        <HeroExample />
      </Example>
      <Example
        file="section-heading.tsx"
        title="Nagłówek sekcji"
        note={
          <>
            „Tytuł — rozwinięcie” w jednym wierszu: tytuł odczytuje się ze znaków przy wejściu w
            kadr, rozwinięcie po półpauzie małą literą. Bez <Code>lead</Code> — sam tytuł.
          </>
        }
      >
        <SectionHeadingExample />
      </Example>
      <Example
        file="peek-trigger.tsx"
        title="Fraza i podpis z kartą podglądu"
        note={
          <>
            <Code>phrase</Code> — jaśniejsza od tekstu, przerywane podkreślenie, obłe tło przy
            najechaniu; <Code>quiet</Code> — sam odcień (liczby). Kliknięcie myszą nie przypina
            karty w torze; Enter i Spacja otwierają ją jako popover z fokusem w środku. Na dotyku
            popover ma szerokość kolumny — wskazuje ją najbliższy <Code>data-peek-column</Code>.
          </>
        }
      >
        <PeekTriggerExample />
      </Example>
      <Example
        file="peek-card.tsx"
        title="Karta podglądu"
        note={
          <>
            Ten sam wygląd w torze i w popoverze: pierwszy kadr w naturalnych proporcjach (gra tylko
            on), miniatury, podpis, opis albo oś czasu i link z ↗ (<Code>LinkArrow</Code>). Z{" "}
            <Code>onClose</Code> karta ma krzyżyk: na kadrze <Code>variant=&quot;media&quot;</Code>{" "}
            12 px od rogu (jak odtwarzanie, tylko u góry), bez kadru <Code>ghost</Code> obok tytułu.
            Nazwę daje <Code>PeekProvider</Code> (<Code>closeLabel</Code>). Tutaj krzyżyk nic nie
            zamyka.
          </>
        }
      >
        <PeekCardExample />
      </Example>
      <Example
        file="facts.tsx"
        title="Liczby „O mnie”"
        note={
          <>
            Nad nimi na starcie stoi biogram wypełniany przewijaniem (<Code>scroll-fill</Code>,
            rozdział „Ruch”).
          </>
        }
      >
        <FactsExample />
      </Example>
      <Example
        file="skill-list.tsx"
        title="Kompetencje — akordeon z dowodami"
        className={LIST}
        note={
          <>
            Otwarty wiersz staje się kartą (<Code>bg-card</Code>, obrys), pozostałe przygasają.
            Dowody to wiersze z wcięciem i tłem, z ↗ po prawej — wyraźnie klikalne. Kotwica
            realizacji otwiera jej wiersz niżej i przewija do niego (<Code>goToAnchor</Code>).
          </>
        }
      >
        <SkillListExample />
      </Example>
      <Example
        file="work-list.tsx"
        title="Portfolio — indeks realizacji"
        className={LIST}
        note={
          <>
            Grupa w kolumnie etykiety (<Code>LabelRow</Code>), wiersz <Code>row</Code> akordeonu. Od
            1280 px najechanie pokazuje kadr w torze, a kliknięcie przenosi go do panelu (View
            Transition); dotyk — rozwinięcie w miejscu.
          </>
        }
      >
        <WorkListExample />
      </Example>
      <Example
        file="post-list.tsx"
        title="Blog — indeks wpisów"
        className={LIST}
        note={
          <>
            Rok raz na rok w kolumnie etykiety, tytuł i data; „Nowy” obwodzi się odręczną elipsą,
            gdy wiersz wjedzie w kadr. Węziej niż 1280 px najnowszy wpis ma okładkę nad listą.
          </>
        }
      >
        <PostListExample />
      </Example>
      <Example
        file="contact.tsx"
        title="Kontakt — adres i czas odpowiedzi"
        note={
          <>
            Pod tym rzędem na starcie stoi <Code>ContactForm</Code> (akcja serwerowa — tu go nie ma,
            bo wysyłałby prawdziwe wiadomości). Pola i stan błędu — rozdział „Komponenty”. Adres to
            przycisk kopiujący; bez schowka działa zwykły <Code>mailto:</Code>.
          </>
        }
      >
        <ContactExample />
      </Example>
    </DsSection>
  )
}
