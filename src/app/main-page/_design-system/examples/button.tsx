import { ArrowRightIcon, MoonIcon } from "lucide-react"
import { Button } from "@/app/main-page/_components/ui/button"

export function ButtonExample() {
  return (
    <>
      <Button size="lg">
        Zarezerwuj konsultację
        <ArrowRightIcon />
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="ghost" size="icon" aria-label="Zmień motyw">
        <MoonIcon />
      </Button>
    </>
  )
}
