import type { ReactNode } from "react"

/**
 * Szkielet sekcji: tytuł, opis i opcjonalna akcja w jednym rzędzie siatki.
 * Jeden wzór dla wszystkich sekcji — koniec trzech skal odstępów.
 */
export function Section({
  id,
  title,
  lead,
  action,
  children,
}: {
  id: string
  title: string
  lead?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="pz-section" aria-labelledby={`${id}-title`}>
      <div className="pz-container">
        <header className="pz-grid pz-section-head pz-reveal">
          <h2 id={`${id}-title`} className="pz-h2 col-span-4 md:col-span-7">
            {title}
          </h2>
          {(lead || action) && (
            <div className="col-span-4 flex flex-col justify-end gap-6 md:col-span-4 md:col-start-9">
              {lead && <p className="pz-lead">{lead}</p>}
              {action}
            </div>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
