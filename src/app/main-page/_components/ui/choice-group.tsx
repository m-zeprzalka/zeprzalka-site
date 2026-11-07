import { buttonVariants } from "@/app/main-page/_components/ui/button"
import { FieldLegend, FieldSet } from "@/app/main-page/_components/ui/field"
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
 * zeprzalka: własny prymityw (wyjątek z ZASADY.md §2). shadcn ma `RadioGroup` i
 * `ToggleGroup`, ale oba to Radix z JS i stanem; tu jednokrotny wybór z pigułek
 * to natywne radio w `fieldset` — strzałki, Tab i wysyłka formularza działają
 * bez hydratacji, a wygląd pochodzi z `buttonVariants` i tokenów systemu.
 */
export function ChoiceGroup({
  legend,
  name,
  options,
  defaultValue,
}: {
  legend: string
  name: string
  options: readonly string[]
  defaultValue?: string
}) {
  return (
    <FieldSet className="gap-0">
      <FieldLegend variant="label">{legend}</FieldLegend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className={CHOICE}>
            <input
              type="radio"
              name={name}
              value={option}
              defaultChecked={defaultValue === option}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </FieldSet>
  )
}
