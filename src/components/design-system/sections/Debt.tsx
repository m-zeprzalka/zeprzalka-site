import { Badge } from "@/components/ui/badge"
import { DsInline, DsSection } from "@/components/design-system/primitives"

interface Item {
  weight: "wysoki" | "średni" | "niski"
  title: string
  detail: React.ReactNode
  where: string
}

/**
 * Lista rozbieżności między zamierzeniem a kodem. Katalog projektowy jest
 * właściwym miejscem, żeby je trzymać: każda z nich to decyzja do podjęcia,
 * a nie błąd do cichego poprawienia.
 */
const items: Item[] = [
  {
    weight: "średni",
    title: "Wideo portfolio bez możliwości zatrzymania",
    detail: (
      <>
        Osiem materiałów odtwarza się w pętli bez żadnego sterowania. WCAG
        2.2.2 wymaga mechanizmu pauzy dla ruchu trwającego dłużej niż 5 sekund.
      </>
    ),
    where: "components/home/Gallery.tsx",
  },
  {
    weight: "średni",
    title: "Dwa różne rozmiary przycisku CTA",
    detail: (
      <>
        Strona główna używa <DsInline>size=&quot;lg&quot; className=&quot;p-6&quot;</DsInline>,
        /o-mnie samego <DsInline>size=&quot;lg&quot;</DsInline>. To dwie różne
        wysokości dla tej samej roli.
      </>
    ),
    where: "home/Hero.tsx, o-mnie/page.tsx",
  },
  {
    weight: "niski",
    title: "Klasa, która nic nie robi",
    detail: (
      <>
        Nagłówki sekcji mają <DsInline>md:font-semi-bold</DsInline> — taka klasa
        nie istnieje w Tailwindzie.
      </>
    ),
    where: "Skills, Gallery, Contact",
  },
  {
    weight: "niski",
    title: "Kolor spoza palety",
    detail: (
      <>
        <DsInline>bg-green-500</DsInline> w kropce dostępności i w komunikacie
        sukcesu. Do zamiany na token (np. <DsInline>--available</DsInline>).
      </>
    ),
    where: "Hero, o-mnie, ContactForm",
  },
  {
    weight: "niski",
    title: "Niespójne przyklejenie kolumn",
    detail: (
      <>
        <DsInline>top-22</DsInline> na stronie głównej, <DsInline>top-24</DsInline>{" "}
        w /kontakt i w podglądzie bloga.
      </>
    ),
    where: "sekcje strony głównej, /kontakt",
  },
  {
    weight: "niski",
    title: "Karta bez karty",
    detail: (
      <>
        Sekcja kontaktu owija treść w <DsInline>Card</DsInline> z wyłączonym
        tłem, obrysem i paddingiem — komponent nie wnosi tam niczego.
      </>
    ),
    where: "components/home/Contact.tsx",
  },
]

const weightStyles: Record<Item["weight"], string> = {
  wysoki: "border-destructive/40 text-destructive",
  średni: "",
  niski: "text-muted-foreground",
}

const fixed = [
  "Serwis renderuje się krojem Geist — zmienne krojów przeniesione z <body> na <html> (layout.tsx).",
  "Ograniczony ruch obsłużony — reguła w globals.css plus zatrzymanie sygnetu i wideo.",
  "Numeracja kompetencji: krycie 30% → 80%, kontrast 1,47:1 → 3,23:1 (jasny motyw).",
  "Nawigacja w nagłówku, stopce i menu mobilnym ma etykiety — audyt axe czysty na każdej stronie.",
  "Hierarchia nagłówków na listach kategorii i tagów bez przeskoków; nagłówek kategorii pokazuje nazwę, nie slug.",
  "Optymalizacja obrazków włączona po przejściu na plan Vercel Pro — do tego pre-kompresja do WebP (4,6 MB → 464 KB) i atrybuty sizes na listach.",
  "Zależności: 44 podatności (20 wysokich) → 0. Next 16.3.3, nodemailer 9, nadpisania dla parserów YAML.",
]

export function DebtSection() {
  return (
    <DsSection
      id="dlug"
      title="Rozbieżności i dług"
      description="Miejsca, w których kod odbiega od systemu. Każda pozycja to decyzja do podjęcia — dlatego mieszka w katalogu, a nie w komentarzu w kodzie."
    >
      <div className="rounded-lg border border-primary/30 bg-card p-5">
        <h3 className="text-base font-semibold">Naprawione 26 sierpnia 2026</h3>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
          {fixed.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Po tych zmianach audyt axe nie zgłasza już żadnego naruszenia na
          żadnym typie strony, a Lighthouse daje 100 na desktopie i 95 na
          mobile.
        </p>
      </div>

      <ol className="flex flex-col gap-px overflow-hidden rounded-lg border bg-border">
        {items.map((item, index) => (
          <li key={item.title} className="flex flex-col gap-2 bg-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <Badge
                variant="outline"
                className={`text-xs font-normal ${weightStyles[item.weight]}`}
              >
                {item.weight}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.detail}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {item.where}
            </p>
          </li>
        ))}
      </ol>
    </DsSection>
  )
}
