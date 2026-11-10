import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BrainCircuitIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClapperboardIcon,
  CodeXmlIcon,
  CopyIcon,
  DownloadIcon,
  GraduationCapIcon,
  HistoryIcon,
  MinusIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PenToolIcon,
  PlayIcon,
  PlusIcon,
  RotateCwIcon,
  SearchIcon,
  SunIcon,
  SunMoonIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  Lead,
  type ChapterProps,
} from "@/design-system/ds-section"
import { Example } from "@/design-system/example"
import { IconsExample } from "@/design-system/examples/icons"

/** Każda ikona, której używa strona, i jej znaczenie — nowa ikona to nowy wiersz tutaj. */
const ICONS: readonly { icons: readonly LucideIcon[]; name: string; use: string }[] = [
  {
    icons: [ArrowUpRightIcon],
    name: "ArrowUpRight",
    use: "znak każdego linku (LinkArrow), strona w ⌘K",
  },
  { icons: [ArrowRightIcon], name: "ArrowRight", use: "tylko wysyłka formularza kontaktu" },
  { icons: [ChevronDownIcon], name: "ChevronDown", use: "pokaż wszystkie (obrót 180°)" },
  { icons: [ChevronRightIcon], name: "ChevronRight", use: "okruszki, następna strona" },
  { icons: [ChevronLeftIcon], name: "ChevronLeft", use: "poprzednia strona" },
  { icons: [PlusIcon, MinusIcon], name: "Plus / Minus", use: "akordeon zamknięty i otwarty" },
  { icons: [MoreHorizontalIcon], name: "MoreHorizontal", use: "wielokropek paginacji" },
  { icons: [SearchIcon], name: "Search", use: "⌘K w nagłówku i pole wyszukiwarki" },
  { icons: [SunIcon, MoonIcon], name: "Sun / Moon", use: "przełącznik motywu (wybiera CSS)" },
  { icons: [SunMoonIcon], name: "SunMoon", use: "akcja motywu w ⌘K" },
  {
    icons: [CopyIcon, CheckIcon],
    name: "Copy / Check",
    use: "kopiuj adres i kod, potem potwierdzenie",
  },
  { icons: [PlayIcon, PauseIcon], name: "Play / Pause", use: "wideo: start, galeria" },
  { icons: [XIcon], name: "X", use: "zamknij kartę podglądu" },
  { icons: [DownloadIcon], name: "Download", use: "CV w PDF (przed tekstem)" },
  { icons: [CheckIcon], name: "Check", use: "punkty pakietu, gwarancje" },
  { icons: [RotateCwIcon], name: "RotateCw", use: "ponów — ekran błędu" },
  { icons: [HistoryIcon], name: "History", use: "fraza „15 lat doświadczenia” (start)" },
  { icons: [MonitorSmartphoneIcon], name: "MonitorSmartphone", use: "fraza „webowych” (start)" },
  { icons: [ClapperboardIcon], name: "Clapperboard", use: "fraza „multimedialnych” (start)" },
  { icons: [PenToolIcon], name: "PenTool", use: "kompetencja: projektowanie" },
  { icons: [CodeXmlIcon], name: "CodeXml", use: "kompetencja: development" },
  { icons: [BrainCircuitIcon], name: "BrainCircuit", use: "kompetencja: AI" },
  { icons: [GraduationCapIcon], name: "GraduationCap", use: "kompetencja: wykłady" },
]

export function IconsChapter(props: ChapterProps) {
  return (
    <DsSection {...props} lead="lucide, jeden rozmiar i jedna strzałka linku">
      <DsNote>
        <Lead>Rozmiar.</Lead> Ikony z <Code>lucide-react</Code> (<Code>XxxIcon</Code>, same dostają{" "}
        <Code>aria-hidden</Code>). W przycisku bez klasy rozmiaru: 16 px (
        <Code>{"[&_svg:not([class*='size-'])]:size-4"}</Code> w <Code>buttonVariants</Code>
        ), w małych kontekstach <Code>size-3.5</Code>, w plakietce, klawiszu i przycisku{" "}
        <Code>xs</Code> — <Code>size-3</Code>. Ikona we frazie tekstu ma <Code>size-[0.72em]</Code>{" "}
        i rośnie razem z pismem.
      </DsNote>
      <DsNote>
        <Lead>Miejsce.</Lead> Ikona po tekście mówi, dokąd prowadzi (strzałka, rozwinięcie), przed
        tekstem — czym jest (pobranie, ponów, kompetencja). Ikona bez tekstu to{" "}
        <Code>size=&quot;icon&quot;</Code> z <Code>aria-label</Code>. Kafel ikony:{" "}
        <Code>size-9 rounded-xl border bg-background</Code> (kompetencje),{" "}
        <Code>size-7 rounded-md border</Code> (⌘K).
      </DsNote>
      <DsNote>
        <Lead>↗ to znak linku.</Lead> Każde przejście ze strzałką — podstrona, wpis, realizacja,
        profil, adres zewnętrzny — ma <Code>ArrowUpRight</Code> przez <Code>LinkArrow</Code> (
        <Code>page/link-arrow.tsx</Code>): główne wezwanie, „Wszystkie realizacje” i „Wszystkie
        artykuły”, panel CTA, 404, profile w stopce, dowody kompetencji, galeria, link karty
        podglądu. 16 px; na najechaniu albo fokusie linku z <Code>group/link</Code> wychyla się o 2
        px w swoją stronę. Adres zewnętrzny dostaje jeszcze dopisek o nowej karcie dla czytnika.{" "}
        <Code>ArrowRight</Code> (→) zostaje tylko na wysyłce formularza kontaktu — to działanie, nie
        przejście.
      </DsNote>
      <DsSubheading>Ikony strony</DsSubheading>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
        {ICONS.map(({ icons, name, use }) => (
          <li key={name} className="flex items-start gap-3">
            {/* Para ikon (stan przed i po) w jednym kaflu — jak przełącza je komponent. */}
            <span className="flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border bg-background px-2 text-foreground">
              {icons.map((Icon, index) => (
                <Icon key={index} className="size-4" />
              ))}
            </span>
            <span className="grid min-w-0 gap-0.5">
              <span className="font-mono text-xs wrap-break-word text-foreground">{name}</span>
              <span className="text-xs">{use}</span>
            </span>
          </li>
        ))}
      </ul>
      <Example file="icons.tsx" title="Ikony w przyciskach i linkach">
        <IconsExample />
      </Example>
    </DsSection>
  )
}
