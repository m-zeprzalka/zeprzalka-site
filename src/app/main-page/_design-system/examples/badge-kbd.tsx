import { Badge } from "@/app/main-page/_components/ui/badge"
import { Kbd, KbdGroup } from "@/app/main-page/_components/ui/kbd"

export function BadgeKbdExample() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Next.js</Badge>
      <Badge variant="outline">Nowy</Badge>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </>
  )
}
