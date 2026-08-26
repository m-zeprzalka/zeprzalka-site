import { DsBlock, DsInline, DsSection } from "@/components/design-system/primitives"
import { Swatch } from "@/components/design-system/Swatch"

/**
 * Paleta jest w całości semantyczna: nazwy mówią o roli, nie o barwie.
 * Wartości pochodzą z `src/app/globals.css` i są odczytywane na żywo —
 * przełącznik motywu w nagłówku pokazuje drugi zestaw.
 */
const surfaces = [
  { variable: "--background", name: "background", usage: "Tło strony", on: "--foreground" },
  { variable: "--foreground", name: "foreground", usage: "Tekst podstawowy", on: "--background" },
  { variable: "--card", name: "card", usage: "Karty portfolio, kontenery", on: "--card-foreground" },
  { variable: "--popover", name: "popover", usage: "Warstwy nakładane (Sheet, Tooltip)", on: "--popover-foreground" },
  { variable: "--muted", name: "muted", usage: "Tła drugorzędne, kod, nagłówki tabel", on: "--muted-foreground" },
  { variable: "--accent", name: "accent", usage: "Stan hover elementów nawigacji", on: "--accent-foreground" },
]

const actions = [
  { variable: "--primary", name: "primary", usage: "Przycisk główny, aktywna paginacja, 404", on: "--primary-foreground" },
  { variable: "--secondary", name: "secondary", usage: "Badge drugorzędny, przycisk secondary", on: "--secondary-foreground" },
  { variable: "--destructive", name: "destructive", usage: "Błędy formularza, gwiazdka pola wymaganego", on: "--background" },
]

const lines = [
  { variable: "--border", name: "border", usage: "Wszystkie obrysy i linie rozdzielające" },
  { variable: "--input", name: "input", usage: "Obrys pól formularza" },
  { variable: "--ring", name: "ring", usage: "Pierścień fokusu (3 px, widoczny na klawiaturze)" },
]

const charts = [1, 2, 3, 4, 5].map((index) => ({
  variable: `--chart-${index}`,
  name: `chart-${index}`,
  usage: "Zarezerwowane pod wykresy — obecnie nieużywane",
}))

export function ColorSection() {
  return (
    <DsSection
      id="kolor"
      title="Kolor"
      description="Paleta jest neutralna i w pełni semantyczna — nazwa tokenu opisuje rolę, nie barwę. Dzięki temu jeden komponent działa w obu motywach bez żadnego wariantu „dark”. Wartości poniżej pochodzą wprost z globals.css — kafelek pokazuje próbkę w bieżącym motywie i zapis źródłowy obu palet."
    >
      <DsBlock
        title="Powierzchnie"
        description="Tła i tekst na nich. Litery „Aa” na próbce pokazują parę, która ma zachować kontrast."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {surfaces.map((token) => (
            <Swatch key={token.variable} {...token} />
          ))}
        </div>
      </DsBlock>

      <DsBlock title="Akcje i sygnały">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((token) => (
            <Swatch key={token.variable} {...token} />
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title="Linie i fokus"
        description="Serwis nie używa cieni do oddzielania warstw — robią to obrysy o grubości 1 px."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lines.map((token) => (
            <Swatch key={token.variable} {...token} />
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title="Wykresy"
        description="Jedyne barwne tokeny w systemie. Wprowadzone razem z presetem shadcn, dziś nieużywane — do wykorzystania przy pierwszej wizualizacji danych."
      >
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {charts.map((token) => (
            <Swatch key={token.variable} {...token} />
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title="Zasady"
        note={
          <>
            Wyjątek w kodzie: kropka „Gotowy do współpracy” w sekcji hero i na
            /o-mnie używa surowego <DsInline>bg-green-500</DsInline>. To jedyny
            kolor spoza palety — jeśli ma zostać, powinien dostać własny token
            (np. <DsInline>--available</DsInline>).
          </>
        }
      >
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground leading-relaxed">
          <li>
            Kolory wyłącznie przez tokeny (<DsInline>bg-background</DsInline>,{" "}
            <DsInline>text-muted-foreground</DsInline>) — nigdy przez wartości
            surowe ani klasy z palety Tailwinda.
          </li>
          <li>
            Brak nadpisań <DsInline>dark:</DsInline> na kolorach. Motyw zmienia
            wartości tokenów, nie klasy komponentów.
          </li>
          <li>
            Przezroczystość służy do warstw, nie do odcieni:{" "}
            <DsInline>bg-background/65</DsInline> w nagłówku i stopce,{" "}
            <DsInline>bg-muted/30</DsInline> pod cytatem. Jedyne krycie na
            tekście to <DsInline>text-muted-foreground/80</DsInline> na
            numeracji kompetencji — najniższa wartość, przy której kontrast
            wciąż spełnia próg 3:1 dla dużego tekstu (3,23:1 w jasnym motywie,
            5,19:1 w ciemnym). Wcześniejsze 30% dawało 1,47:1.
          </li>
        </ul>
      </DsBlock>
    </DsSection>
  )
}
