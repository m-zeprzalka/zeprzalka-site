const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Elementy osiągalne Tabem w `root` (widoczne, poza `inert` i `aria-hidden`). */
export function tabbables(root: ParentNode = document): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(TABBABLE)].filter(
    (element) =>
      element.getClientRects().length > 0 && !element.closest("[inert], [aria-hidden='true']")
  )
}

/**
 * Fokus na następny element po `anchor` w kolejności dokumentu — pomijając `skip`
 * (np. kartę w portalu na końcu `<body>`, która w kolejności Tab „należy” do frazy).
 */
export function focusAfter(anchor: HTMLElement, skip?: Element | null) {
  const all = tabbables().filter((element) => !skip?.contains(element))
  const next = all[all.indexOf(anchor) + 1]
  next?.focus()
}
