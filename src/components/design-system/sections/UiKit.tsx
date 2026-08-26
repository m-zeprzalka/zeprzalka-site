import Link from "next/link"
import { CalendarDays, Clock, Menu, MousePointerClick } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DsBlock,
  DsCode,
  DsInline,
  DsPreview,
  DsSection,
  DsTable,
} from "@/components/design-system/primitives"

const inventory: [string, string, string][] = [
  ["accordion", "Kompetencje na stronie głównej", "W użyciu"],
  ["avatar", "Nota autora pod wpisem", "W użyciu"],
  ["badge", "Statusy, kategorie, tagi, narzędzia", "W użyciu (11 miejsc)"],
  ["breadcrumb", "Nawigacja okruszkowa wpisu", "W użyciu"],
  ["button", "CTA, formularz, paginacja, motyw", "W użyciu (9 miejsc)"],
  ["card", "Portfolio, sekcja kontaktu", "W użyciu"],
  ["input", "Formularz kontaktowy", "W użyciu"],
  ["pagination", "Lista bloga", "W użyciu"],
  ["separator", "Nagłówki stron, /o-mnie, /kontakt", "W użyciu"],
  ["sheet", "Menu mobilne", "W użyciu"],
  ["sidebar", "Spis treści wpisu blogowego", "W użyciu"],
  ["skeleton", "Ekran ładowania", "W użyciu"],
  ["tooltip", "Wyłącznie wewnątrz komponentu sidebar", "Pośrednio"],
  ["alert · field · label · spinner · textarea", "—", "Zainstalowane, nieużywane"],
]

export function UiKitSection() {
  return (
    <DsSection
      id="ui"
      title="Komponenty bazowe"
      description="Warstwa shadcn/ui w stylu new-york na prymitywach Radix. Kod komponentów leży w repozytorium (src/components/ui) i jest własnością projektu — zmiany wprowadzamy w nim, nie przez nadpisywanie klas w miejscu użycia."
    >
      <DsBlock title="Inwentarz">
        <DsTable
          head={["Komponent", "Gdzie w serwisie", "Status"]}
          rows={inventory.map(([name, where, status]) => [
            name,
            where,
            status,
          ])}
        />
      </DsBlock>

      <DsBlock
        title="Button"
        description="Sześć wariantów i cztery rozmiary. W serwisie używane są trzy warianty: default, outline i ghost."
        note={
          <>
            Serwis powiększa przyciski klasą <DsInline>p-6</DsInline> zamiast
            używać rozmiaru <DsInline>size=&quot;lg&quot;</DsInline> zgodnie
            z jego definicją — stąd dwie różne wysokości CTA na stronie głównej
            i w /o-mnie. Do ujednolicenia.
          </>
        }
      >
        <DsPreview label="Warianty">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Domyślny</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </DsPreview>

        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Rozmiary">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">sm</Button>
              <Button>default</Button>
              <Button size="lg">lg</Button>
              <Button size="icon" aria-label="Menu">
                <Menu />
              </Button>
            </div>
          </DsPreview>

          <DsPreview label="Stany">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Aktywny</Button>
              <Button disabled>Wyłączony</Button>
              <Button variant="outline" disabled>
                Wyłączony outline
              </Button>
            </div>
          </DsPreview>
        </div>

        <DsPreview
          label="Wzorzec CTA ze strony głównej"
          code={`<Button asChild size="lg" className="p-6 w-fit">\n  <Link href="/kontakt"><MousePointerClick />Zarezerwuj Bezpłatną Konsultację</Link>\n</Button>`}
        >
          <Button asChild size="lg" className="p-6 w-fit">
            <Link href="/kontakt">
              <MousePointerClick />
              Zarezerwuj Bezpłatną Konsultację
            </Link>
          </Button>
        </DsPreview>
      </DsBlock>

      <DsBlock
        title="Badge"
        description="Najczęściej używany komponent w serwisie. Cztery warianty pełnią różne role: outline dla kategorii i narzędzi, secondary dla tagów, default rzadko."
      >
        <DsPreview label="Warianty">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Domyślny</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </DsPreview>

        <div className="grid gap-4 md:grid-cols-3">
          <DsPreview
            label="Status dostępności"
            code='variant="outline" px-4 py-2'
          >
            <Badge variant="outline" className="flex items-center gap-2 text-sm px-4 py-2">
              <span className="w-2 h-2 animate-pulse rounded-full bg-green-500" />
              Gotowy do współpracy
            </Badge>
          </DsPreview>
          <DsPreview label="Kategoria wpisu" code='variant="outline" text-xs'>
            <Badge variant="outline" className="text-xs">
              Web Development
            </Badge>
          </DsPreview>
          <DsPreview label="Narzędzie / tag" code='variant="secondary" text-xs font-normal'>
            <Badge variant="secondary" className="text-xs font-normal">
              Next.js
            </Badge>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Card"
        description="Pełna kompozycja komponentu. W serwisie występuje w dwóch skrajnych postaciach: karta portfolio (bez paddingu, samo wideo) i karta kontaktu (bez tła i obrysu)."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Pełna kompozycja">
            <Card>
              <CardHeader>
                <CardTitle>Opowiedz o swoim projekcie</CardTitle>
                <CardDescription>
                  Im bardziej szczegółowy opis, tym precyzyjniejsza wycena.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Treść karty w tokenach card / card-foreground.
                </p>
              </CardContent>
            </Card>
          </DsPreview>
          <DsPreview
            label="Karta portfolio"
            code="break-inside-avoid overflow-hidden group hover:shadow-xl"
          >
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="relative -my-6 aspect-video bg-muted/30">
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 px-3 py-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  UX/UI Design
                </Badge>
              </div>
            </Card>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock
        title="Accordion"
        description="Jedna pozycja otwarta naraz (type=single, collapsible), pierwsza rozwinięta domyślnie."
      >
        <DsPreview code='type="single" collapsible defaultValue="item-1"'>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-t">
              <AccordionTrigger className="py-8 hover:no-underline">
                <div className="flex w-full items-center gap-4 lg:gap-6">
                  <span className="text-2xl md:text-3xl text-muted-foreground/80">
                    01
                  </span>
                  <span className="text-xl sm:text-3xl">Projektowanie Produktu</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Od analizy rynku i potrzeb użytkowników, przez architekturę
                  informacji, po interaktywne prototypy.
                </p>
                <div className="flex flex-wrap gap-2 py-4">
                  {["User Experience (UX)", "User Interface (UI)"].map((tool) => (
                    <Badge key={tool} variant="outline" className="px-3 py-1">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-t">
              <AccordionTrigger className="py-8 hover:no-underline">
                <div className="flex w-full items-center gap-4 lg:gap-6">
                  <span className="text-2xl md:text-3xl text-muted-foreground/80">
                    02
                  </span>
                  <span className="text-xl sm:text-3xl">Development i Technologia</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-base text-muted-foreground">Treść pozycji.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DsPreview>
      </DsBlock>

      <DsBlock
        title="Pola formularza"
        note={
          <>
            Formularz kontaktowy używa <DsInline>Input</DsInline> z komponentów,
            ale etykiety są zwykłymi <DsInline>&lt;label&gt;</DsInline>,
            a pole wieloliniowe to ręcznie ostylowany{" "}
            <DsInline>&lt;textarea&gt;</DsInline> — mimo że komponenty{" "}
            <DsInline>label</DsInline>, <DsInline>textarea</DsInline> i{" "}
            <DsInline>field</DsInline> są w projekcie. Ujednolicenie usunęłoby
            ok. 20 linii powtórzonych klas.
          </>
        }
      >
        <DsPreview label="Wzorzec z formularza kontaktowego" code="className=&quot;py-6 px-4&quot;">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ds-name" className="mb-2 block text-sm font-medium">
                Imię <span className="text-destructive">*</span>
              </label>
              <Input id="ds-name" placeholder="Twoje imię" className="py-6 px-4" />
            </div>
            <div>
              <label htmlFor="ds-email" className="mb-2 block text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="ds-email"
                type="email"
                placeholder="twoj@email.pl"
                className="py-6 px-4"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ds-msg" className="mb-2 block text-sm font-medium">
                Wiadomość <span className="text-destructive">*</span>
              </label>
              <textarea
                id="ds-msg"
                rows={3}
                placeholder="Opisz swój projekt lub pytanie…"
                className="flex w-full resize-none rounded-md border border-input bg-background p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            </div>
          </div>
        </DsPreview>
      </DsBlock>

      <DsBlock title="Nawigacja i metadane">
        <div className="grid gap-4 md:grid-cols-2">
          <DsPreview label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tytuł wpisu</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DsPreview>

          <DsPreview label="Avatar (nota autora)">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border">
                <AvatarImage src="/avatar.png" alt="Michał Zeprzałka" />
                <AvatarFallback>MZ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Michał Zeprzałka</p>
                <p className="text-sm text-muted-foreground">
                  Digital Solutions Architect
                </p>
              </div>
            </div>
          </DsPreview>

          <DsPreview label="Paginacja">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#ui" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#ui" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#ui">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#ui" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </DsPreview>

          <DsPreview label="Metadane wpisu">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                23.08.2026
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                12 min czytania
              </span>
            </div>
          </DsPreview>
        </div>
      </DsBlock>

      <DsBlock title="Warstwy i stany pomocnicze">
        <div className="grid gap-4 md:grid-cols-3">
          <DsPreview label="Sheet (menu mobilne)">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  Otwórz panel
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-64">
                <SheetTitle className="p-6">Panel nawigacji</SheetTitle>
              </SheetContent>
            </Sheet>
          </DsPreview>

          <DsPreview label="Tooltip">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Najedź
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Podpowiedź</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DsPreview>

          <DsPreview label="Skeleton (ekran ładowania)">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-16 w-full rounded-xl bg-muted/20" />
              <Skeleton className="h-4 w-2/3 rounded bg-muted/20" />
            </div>
          </DsPreview>
        </div>
        <DsCode>
          {`// Tooltip nie zawiera własnego providera — wymaga owinięcia
<TooltipProvider><Tooltip>…</Tooltip></TooltipProvider>`}
        </DsCode>
      </DsBlock>

      <DsBlock title="Separator">
        <DsPreview code="Separator — używany po nagłówku strony i między sekcjami /o-mnie">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">Sekcja pierwsza</p>
            <Separator />
            <p className="text-sm text-muted-foreground">Sekcja druga</p>
          </div>
        </DsPreview>
      </DsBlock>
    </DsSection>
  )
}
