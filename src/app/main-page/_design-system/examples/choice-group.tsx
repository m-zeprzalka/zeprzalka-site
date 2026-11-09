import { ChoiceGroup } from "@/app/main-page/_components/ui/choice-group"

export function ChoiceGroupExample() {
  return (
    // Natywne radio w `fieldset`: strzałki, Tab i wysyłka działają bez hydratacji.
    <ChoiceGroup
      legend="Rodzaj projektu"
      name="ds-type"
      options={["Strona", "Sklep", "Aplikacja", "Wdrożenie AI"]}
      defaultValue="Strona"
    />
  )
}
