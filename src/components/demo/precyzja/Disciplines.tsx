import type { ReactNode } from "react"
import { typo } from "./typo"

export interface Discipline {
  key: string
  title: string
  description: string
  tools: readonly string[]
  sample: ReactNode
}

/**
 * Cztery kompetencje 2 × 2: próbka do dotknięcia (z podpisem niosącym
 * prawdziwe dane), tytuł, opis i narzędzia.
 */
export function Disciplines({ items }: { items: readonly Discipline[] }) {
  return (
    <ol className="pz-sheets">
      {items.map((item) => (
        <li key={item.key} className="pz-sheet pz-reveal">
          {item.sample}
          <h3 className="pz-sheet__title">{item.title}</h3>
          <p className="pz-sheet__text">{typo(item.description)}</p>
          <ul className="pz-sheet__tools" aria-label="Narzędzia">
            {item.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
