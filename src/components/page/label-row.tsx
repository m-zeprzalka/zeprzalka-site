import type { ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Wiersz z kolumną etykiety (okres, numer, grupa) — ten sam rytm co grupy
 * portfolio na starcie: od 768 px etykieta stoi w kolumnie 9,5 rem obok treści,
 * węziej nad nią. `labelAfter` — w kodzie (i dla czytnika) etykieta idzie po
 * treści, a wygląda tak samo (`order-first`): skok do nagłówka wiersza nie
 * omija wtedy okresu i firmy.
 */
export function LabelRow({
  label,
  labelAs: Label = "p",
  contentAs: Content = "div",
  labelAfter = false,
  labelClassName,
  className,
  children,
}: {
  label: ReactNode
  /** `dt` + `contentAs="dd"` — wiersz listy opisowej (`<dl>` z wierszami w `div`). */
  labelAs?: ElementType
  contentAs?: ElementType
  labelAfter?: boolean
  labelClassName?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("grid gap-1 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-6", className)}>
      {!labelAfter && (
        <Label className={cn("text-sm text-muted-foreground tabular-nums", labelClassName)}>
          {label}
        </Label>
      )}
      <Content className="min-w-0">{children}</Content>
      {labelAfter && (
        <Label
          className={cn("order-first text-sm text-muted-foreground tabular-nums", labelClassName)}
        >
          {label}
        </Label>
      )}
    </div>
  )
}
