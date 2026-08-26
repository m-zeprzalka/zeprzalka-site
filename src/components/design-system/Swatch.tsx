import { getToken } from "@/components/design-system/tokens"

interface SwatchProps {
  variable: string
  name: string
  usage: string
  /** Token tekstu, którym opisujemy próbkę — kontrola kontrastu pary. */
  on?: string
}

/**
 * Kafelek tokenu: próbka w kolorze bieżącego motywu, nazwa, obie wartości
 * źródłowe i rola w serwisie. Wartości pochodzą z globals.css — kafelek nie
 * może więc rozjechać się z arkuszem.
 */
export function Swatch({ variable, name, usage, on }: SwatchProps) {
  const { light, dark } = getToken(variable)

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-20 items-end rounded-lg border p-3"
        style={{ backgroundColor: `var(${variable})` }}
      >
        {on && (
          <span className="text-xs font-medium" style={{ color: `var(${on})` }}>
            Aa
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs">{name}</span>
        <span className="flex flex-col gap-0.5 font-mono text-[0.6875rem] text-muted-foreground">
          <span>
            <span className="text-muted-foreground/90">jasny </span>
            {light || "—"}
          </span>
          <span>
            <span className="text-muted-foreground/90">ciemny </span>
            {dark || "—"}
          </span>
        </span>
        <span className="text-xs text-muted-foreground leading-snug">
          {usage}
        </span>
      </div>
    </div>
  )
}
