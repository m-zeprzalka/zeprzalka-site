import { Field, FieldError, FieldLabel } from "@/app/main-page/_components/ui/field"
import { Input } from "@/app/main-page/_components/ui/input"
import { Textarea } from "@/app/main-page/_components/ui/textarea"

export function FieldExample() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="ds-name">Imię</FieldLabel>
        <Input id="ds-name" placeholder="Twoje imię" autoComplete="off" />
      </Field>
      <Field>
        <FieldLabel htmlFor="ds-email">E-mail</FieldLabel>
        {/* Błąd: obrys z `aria-invalid`, komunikat pod polem opisuje to pole. */}
        <Input
          id="ds-email"
          type="email"
          defaultValue="m@zeprzalka"
          autoComplete="off"
          aria-invalid
          aria-describedby="ds-email-error"
        />
        <FieldError id="ds-email-error">Podaj pełny adres e-mail.</FieldError>
      </Field>
      <Field className="sm:col-span-2">
        <FieldLabel htmlFor="ds-message">Wiadomość</FieldLabel>
        <Textarea id="ds-message" placeholder="Opisz swój projekt…" />
      </Field>
      <Field>
        <FieldLabel htmlFor="ds-disabled">Pole wyłączone</FieldLabel>
        <Input id="ds-disabled" placeholder="Niedostępne" disabled />
      </Field>
    </div>
  )
}
