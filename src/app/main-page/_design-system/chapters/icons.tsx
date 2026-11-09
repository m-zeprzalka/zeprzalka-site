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
  type LucideIcon,
} from "lucide-react"
import {
  Code,
  DsNote,
  DsSection,
  DsSubheading,
  Lead,
  type ChapterProps,
} from "@/app/main-page/_design-system/ds-section"
import { Example } from "@/app/main-page/_design-system/example"
import { IconsExample } from "@/app/main-page/_design-system/examples/icons"

/** Każda ikona, której używa strona, i jej znaczenie — nowa ikona to nowy wiersz tutaj. */
const ICONS: readonly { icons: readonly LucideIcon[]; name: string; use: string }[] = [
  { icons: [ArrowRightIcon], name: "ArrowRight", use: "główne wezwanie, „wszystkie …”" },
  {
    icons: [ArrowUpRightIcon],
    name: "ArrowUpRight",
    use: "adres zewnętrzny, konkretne miejsce gdzie indziej",
  },
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
    <DsSection {...props} lead="lucide, jeden rozmiar i dwie strzałki">
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
        <Lead>→ i ↗.</Lead> <Code>ArrowRight</Code> — działanie w tym samym toku: główne wezwanie
        (przycisk <Code>default</Code>, <Code>lg</Code>) i „dalej” pod listą („Wszystkie
        realizacje”, „Wszystkie artykuły”). <Code>ArrowUpRight</Code> — wyjście do konkretnego
        miejsca poza bieżącym blokiem: adres zewnętrzny (nowa karta i dopisek dla czytnika),
        realizacja w portfolio, wpis-dowód kompetencji, strona w ⌘K.
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
