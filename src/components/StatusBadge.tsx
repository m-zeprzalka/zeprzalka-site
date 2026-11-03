import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** „Gotowy do współpracy” z pulsującą kropką — strona główna i /o-mnie. */
export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("flex items-center gap-2 text-sm px-4 py-2", className)}>
      <span aria-hidden="true" className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      {label}
    </Badge>
  )
}
