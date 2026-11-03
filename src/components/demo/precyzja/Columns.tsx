/** Prowadnice 12 kolumn (4 na telefonie) — dokładnie te, na których stoi układ. */
export function Columns({ className = "" }: { className?: string }) {
  return (
    <div className={`pz-columns pz-grid ${className}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}
