import type { CSSProperties, ReactNode } from "react"
import { cn } from "../forma/cn"

/**
 * Jedna warstwa: obła karta przyklejana pod nagłówkiem. Kotwica rozdziału stoi PRZED kartą
 * (w przepływie) — przewinięcie do przyklejonego elementu poszłoby do jego bieżącej, a nie
 * naturalnej pozycji. Następna karta cofa tę w głąb przez własną oś widoku (`--au-next`).
 */
export function Sheet({
  index,
  last = false,
  anchor,
  labelledBy,
  className,
  children,
}: {
  index: number
  last?: boolean
  anchor?: string
  labelledBy?: string
  className?: string
  children: ReactNode
}) {
  const timelines = {
    "--au-self": `--au-v${index}`,
    "--au-next": `--au-v${index + 1}`,
  } as CSSProperties

  return (
    <>
      {anchor && <div id={anchor} className="scroll-mt-(--au-t)" />}
      <section
        data-au-sheet=""
        data-next={last ? undefined : ""}
        aria-labelledby={labelledBy}
        style={timelines}
        className={cn(
          // Każda karta ma co najmniej wysokość okna pod nagłówkiem — spod krótszej nie wystaje
          // poprzednia ani następna warstwa (stos czyta się jak talia równych arkuszy).
          "au-sheet au-frame isolate flex min-h-[calc(100svh-var(--au-t)-var(--au-m))] flex-col overflow-clip rounded-(--au-r-sheet) bg-(--au-sheet) p-(--au-p) shadow-[0_0_0_1px_var(--au-ring)]",
          index > 0 && "mt-(--au-m)",
          className
        )}
      >
        {children}
      </section>
    </>
  )
}

/** Nagłówek sekcji: tytuł i dalszy ciąg w jednym zdaniu („Tytuł — dalej małą literą”). */
export function SectionHead({
  id,
  title,
  lead,
  className,
  aside,
}: {
  id: string
  title: string
  lead?: string
  className?: string
  aside?: ReactNode
}) {
  const rest = lead ? lead.charAt(0).toLowerCase() + lead.slice(1) : null
  return (
    <div className={cn("flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3", className)}>
      <h2
        id={id}
        className="max-w-[40rem] text-fm-lead font-medium tracking-[-0.012em] text-pretty text-fm-ink"
      >
        {title}
        {rest && (
          <span className="text-fm-ink-3">
            {" — "}
            {rest}
          </span>
        )}
      </h2>
      {aside}
    </div>
  )
}
