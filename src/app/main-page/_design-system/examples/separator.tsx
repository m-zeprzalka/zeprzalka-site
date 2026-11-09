import { Separator } from "@/app/main-page/_components/ui/separator"

export function SeparatorExample() {
  return (
    <div className="grid w-full gap-4">
      <p>Nad linią</p>
      <Separator />
      <div className="flex h-5 items-center gap-4 text-sm text-muted-foreground">
        <span>4 min czytania</span>
        <Separator orientation="vertical" />
        <span>AI</span>
      </div>
    </div>
  )
}
