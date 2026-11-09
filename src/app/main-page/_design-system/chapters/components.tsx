import {
  Code,
  DsNote,
  DsSection,
  Lead,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { Example } from "@/app/main-page/_design-system/example"
import { AccordionExample } from "@/app/main-page/_design-system/examples/accordion"
import { BadgeExample } from "@/app/main-page/_design-system/examples/badge"
import { BreadcrumbExample } from "@/app/main-page/_design-system/examples/breadcrumb"
import { ButtonExample } from "@/app/main-page/_design-system/examples/button"
import { ButtonMediaExample } from "@/app/main-page/_design-system/examples/button-media"
import { ButtonSizesExample } from "@/app/main-page/_design-system/examples/button-sizes"
import { ChoiceGroupExample } from "@/app/main-page/_design-system/examples/choice-group"
import { DialogExample } from "@/app/main-page/_design-system/examples/dialog"
import { FieldExample } from "@/app/main-page/_design-system/examples/field"
import { KbdExample } from "@/app/main-page/_design-system/examples/kbd"
import { PopoverExample } from "@/app/main-page/_design-system/examples/popover"
import { SeparatorExample } from "@/app/main-page/_design-system/examples/separator"

export function ComponentsChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="shadcn z katalogu _components/ui">
      <DsNote>
        <Lead>Serwer czy klient.</Lead> <Code>Button</Code>, <Code>Badge</Code>,{" "}
        <Code>Breadcrumb</Code>, <Code>Kbd</Code>, <Code>Input</Code> i <Code>Pagination</Code> są
        serwerowe — tam <Code>asChild</Code> jest bezpieczne. Akordeon, popover, okna i etykiety to
        Radix z klienta, a <Code>field.tsx</Code> jest kliencki przez <Code>FieldError</Code> — w
        nich <Code>asChild</Code> tylko z dzieckiem z klienta (ZASADY §10).
      </DsNote>
      <DsNote>
        <Lead>Gdzie indziej na tej stronie:</Lead> <Code>Pagination</Code> — w <Code>Pager</Code>{" "}
        (Podstrony), <Code>Command</Code>, <Code>Dialog</Code> i <Code>Drawer</Code> — w ⌘K
        (Nawigacja), <Code>Popover</Code> — w karcie podglądu pod frazą (Strona główna),{" "}
        <Code>Label</Code> — w <Code>FieldLabel</Code>.
      </DsNote>

      <Example
        file="button.tsx"
        title="Przycisk — warianty"
        note={
          <>
            Pigułki. Na stronie: <Code>default</Code> (główne wezwanie), <Code>secondary</Code> (⌘K,
            profile, „Odwiedź stronę”), <Code>outline</Code> (e-mail, CV, kolejne działania),{" "}
            <Code>ghost</Code> (motyw, stopka, „wszystkie …”). <Code>link</Code> i{" "}
            <Code>destructive</Code> są w systemie, ale strona ich nie używa.
          </>
        }
      >
        <ButtonExample />
      </Example>
      <Example
        file="button-sizes.tsx"
        title="Przycisk — rozmiary"
        note={
          <>
            Na stronie: <Code>sm</Code>, <Code>default</Code>, <Code>lg</Code> (44 px — cel dotyku)
            i <Code>icon</Code>; w nagłówku 36 px z polem dotyku powiększonym przez{" "}
            <Code>after:-inset-1</Code>. Pozostałe rozmiary — z shadcn, nieużywane.
          </>
        }
      >
        <ButtonSizesExample />
      </Example>
      <Example
        file="button-media.tsx"
        title="Przycisk na kadrze — wariant media"
        note={
          <>
            Własny wariant (<Code>{"// zeprzalka:"}</Code>): ciemne szkło z rozmyciem, niezależne od
            motywu. Wideo startu i kafle galerii.
          </>
        }
      >
        <ButtonMediaExample />
      </Example>
      <Example
        file="badge.tsx"
        title="Plakietka"
        note={
          <>
            Rozmiar <Code>md</Code> (<Code>{"// zeprzalka:"}</Code>) — tagi kompetencji i plakietki
            kategorii; z <Code>asChild</Code> staje się linkiem (najechanie z{" "}
            <Code>[a&]:hover</Code>).
          </>
        }
      >
        <BadgeExample />
      </Example>
      <Example
        file="kbd.tsx"
        title="Klawisz"
        note={
          <>
            Krój bez szeryfów i tło <Code>background</Code> — klawisz czyta się jako klawisz także
            na przycisku <Code>secondary</Code>. Skrót w nagłówku i podpowiedzi w stopce ⌘K.
          </>
        }
      >
        <KbdExample />
      </Example>
      <Example
        file="field.tsx"
        title="Pola formularza i błąd"
        note={
          <>
            <Code>Input</Code> i <Code>Textarea</Code> mają 44 px i promień xl. Błąd:{" "}
            <Code>aria-invalid</Code> na polu i <Code>FieldError</Code> pod nim (
            <Code>aria-describedby</Code>) — formularz po wysyłce przenosi fokus na pierwsze błędne
            pole.
          </>
        }
      >
        <FieldExample />
      </Example>
      <Example
        file="choice-group.tsx"
        title="Wybór jednokrotny — ChoiceGroup"
        note={
          <>
            Jedyny własny prymityw w <Code>ui/</Code>: <Code>RadioGroup</Code> i{" "}
            <Code>ToggleGroup</Code> shadcn to Radix ze stanem, a tu wystarczy natywne radio z
            wyglądem z <Code>buttonVariants</Code>.
          </>
        }
      >
        <ChoiceGroupExample />
      </Example>
      <Example
        file="accordion.tsx"
        title="Akordeon"
        note={
          <>
            „+” i „−” zamiast strzałki, <Code>headingLevel</Code> dla poprawnej struktury nagłówków,{" "}
            <Code>forceMount</Code> — treść zamkniętego panelu zostaje w HTML (SEO), ale poza Tabem.
            Wariant <Code>row</Code> (wiersz indeksu) — w rozdziale „Podstrony”.
          </>
        }
      >
        <AccordionExample />
      </Example>
      <Example file="breadcrumb.tsx" title="Okruszki">
        <BreadcrumbExample />
      </Example>
      <Example
        file="separator.tsx"
        title="Linia"
        note={
          <>
            W treści strony linie to częściej <Code>border-t</Code> albo kropka <Code>·</Code> w
            metadanych (<Code>aria-hidden</Code>); <Code>Separator</Code> składa pola (
            <Code>FieldSeparator</Code>).
          </>
        }
      >
        <SeparatorExample />
      </Example>
      <Example file="popover.tsx" title="Popover">
        <PopoverExample />
      </Example>
      <Example
        file="dialog.tsx"
        title="Okno dialogowe"
        note={
          <>
            Promień 2xl i bez krzyżyka z angielskim „Close” (<Code>{"// zeprzalka:"}</Code>). Na
            stronie niesie ⌘K; na telefonie zamiast niego arkusz od dołu (<Code>Drawer</Code>).
          </>
        }
      >
        <DialogExample />
      </Example>
    </DsSection>
  )
}
