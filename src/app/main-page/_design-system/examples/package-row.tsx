import { CheckIcon } from "lucide-react"
import { IndexAccordion } from "@/app/main-page/_components/page/index-accordion"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/main-page/_components/ui/accordion"
import { formatNumber } from "@/i18n/format"
import { packages } from "@/lib/services"

/** Pakiet usług jako wiersz indeksu (`row`): nazwa i cena zawsze widoczne, zakres po rozwinięciu. */
export function PackageRowExample() {
  return (
    <IndexAccordion idPrefix="ds-pakiet-" className="w-full">
      {packages.slice(0, 2).map((pack) => (
        <AccordionItem
          key={pack.id}
          id={`ds-pakiet-${pack.id}`}
          value={pack.id}
          className="border-0"
        >
          <article>
            <AccordionTrigger variant="row">
              <span className="grid flex-1 gap-0.5 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                <span>{pack.name.pl}</span>{" "}
                <span className="text-sm text-foreground tabular-nums sm:text-base">
                  od {formatNumber(pack.from, "pl")} zł
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent forceMount className="grid gap-4 pt-3 pb-6">
              <p className="text-base text-pretty text-muted-foreground">{pack.scope.pl}</p>
              <ul className="grid gap-2.5 text-base">
                {pack.items.pl.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </article>
        </AccordionItem>
      ))}
    </IndexAccordion>
  )
}
