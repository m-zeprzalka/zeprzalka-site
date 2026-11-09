/** Blok pod zgięciem wjeżdża z dołu, gdy wchodzi w okno — oś `view()`, sam CSS, bez JS. */
export function RevealExample() {
  return (
    <ul className="grid w-full gap-3 sm:grid-cols-3">
      {["Pierwszy", "Drugi", "Trzeci"].map((label) => (
        <li key={label} className="reveal rounded-xl border bg-card p-4 text-sm">
          {label} blok
        </li>
      ))}
    </ul>
  )
}
