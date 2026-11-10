import { ChoiceGroup } from "@/components/ui/choice-group"

export function ChoiceGroupExample() {
  return (
    <div className="grid gap-6">
      {/* `multiple` — pola wyboru (kilka naraz), jak rodzaj projektu w formularzu. */}
      <ChoiceGroup
        legend="Rodzaj projektu"
        description="Możesz wybrać kilka."
        name="ds-types"
        options={["Strona internetowa", "Animacja", "Grafika", "Inny"]}
        multiple
        defaultValue={["Strona internetowa", "Animacja"]}
      />
      {/* Bez `multiple` — natywne radio: strzałki, Tab i wysyłka działają bez hydratacji. */}
      <ChoiceGroup
        legend="Budżet (jeden)"
        name="ds-budget"
        options={["do 10 000 zł", "10–30 000 zł", "powyżej 30 000 zł"]}
        defaultValue={["10–30 000 zł"]}
      />
    </div>
  )
}
