"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

// zeprzalka: `row` — wiersz indeksu (portfolio, pakiety usług): pełna szerokość z wcięciem
// równym ujemnemu marginesowi, obłe tło na najechanie i przy otwarciu.
const accordionTriggerVariants = cva(
  "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=closed]>.minus]:hidden [&[data-state=open]>.plus]:hidden",
  {
    variants: {
      variant: {
        default: "",
        row: "-mx-3 items-center rounded-xl px-3 py-3 text-base font-normal transition-colors hover:bg-accent/60 data-[state=open]:bg-accent/60",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

// zeprzalka: „+” / „−” zamiast strzałki i bez podkreślenia — spokojniejszy rytm listy.
// `headingLevel` — poziom nagłówka wiersza (Radix daje zawsze <h3>), żeby lista pod
// własnym <h3> grupy nie spłaszczała struktury nagłówków.
function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  variant,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> &
  VariantProps<typeof accordionTriggerVariants> & { headingLevel?: 2 | 3 | 4 | 5 | 6 }) {
  const Heading = `h${headingLevel}` as const
  return (
    <AccordionPrimitive.Header asChild className="flex">
      <Heading>
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(accordionTriggerVariants({ variant }), className)}
          {...props}
        >
          {children}
          <PlusIcon className="plus pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground" />
          <MinusIcon className="minus pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground" />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  )
}

// zeprzalka: z `forceMount` treść zamkniętego elementu zostaje w HTML (SEO), ale ma zerową
// wysokość i jest `invisible` (poza Tabem i drzewem dostępności) — dopiero po animacji zwijania.
// Własne `animate-collapse/expand` (globals.css): przed hydratacją, gdy Radix nie zmierzył
// jeszcze wysokości, zwijanie biegnie od zera — zamknięte panele nie rozpychają strony.
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:invisible data-[state=closed]:h-0 data-[state=closed]:animate-collapse data-[state=closed]:[transition:visibility_0s_200ms] data-[state=open]:animate-expand"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
