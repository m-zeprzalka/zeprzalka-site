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
        <Badge variant="outline" className="text-sm px-4 py-2 w-fit mb-6">
          {badge}
        </Badge>
      )}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-muted-foreground max-w-2xl">{description}</p>
      )}
      <Separator className="mt-10" />
    </header>
  )
}
