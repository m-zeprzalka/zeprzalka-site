"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

/** Plik kliencki: `PopoverTrigger asChild` dostaje przycisk z klienta (pułapka Slota, ZASADY §10). */
export function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Otwórz popover</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Popover</PopoverTitle>
          <PopoverDescription>
            Promień 2xl, obrys i cień md. Na stronie niesie kartę podglądu pod frazą.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
