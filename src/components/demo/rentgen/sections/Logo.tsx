import { cn } from "../../forma/cn"
import { SectionGlyph } from "./SectionGlyph"

/**
 * Sygnet: nazwisko i mała soczewka z glifem. Wariacja logo serwisu (nazwisko +
 * migający znak ASCII): znak zmienia się tylko z powodu (sekcja, najechanie),
 * a po najechaniu soczewka przejeżdża przez nazwisko i odwraca litery pod
 * sobą — ten sam mechanizm co na całej stronie, w skali 1:50. Czysty CSS;
 * wielka soczewka nad sygnetem się zamyka (`data-rg-quiet`), żeby go nie zasłonić.
 */
export function Logo({ name, className }: { name: string; className?: string }) {
  return (
    <a
      href="#start"
      data-rg-key="logo"
      data-rg-name="Logo"
      data-rg-quiet=""
      className={cn("rg-logo fm-focus", className)}
    >
      <span className="rg-logo__lens" aria-hidden="true">
        <SectionGlyph />
      </span>
      <span className="rg-logo__word">
        <span className="rg-logo__name">{name}</span>
        <span className="rg-logo__negative" aria-hidden="true">
          {name}
        </span>
      </span>
    </a>
  )
}
