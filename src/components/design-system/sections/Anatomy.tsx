import {
  DsBlock,
  DsCode,
  DsInline,
  DsSection,
} from "@/components/design-system/primitives"

interface Part {
  label: string
  detail: string
}

function Anatomy({ parts }: { parts: Part[] }) {
  return (
    <ol className="flex flex-col gap-px overflow-hidden rounded-lg border bg-border">
      {parts.map((part, index) => (
        <li key={part.label} className="flex gap-4 bg-card p-4">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{part.label}</span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              {part.detail}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function AnatomySection() {
  return (
    <DsSection
      id="sekcje"
      title="Anatomia sekcji"
      description="Strona główna to pięć sekcji o powtarzalnej budowie. Kolejność i role są stałe: obietnica → kompetencje → dowód → wiedza → zaproszenie do rozmowy."
    >
      <DsBlock
        title="01 Hero — obietnica"
        description="Jedyna sekcja bez podziału na kolumny. Cała szerokość, elementy jeden pod drugim."
      >
        <Anatomy
          parts={[
            { label: "Badge dostępności", detail: "Outline, pulsująca kropka, tekst „Gotowy do współpracy”" },
            { label: "H1", detail: "Do 5xl/7xl, waga medium, maksymalnie 5 kolumn szerokości (max-w-5xl)" },
            { label: "Lead", detail: "Rola + staż wyróżniony kolorem foreground, reszta muted" },
            { label: "CTA", detail: "Przycisk główny z ikoną, szerokość dopasowana do treści" },
            { label: "Kadr wideo", detail: "Proporcja 16:9, autoodtwarzanie bez dźwięku, pojawia się po wczytaniu" },
          ]}
        />
      </DsBlock>

      <DsBlock title="02 Kompetencje — zakres">
        <Anatomy
          parts={[
            { label: "Kolumna opisu (3)", detail: "H2 „Kompetencje” + zdanie wprowadzenia, przyklejona" },
            { label: "Akordeon (9)", detail: "Trzy pozycje, numer 01–03 w kolorze muted-foreground/80" },
            { label: "Treść pozycji", detail: "Opis + zestaw narzędzi jako badge outline" },
          ]}
        />
      </DsBlock>

      <DsBlock title="03 Portfolio — dowód">
        <Anatomy
          parts={[
            { label: "Kolumna opisu (3)", detail: "H2 „Portfolio” + zdanie wprowadzenia" },
            { label: "Układ murowany (9)", detail: "1 → 2 → 3 kolumny, karty bez marginesu wewnętrznego" },
            { label: "Kadr", detail: "Wideo mp4 w pętli, montowane 600 px przed wejściem w kadr" },
            { label: "Warstwa hover", detail: "Gradient od dołu, badge kategorii, tytuł wjeżdżający od dołu" },
          ]}
        />
        <DsCode>
          {`// Kadr wideo w karcie — ujemny margines znosi padding karty
<Card className="break-inside-avoid mb-4 overflow-hidden group">
  <div className="relative aspect-video -my-6 bg-muted/30">…</div>
</Card>`}
        </DsCode>
      </DsBlock>

      <DsBlock title="04 Blog — wiedza">
        <Anatomy
          parts={[
            { label: "Kolumna opisu (3)", detail: "H2 „Blog”, zdanie wprowadzenia i przycisk outline do listy" },
            { label: "Siatka wpisów (9)", detail: "Sześć najnowszych, dwie kolumny od sm" },
            { label: "Karta wpisu", detail: "Obraz 16:9, kategorie, tytuł, lead, data i czas czytania" },
          ]}
        />
      </DsBlock>

      <DsBlock
        title="05 Kontakt — zaproszenie"
        note={
          <>
            Sekcja jest owinięta w <DsInline>Card</DsInline> z wyłączonym tłem,
            obrysem i paddingiem (<DsInline>shadow-none bg-transparent border-0 p-0</DsInline>).
            Skoro nic z karty nie zostaje, prostszy byłby zwykły kontener.
          </>
        }
      >
        <Anatomy
          parts={[
            { label: "Kolumna opisu (3)", detail: "H2 „Kontakt” + zdanie wprowadzenia" },
            { label: "Formularz (9)", detail: "Tytuł, opis i pola w dwóch kolumnach od sm" },
            { label: "Stan sukcesu", detail: "Komunikat zielony zastępuje cały formularz" },
          ]}
        />
      </DsBlock>
    </DsSection>
  )
}
