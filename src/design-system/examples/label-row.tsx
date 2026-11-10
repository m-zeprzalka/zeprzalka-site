import { LabelRow } from "@/components/page/label-row"

export function LabelRowExample() {
  return (
    <ol className="grid w-full gap-6">
      <li>
        <LabelRow label="2011–obecnie">
          <h3 className="font-medium">Projektant i programista</h3>
          <p className="mt-1 text-muted-foreground">
            Etykieta w kolumnie 9,5 rem od 768 px, węziej nad treścią.
          </p>
        </LabelRow>
      </li>
      <li>
        <LabelRow label="01">
          <h3 className="font-medium">Rozmowa</h3>
          <p className="mt-1 text-muted-foreground">
            Ten sam rytm: kroki usług, edukacja, grupy portfolio.
          </p>
        </LabelRow>
      </li>
    </ol>
  )
}
