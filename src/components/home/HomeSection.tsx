import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Szkielet sekcji strony głównej: przyklejona kolumna z tytułem (3/12)
 * i treść (9/12). Różnice między sekcjami — odstępy siatki, wysokość,
 * przesunięcie przyklejenia — są jawne w propsach zamiast w czterech
 * kopiach tych samych klas (wygląd strony głównej jest zamrożony; ich
 * ujednolicenie to decyzja projektowa, nie refaktor).
 */
const SECTION =
  "flex flex-col justify-center p-4 py-6 md:py-8 lg:py-12 xl:py-16 xl:min-h-[calc(100vh-4rem)] container mx-auto"

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
        <div className={cn("lg:col-span-3 lg:sticky self-start", stickyClassName)}>
          <div>
            <h2 className="text-3xl md:text-4xl font-medium">{title}</h2>
            <p className="text-muted-foreground lg:text-lg 2xl:text-xl mt-2 lg:mt-6 max-w-xs">
              {lead}
            </p>
            {action}
          </div>
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}
