import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Szkielet sekcji strony głównej: przyklejona kolumna z tytułem (3/12)
 * i treść (9/12). Różnice między sekcjami — odstępy siatki, wysokość,
 * przesunięcie przyklejenia — są jawne w propsach zamiast w czterech
 * kopiach tych samych klas (wygląd strony głównej jest zamrożony; ich
 * ujednolicenie to decyzja projektowa, nie refaktor).
 */
const SECTION = cn(
  "container mx-auto flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:min-h-[calc(100vh-4rem)] xl:py-16"
)

export function HomeSection({
  id,
  title,
  lead,
  action,
  sectionClassName = SECTION,
  gridClassName,
  stickyClassName = "top-22",
  children,
}: {
  id?: string
  title: string
  lead: string
  action?: ReactNode
  sectionClassName?: string
  gridClassName: string
  stickyClassName?: string
  children: ReactNode
}) {
  return (
    <section className={sectionClassName} id={id}>
      <div className={cn("grid lg:grid-cols-12", gridClassName)}>
        <div className={cn("self-start lg:sticky lg:col-span-3", stickyClassName)}>
          <h2 className="text-3xl font-medium md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-xs text-muted-foreground lg:mt-6 lg:text-lg 2xl:text-xl">
            {lead}
          </p>
          {action}
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}
