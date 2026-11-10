import { buttonVariants } from "@/app/main-page/_components/ui/button"
import { FieldDescription, FieldLegend, FieldSet } from "@/app/main-page/_components/ui/field"
import { cn } from "@/lib/utils"

/**
 * Pigułka wyboru: obrys jak przycisk `outline`, zaznaczona — odwrócone kolory, fokus z
 * klawiatury. Zaznaczenie powtórzone z `dark:` — ciemne tło wariantu `outline` ma tę samą
 * swoistość co `has-checked:` i wygrywałoby kolejnością w arkuszu.
 */
const CHOICE = cn(
  buttonVariants({ variant: "outline" }),
  "h-10 cursor-pointer px-4",
  "has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-checked:hover:bg-primary/90 has-checked:hover:text-primary-foreground",
  "dark:has-checked:border-primary dark:has-checked:bg-primary dark:has-checked:hover:bg-primary/90",
  "has-focus-visible:ring-[3px] has-focus-visible:ring-ring"
)

/**
 * zeprzalka: własny prymityw (wyjątek z ZASADY.md §2). shadcn ma `RadioGroup`,
 * `Checkbox` i `ToggleGroup`, ale to Radix z JS i stanem; tu pigułki to natywne pola
 * w `fieldset` — `multiple` daje pola wyboru (kilka naraz, Tab i Spacja), bez niego radio
 * (jedno, strzałki). Wysyłka formularza działa bez hydratacji, a wygląd pochodzi
 * z `buttonVariants` i tokenów systemu. `description` — podpowiedź pod nazwą (np. że można
 * wybrać kilka: zaznaczona pigułka sama tego nie mówi).
 */
export function ChoiceGroup({
  legend,
  name,
  options,
  multiple = false,
  defaultValue = [],
  description,
}: {
  legend: string
  description?: string
  name: string
  options: readonly string[]
  multiple?: boolean
  /** Zaznaczone na start (np. wartości odesłane po błędzie walidacji). */
  defaultValue?: readonly string[]
}) {
  return (
    <FieldSet className="gap-0" aria-describedby={description ? `${name}-description` : undefined}>
      <FieldLegend variant="label">{legend}</FieldLegend>
      {description && (
        <FieldDescription id={`${name}-description`} className="-mt-2 mb-3">
          {description}
        </FieldDescription>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className={CHOICE}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option}
              defaultChecked={defaultValue.includes(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </FieldSet>
  )
}
