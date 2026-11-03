import type { ComponentProps } from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./cn"

/**
 * Przycisk Formy: pigułka. Trzy warianty i trzy wysokości (32 / 40 / 48 px —
 * na telefonie akcje główne dostają 48). `asChild` zamienia go w link.
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap fm-focus select-none",
    "transition-[background-color,box-shadow,color,scale] duration-150 ease-fm-snap active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-fm-ink text-fm-inverse hover:bg-fm-ink/85",
        secondary: "bg-fm-surface text-fm-ink shadow-fm-ring hover:bg-fm-fill",
        ghost: "text-fm-ink-2 hover:bg-fm-fill hover:text-fm-ink",
      },
      size: {
        sm: "h-8 px-3.5 text-[0.8125rem]",
        md: "h-10 px-4.5 text-sm",
        lg: "h-12 px-6 text-[0.9375rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
