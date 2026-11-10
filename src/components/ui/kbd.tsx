import { cn } from "@/lib/utils"

// zeprzalka: krój bez szeryfów (Geist Mono nie pobiera się przez skrót w nagłówku); obrys i tło `background` — klawisz czyta się jako klawisz na każdym tle
// (także na przycisku `secondary`, którego tło jest takie samo jak `muted`); krój mono.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-md border bg-background px-1 font-sans text-[0.6875rem] font-medium text-muted-foreground shadow-xs select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
