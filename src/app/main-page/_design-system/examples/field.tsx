import { ChoiceGroup } from "@/app/main-page/_components/ui/choice-group"
import { Field, FieldLabel } from "@/app/main-page/_components/ui/field"
import { Input } from "@/app/main-page/_components/ui/input"
import { Textarea } from "@/app/main-page/_components/ui/textarea"

export function FieldExample() {
  return (
    <div className="grid w-full gap-6">
      <Field>
        <FieldLabel htmlFor="ds-name">Imię</FieldLabel>
        <Input id="ds-name" placeholder="Twoje imię" />
      </Field>
      <ChoiceGroup
        legend="Rodzaj projektu"
        name="ds-type"
        options={["Strona", "Sklep", "Aplikacja"]}
        defaultValue="Strona"
      />
      <Field>
        <FieldLabel htmlFor="ds-message">Wiadomość</FieldLabel>
        <Textarea id="ds-message" placeholder="Opisz swój projekt…" />
      </Field>
    </div>
  )
}
