/**
 * Kopiowanie do schowka z jedną polityką błędów: `true` — skopiowane, `false` —
 * nie da się (brak API, kontekst bez HTTPS, odmowa zapisu). Wywołujący decyduje,
 * co wtedy (np. `mailto:`), zamiast połykać wyjątek.
 */
export function copyText(text: string): Promise<boolean> {
  if (!navigator.clipboard) return Promise.resolve(false)
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false
  )
}
