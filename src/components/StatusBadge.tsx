import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** „Gotowy do współpracy” z pulsującą kropką — strona główna i /o-mnie. */
export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("flex items-center gap-2 px-4 py-2 text-sm", className)}>
      <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
      {label}
    </Badge>
  )
}
