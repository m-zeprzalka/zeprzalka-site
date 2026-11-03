import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  badge?: string
  title: string
  description?: string
  className?: string
}

export function PageHeader({ badge, title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-16", className)}>
      {badge && (
        <Badge variant="outline" className="mb-6 w-fit px-4 py-2 text-sm">
          {badge}
        </Badge>
      )}
      <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
      {description && <p className="max-w-2xl text-xl text-muted-foreground">{description}</p>}
      <Separator className="mt-10" />
    </header>
  )
}
