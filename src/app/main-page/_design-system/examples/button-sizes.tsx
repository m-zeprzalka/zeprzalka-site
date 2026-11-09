import { PlusIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"

export function ButtonSizesExample() {
  return (
    <>
      <Button size="xs">xs · 24</Button>
      <Button size="sm">sm · 32</Button>
      <Button>default · 36</Button>
      {/* 44 px — cel dotyku: główne działania stron. */}
      <Button size="lg">lg · 44</Button>
      <Button variant="outline" size="icon-xs" aria-label="Dodaj (icon-xs)">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Dodaj (icon-sm)">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Dodaj (icon)">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon-lg" aria-label="Dodaj (icon-lg)">
        <PlusIcon />
      </Button>
    </>
  )
}
