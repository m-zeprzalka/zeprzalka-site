/**
 * Blok danych strukturalnych. `<` zamieniamy na `<`: tekst zawierający
 * `</script>` nie zamknie znacznika (dla parsera JSON to ten sam znak).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
