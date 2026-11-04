/**
 * Odznaka „Nowy” przy najnowszym wpisie — mała pigułka w języku chipów Formy
 * (wypełnienie, bez obrysu). `vertical-align: middle` kładzie jej środek na
 * środku wysokości małych liter, więc stoi optycznie w linii tytułu.
 */
export function NewBadge({ label }: { label: string }) {
  return (
    <span className="ms-2 inline-flex h-5 items-center rounded-full bg-fm-fill-strong px-2 align-middle text-[0.75rem] leading-none font-medium tracking-[0.01em] whitespace-nowrap text-fm-ink-2">
      {label}
    </span>
  )
}
